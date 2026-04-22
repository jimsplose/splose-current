// src/app/api/issues/[number]/close/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { closeIssue } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const issue = await closeIssue(parseInt(number, 10));
    return NextResponse.json(issue, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
