// src/app/api/issues/[number]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getIssue, getComments } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const num = parseInt(number, 10);
    const [issue, comments] = await Promise.all([getIssue(num), getComments(num)]);
    return NextResponse.json({ issue, comments }, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
