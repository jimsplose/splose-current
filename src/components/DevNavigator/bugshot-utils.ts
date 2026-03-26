// src/components/DevNavigator/bugshot-utils.ts

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementStyles {
  tag: string;
  className: string;
  width: number;
  height: number;
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  gap: string;
}

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "LINK", "META", "NOSCRIPT", "BR", "HR", "IFRAME"]);
const MAX_ELEMENTS = 50;
const MAX_CLASSNAME_LEN = 80;

/**
 * Find all visible elements overlapping a viewport-relative region.
 * Returns computed styles sorted by visual area (largest first), capped at 50.
 * Also detects iframes in the region (their content cannot be captured).
 */
export function extractStyles(region: Region): { elements: ElementStyles[]; hasIframe: boolean } {
  let hasIframe = false;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  // Absolute region in document coordinates
  const absRegion = {
    left: region.x + scrollX,
    top: region.y + scrollY,
    right: region.x + region.width + scrollX,
    bottom: region.y + region.height + scrollY,
  };

  const results: ElementStyles[] = [];
  const allElements = document.querySelectorAll("body *");

  for (const el of allElements) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.tagName === "IFRAME") { hasIframe = true; continue; }
    if (SKIP_TAGS.has(el.tagName)) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    // Convert to absolute coordinates
    const elLeft = rect.left + scrollX;
    const elTop = rect.top + scrollY;
    const elRight = rect.right + scrollX;
    const elBottom = rect.bottom + scrollY;

    // Check overlap
    if (elRight < absRegion.left || elLeft > absRegion.right) continue;
    if (elBottom < absRegion.top || elTop > absRegion.bottom) continue;

    const cs = window.getComputedStyle(el);
    const className = el.className && typeof el.className === "string"
      ? el.className.slice(0, MAX_CLASSNAME_LEN)
      : "";

    results.push({
      tag: el.tagName.toLowerCase(),
      className,
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      fontSize: cs.fontSize,
      lineHeight: cs.lineHeight,
      fontWeight: cs.fontWeight,
      fontFamily: cs.fontFamily.split(",")[0].trim().replace(/['"]/g, ""),
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      marginTop: cs.marginTop,
      marginRight: cs.marginRight,
      marginBottom: cs.marginBottom,
      marginLeft: cs.marginLeft,
      borderWidth: reconstructBorderWidth(cs),
      borderColor: cs.borderTopColor,
      borderRadius: cs.borderRadius,
      gap: cs.gap,
    });
  }

  // Sort by visual area descending, cap at MAX_ELEMENTS
  results.sort((a, b) => b.width * b.height - a.width * a.height);
  return { elements: results.slice(0, MAX_ELEMENTS), hasIframe };
}

function reconstructBorderWidth(cs: CSSStyleDeclaration): string {
  const t = cs.borderTopWidth;
  const r = cs.borderRightWidth;
  const b = cs.borderBottomWidth;
  const l = cs.borderLeftWidth;
  if (t === r && r === b && b === l) return t;
  return `${t} ${r} ${b} ${l}`;
}

/**
 * Format element styles into a readable block for the prompt.
 */
function formatElement(el: ElementStyles): string {
  const id = el.className ? `${el.tag}.${el.className}` : el.tag;
  const padding = `${el.paddingTop} ${el.paddingRight} ${el.paddingBottom} ${el.paddingLeft}`;
  const margin = `${el.marginTop} ${el.marginRight} ${el.marginBottom} ${el.marginLeft}`;
  return [
    `${id} — ${el.width}x${el.height}`,
    `  font: ${el.fontSize}/${el.lineHeight} ${el.fontWeight} ${el.fontFamily}`,
    `  color: ${el.color} | bg: ${el.backgroundColor}`,
    `  padding: ${padding} | margin: ${margin}`,
    `  border: ${el.borderWidth} ${el.borderColor} | radius: ${el.borderRadius} | gap: ${el.gap}`,
  ].join("\n");
}

/**
 * Generate the natural language prompt for clipboard.
 */
export function generatePrompt(opts: {
  description: string;
  tags: string[];
  region: Region;
  filename: string;
  elements: ElementStyles[];
  hasIframe: boolean;
}): string {
  const url = window.location.href;
  const viewport = window.innerWidth;
  const tagsStr = opts.tags.length > 0 ? ` [${opts.tags.join(", ")}]` : "";

  const absRegion = {
    x: Math.round(opts.region.x + window.scrollX),
    y: Math.round(opts.region.y + window.scrollY),
    width: Math.round(opts.region.width),
    height: Math.round(opts.region.height),
  };

  const elementsBlock = opts.elements.map(formatElement).join("\n\n");
  const iframeNote = opts.hasIframe
    ? "\n\nNote: region contains an iframe whose content could not be captured or measured."
    : "";

  return `Fix this issue on ${url} at ${viewport}px viewport.

${opts.description}${tagsStr}

Screenshot downloaded to your Downloads folder as: ${opts.filename}
Region: ${absRegion.x}, ${absRegion.y}, ${absRegion.width}, ${absRegion.height} from top-left of viewport (scroll offset already applied).

Measured styles for elements in the selected region:

${elementsBlock}${iframeNote}`;
}

/**
 * Generate the download filename from the current route.
 */
export function generateFilename(): string {
  const route = window.location.pathname
    .replace(/^\//, "")
    .replace(/\//g, "-") || "root";
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `bugshot-${route}-${ts}.png`;
}

/**
 * Trigger a PNG download from a canvas blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
