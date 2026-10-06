// src/lib/og-image.ts
// Build-time Open Graph image generation.
//
// Social crawlers (Facebook, X, LinkedIn, WhatsApp) do not rasterise SVG, so the
// previous `og-*.svg` references produced no preview at all. These are real
// 1200x630 PNGs rendered with sharp, which is already a dependency of Astro.
//
// The font is committed to `assets/fonts/` and passed explicitly via `fontfile`
// so output does not depend on whichever fonts happen to exist on the build box.
import path from "node:path";
import sharp from "sharp";

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const FONT_FILE = path.resolve(process.cwd(), "assets", "fonts", "DejaVuSans-Bold.ttf");
const FONT_NAME = "DejaVu Sans Bold";
const BASE_POINT_SIZE = 34;
const RENDER_DPI = 150;

const CANVAS_BG = { r: 11, g: 18, b: 32, alpha: 1 };
const TITLE_COLOR = "#FFFFFF";
const FOOTER_COLOR = "#94A3B8";

const TEXT_LEFT = 80;
const TEXT_WIDTH = OG_WIDTH - TEXT_LEFT * 2;
const TITLE_MAX_CHARS = 104;
const TITLE_MAX_HEIGHT = 340;

export const CATEGORY_ACCENT: Record<string, string> = {
  "news": "#F472B6",
  "market-briefs": "#F59E0B",
  "deep-dives": "#38BDF8",
  "education": "#34D399",
  "bot-updates": "#A78BFA",
};

export const DEFAULT_ACCENT = "#F59E0B";

/** Pango markup is XML-ish, so the same five entities must be escaped. */
function escapeMarkup(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value: string, max: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number; alpha: number } {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
    alpha: 1,
  };
}

interface TextLayer {
  buffer: Buffer;
  width: number;
  height: number;
}

async function textLayer(markup: string): Promise<TextLayer> {
  const buffer = await sharp({
    text: {
      text: markup,
      font: `${FONT_NAME} ${BASE_POINT_SIZE}`,
      fontfile: FONT_FILE,
      rgba: true,
      width: TEXT_WIDTH,
      align: "left",
      wrap: "word",
      dpi: RENDER_DPI,
    },
  })
    .png()
    .toBuffer();

  // Pango returns a tight bounding box, so the layer is usually narrower than
  // TEXT_WIDTH. Carry the real dimensions for any later crop.
  const { width = 0, height = 0 } = await sharp(buffer).metadata();
  return { buffer, width, height };
}

// The background and footer are identical on every image; build them once.
let backgroundPromise: Promise<Buffer> | null = null;
function background(): Promise<Buffer> {
  backgroundPromise ??= sharp({
    create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 4, background: CANVAS_BG },
  })
    .png()
    .toBuffer();
  return backgroundPromise;
}

const footerCache = new Map<string, Promise<TextLayer>>();
function footerLayerFor(footer: string): Promise<TextLayer> {
  let cached = footerCache.get(footer);
  if (!cached) {
    cached = textLayer(`<span foreground="${FOOTER_COLOR}" size="60%">${escapeMarkup(footer)}</span>`);
    footerCache.set(footer, cached);
  }
  return cached;
}

export interface OgImageOptions {
  /** Headline. Long titles are truncated rather than allowed to overflow. */
  title: string;
  /** Small line above the title, e.g. "Market Brief · 14 Jun 2026". */
  kicker?: string;
  /** Hex accent used for the top rule and the kicker. */
  accent?: string;
  /** Bottom-left attribution line. */
  footer?: string;
}

export async function renderOgImage({
  title,
  kicker,
  accent = DEFAULT_ACCENT,
  footer = "nseinsider.co.ke",
}: OgImageOptions): Promise<Buffer> {
  const layers: sharp.OverlayOptions[] = [];

  // Accent rule across the top so category is readable at thumbnail size.
  layers.push({
    input: {
      create: { width: OG_WIDTH, height: 10, channels: 4, background: hexToRgb(accent) },
    },
    top: 0,
    left: 0,
  });

  let cursor = 96;

  if (kicker) {
    const { buffer, height } = await textLayer(
      `<span foreground="${accent}" size="62%" letter_spacing="2048">${escapeMarkup(kicker.toUpperCase())}</span>`
    );
    layers.push({ input: buffer, top: cursor, left: TEXT_LEFT });
    cursor += height + 28;
  }

  const titleLayer = await textLayer(
    `<span foreground="${TITLE_COLOR}">${escapeMarkup(truncate(title, TITLE_MAX_CHARS))}</span>`
  );

  // Clamp so an unexpectedly tall block can never run off the canvas. The crop
  // must use the layer's own width — pango's box is narrower than TEXT_WIDTH.
  let titleBuffer = titleLayer.buffer;
  let titleHeight = titleLayer.height;
  if (titleHeight > TITLE_MAX_HEIGHT && titleLayer.width > 0) {
    titleBuffer = await sharp(titleLayer.buffer)
      .extract({ left: 0, top: 0, width: titleLayer.width, height: TITLE_MAX_HEIGHT })
      .png()
      .toBuffer();
    titleHeight = TITLE_MAX_HEIGHT;
  }

  const footerTop = OG_HEIGHT - 108;
  const titleCeiling = footerTop - 24 - titleHeight;
  const titleTop = Math.max(40, Math.min(cursor, titleCeiling));
  layers.push({ input: titleBuffer, top: titleTop, left: TEXT_LEFT });

  const footerLayer = await footerLayerFor(footer);
  layers.push({ input: footerLayer.buffer, top: footerTop, left: TEXT_LEFT });

  return sharp(await background())
    .composite(layers)
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

export function ogImageResponse(buffer: Buffer): Response {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
