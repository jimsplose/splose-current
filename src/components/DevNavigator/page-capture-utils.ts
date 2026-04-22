// src/components/DevNavigator/page-capture-utils.ts

export const SESSION_KEY = 'devnav-workflow-session';
export const VERCEL_URL = 'https://splose-current.vercel.app';

const SEMANTIC_TAGS = new Set([
  'nav','main','section','article','aside','header','footer','form',
  'h1','h2','h3','h4','button','input','select','textarea','label',
  'a','ul','ol','li','table','figure',
]);
const SKIP_TAGS = new Set(['SCRIPT','STYLE','LINK','META','NOSCRIPT','SVG','PATH','DEFS']);
const MAX_DEPTH = 6;

export function buildDomOutline(root: Element, depth = 0): string {
  if (depth > MAX_DEPTH) return '';
  const lines: string[] = [];
  for (const child of Array.from(root.children)) {
    if (SKIP_TAGS.has(child.tagName)) continue;
    const tag = child.tagName.toLowerCase();
    if (!SEMANTIC_TAGS.has(tag)) {
      const nested = buildDomOutline(child, depth + 1);
      if (nested) lines.push(nested);
      continue;
    }
    const id = child.id ? `#${child.id}` : '';
    const children = buildDomOutline(child, depth + 1);
    const indent = '  '.repeat(depth);
    if (children) {
      lines.push(`${indent}${tag}${id} > [\n${children}\n${indent}]`);
    } else {
      lines.push(`${indent}${tag}${id}`);
    }
  }
  return lines.join('\n');
}

export interface TextContent {
  headings: string[];
  labels: string[];
  ctas: string[];
}

export function extractTextContent(): TextContent {
  const text = (sel: string) =>
    Array.from(document.querySelectorAll(sel))
      .map(el => el.textContent?.trim() ?? '')
      .filter(Boolean)
      .slice(0, 10);

  return {
    headings: text('h1, h2, h3, h4'),
    labels: text('label'),
    ctas: text('button, a[href], input[type="submit"]'),
  };
}

export interface DesignTokenSample {
  tag: string;
  bg: string;
  color: string;
  fontSize: string;
  fontWeight: string;
  borderRadius: string;
}

export function extractDesignTokens(): string {
  const elements = Array.from(document.querySelectorAll('body *'))
    .filter(el => el instanceof HTMLElement)
    .slice(0, 20) as HTMLElement[];

  const seen = new Set<string>();
  const tokens: string[] = [];
  for (const el of elements) {
    const cs = window.getComputedStyle(el);
    const key = `${cs.backgroundColor}|${cs.color}|${cs.fontSize}`;
    if (seen.has(key)) continue;
    seen.add(key);
    tokens.push(`${el.tagName.toLowerCase()}: bg=${cs.backgroundColor} color=${cs.color} font=${cs.fontSize}/${cs.fontWeight}`);
  }
  return tokens.join('\n');
}

export interface PagePayload {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  domOutline: string;
  tokens: string;
  content: TextContent;
}

export async function collectPagePayload(): Promise<PagePayload> {
  return {
    url: window.location.href,
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    domOutline: buildDomOutline(document.body),
    tokens: extractDesignTokens(),
    content: extractTextContent(),
  };
}

export function formatNewPageBody(opts: {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  description: string;
  domOutline: string;
  tokens: string;
  content: TextContent;
  filename: string;
}): string {
  const { url, title, viewport, description, domOutline, tokens, content, filename } = opts;
  return [
    `**Intent:** new-page`,
    `**URL:** ${url}`,
    `**Title:** ${title}`,
    `**Viewport:** ${viewport.width}×${viewport.height}`,
    `**Description:** ${description}`,
    ``,
    `### DOM Outline`,
    domOutline,
    ``,
    `### Design Tokens`,
    tokens,
    ``,
    `### Content`,
    `headings: ${JSON.stringify(content.headings)}`,
    `labels: ${JSON.stringify(content.labels)}`,
    `ctas: ${JSON.stringify(content.ctas)}`,
    ``,
    `Screenshot: ${filename} (downloaded locally)`,
  ].join('\n');
}

export function formatWorkflowParentBody(opts: {
  name: string;
  description: string;
  stepIssues: Array<{ number: number; stepLabel: string }>;
}): string {
  const { name, description, stepIssues } = opts;
  const refs = stepIssues.map(s => `#${s.number}`).join(' · ');
  const steps = stepIssues.map(s => `- #${s.number} ${name} — ${s.stepLabel}`).join('\n');
  return [
    `**Intent:** workflow`,
    `**Name:** ${name}`,
    `**Steps:** ${refs}`,
    `**Description:** ${description}`,
    ``,
    `Steps:`,
    steps,
  ].join('\n');
}

export function generatePageCaptureFilename(): string {
  const route = window.location.pathname.replace(/^\//, '').replace(/\//g, '-') || 'root';
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `page-capture-${route}-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.png`;
}
