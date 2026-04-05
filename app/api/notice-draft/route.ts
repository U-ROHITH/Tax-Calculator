import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// ---------- Environment guard ----------
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

const client = new Anthropic({ apiKey });

// ---------- Constants ----------
const MAX_TOKENS = 2048;
const MAX_NOTICE_DETAILS_LENGTH = 3000;
const MAX_FIELD_LENGTH = 200;

const SYSTEM_PROMPT = `You are a senior Chartered Accountant specializing in Income Tax litigation and representation in India. You help taxpayers understand and respond to Income Tax Department notices.

When given a notice description, provide:

## 1. What This Notice Means
- Explain in plain language what the notice is about
- Cite the relevant section (e.g., "Section 143(1) of the Income Tax Act, 1961")
- State the deadline for response (typical statutory timelines)

## 2. Why You May Have Received This
- List the most common reasons for this type of notice

## 3. What You Need to Do
- Step-by-step action list
- Documents to gather
- Whether you need a CA (be honest — complex matters need professional help)

## 4. Draft Response Letter
Provide a formal draft response in proper legal letter format:
- To: The Assessing Officer
- Subject line
- Reference: notice section and date
- Body: formal response addressing the notice
- Enclosures list
- Closing: "Yours faithfully" etc.

## 5. Important Warnings
- Deadlines to not miss
- What happens if you don't respond
- When you MUST hire a CA

Always end with: "This draft is for guidance only. Have a qualified CA review before submission."`;

// ---------- In-memory rate limiter (per IP, resets on cold start) ----------
// For production, replace with Redis / Upstash.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;           // notice drafts are more expensive — stricter limit

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

// ---------- Sanitize a plain-text field ----------
// Strips leading/trailing whitespace and enforces a character limit.
// Does NOT allow HTML or control characters.
function sanitizeField(value: unknown, maxLength: number, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new RangeError(`${fieldName} must not be empty`);
  }
  if (trimmed.length > maxLength) {
    throw new RangeError(
      `${fieldName} exceeds maximum length of ${maxLength} characters`
    );
  }
  return trimmed;
}

function sanitizeOptionalField(value: unknown, maxLength: number, fallback: string): string {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) return fallback;
  if (trimmed.length > maxLength) {
    throw new RangeError(`Field exceeds maximum length of ${maxLength} characters`);
  }
  return trimmed;
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

  const raw = body as Record<string, unknown>;

  // Validate and sanitize inputs
  let noticeType: string;
  let noticeDetails: string;
  let taxpayerName: string;
  let assessmentYear: string;

  try {
    noticeType    = sanitizeField(raw.noticeType,    MAX_FIELD_LENGTH,           'noticeType');
    noticeDetails = sanitizeField(raw.noticeDetails, MAX_NOTICE_DETAILS_LENGTH,  'noticeDetails');
    taxpayerName  = sanitizeOptionalField(raw.taxpayerName,    MAX_FIELD_LENGTH, '[Taxpayer Name]');
    assessmentYear = sanitizeOptionalField(raw.assessmentYear, MAX_FIELD_LENGTH, 'Not specified');
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid input' },
      { status: 400 }
    );
  }

  // Build the user message from validated fields only — no raw interpolation
  const userMessage = [
    `Notice Type: ${noticeType}`,
    `Assessment Year: ${assessmentYear}`,
    `Taxpayer Name: ${taxpayerName}`,
    '',
    `Details provided: ${noticeDetails}`,
  ].join('\n');

  // Call Anthropic and stream response
  try {
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
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
    console.error('[notice-draft] Anthropic API error:', err);

    const status =
      err instanceof Anthropic.APIError && err.status === 429 ? 429 : 500;
    const message =
      status === 429
        ? 'AI service is currently overloaded. Please try again shortly.'
        : 'An error occurred while processing your request.';

    return NextResponse.json({ error: message }, { status });
  }
}
