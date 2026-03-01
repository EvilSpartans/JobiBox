/**
 * Injecte des séparateurs de pages (barres grises) en overlay pour simuler les coupures A4.
 * Utilise position:absolute pour ne pas déformer le layout (comme sur le front Angular).
 */

const A4_HEIGHT = 1123;
const SEPARATOR_HEIGHT = 28;

/**
 * Parse le commentaire <!-- CV_PAGE_BREAKS: [positions] --> dans le HTML
 */
function parsePageBreaksFromHtml(html) {
  const match = html?.match(/<!--\s*CV_PAGE_BREAKS:\s*(\[[\d,\s]*\])\s*-->/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Calcule les positions Y des séparateurs (client-side fallback)
 * Page 1: 0-1123, sép: 1123, Page 2: 1123+28-2254, sép: 2254, etc.
 */
function computeSeparatorPositions(totalHeight) {
  const positions = [];
  let y = A4_HEIGHT;
  while (y < totalHeight && positions.length < 15) {
    positions.push(y);
    y += A4_HEIGHT + SEPARATOR_HEIGHT;
  }
  return positions;
}

/**
 * Injecte une overlay de séparateurs en position absolue (sans modifier le flux du document)
 */
export function injectPageSeparators(iframeDoc, sourceHtml) {
  if (!iframeDoc?.body) return;

  const totalHeight = iframeDoc.documentElement.scrollHeight;

  const pdfHtmlRaw = sourceHtml || iframeDoc.documentElement?.innerHTML || "";
  if (!pdfHtmlRaw || pdfHtmlRaw.length < 50) return;

  let positions = parsePageBreaksFromHtml(pdfHtmlRaw);
  if (!positions || !Array.isArray(positions) || positions.length === 0) {
    positions = computeSeparatorPositions(totalHeight);
  }

  // Supprimer l'ancienne overlay si elle existe
  const existing = iframeDoc.getElementById("cv-pagination-overlay");
  if (existing) existing.remove();

  const overlay = iframeDoc.createElement("div");
  overlay.id = "cv-pagination-overlay";
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: ${totalHeight}px;
    pointer-events: none;
    z-index: 9999;
  `;

  const body = iframeDoc.body;
  if (getComputedStyle(body).position === "static") {
    body.style.position = "relative";
  }

  positions.forEach((topPx) => {
    if (topPx >= totalHeight) return;
    const sep = iframeDoc.createElement("div");
    sep.style.cssText = `
      position: absolute;
      top: ${topPx}px;
      left: 0;
      right: 0;
      height: ${SEPARATOR_HEIGHT}px;
      background: #9e9e9e;
    `;
    overlay.appendChild(sep);
  });

  body.appendChild(overlay);
}

/**
 * Exécute la pagination après un délai (pour laisser le rendu se stabiliser)
 */
export function runPaginationWhenReady(iframeRef, previewHtml, delayMs = 500) {
  if (!iframeRef?.current) return;

  const timer = setTimeout(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc && doc.readyState === "complete") {
        injectPageSeparators(doc, previewHtml);
      }
    } catch (e) {
      console.warn("cvPreviewPagination:", e);
    }
  }, delayMs);

  return () => clearTimeout(timer);
}
