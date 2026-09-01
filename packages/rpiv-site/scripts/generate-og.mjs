#!/usr/bin/env node
// Generates the active social card and touch icon from a π glyph.
// Run: node packages/rpiv-site/scripts/generate-og.mjs

import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "../public");

const ink = { r: 0x1c, g: 0x1a, b: 0x17, alpha: 1 };
const ochre = "#a8896c";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
	<rect width="180" height="180" rx="28" fill="#1c1a17"/>
	<text x="90" y="125" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="120" font-weight="600" fill="${ochre}">π</text>
</svg>`;

const icon = await sharp(Buffer.from(iconSvg)).png().toBuffer();
const iconOut = resolve(publicDir, "apple-touch-icon.png");
writeFileSync(iconOut, icon);
console.log(`wrote ${iconOut} (${icon.length} bytes)`);

// Full-bleed square for X `summary` cards. X (and most surfaces) re-clip the
// thumbnail with their own rounded mask, so the source must fill every pixel
// with opaque background — any baked rounded corners or transparency show
// through as white wedges around the final preview.
const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
	<rect width="1024" height="1024" fill="#1c1a17"/>
	<text x="512" y="712" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="680" font-weight="600" fill="${ochre}">π</text>
</svg>`;

const square = await sharp(Buffer.from(squareSvg)).flatten({ background: ink }).png().toBuffer();
const squareOut = resolve(publicDir, "og-square.png");
writeFileSync(squareOut, square);
console.log(`wrote ${squareOut} (${square.length} bytes)`);
