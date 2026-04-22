// src/app/api/issues/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listIssues, createIssue } from '@/lib/github-issues';

export const dynamic = 'force-dynamic';

const CORS = { 'Access-Control-Allow-Origin': '*' };

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' },
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = (searchParams.get('state') ?? 'open') as 'open' | 'closed' | 'all';
    const labelsParam = searchParams.get('labels');
    const labels = labelsParam ? labelsParam.split(',').filter(Boolean) : undefined;
    const issues = await listIssues({ state, labels });
    return NextResponse.json(issues, { headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { title?: string; body?: string; labels?: string[] };
    if (!body.title?.trim() || !body.body?.trim()) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400, headers: CORS });
    }
    const issue = await createIssue({ title: body.title, body: body.body, labels: body.labels ?? [] });
    return NextResponse.json(issue, { status: 201, headers: CORS });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: CORS });
  }
}
