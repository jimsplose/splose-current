// src/app/api/issues/labels/route.ts
import { NextResponse } from 'next/server';
import { listLabels } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export async function GET() {
  try {
    const labels = await listLabels();
    return NextResponse.json(labels, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
