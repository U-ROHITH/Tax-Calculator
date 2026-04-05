import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// ---------- Environment guard ----------
function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
  return new GoogleGenerativeAI(apiKey);
}

// ---------- Constants ----------
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const ALLOWED_ROLES = new Set(['user', 'assistant']);
const ALLOWED_COUNTRIES = new Set(['IN', 'US', 'UK', '']);

const SYSTEM_PROMPT = `You are a senior Chartered Accountant and tax consultant with expertise in Indian Income Tax, US Federal/State Tax, and UK Self Assessment. You have 20 years of experience.

Rules:
- Give accurate, specific answers with section references (e.g., "Section 80C of the Income Tax Act")
- When uncertain, say so clearly and recommend consulting a CA
- For India: cite Income Tax Act sections, CBDT circulars where relevant
- For US: cite IRC sections, IRS publications
- For UK: cite HMRC guidance, Finance Act sections
- Always mention if a rule changed recently (e.g., Budget 2024 changes)
- Format responses with clear headings using markdown
- End every response with: "This is informational only. Consult a qualified CA/CPA/tax advisor before making decisions."
- Be concise but complete. Typical response: 150-300 words.`;

// ---------- In-memory rate limiter ----------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// ---------- Input validation ----------
interface MessageShape {
  role: string;
  content: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

function validateMessages(raw: unknown): GeminiMessage[] {
  if (!Array.isArray(raw)) throw new TypeError('messages must be an array');
  if (raw.length === 0) throw new TypeError('messages array must not be empty');
  if (raw.length > MAX_MESSAGES)
    throw new RangeError(`messages array exceeds maximum length of ${MAX_MESSAGES}`);

  return raw.map((item: unknown, index: number): GeminiMessage => {
    if (typeof item !== 'object' || item === null)
      throw new TypeError(`messages[${index}] must be an object`);

    const msg = item as MessageShape;
    if (!ALLOWED_ROLES.has(msg.role))
      throw new TypeError(
        `messages[${index}].role must be "user" or "assistant", got "${msg.role}"`
      );
    if (typeof msg.content !== 'string')
      throw new TypeError(`messages[${index}].content must be a string`);
    if (msg.content.length > MAX_MESSAGE_LENGTH)
      throw new RangeError(
        `messages[${index}].content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      );

    // Gemini uses 'model' instead of 'assistant'
    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    };
  });
}

// ---------- Route handler ----------
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Request body must be a JSON object' }, { status: 400 });
  }

  const { messages: rawMessages, country: rawCountry } = body as Record<string, unknown>;

  const country = typeof rawCountry === 'string' ? rawCountry : '';
  if (!ALLOWED_COUNTRIES.has(country)) {
    return NextResponse.json(
      { error: 'country must be one of: IN, US, UK or omitted' },
      { status: 400 }
    );
  }

  let messages: GeminiMessage[];
  try {
    messages = validateMessages(rawMessages);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid messages' },
      { status: 400 }
    );
  }

  if (messages[messages.length - 1].role !== 'user') {
    return NextResponse.json(
      { error: 'The last message must have role "user"' },
      { status: 400 }
    );
  }

  const countryContext =
    country === 'IN'
      ? 'Focus on Indian tax law.'
      : country === 'US'
      ? 'Focus on US federal and state tax law.'
      : country === 'UK'
      ? 'Focus on UK tax law and HMRC guidance.'
      : 'Cover India, US, and UK tax law as relevant.';

  // Separate history from the latest user message
  const history = messages.slice(0, -1);
  const lastMessage = messages[messages.length - 1].parts[0].text;

  try {
    const genAI = getClient();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT + '\n\n' + countryContext,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage);

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch {
          controller.error(new Error('Stream interrupted'));
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: unknown) {
    console.error('[tax-assistant] Google AI error:', err);

    const message =
      err instanceof Error && err.message.includes('429')
        ? 'AI service is currently overloaded. Please try again shortly.'
        : 'An error occurred while processing your request.';

    const status =
      err instanceof Error && err.message.includes('429') ? 429 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
