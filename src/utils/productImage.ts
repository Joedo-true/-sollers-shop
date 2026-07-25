import type { Product } from '../types'

/**
 * Generates a recognizable, per-product illustration (as an inline SVG data
 * URI) for the local catalog. Real product photos can't be bundled offline,
 * so instead each product gets a clean vector illustration of its actual
 * product type — a phone for smartphones, a laptop for laptops, headphones,
 * a camera, a perfume bottle, and so on — tinted by a brand-derived colour
 * theme. Everything is generated at runtime, so nothing bloats the bundle and
 * there are zero network requests.
 */

interface Theme {
  bg1: string
  bg2: string
  main: string
  dark: string
  light: string
}

const THEMES: Theme[] = [
  { bg1: '#eef2ff', bg2: '#e0e7ff', main: '#4f46e5', dark: '#312e81', light: '#c7d2fe' }, // indigo
  { bg1: '#ecfeff', bg2: '#cffafe', main: '#0891b2', dark: '#155e75', light: '#a5f3fc' }, // cyan
  { bg1: '#fef2f2', bg2: '#ffe4e6', main: '#e11d48', dark: '#881337', light: '#fecdd3' }, // rose
  { bg1: '#f0fdf4', bg2: '#dcfce7', main: '#16a34a', dark: '#14532d', light: '#bbf7d0' }, // green
  { bg1: '#fffbeb', bg2: '#fef3c7', main: '#d97706', dark: '#78350f', light: '#fde68a' }, // amber
  { bg1: '#faf5ff', bg2: '#f3e8ff', main: '#9333ea', dark: '#581c87', light: '#e9d5ff' }, // purple
  { bg1: '#eff6ff', bg2: '#dbeafe', main: '#2563eb', dark: '#1e3a8a', light: '#bfdbfe' }, // blue
  { bg1: '#f8fafc', bg2: '#e2e8f0', main: '#475569', dark: '#1e293b', light: '#cbd5e1' }, // slate
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

/** Category → product illustration (SVG markup drawn over the background). */
const ILLUSTRATIONS: Record<string, (t: Theme) => string> = {
  smartphones: (t) => `
    <rect x="152" y="90" width="96" height="220" rx="24" fill="${t.dark}"/>
    <rect x="160" y="98" width="80" height="204" rx="17" fill="#fff"/>
    <rect x="160" y="98" width="80" height="80" rx="17" fill="${t.main}" opacity="0.18"/>
    <rect x="184" y="106" width="32" height="7" rx="3.5" fill="${t.dark}"/>
    <rect x="174" y="150" width="52" height="9" rx="4.5" fill="${t.main}" opacity="0.35"/>
    <rect x="174" y="168" width="52" height="9" rx="4.5" fill="${t.main}" opacity="0.22"/>
    <circle cx="200" cy="232" r="28" fill="${t.main}" opacity="0.85"/>`,

  laptops: (t) => `
    <rect x="122" y="118" width="156" height="104" rx="10" fill="${t.dark}"/>
    <rect x="130" y="126" width="140" height="88" rx="4" fill="#fff"/>
    <rect x="130" y="126" width="140" height="88" rx="4" fill="${t.main}" opacity="0.16"/>
    <circle cx="200" cy="170" r="20" fill="${t.main}" opacity="0.5"/>
    <path d="M92 230 h216 l16 26 a6 6 0 0 1 -5 9 H81 a6 6 0 0 1 -5 -9 Z" fill="${t.main}"/>
    <rect x="168" y="230" width="64" height="9" rx="4.5" fill="${t.dark}" opacity="0.4"/>`,

  headphones: (t) => `
    <path d="M118 214 a82 82 0 0 1 164 0" fill="none" stroke="${t.dark}" stroke-width="16" stroke-linecap="round"/>
    <rect x="100" y="198" width="42" height="76" rx="18" fill="${t.main}"/>
    <rect x="258" y="198" width="42" height="76" rx="18" fill="${t.main}"/>
    <rect x="109" y="210" width="24" height="52" rx="11" fill="${t.dark}" opacity="0.45"/>
    <rect x="267" y="210" width="24" height="52" rx="11" fill="${t.dark}" opacity="0.45"/>`,

  watches: (t) => `
    <rect x="170" y="92" width="60" height="56" rx="16" fill="${t.dark}"/>
    <rect x="170" y="252" width="60" height="56" rx="16" fill="${t.dark}"/>
    <rect x="150" y="138" width="100" height="124" rx="30" fill="${t.main}"/>
    <rect x="162" y="150" width="76" height="100" rx="20" fill="#fff"/>
    <rect x="162" y="150" width="76" height="100" rx="20" fill="${t.main}" opacity="0.12"/>
    <circle cx="200" cy="200" r="22" fill="${t.main}" opacity="0.6"/>
    <rect x="196" y="182" width="8" height="20" rx="4" fill="${t.dark}"/>`,

  cameras: (t) => `
    <rect x="150" y="128" width="64" height="26" rx="8" fill="${t.dark}"/>
    <rect x="110" y="150" width="180" height="122" rx="18" fill="${t.dark}"/>
    <circle cx="200" cy="214" r="48" fill="${t.main}"/>
    <circle cx="200" cy="214" r="32" fill="#fff"/>
    <circle cx="200" cy="214" r="32" fill="${t.dark}" opacity="0.18"/>
    <circle cx="200" cy="214" r="15" fill="${t.dark}"/>
    <rect x="248" y="162" width="24" height="12" rx="4" fill="${t.light}"/>`,

  gaming: (t) => `
    <circle cx="132" cy="214" r="36" fill="${t.dark}"/>
    <circle cx="268" cy="214" r="36" fill="${t.dark}"/>
    <rect x="118" y="178" width="164" height="72" rx="34" fill="${t.dark}"/>
    <circle cx="166" cy="206" r="13" fill="${t.main}"/>
    <circle cx="234" cy="206" r="13" fill="${t.main}"/>
    <rect x="150" y="220" width="8" height="22" rx="3" fill="${t.light}"/>
    <rect x="139" y="231" width="22" height="8" rx="3" fill="${t.light}"/>
    <circle cx="248" cy="230" r="5.5" fill="${t.light}"/>
    <circle cx="263" cy="217" r="5.5" fill="${t.light}"/>`,

  tablets: (t) => `
    <rect x="128" y="94" width="144" height="212" rx="18" fill="${t.dark}"/>
    <rect x="139" y="110" width="122" height="180" rx="6" fill="#fff"/>
    <rect x="139" y="110" width="122" height="180" rx="6" fill="${t.main}" opacity="0.14"/>
    <circle cx="200" cy="200" r="30" fill="${t.main}" opacity="0.45"/>`,

  tv: (t) => `
    <rect x="92" y="116" width="216" height="134" rx="10" fill="${t.dark}"/>
    <rect x="102" y="126" width="196" height="114" rx="4" fill="#fff"/>
    <rect x="102" y="126" width="196" height="114" rx="4" fill="${t.main}" opacity="0.2"/>
    <rect x="182" y="250" width="36" height="16" fill="${t.dark}"/>
    <rect x="146" y="266" width="108" height="11" rx="5.5" fill="${t.dark}"/>`,

  fragrances: (t) => `
    <rect x="186" y="100" width="28" height="28" rx="4" fill="${t.dark}"/>
    <rect x="192" y="126" width="16" height="20" fill="${t.dark}" opacity="0.7"/>
    <rect x="156" y="144" width="88" height="156" rx="20" fill="${t.main}"/>
    <rect x="156" y="144" width="88" height="60" rx="20" fill="#fff" opacity="0.16"/>
    <rect x="176" y="206" width="48" height="66" rx="8" fill="#fff" opacity="0.4"/>`,

  sneakers: (t) => `
    <path d="M84 250 q4 -34 40 -40 q16 -3 30 8 q14 -12 30 -4 l70 34 q40 4 52 20 q8 12 6 22 a8 8 0 0 1 -8 6 H92 a8 8 0 0 1 -8 -8 Z" fill="${t.main}"/>
    <path d="M84 268 h236 v8 a8 8 0 0 1 -8 8 H92 a8 8 0 0 1 -8 -8 Z" fill="${t.dark}"/>
    <path d="M150 224 l18 14 M178 212 l16 20 M206 218 l14 18" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.55"/>`,

  bags: (t) => `
    <path d="M150 156 a50 50 0 0 1 100 0 v8 h-100 Z" fill="${t.dark}"/>
    <rect x="192" y="118" width="16" height="44" rx="8" fill="${t.dark}"/>
    <rect x="142" y="150" width="116" height="152" rx="28" fill="${t.main}"/>
    <rect x="174" y="150" width="52" height="74" rx="16" fill="${t.dark}" opacity="0.32"/>
    <rect x="166" y="238" width="68" height="10" rx="5" fill="${t.dark}" opacity="0.4"/>`,

  home: (t) => `
    <path d="M200 116 l90 74 h-26 v98 a8 8 0 0 1 -8 8 H144 a8 8 0 0 1 -8 -8 v-98 h-26 Z" fill="${t.main}"/>
    <path d="M200 116 l90 74 h-180 Z" fill="${t.dark}"/>
    <rect x="182" y="228" width="36" height="66" rx="4" fill="#fff" opacity="0.5"/>
    <rect x="150" y="206" width="30" height="26" rx="4" fill="#fff" opacity="0.35"/>`,
}

function defaultIllustration(t: Theme): string {
  return `
    <rect x="128" y="140" width="144" height="132" rx="16" fill="${t.main}"/>
    <path d="M128 178 h144" stroke="#fff" stroke-width="6" opacity="0.4"/>
    <circle cx="200" cy="222" r="28" fill="#fff" opacity="0.4"/>`
}

export function productImage(product: Product): string {
  const seed = hash(`${product.brand}|${product.id}`)
  const theme = THEMES[seed % THEMES.length]
  const draw = ILLUSTRATIONS[product.category] ?? defaultIllustration

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
    `<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${theme.bg1}"/><stop offset="1" stop-color="${theme.bg2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="400" height="400" fill="url(#b)"/>` +
    draw(theme) +
    `</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
