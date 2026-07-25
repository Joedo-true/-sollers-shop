import type { Product } from '../types'

/**
 * Generates a lightweight, self-contained SVG placeholder image (as a data
 * URI) for a product. Because the catalog is now local, we don't depend on any
 * remote image host — each product gets an on-brand gradient tile with its
 * brand wordmark, generated at runtime so nothing is stored in the bundle.
 */

// Soft gradient backgrounds paired with a matching accent colour.
const THEMES: { from: string; to: string; accent: string }[] = [
  { from: '#eef2ff', to: '#e0e7ff', accent: '#6366f1' }, // indigo
  { from: '#eff6ff', to: '#dbeafe', accent: '#3b82f6' }, // blue
  { from: '#f0fdfa', to: '#ccfbf1', accent: '#14b8a6' }, // teal
  { from: '#fff1f2', to: '#ffe4e6', accent: '#f43f5e' }, // rose
  { from: '#fefce8', to: '#fef9c3', accent: '#f59e0b' }, // amber
  { from: '#faf5ff', to: '#f3e8ff', accent: '#a855f7' }, // purple
  { from: '#f0fdf4', to: '#dcfce7', accent: '#22c55e' }, // green
  { from: '#fff7ed', to: '#ffedd5', accent: '#f97316' }, // orange
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function productPlaceholder(product: Product): string {
  const seed = hash(`${product.brand}|${product.category}|${product.id}`)
  const theme = THEMES[seed % THEMES.length]
  const brand = escapeXml((product.brand || 'Sollers').slice(0, 20))
  const initial = escapeXml((product.brand || 'S').charAt(0).toUpperCase())

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${theme.from}"/>` +
    `<stop offset="1" stop-color="${theme.to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="400" height="400" fill="url(#g)"/>` +
    `<circle cx="200" cy="158" r="66" fill="${theme.accent}" opacity="0.12"/>` +
    `<text x="200" y="158" font-family="system-ui,Segoe UI,Arial,sans-serif" font-size="76" ` +
    `font-weight="800" fill="${theme.accent}" text-anchor="middle" dominant-baseline="central">${initial}</text>` +
    `<text x="200" y="270" font-family="system-ui,Segoe UI,Arial,sans-serif" font-size="26" ` +
    `font-weight="700" fill="#0f172a" text-anchor="middle">${brand}</text>` +
    `</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
