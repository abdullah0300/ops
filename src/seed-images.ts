/**
 * ════════════════════════════════════════════════════════
 *  SCRIPT 2: OPS Image Downloader + Converter + Linker
 *
 *  PLACE THIS FILE AT:
 *    D:\Webcraftio\ops\src\seed-images.ts
 *
 *  RUN WITH (from D:\Webcraftio\ops):
 *    npx tsx src/seed-images.ts
 *
 *  ⚠️  RUN seed-products.ts FIRST, then this script
 *
 *  WHAT IT DOES:
 *  1. Downloads each product's front image from onlinepackagingstore.com
 *  2. Converts .webp → .jpg using Sharp (already in Payload)
 *  3. Uploads the JPG to Payload media library
 *  4. Links the image to the correct product automatically
 *  5. Your images are now YOUR property — safe even if old site goes down
 * ════════════════════════════════════════════════════════
 */


import { getPayload } from 'payload'
import configPromise from '@payload-config'
import sharp from 'sharp'
import fs from 'fs'
import https from 'https'
import http from 'http'
import path from 'path'

const BASE_URL = 'https://onlinepackagingstore.com/assets/images/products/'
const TMP_DIR  = path.join(process.cwd(), '.image-tmp')

// ── All 159 products with their exact image filenames from your SQL ───────────
const PRODUCTS = [
  { slug: 'live-resin-vape-boxes',                frontImage: '1747726430_cannabis-vape-box.webp' },
  { slug: 'vape-cartridge-boxes',                 frontImage: '1742275685_vape-cartridge-box.webp' },
  { slug: 'ziplock-mylar-bags',                   frontImage: '1747639337_zip-lock-thc-bags.webp' },
  { slug: 'weed-mylar-bags',                      frontImage: '1747651746_custom-weed-mylar-bags-wholesale.webp' },
  { slug: 'smell-proof-bags',                     frontImage: '1747651145_printed-smell-proof-mylar-bags.webp' },
  { slug: 'food-storage-bags',                    frontImage: '1747651280_custom-food-storage-mylar-bags.webp' },
  { slug: 'die-cut-mylar-bags',                   frontImage: '1747651437_custom-shaped-die-cut-mylar-bags.webp' },
  { slug: 'mylar-envelopes',                      frontImage: '1747727724_custom-mylar-envelope-bags.webp' },
  { slug: 'pet-food-mylar-bags',                  frontImage: '1747727832_pet-food-bags.webp' },
  { slug: 'direct-print-bags',                    frontImage: '1749707160_direct-print-mylar-bags.webp' },
  { slug: 'candy-mylar-bags',                     frontImage: '1747726341_candy-mylar-bags.webp' },
  { slug: 'kraft-mylar-bags',                     frontImage: '1747652420_kraft-mylar-bags.webp' },
  { slug: 'edible-gummy-bags',                    frontImage: '1747727268_edibles-gummy-mylar-bags.webp' },
  { slug: 'lollipop-mylar-bag',                   frontImage: '1747727581_custom-lollipop-mylar-bag-wholesale.webp' },
  { slug: 'coffee-mylar-bag',                     frontImage: '1747726815_coffee-mylar-bags.webp' },
  { slug: '8-oz-mylar-bags',                      frontImage: '1747637586_8-oz-mylar-bags.webp' },
  { slug: 'powder-mylar-bags',                    frontImage: '1747728027_powder-mylar-bags.webp' },
  { slug: 'vacuum-sealed-mylar-bags',             frontImage: '1747728062_sealed-mylar-bag.webp' },
  { slug: 'capsule-mylar-bags',                   frontImage: '1747637856_capsule-mylar-bag.webp' },
  { slug: 'vape-mylar-bags',                      frontImage: '1747728139_custom-vape-mylar-bags.webp' },
  { slug: 'pill-pouch-bags',                      frontImage: '1747727951_custom-pill-pouch-bag.webp' },
  { slug: 'display-boxes-for-mylar-bags',         frontImage: '1747728254_display-box-for-mylar-bag.webp' },
  { slug: 'marijuana-boxes-bags-packaging',       frontImage: '1747638905_marijuana-boxes-bag-packaging.webp' },
  { slug: 'gummy-packaging-boxes',                frontImage: '1747727392_gummies-boxes.webp' },
  { slug: 'cbd-tincture-boxes',                   frontImage: '1747637888_cbd-tincture-box.webp' },
  { slug: 'hemp-boxes',                           frontImage: '1742203350_hemp-box.webp' },
  { slug: 'pizza-boxes',                          frontImage: '1747639028_pizza-boxes.webp' },
  { slug: 'cereal-boxes',                         frontImage: '1747637933_cereal-box.webp' },
  { slug: 'chocolate-packaging',                  frontImage: '1747638040_chocolate-box.webp' },
  { slug: 'macaron-boxes',                        frontImage: '1747638815_macaron-boxes.webp' },
  { slug: 'burger-boxes',                         frontImage: '1747637671_burger-box.webp' },
  { slug: 'donut-boxes',                          frontImage: '1747638576_donut-box.webp' },
  { slug: 'noodle-boxes',                         frontImage: '1742206235_noodle-boxes.webp' },
  { slug: 'cardboard-boxes',                      frontImage: '1747637888_cardboard-box.webp' },
  { slug: 'rigid-boxes',                          frontImage: '1747639102_rigid-box.webp' },
  { slug: 'pillow-boxes',                         frontImage: '1747728332_pillow-box.webp' },
  { slug: 'mailer-boxes',                         frontImage: '1747638886_mailer-boxes-wholesale.webp' },
  { slug: 'candle-boxes',                         frontImage: '1747637693_candle-box.webp' },
  { slug: 'white-boxes',                          frontImage: '1747639350_white-box.webp' },
  { slug: 'corrugated-boxes',                     frontImage: '1747638049_corrugated-box.webp' },
  { slug: 'cigarette-boxes',                      frontImage: '1742208661_cigarette-box.webp' },
  { slug: 'lingerie-boxes',                       frontImage: '1747638647_lingerie-box.webp' },
  { slug: 'action-figure-boxes',                  frontImage: '1747637628_action-figure-box.webp' },
  { slug: 'lighter-boxes',                        frontImage: '1747638618_lighter-box.webp' },
  { slug: 'condom-boxes',                         frontImage: '1747638005_condom-box.webp' },
  { slug: 'influencer-boxes',                     frontImage: '1742210038_influencer-box.webp' },
  { slug: 'custom-phone-case-boxes',              frontImage: '1747638402_custom-phone-case-box.webp' },
  { slug: 'tie-boxes',                            frontImage: '1747639247_tie-box.webp' },
  { slug: 'custom-perfume-boxes',                 frontImage: '1747638193_custom-perfume-box.webp' },
  { slug: 'custom-presentation-boxes',            frontImage: '1747638414_custom-presentation-box.webp' },
  { slug: 'custom-jewelry-boxes',                 frontImage: '1742274113_custom-jewelry-box.webp' },
  { slug: 'stationery-boxes',                     frontImage: '1742274578_stationery-boxes.webp' },
  { slug: 'barbie-doll-boxes',                    frontImage: '1747637650_barbie-doll-box.webp' },
  { slug: 'custom-box-inserts',                   frontImage: '1745408306_custom-box-inserts-wholesale.webp' },
  { slug: 'disposable-vape-boxes',                frontImage: '1747638563_disposable-vape-boxes.webp' },
  { slug: 'vape-juice-boxes',                     frontImage: '1747044177_custom-vape-juice-boxes.webp' },
  { slug: 'child-lock-vape-boxes',                frontImage: '1747638015_child-lock-vape-boxes.webp' },
  { slug: 'rigid-vape-boxes',                     frontImage: '1747639116_rigid-vape-boxes.webp' },
  { slug: '510-thread-vape-boxes',                frontImage: '1747637605_510-thread-vape-boxes.webp' },
  { slug: 'bath-bomb-display-boxes',              frontImage: '1745480128_bath-bomb-display-box.webp' },
  { slug: 'cardstock-display-boxes',              frontImage: '1745480313_custom-cardstock-display-boxes.webp' },
  { slug: 'cosmetic-display-boxes',               frontImage: '1745480691_cosmetic-display-boxes.webp' },
  { slug: 'cbd-display-boxes',                    frontImage: '1745481029_cbd-display-boxes.webp' },
  { slug: 'display-boxes-with-insert',            frontImage: '1745481268_display-boxes-with-inserts.webp' },
  { slug: 'custom-display-boxes-with-dividers',   frontImage: '1745481453_custom-display-boxes-with-dividers.webp' },
  { slug: 'lollipop-display-boxes',               frontImage: '1745481913_custom-lollipop-display-boxes.webp' },
  { slug: 'pop-up-display-boxes',                 frontImage: '1745482083_custom-pop-up-display-boxes.webp' },
  { slug: 'product-display-boxes',                frontImage: '1745482568_custom-product-display-boxes.webp' },
  { slug: 'retail-display-boxes',                 frontImage: '1745482758_custom-retail-display-boxes.webp' },
  { slug: 'sachet-display-boxes',                 frontImage: '1745482937_custom-sachet-display-boxes.webp' },
  { slug: 'vape-display-boxes',                   frontImage: '1745483238_custom-vape-display-packaging-boxes.webp' },
  { slug: 'disposable-vape-display-boxes',        frontImage: '1745483485_custom-disposable-vape-packaging-boxes.webp' },
  { slug: 'soap-boxes',                           frontImage: '1747639233_soap-bar-labels.webp' },
  { slug: 'honey-packaging',                      frontImage: '1747638132_custom-honey-packaging-box.webp' },
  { slug: 'gift-boxes',                           frontImage: '1747639076_printed-gift-boxes-wholesale.webp' },
  { slug: 'custom-popcorn-boxes',                 frontImage: '1747639061_popcorn-packaging-boxes.webp' },
  { slug: 'card-boxes',                           frontImage: '1747638374_custom-playing-card-boxes.webp' },
  { slug: 'folding-boxes',                        frontImage: '1745996825_custom-folding-cartons.webp' },
  { slug: 'booklet-boxes',                        frontImage: '1747638460_custom-standard-booklet-box.webp' },
  { slug: 'child-resistant-mylar-bags',           frontImage: '1746435363_custom-child-resistant-mylar-bag.webp' },
  { slug: 'custom-cbd-oil-boxes',                 frontImage: '1747637789_cannabis-oil-boxes.webp' },
  { slug: 'custom-shoe-boxes',                    frontImage: '1746601009_custom-rigid-shoe-boxes.webp' },
  { slug: 'custom-watch-boxes',                   frontImage: '1746605313_custom-printed-custom-watch-boxes.webp' },
  { slug: 'custom-mylar-bags',                    frontImage: '1746602492_vacuum-sealed-mylar-packaging-bags.webp' },
  { slug: 'personalized-tea-bags',                frontImage: '1746607199_custom-printed-tea-bags.webp' },
  { slug: 'clothing-packaging',                   frontImage: '1746603673_clothing-packaging-box.webp' },
  { slug: 'hot-dog-packaging',                    frontImage: '1746604021_printed-hot-dog-packaging.webp' },
  { slug: 'cardboard-ammo-boxes',                 frontImage: '1746607499_cardboard-ammo-boxes.webp' },
  { slug: 'seed-boxes',                           frontImage: '1746604942_custom-printed-seed-boxes.webp' },
  { slug: 'reverse-tuck-boxes',                   frontImage: '1746692582_custom-reverse-tuck-box.webp' },
  { slug: 'auto-lock-boxes',                      frontImage: '1746693156_printed-auto-lock-boxes.webp' },
  { slug: 'bottom-boxes',                         frontImage: '1746693907_bottom-box.webp' },
  { slug: 'straight-tuck-end-boxes',              frontImage: '1746694261_custom-straight-tuck-end-box.webp' },
  { slug: 'tuck-top-auto-bottom-boxes',           frontImage: '1746694695_tuck-top-auto-bottom-boxes.webp' },
  { slug: 'snap-lock-boxes',                      frontImage: '1746699202_snap-lock-bottom-boxes.webp' },
  { slug: 'roll-end-tuck-boxes',                  frontImage: '1746700769_custom-roll-end-tuck-boxes.webp' },
  { slug: 'kraft-tuck-top-boxes',                 frontImage: '1746701181_custom-kraft-tuck-top-boxes.webp' },
  { slug: 'tuck-top-mailer-boxes',                frontImage: '1746701523_custom-tuck-top-mailer-boxes.webp' },
  { slug: 'tuck-boxes',                           frontImage: '1746701778_custom-roll-end-tuck-boxes.webp' },
  { slug: 'pre-roll-packaging',                   frontImage: '1746702307_luxury-pre-roll-packaging.webp' },
  { slug: 'blister-card',                         frontImage: '1746702583_printed-blister-cards.webp' },
  { slug: 'custom-za-bags',                       frontImage: '1746703005_custom-printed-za-bags.webp' },
  { slug: 'custom-anklet-boxes',                  frontImage: '1746703360_anklet-boxes.webp' },
  { slug: 'paper-mailing-bags',                   frontImage: '1746704725_poly-mailers.webp' },
  { slug: 'custom-eva-foam-inserts',              frontImage: '1746705254_custom-foam-packaging-wholesale.webp' },
  { slug: '3d-card-boxes',                        frontImage: '1746705610_3d-cardboxes.webp' },
  { slug: 'custom-book-boxes',                    frontImage: '1746706480_custom-book-packaging-boxes.webp' },
  { slug: 'custom-cake-boxes',                    frontImage: '1747040314_cake-box.webp' },
  { slug: 'custom-foam-packaging',                frontImage: '1746707687_custom-foam-packaging.webp' },
  { slug: 'custom-toy-boxes',                     frontImage: '1746708879_custom-printed-toy-boxes.webp' },
  { slug: 'christmas-bags',                       frontImage: '1746709376_custom-printed-christmas-boxes-wholesale.webp' },
  { slug: 'bagel-boxes',                          frontImage: '1746709721_bagel-boxes-wholesale.webp' },
  { slug: 'heart-boxes',                          frontImage: '1746709988_custom-heart-shaped-packaging-boxes.webp' },
  { slug: 'belly-band-packaging',                 frontImage: '1746710390_custom-printed-belly-band-packaging.webp' },
  { slug: 'mobile-battery-packaging',             frontImage: '1746710683_custom-printed-mobile-battery-packaging.webp' },
  { slug: 'custom-dog-soap-boxes',                frontImage: '1746711032_dog-soap-box.webp' },
  { slug: 'exotic-weed-bags',                     frontImage: '1747651642_custom-exotic-weed-bag.webp' },
  { slug: 'dessert-boxes',                        frontImage: '1746711749_custom-dessert-boxes.webp' },
  { slug: 'display-box-with-lock',                frontImage: '1746712063_display-boxes-with-lock-wholesale.webp' },
  { slug: 'round-boxes',                          frontImage: '1746712297_round-box.webp' },
  { slug: 'custom-vape-boxes',                    frontImage: '1748588548_custom-rechargeable-vape-boxes-wholesale.webp' },
  { slug: 'pasta-boxes',                          frontImage: '1746771533_custom-pasta-boxes.webp' },
  { slug: 'pr-boxes',                             frontImage: '1746771894_custom-printed-pr-boxes.webp' },
  { slug: 'ice-cream-cone-holder',                frontImage: '1746772167_custom-printed-ice-cream-cone-holder.webp' },
  { slug: 'color-boxes',                          frontImage: '1746772429_color-box.webp' },
  { slug: 'catering-boxes',                       frontImage: '1746773358_catering-box.webp' },
  { slug: 'custom-gable-boxes',                   frontImage: '1746773621_printed-gable-boxes.webp' },
  { slug: 'sports-packaging-boxes',               frontImage: '1746774189_custom-sports-packaging.webp' },
  { slug: 'mug-boxes',                            frontImage: '1746774456_custom-mug-packaging-box.webp' },
  { slug: 'fruit-corn-packaging-box',             frontImage: '1746774761_fruit-corn-packaging-boxes.webp' },
  { slug: 'boxes-for-chargers',                   frontImage: '1746775264_boxes-for-charger.webp' },
  { slug: 'custom-foil-breadstick-bags',          frontImage: '1746775480_custom-printed-foil-breadstick-bags.webp' },
  { slug: 'ornament-packaging',                   frontImage: '1746775777_custom-ornament-packaging-boxes.webp' },
  { slug: 'gusset-mylar-bags',                    frontImage: '1746776072_gusset-bags.webp' },
  { slug: 'skin-care-packaging',                  frontImage: '1746776314_skincare-packaging.webp' },
  { slug: 'slip-boxes',                           frontImage: '1746776566_printed-slip-boxes.webp' },
  { slug: 'mylar-stand-up-bags',                  frontImage: '1746776881_custom-mylar-stand-up-tray.webp' },
  { slug: 'belt-boxes',                           frontImage: '1746777244_printed-belt-boxes.webp' },
  { slug: 'french-fries-boxes',                   frontImage: '1746778295_custom-french-fries-sleeve-boxes-wholesale.webp' },
  { slug: 'supplement-packaging-boxes',           frontImage: '1746778651_custom-supplement-packaging-boxes.webp' },
  { slug: 'sweet-packaging-boxes',                frontImage: '1746778942_custom-printed-sweet-boxes.webp' },
  { slug: 'edible-packaging-bags',                frontImage: '1746779309_mylar-bags-for-edible.webp' },
  { slug: 'record-album-shipping-boxes',          frontImage: '1746779918_record-album-box.webp' },
  { slug: 'clear-lid-packaging',                  frontImage: '1746797183_clear-lid-box-wholesale.webp' },
  { slug: 'heat-seal-packaging-bags',             frontImage: '1746797543_printed-heat-seal-bags.webp' },
  { slug: 'wine-packaging',                       frontImage: '1746798275_custom-wine-bottle.webp' },
  { slug: 'paper-bread-bags',                     frontImage: '1746798761_paper-bread-bags.webp' },
  { slug: 'vitamin-packaging',                    frontImage: '1747142968_custom-vitamin-packaging.webp' },
  { slug: 'game-boxes',                           frontImage: '1747143248_game-boxes.webp' },
  { slug: 'stevia-packaging',                     frontImage: '1747143761_custom-printed-stevia-packaging.webp' },
  { slug: 'sandwich-boxes',                       frontImage: '1747143980_custom-printed-sandwich-boxes.webp' },
  { slug: 'cupcake-boxes',                        frontImage: '1747144235_boxes-for-single-cupcake.webp' },
  { slug: 'cookies-boxes',                        frontImage: '1747144496_cookie-packaging-boxes.webp' },
  { slug: 'massager-packaging',                   frontImage: '1747144765_massager-packaging.webp' },
  { slug: 'poly-mailer-bags',                     frontImage: '1747145142_custom-poly-mailers.webp' },
  { slug: 'sushi-boxes',                          frontImage: '1747145438_custom-printed-sushi-boxes.webp' },
  { slug: 'blister-bags',                         frontImage: '1747218595_blister-bag-wholesale.webp' },
  { slug: 'pdq-display-boxes',                    frontImage: '1747225679_pdq-display-box.webp' },
  { slug: 'custom-sleeves-boxes',                 frontImage: '1747230899_custom-printed-sleeve-boxes.webp' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlink(dest, () => {})
        return downloadFile(res.headers.location!, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        fs.unlink(dest, () => {})
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    })
    req.on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
    req.setTimeout(15000, () => {
      req.destroy()
      reject(new Error(`Timeout downloading ${url}`))
    })
  })
}

async function convertToJpg(inputPath: string, outputPath: string): Promise<void> {
  await sharp(inputPath)
    .jpeg({ quality: 90 })
    .toFile(outputPath)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function seedImages() {
  const payload = await getPayload({ config: configPromise })

  // Create temp directory
  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

  console.log('\n🖼  Starting image download + convert + link...\n')
  console.log(`   Total products: ${PRODUCTS.length}`)
  console.log(`   Downloading from: ${BASE_URL}`)
  console.log(`   Converting: .webp → .jpg\n`)

  let success = 0, failed = 0, skipped = 0

  for (const product of PRODUCTS) {
    // Find the product in Payload by slug
    const found = await payload.find({
      collection: 'products',
      where: { slug: { equals: product.slug } },
      limit: 1,
    })

    if (found.docs.length === 0) {
      console.log(`  ⚠️  Product not found in DB, skipping: ${product.slug}`)
      skipped++
      continue
    }

    const payloadProduct = found.docs[0] as any

    // Skip if image already attached
    if (payloadProduct.meta?.image) {
      console.log(`  ⏭  Already has image: ${product.slug}`)
      skipped++
      continue
    }

    const webpFilename = product.frontImage
    const jpgFilename  = webpFilename.replace('.webp', '.jpg').replace(/\s+/g, '-')
    const webpPath     = path.join(TMP_DIR, webpFilename.replace(/\s+/g, '-'))
    const jpgPath      = path.join(TMP_DIR, jpgFilename)
    const sourceUrl    = BASE_URL + webpFilename.replace(/ /g, '%20')

    try {
      // 1. Download .webp
      process.stdout.write(`  ⬇️  ${product.slug}...`)
      await downloadFile(sourceUrl, webpPath)

      // 2. Convert to .jpg
      await convertToJpg(webpPath, jpgPath)

      // 3. Upload to Payload media
      const fileBuffer = fs.readFileSync(jpgPath)
      const mediaDoc = await payload.create({
        collection: 'media',
        data: { alt: payloadProduct.title },
        file: {
          data: fileBuffer,
          mimetype: 'image/jpeg',
          name: jpgFilename,
          size: fileBuffer.length,
        },
      })

      // 4. Link image to the product's meta.image
      await payload.update({
        collection: 'products',
        id: payloadProduct.id,
        data: {
          meta: {
            ...payloadProduct.meta,
            image: mediaDoc.id,
          },
        } as any,
      })

      // Cleanup temp files
      fs.unlink(webpPath, () => {})
      fs.unlink(jpgPath, () => {})

      success++
      console.log(` ✅`)

    } catch (err: any) {
      failed++
      console.log(` ❌ ${err.message}`)
      // Cleanup on error
      if (fs.existsSync(webpPath)) fs.unlink(webpPath, () => {})
      if (fs.existsSync(jpgPath))  fs.unlink(jpgPath, () => {})
    }
  }

  // Cleanup temp dir
  try { fs.rmdirSync(TMP_DIR) } catch {}

  console.log(`
════════════════════════════════════
✅ IMAGE SEED COMPLETE
   ✅ Success : ${success}
   ⏭  Skipped : ${skipped}
   ❌ Failed  : ${failed}

   ${failed > 0 ? '⚠️  Re-run the script to retry failed images.' : '🎉 All images downloaded, converted to JPG, and linked!'}
════════════════════════════════════
  `)

  process.exit(0)
}

seedImages().catch(err => { console.error('❌ Fatal error:', err); process.exit(1) })