// src/app/api/issues/[number]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  try {
    const { number } = await params;
    const num = parseInt(number, 10);
    const { body } = await req.json() as { body?: string };
    if (!body?.trim()) {
      return NextResponse.json({ error: 'body is required' }, { status: 400, headers: CORS });
    }
    const comment = await addComment(num, body);
    return NextResponse.json(comment, { status: 201, headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
