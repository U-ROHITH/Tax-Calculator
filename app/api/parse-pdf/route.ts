import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const parser = new PDFParse({ data: uint8 });
    const result = await parser.getText();
    const text = result.text;

    const extracted = extractForm16Fields(text);
    return NextResponse.json({ extracted, rawTextLength: text.length });
  } catch {
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}

function extractForm16Fields(text: string) {
  // Normalize text
  const t = text.replace(/\s+/g, ' ');

  const extract = (patterns: RegExp[]): number | null => {
    for (const p of patterns) {
      const m = t.match(p);
      if (m) return parseFloat(m[1].replace(/,/g, ''));
    }
    return null;
  };

  return {
    grossSalary: extract([/Gross Salary[:\s]+(?:Rs\.?\s*)?([0-9,]+)/i, /Total Salary[:\s]+([0-9,]+)/i]),
    basicSalary: extract([/Basic[:\s]+(?:Rs\.?\s*)?([0-9,]+)/i, /Basic Pay[:\s]+([0-9,]+)/i]),
    hra: extract([/HRA[:\s]+([0-9,]+)/i, /House Rent Allowance[:\s]+([0-9,]+)/i]),
    standardDeduction: extract([/Standard Deduction[:\s]+([0-9,]+)/i]),
    professionalTax: extract([/Professional Tax[:\s]+([0-9,]+)/i, /Prof\. Tax[:\s]+([0-9,]+)/i]),
    tdsDeducted: extract([/Tax Deducted[:\s]+([0-9,]+)/i, /TDS[:\s]+([0-9,]+)/i, /Income Tax[:\s]+([0-9,]+)/i]),
    deduction80C: extract([/80C[:\s]+([0-9,]+)/i, /Chapter VI-A.*?80C[:\s]+([0-9,]+)/i]),
    deduction80D: extract([/80D[:\s]+([0-9,]+)/i, /Medical Insurance[:\s]+([0-9,]+)/i]),
    employerName: (t.match(/(?:Name of Employer|Employer Name)[:\s]+([A-Z][A-Za-z\s]+?)(?:\n|Ltd|Pvt|Inc)/i) || [])[1]?.trim() || null,
    pan: (t.match(/PAN[:\s]+([A-Z]{5}[0-9]{4}[A-Z])/i) || [])[1] || null,
    assessmentYear: (t.match(/Assessment Year[:\s]+(\d{4}-\d{2,4})/i) || [])[1] || null,
  };
}
