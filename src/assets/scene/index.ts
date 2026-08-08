/**
 * Scene sprite URLs.
 *
 * Vite resolves these at build time: base64 data URIs in the single-file build
 * (so it still opens from file://) and hashed files in the Pages build.
 */
import backdrop from './backdrop.webp'
import backdrop2 from './backdrop2.webp'
import merchantLit from './merchant_lit.webp'
import merchant from './merchant.webp'
import banner from './obj_banner.webp'
import compass from './obj_compass.webp'
import rabbit from './obj_rabbit.webp'

import goodPearl from './good_pearl.webp'
import goodRose from './good_rose.webp'
import goodSaffron from './good_saffron.webp'
import goodEmber from './good_ember.webp'
import goodOlive from './good_olive.webp'
import goodVermil from './good_vermil.webp'
import goodCream from './good_cream.webp'
import goodAmber from './good_amber.webp'
import goodJade from './good_jade.webp'
import goodCoral from './good_coral.webp'
import goodRust from './good_rust.webp'

export const SCENE = { backdrop, backdrop2, merchant, merchantLit, banner, compass, rabbit }

/** The cut-out goods, in the order they read best across the counter. */
export const GOOD_SPRITES: string[] = [
  goodRose,
  goodSaffron,
  goodJade,
  goodVermil,
  goodCoral,
  goodAmber,
  goodCream,
  goodEmber,
  goodOlive,
  goodPearl,
  goodRust,
]
