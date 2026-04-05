import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// ---------- Environment guard ----------
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

const client = new Anthropic({ apiKey });

// ---------- Constants ----------
const MAX_MESSAGES = 20;          // max conversation turns passed from client
const MAX_MESSAGE_LENGTH = 4000;  // max chars per single message content string
const ALLOWED_ROLES = new Set(['user', 'assistant']);
const ALLOWED_COUNTRIES = new Set(['IN', 'US', 'UK', '']);
const MAX_TOKENS = 1024;          // hard ceiling — never exceed this

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

// ---------- In-memory rate limiter (per IP, resets on cold start) ----------
// For production, replace with Redis / Upstash.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 15;           // requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

// ---------- Input validation ----------
interface MessageShape {
  role: string;
  content: string;
}

function validateMessages(raw: unknown): Anthropic.MessageParam[] {
  if (!Array.isArray(raw)) {
    throw new TypeError('messages must be an array');
  }
  if (raw.length === 0) {
    throw new TypeError('messages array must not be empty');
  }
  if (raw.length > MAX_MESSAGES) {
    throw new RangeError(`messages array exceeds maximum length of ${MAX_MESSAGES}`);
  }

  return raw.map((item: unknown, index: number): Anthropic.MessageParam => {
    if (typeof item !== 'object' || item === null) {
      throw new TypeError(`messages[${index}] must be an object`);
    }
    const msg = item as MessageShape;

    if (!ALLOWED_ROLES.has(msg.role)) {
      throw new TypeError(
        `messages[${index}].role must be "user" or "assistant", got "${msg.role}"`
      );
    }
    if (typeof msg.content !== 'string') {
      throw new TypeError(`messages[${index}].content must be a string`);
    }
    if (msg.content.length > MAX_MESSAGE_LENGTH) {
      throw new RangeError(
        `messages[${index}].content exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      );
    }

    return { role: msg.role as 'user' | 'assistant', content: msg.content };
  });
}

// ---------- Route handler ----------
export async function POST(req: NextRequest) {
  // Rate limiting
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

  // Parse body
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

  // Validate country
  const country = typeof rawCountry === 'string' ? rawCountry : '';
  if (!ALLOWED_COUNTRIES.has(country)) {
    return NextResponse.json(
      { error: 'country must be one of: IN, US, UK or omitted' },
      { status: 400 }
    );
  }

  // Validate messages
  let messages: Anthropic.MessageParam[];
  try {
    messages = validateMessages(rawMessages);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid messages' },
      { status: 400 }
    );
  }

  // Enforce last message is from user
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

  // Call Anthropic and stream response
  try {
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT + '\n\n' + countryContext,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
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
    // Log internally but never expose SDK/key details to the client
    console.error('[tax-assistant] Anthropic API error:', err);

    const status =
      err instanceof Anthropic.APIError && err.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? 'AI service is currently overloaded. Please try again shortly.'
        : 'An error occurred while processing your request.';

    return NextResponse.json({ error: message }, { status });
  }
}
