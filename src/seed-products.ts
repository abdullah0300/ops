/**
 * ════════════════════════════════════════════════════════
 *  SCRIPT 1: OPS Product + Category Seeder
 *
 *  PLACE THIS FILE AT:
 *    D:\Webcraftio\ops\src\seed-products.ts
 *
 *  RUN WITH (from D:\Webcraftio\ops):
 *    npx tsx src/seed-products.ts
 *
 *  RUN THIS FIRST, then run seed-images.ts
 * ════════════════════════════════════════════════════════
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'

const CATEGORIES = [
  { oldId: '4', title: 'Mylar Bags',             slug: 'mylar-bags' },
  { oldId: '5', title: 'CBD Packaging Boxes',     slug: 'cbd-packaging-boxes' },
  { oldId: '6', title: 'Food Boxes',              slug: 'food-boxes' },
  { oldId: '7', title: 'Retail Packaging Boxes',  slug: 'retail-packaging-boxes' },
  { oldId: '8', title: 'Display Packaging Boxes', slug: 'display-packaging-boxes' },
  { oldId: '9', title: 'Vape Boxes',              slug: 'vape-packaging-boxes' },
]

const PRODUCTS = [
  { id: 2,   catId: '9', title: 'Live Resin Vape Boxes',              slug: 'live-resin-vape-boxes',                  frontImage: '1747726430_cannabis-vape-box.webp',                           backImage: '1747726430_cannabis-vape-boxes.webp' },
  { id: 3,   catId: '9', title: 'Vape Cartridge Boxes',               slug: 'vape-cartridge-boxes',                   frontImage: '1742275685_vape-cartridge-box.webp',                          backImage: '1742275685_vape-cartridge-boxes.webp' },
  { id: 4,   catId: '4', title: 'Ziplock Mylar Bags',                 slug: 'ziplock-mylar-bags',                     frontImage: '1747639337_zip-lock-thc-bags.webp',                           backImage: '1745416802_zip-lock-thc-mylar.webp' },
  { id: 5,   catId: '4', title: 'Weed Mylar Bags',                    slug: 'weed-mylar-bags',                        frontImage: '1747651746_custom-weed-mylar-bags-wholesale.webp',            backImage: '1747651746_custom-weed-mylar-bag.webp' },
  { id: 6,   catId: '4', title: 'Smell Proof Bags',                   slug: 'smell-proof-bags',                       frontImage: '1747651145_printed-smell-proof-mylar-bags.webp',              backImage: '1747651145_smell-proof-mylar-bags.webp' },
  { id: 7,   catId: '4', title: 'Food Storage Bags',                  slug: 'food-storage-bags',                      frontImage: '1747651280_custom-food-storage-mylar-bags.webp',              backImage: '1747651280_custom-food-storage-mylar-bags-wholesale.webp' },
  { id: 8,   catId: '4', title: 'Die Cut Mylar Bags',                 slug: 'die-cut-mylar-bags',                     frontImage: '1747651437_custom-shaped-die-cut-mylar-bags.webp',            backImage: '1747651437_custom-shaped-die-cut-bags.webp' },
  { id: 9,   catId: '4', title: 'Mylar Envelopes',                    slug: 'mylar-envelopes',                        frontImage: '1747727724_custom-mylar-envelope-bags.webp',                  backImage: '1745416621_custom-mylar-envelope-wholesale.webp' },
  { id: 10,  catId: '4', title: 'Pet Food Bags',                      slug: 'pet-food-mylar-bags',                    frontImage: '1747727832_pet-food-bags.webp',                               backImage: '1747727832_printed-pet-food-bags.webp' },
  { id: 11,  catId: '4', title: 'Direct Print Bags',                  slug: 'direct-print-bags',                      frontImage: '1749707160_direct-print-mylar-bags.webp',                     backImage: '1749707160_custom-direct-print-mylar-bags.webp' },
  { id: 12,  catId: '4', title: 'Candy Mylar Bags',                   slug: 'candy-mylar-bags',                       frontImage: '1747726341_candy-mylar-bags.webp',                            backImage: '1747726341_candy-mylar-bag-wholesale.webp' },
  { id: 13,  catId: '4', title: 'Kraft Mylar Bags',                   slug: 'kraft-mylar-bags',                       frontImage: '1747652420_kraft-mylar-bags.webp',                            backImage: '1747652420_kraft-mylar-bag.webp' },
  { id: 14,  catId: '4', title: 'Edible Gummy Bags',                  slug: 'edible-gummy-bags',                      frontImage: '1747727268_edibles-gummy-mylar-bags.webp',                    backImage: '1747727268_edibles-gummy-mylar-bag.webp' },
  { id: 15,  catId: '4', title: 'Lollipop Mylar Bags',                slug: 'lollipop-mylar-bag',                     frontImage: '1747727581_custom-lollipop-mylar-bag-wholesale.webp',         backImage: '1747727581_lollipop-mylar-bag.webp' },
  { id: 16,  catId: '4', title: 'Coffee Mylar Bags',                  slug: 'coffee-mylar-bag',                       frontImage: '1747726815_coffee-mylar-bags.webp',                           backImage: '1747726815_coffee mylar bag.webp' },
  { id: 17,  catId: '4', title: '8 Oz Mylar Bags',                    slug: '8-oz-mylar-bags',                        frontImage: '1747637586_8-oz-mylar-bags.webp',                             backImage: '1742196104_custom-8-oz-mylar-bags.webp' },
  { id: 18,  catId: '4', title: 'Powder Mylar Bags',                  slug: 'powder-mylar-bags',                      frontImage: '1747728027_powder-mylar-bags.webp',                           backImage: '1747728027_custom-powder-mylar-bags.webp' },
  { id: 19,  catId: '4', title: 'Vacuum Sealed Mylar Bags',           slug: 'vacuum-sealed-mylar-bags',               frontImage: '1747728062_sealed-mylar-bag.webp',                            backImage: '1742199245_sealed-mylar-bags-wholesale.webp' },
  { id: 20,  catId: '4', title: 'Capsule Mylar Bags',                 slug: 'capsule-mylar-bags',                     frontImage: '1747637856_capsule-mylar-bag.webp',                           backImage: '1747726592_capsule-mylar-bag.webp' },
  { id: 21,  catId: '4', title: 'Vape Mylar Bags',                    slug: 'vape-mylar-bags',                        frontImage: '1747728139_custom-vape-mylar-bags.webp',                      backImage: '1742201526_vape-mylar-bags.webp' },
  { id: 22,  catId: '4', title: 'Pill Pouch Bags',                    slug: 'pill-pouch-bags',                        frontImage: '1747727951_custom-pill-pouch-bag.webp',                       backImage: '1742201806_pill-pouch-bags.webp' },
  { id: 23,  catId: '4', title: 'Display Boxes For Mylar Bags',       slug: 'display-boxes-for-mylar-bags',           frontImage: '1747728254_display-box-for-mylar-bag.webp',                   backImage: '1742202074_display-boxes-for-mylar-bags.webp' },
  { id: 24,  catId: '5', title: 'Marijuana Boxes And Bags Packaging', slug: 'marijuana-boxes-bags-packaging',         frontImage: '1747638905_marijuana-boxes-bag-packaging.webp',               backImage: '1742202490_marijuana-boxes-bags-packaging-wholesale.webp' },
  { id: 25,  catId: '5', title: 'Gummy Packaging Boxes',              slug: 'gummy-packaging-boxes',                  frontImage: '1747727392_gummies-boxes.webp',                               backImage: '1742202794_gummy-packaging-boxes-wholesale.webp' },
  { id: 26,  catId: '5', title: 'CBD Tincture Boxes',                 slug: 'cbd-tincture-boxes',                     frontImage: '1747637888_cbd-tincture-box.webp',                            backImage: '1742203058_cbd-tincture-boxes.webp' },
  { id: 27,  catId: '5', title: 'Custom Hemp Boxes',                  slug: 'hemp-boxes',                             frontImage: '1742203350_hemp-box.webp',                                    backImage: '1742203350_hemp-boxes.webp' },
  { id: 28,  catId: '6', title: 'Custom Pizza Boxes',                 slug: 'pizza-boxes',                            frontImage: '1747639028_pizza-boxes.webp',                                 backImage: '1742204573_pizza-box.webp' },
  { id: 29,  catId: '6', title: 'Cereal Boxes',                       slug: 'cereal-boxes',                           frontImage: '1747637933_cereal-box.webp',                                  backImage: '1742204803_cereal-boxes.webp' },
  { id: 30,  catId: '6', title: 'Chocolate Packaging',                slug: 'chocolate-packaging',                    frontImage: '1747638040_chocolate-box.webp',                               backImage: '1742205136_chocolate-boxes-wholesale.webp' },
  { id: 31,  catId: '6', title: 'Macaron Boxes',                      slug: 'macaron-boxes',                          frontImage: '1747638815_macaron-boxes.webp',                               backImage: '1742205351_macaron-box.webp' },
  { id: 32,  catId: '6', title: 'Burger Boxes',                       slug: 'burger-boxes',                           frontImage: '1747637671_burger-box.webp',                                  backImage: '1742205587_burger-boxes.webp' },
  { id: 33,  catId: '6', title: 'Donut Boxes',                        slug: 'donut-boxes',                            frontImage: '1747638576_donut-box.webp',                                   backImage: '1742205939_donut-boxes.webp' },
  { id: 34,  catId: '6', title: 'Custom Noodle Boxes',                slug: 'noodle-boxes',                           frontImage: '1742206235_noodle-boxes.webp',                                backImage: '1742206235_noodle-box.webp' },
  { id: 35,  catId: '7', title: 'Cardboard Boxes',                    slug: 'cardboard-boxes',                        frontImage: '1747637888_cardboard-box.webp',                               backImage: '1742206575_chocolate-boxes.webp' },
  { id: 36,  catId: '7', title: 'Rigid Boxes',                        slug: 'rigid-boxes',                            frontImage: '1747639102_rigid-box.webp',                                   backImage: '1742206915_rigid-boxes.webp' },
  { id: 37,  catId: '7', title: 'Pillow Boxes',                       slug: 'pillow-boxes',                           frontImage: '1747728332_pillow-box.webp',                                  backImage: '1742207234_pizza-boxes.webp' },
  { id: 38,  catId: '7', title: 'Mailer Boxes',                       slug: 'mailer-boxes',                           frontImage: '1747638886_mailer-boxes-wholesale.webp',                      backImage: '1742207518_mailer-box.webp' },
  { id: 39,  catId: '7', title: 'Candle Boxes',                       slug: 'candle-boxes',                           frontImage: '1747637693_candle-box.webp',                                  backImage: '1742207903_candle-boxes.webp' },
  { id: 40,  catId: '7', title: 'White Boxes',                        slug: 'white-boxes',                            frontImage: '1747639350_white-box.webp',                                   backImage: '1742208137_white-boxes.webp' },
  { id: 41,  catId: '7', title: 'Corrugated Boxes',                   slug: 'corrugated-boxes',                       frontImage: '1747638049_corrugated-box.webp',                              backImage: '1742208391_corrugated-boxes.webp' },
  { id: 42,  catId: '7', title: 'Cigarette Boxes',                    slug: 'cigarette-boxes',                        frontImage: '1742208661_cigarette-box.webp',                               backImage: '1742208661_cigarette-boxes.webp' },
  { id: 43,  catId: '7', title: 'Lingerie Boxes',                     slug: 'lingerie-boxes',                         frontImage: '1747638647_lingerie-box.webp',                                backImage: '1742208963_lingerie-boxes-wholesale.webp' },
  { id: 44,  catId: '7', title: 'Action Figure Boxes',                slug: 'action-figure-boxes',                    frontImage: '1747637628_action-figure-box.webp',                           backImage: '1742209243_action-figure-boxes.webp' },
  { id: 45,  catId: '7', title: 'Lighter Boxes',                      slug: 'lighter-boxes',                          frontImage: '1747638618_lighter-box.webp',                                 backImage: '1742209524_lighter-boxes.webp' },
  { id: 46,  catId: '7', title: 'Condom Boxes',                       slug: 'condom-boxes',                           frontImage: '1747638005_condom-box.webp',                                  backImage: '1742209755_condom-boxes.webp' },
  { id: 47,  catId: '7', title: 'Custom Influencer Boxes',            slug: 'influencer-boxes',                       frontImage: '1742210038_influencer-box.webp',                              backImage: '1742210038_influencer-boxes.webp' },
  { id: 48,  catId: '7', title: 'Custom Phone Case Boxes',            slug: 'custom-phone-case-boxes',                frontImage: '1747638402_custom-phone-case-box.webp',                       backImage: '1742210287_custom-phone-case-boxes.webp' },
  { id: 49,  catId: '7', title: 'Tie Boxes',                          slug: 'tie-boxes',                              frontImage: '1747639247_tie-box.webp',                                     backImage: '1742210507_tie-boxes.webp' },
  { id: 50,  catId: '7', title: 'Perfume Boxes',                      slug: 'custom-perfume-boxes',                   frontImage: '1747638193_custom-perfume-box.webp',                          backImage: '1742210880_custom-perfume-boxes.webp' },
  { id: 51,  catId: '7', title: 'Presentation Boxes',                 slug: 'custom-presentation-boxes',              frontImage: '1747638414_custom-presentation-box.webp',                     backImage: '1742273907_custom-presentation-boxes.webp' },
  { id: 52,  catId: '7', title: 'Jewelry Boxes',                      slug: 'custom-jewelry-boxes',                   frontImage: '1742274113_custom-jewelry-box.webp',                          backImage: '1742274113_custom-jewelry-boxes.webp' },
  { id: 54,  catId: '7', title: 'Stationery Boxes',                   slug: 'stationery-boxes',                       frontImage: '1742274578_stationery-boxes.webp',                            backImage: '1742274578_stationery-box.webp' },
  { id: 56,  catId: '7', title: 'Barbie Doll Boxes',                  slug: 'barbie-doll-boxes',                      frontImage: '1747637650_barbie-doll-box.webp',                             backImage: '1742275004_barbie-doll-boxes.webp' },
  { id: 57,  catId: '7', title: 'Custom Box Inserts',                 slug: 'custom-box-inserts',                     frontImage: '1745408306_custom-box-inserts-wholesale.webp',                backImage: '1745408306_custom-box-inserts.webp' },
  { id: 58,  catId: '9', title: 'Disposable Vape Boxes',              slug: 'disposable-vape-boxes',                  frontImage: '1747638563_disposable-vape-boxes.webp',                       backImage: '1742275973_disposable-vape-box.webp' },
  { id: 59,  catId: '9', title: 'Vape Juice Boxes',                   slug: 'vape-juice-boxes',                       frontImage: '1747044177_custom-vape-juice-boxes.webp',                     backImage: '1747044177_vape-juice-boxes.webp' },
  { id: 60,  catId: '9', title: 'Child Vape Boxes',                   slug: 'child-lock-vape-boxes',                  frontImage: '1747638015_child-lock-vape-boxes.webp',                       backImage: '1742277227_child-lock-vape-box.webp' },
  { id: 61,  catId: '9', title: 'Rigid Vape Boxes',                   slug: 'rigid-vape-boxes',                       frontImage: '1747639116_rigid-vape-boxes.webp',                            backImage: '1747728414_printed-rigid-vape-box.webp' },
  { id: 62,  catId: '9', title: '510 Thread Vape Boxes',              slug: '510-thread-vape-boxes',                  frontImage: '1747637605_510-thread-vape-boxes.webp',                       backImage: '1742277971_510-thread-vape-box.webp' },
  { id: 63,  catId: '8', title: 'Bath Bomb Display Boxes',            slug: 'bath-bomb-display-boxes',                frontImage: '1745480128_bath-bomb-display-box.webp',                       backImage: '1745480128_bath-bomb-display-boxes.webp' },
  { id: 64,  catId: '8', title: 'Cardstock Display Boxes',            slug: 'cardstock-display-boxes',                frontImage: '1745480313_custom-cardstock-display-boxes.webp',              backImage: '1745480313_cardstock-display-boxes.webp' },
  { id: 65,  catId: '8', title: 'Cosmetic Display Boxes',             slug: 'cosmetic-display-boxes',                 frontImage: '1745480691_cosmetic-display-boxes.webp',                      backImage: '1745480691_cosmetic-display-packaging-boxes.webp' },
  { id: 66,  catId: '8', title: 'Custom CBD Display Boxes',           slug: 'cbd-display-boxes',                      frontImage: '1745481029_cbd-display-boxes.webp',                           backImage: '1745481029_cbd-display-packaging-boxes.webp' },
  { id: 67,  catId: '8', title: 'Display Boxes With Insert',          slug: 'display-boxes-with-insert',              frontImage: '1745481268_display-boxes-with-inserts.webp',                  backImage: '1745481268_custom-display-boxes-with-inserts.webp' },
  { id: 68,  catId: '8', title: 'Custom Display Boxes With Dividers', slug: 'custom-display-boxes-with-dividers',     frontImage: '1745481453_custom-display-boxes-with-dividers.webp',          backImage: '1745481453_display-boxes-with-dividers.webp' },
  { id: 70,  catId: '8', title: 'Lollipop Display Boxes',             slug: 'lollipop-display-boxes',                 frontImage: '1745481913_custom-lollipop-display-boxes.webp',               backImage: '1745481913_custom-lollipop-display-boxes-wholesale.webp' },
  { id: 71,  catId: '8', title: 'Pop Up Display Boxes',               slug: 'pop-up-display-boxes',                   frontImage: '1745482083_custom-pop-up-display-boxes.webp',                 backImage: '1745482083_custom-pop-up-display-boxes-wholesale.webp' },
  { id: 73,  catId: '8', title: 'Product Display Boxes',              slug: 'product-display-boxes',                  frontImage: '1745482568_custom-product-display-boxes.webp',                backImage: '1745482568_printed-product-display-boxes.webp' },
  { id: 74,  catId: '8', title: 'Custom Retail Display Boxes',        slug: 'retail-display-boxes',                   frontImage: '1745482758_custom-retail-display-boxes.webp',                 backImage: '1745482758_custom-retail-display-boxes-wholesale.webp' },
  { id: 76,  catId: '8', title: 'Custom Sachet Display Boxes',        slug: 'sachet-display-boxes',                   frontImage: '1745482937_custom-sachet-display-boxes.webp',                 backImage: '1745482937_sachet-display-boxes-wholesale.webp' },
  { id: 77,  catId: '8', title: 'Custom Vape Display Boxes',          slug: 'vape-display-boxes',                     frontImage: '1745483238_custom-vape-display-packaging-boxes.webp',         backImage: '1745483238_custom-vape-display-packaging-boxes-wholesale.webp' },
  { id: 78,  catId: '8', title: 'Custom Disposable Vape Boxes',       slug: 'disposable-vape-display-boxes',          frontImage: '1745483485_custom-disposable-vape-packaging-boxes.webp',      backImage: '1745483485_custom-disposable-vape-packaging-boxes-wholesale.webp' },
  { id: 79,  catId: '7', title: 'Soap Boxes',                         slug: 'soap-boxes',                             frontImage: '1747639233_soap-bar-labels.webp',                             backImage: '1745829474_bath-soap-boxes-custom.webp' },
  { id: 80,  catId: '7', title: 'Honey Packaging',                    slug: 'honey-packaging',                        frontImage: '1747638132_custom-honey-packaging-box.webp',                  backImage: '1745993023_custom-honey-packaging-boxes.webp' },
  { id: 81,  catId: '7', title: 'Gift Boxes',                         slug: 'gift-boxes',                             frontImage: '1747639076_printed-gift-boxes-wholesale.webp',                backImage: '1745994647_gift-box.webp' },
  { id: 82,  catId: '6', title: 'Custom Popcorn Boxes',               slug: 'custom-popcorn-boxes',                   frontImage: '1747639061_popcorn-packaging-boxes.webp',                     backImage: '1745995692_popcorn-boxes-wholesale.webp' },
  { id: 83,  catId: '7', title: 'Card Boxes',                         slug: 'card-boxes',                             frontImage: '1747638374_custom-playing-card-boxes.webp',                   backImage: '1745996527_custom-playing-card-box.webp' },
  { id: 84,  catId: '7', title: 'Folding Boxes',                      slug: 'folding-boxes',                          frontImage: '1745996825_custom-folding-cartons.webp',                      backImage: '1745996825_custom-folding-cartons-wholesale.webp' },
  { id: 85,  catId: '7', title: 'Booklet Boxes',                      slug: 'booklet-boxes',                          frontImage: '1747638460_custom-standard-booklet-box.webp',                 backImage: '1746429507_standard-booklet-box-wholesale.webp' },
  { id: 86,  catId: '4', title: 'Child Resistant Mylar Bags',         slug: 'child-resistant-mylar-bags',             frontImage: '1746435363_custom-child-resistant-mylar-bag.webp',            backImage: '1746435363_child-resistant-mylar-bag.webp' },
  { id: 87,  catId: '5', title: 'Custom CBD Oil Boxes',               slug: 'custom-cbd-oil-boxes',                   frontImage: '1747637789_cannabis-oil-boxes.webp',                          backImage: '1746435753_printed-cannabis-oil-packaging-boxes.webp' },
  { id: 88,  catId: '7', title: 'Custom Shoe Boxes',                  slug: 'custom-shoe-boxes',                      frontImage: '1746601009_custom-rigid-shoe-boxes.webp',                     backImage: '1746601009_custom-rigid-shoe-boxes-wholesale.webp' },
  { id: 89,  catId: '7', title: 'Custom Watch Boxes',                 slug: 'custom-watch-boxes',                     frontImage: '1746605313_custom-printed-custom-watch-boxes.webp',           backImage: '1746605313_custom-watch-boxes-wholesale.webp' },
  { id: 90,  catId: '4', title: 'Custom Mylar Bags',                  slug: 'custom-mylar-bags',                      frontImage: '1746602492_vacuum-sealed-mylar-packaging-bags.webp',          backImage: '1746602492_custom-1-oz-mylar-bag.webp' },
  { id: 91,  catId: '6', title: 'Personalized Tea Bags',              slug: 'personalized-tea-bags',                  frontImage: '1746607199_custom-printed-tea-bags.webp',                     backImage: '1746607199_custom-tea-bag.webp' },
  { id: 92,  catId: '7', title: 'Clothing Packaging',                 slug: 'clothing-packaging',                     frontImage: '1746603673_clothing-packaging-box.webp',                      backImage: '1746603673_clothing-packaging-boxes.webp' },
  { id: 93,  catId: '6', title: 'Hot Dog Packaging',                  slug: 'hot-dog-packaging',                      frontImage: '1746604021_printed-hot-dog-packaging.webp',                   backImage: '1746604021_custom-hot-dog-box.webp' },
  { id: 94,  catId: '7', title: 'Cardboard Ammo Boxes',               slug: 'cardboard-ammo-boxes',                   frontImage: '1746607499_cardboard-ammo-boxes.webp',                        backImage: '1746607499_custom-printed-cardboard-ammo-boxes.webp' },
  { id: 95,  catId: '6', title: 'Seed Boxes',                         slug: 'seed-boxes',                             frontImage: '1746604942_custom-printed-seed-boxes.webp',                   backImage: '1746604942_custom-seed-boxes.webp' },
  { id: 96,  catId: '7', title: 'Reverse Tuck Boxes',                 slug: 'reverse-tuck-boxes',                     frontImage: '1746692582_custom-reverse-tuck-box.webp',                     backImage: '1746692582_custom-printed-reverse-tuck-boxes.webp' },
  { id: 97,  catId: '7', title: 'Auto Lock Boxes',                    slug: 'auto-lock-boxes',                        frontImage: '1746693156_printed-auto-lock-boxes.webp',                     backImage: '1746693156_custom-printed-auto-lock-boxes.webp' },
  { id: 98,  catId: '7', title: 'Bottom Boxes',                       slug: 'bottom-boxes',                           frontImage: '1746693907_bottom-box.webp',                                  backImage: '1746693907_bottom-boxes.webp' },
  { id: 99,  catId: '7', title: 'Straight Tuck End Boxes',            slug: 'straight-tuck-end-boxes',                frontImage: '1746694261_custom-straight-tuck-end-box.webp',                backImage: '1746694261_straight-tuck-end-box.webp' },
  { id: 100, catId: '7', title: 'Tuck Top Auto Bottom Boxes',         slug: 'tuck-top-auto-bottom-boxes',             frontImage: '1746694695_tuck-top-auto-bottom-boxes.webp',                  backImage: '1746694695_custom-tuck-top-auto-bottom-boxes.webp' },
  { id: 101, catId: '7', title: 'Snap Lock Boxes',                    slug: 'snap-lock-boxes',                        frontImage: '1746699202_snap-lock-bottom-boxes.webp',                      backImage: '1746699202_custom-snap-lock-bottom-boxes.webp' },
  { id: 102, catId: '7', title: 'Roll End Tuck Boxes',                slug: 'roll-end-tuck-boxes',                    frontImage: '1746700769_custom-roll-end-tuck-boxes.webp',                  backImage: '1746700769_roll-end-tuck-boxes.webp' },
  { id: 103, catId: '7', title: 'Kraft Tuck Top Boxes',               slug: 'kraft-tuck-top-boxes',                   frontImage: '1746701181_custom-kraft-tuck-top-boxes.webp',                 backImage: '1746701181_custom-printing-kraft-tuck-top-boxes.webp' },
  { id: 104, catId: '7', title: 'Tuck Top Mailer Boxes',              slug: 'tuck-top-mailer-boxes',                  frontImage: '1746701523_custom-tuck-top-mailer-boxes.webp',                backImage: '1746701523_tuck-top-mailer-box.webp' },
  { id: 105, catId: '7', title: 'Tuck Boxes',                         slug: 'tuck-boxes',                             frontImage: '1746701778_custom-roll-end-tuck-boxes.webp',                  backImage: '1746701778_snap-lock-bottom-box.webp' },
  { id: 106, catId: '5', title: 'Pre Roll Packaging',                 slug: 'pre-roll-packaging',                     frontImage: '1746702307_luxury-pre-roll-packaging.webp',                   backImage: '1746702307_pre-rolled-joint-printed-boxes.webp' },
  { id: 107, catId: '7', title: 'Blister Card',                       slug: 'blister-card',                           frontImage: '1746702583_printed-blister-cards.webp',                       backImage: '1746702583_blister-cards-wholesale.webp' },
  { id: 108, catId: '4', title: 'Custom ZA Bags',                     slug: 'custom-za-bags',                         frontImage: '1746703005_custom-printed-za-bags.webp',                      backImage: '1746703005_za-bags-wholesale.webp' },
  { id: 109, catId: '7', title: 'Custom Anklet Boxes',                slug: 'custom-anklet-boxes',                    frontImage: '1746703360_anklet-boxes.webp',                                backImage: '1746703360_custom-anklet-box.webp' },
  { id: 110, catId: '4', title: 'Paper Mailing Bags',                 slug: 'paper-mailing-bags',                     frontImage: '1746704725_poly-mailers.webp',                                backImage: '1746704725_custom-printed-poly-mailers.webp' },
  { id: 111, catId: '7', title: 'Custom EVA Foam Inserts',            slug: 'custom-eva-foam-inserts',                frontImage: '1746705254_custom-foam-packaging-wholesale.webp',             backImage: '1746705254_custom-foam-packaging-box.webp' },
  { id: 112, catId: '7', title: '3D Card Boxes',                      slug: '3d-card-boxes',                          frontImage: '1746705610_3d-cardboxes.webp',                                backImage: '1746705610_3d-card-boxes.webp' },
  { id: 113, catId: '7', title: 'Custom Book Boxes',                  slug: 'custom-book-boxes',                      frontImage: '1746706480_custom-book-packaging-boxes.webp',                 backImage: '1746706480_custom-book-packaging-boxes.webp' },
  { id: 114, catId: '6', title: 'Custom Cake Boxes',                  slug: 'custom-cake-boxes',                      frontImage: '1747040314_cake-box.webp',                                    backImage: '1746707288_custom-printed-cake-boxes-wholesale.webp' },
  { id: 115, catId: '7', title: 'Custom Foam Packaging',              slug: 'custom-foam-packaging',                  frontImage: '1746707687_custom-foam-packaging.webp',                       backImage: '1746707687_printed-foam-packaging.webp' },
  { id: 116, catId: '7', title: 'Custom Toy Boxes',                   slug: 'custom-toy-boxes',                       frontImage: '1746708879_custom-printed-toy-boxes.webp',                    backImage: '1746708879_printed-toy-boxes-wholesale.webp' },
  { id: 117, catId: '4', title: 'Christmas Bags',                     slug: 'christmas-bags',                         frontImage: '1746709376_custom-printed-christmas-boxes-wholesale.webp',    backImage: '1746709376_christmas-boxes-wholesale.webp' },
  { id: 118, catId: '6', title: 'Bagel Boxes',                        slug: 'bagel-boxes',                            frontImage: '1746709721_bagel-boxes-wholesale.webp',                       backImage: '1746709721_printed-bagel-boxes.webp' },
  { id: 119, catId: '7', title: 'Heart Boxes',                        slug: 'heart-boxes',                            frontImage: '1746709988_custom-heart-shaped-packaging-boxes.webp',         backImage: '1746709988_custom-heart-shaped-packaging-boxes-wholesale.webp' },
  { id: 120, catId: '7', title: 'Belly Band Packaging',               slug: 'belly-band-packaging',                   frontImage: '1746710390_custom-printed-belly-band-packaging.webp',         backImage: '1746710390_belly-band-packaging-box.webp' },
  { id: 121, catId: '7', title: 'Mobile Battery Packaging',           slug: 'mobile-battery-packaging',               frontImage: '1746710683_custom-printed-mobile-battery-packaging.webp',     backImage: '1746710683_mobile-battery-boxes.webp' },
  { id: 122, catId: '7', title: 'Custom Dog Soap Boxes',              slug: 'custom-dog-soap-boxes',                  frontImage: '1746711032_dog-soap-box.webp',                                backImage: '1746711032_dog-soap-boxes-wholesale.webp' },
  { id: 123, catId: '4', title: 'Exotic Weed Bags',                   slug: 'exotic-weed-bags',                       frontImage: '1747651642_custom-exotic-weed-bag.webp',                      backImage: '1747651642_custom-exotic-weed-bags.webp' },
  { id: 124, catId: '6', title: 'Dessert Boxes',                      slug: 'dessert-boxes',                          frontImage: '1746711749_custom-dessert-boxes.webp',                        backImage: '1746711749_custom-dessert-boxes-wholesale.webp' },
  { id: 125, catId: '8', title: 'Display Box With Lock',              slug: 'display-box-with-lock',                  frontImage: '1746712063_display-boxes-with-lock-wholesale.webp',           backImage: '1746712063_display-box-with-lock-wholesale.webp' },
  { id: 126, catId: '7', title: 'Round Boxes',                        slug: 'round-boxes',                            frontImage: '1746712297_round-box.webp',                                   backImage: '1746712297_round-boxes.webp' },
  { id: 127, catId: '9', title: 'Custom Vape Boxes',                  slug: 'custom-vape-boxes',                      frontImage: '1748588548_custom-rechargeable-vape-boxes-wholesale.webp',    backImage: '1748588469_rechargeable-vape-boxes-wholesale.webp' },
  { id: 128, catId: '6', title: 'Pasta Boxes',                        slug: 'pasta-boxes',                            frontImage: '1746771533_custom-pasta-boxes.webp',                          backImage: '1746771533_custom-printed-pasta-boxes.webp' },
  { id: 129, catId: '7', title: 'PR Boxes',                           slug: 'pr-boxes',                               frontImage: '1746771894_custom-printed-pr-boxes.webp',                     backImage: '1746771894_custom-pr-boxes.webp' },
  { id: 130, catId: '6', title: 'Ice Cream Cone Holder',              slug: 'ice-cream-cone-holder',                  frontImage: '1746772167_custom-printed-ice-cream-cone-holder.webp',        backImage: '1746772167_ice-cream-cone-holder-boxes.webp' },
  { id: 131, catId: '7', title: 'Color Boxes',                        slug: 'color-boxes',                            frontImage: '1746772429_color-box.webp',                                   backImage: '1746772429_color-boxes.webp' },
  { id: 132, catId: '6', title: 'Catering Boxes',                     slug: 'catering-boxes',                         frontImage: '1746773358_catering-box.webp',                                backImage: '1746773358_catering-boxes-wholesale.webp' },
  { id: 133, catId: '7', title: 'Custom Gable Boxes',                 slug: 'custom-gable-boxes',                     frontImage: '1746773621_printed-gable-boxes.webp',                         backImage: '1746773621_printed-gable-boxes-wholesale.webp' },
  { id: 134, catId: '7', title: 'Sports Packaging Boxes',             slug: 'sports-packaging-boxes',                 frontImage: '1746774189_custom-sports-packaging.webp',                     backImage: '1746774189_printed-sports-packaging.webp' },
  { id: 135, catId: '7', title: 'Mug Boxes',                          slug: 'mug-boxes',                              frontImage: '1746774456_custom-mug-packaging-box.webp',                    backImage: '1746774456_custom-mug-packaging-boxes.webp' },
  { id: 136, catId: '6', title: 'Fruit Corn Packaging Box',           slug: 'fruit-corn-packaging-box',               frontImage: '1746774761_fruit-corn-packaging-boxes.webp',                  backImage: '1746774761_fruit-corn-packaging-boxes-wholesale.webp' },
  { id: 137, catId: '7', title: 'Boxes For Chargers',                 slug: 'boxes-for-chargers',                     frontImage: '1746775264_boxes-for-charger.webp',                           backImage: '1746775264_boxes-for-chargers-wholesale.webp' },
  { id: 138, catId: '4', title: 'Custom Foil Breadstick Bags',        slug: 'custom-foil-breadstick-bags',            frontImage: '1746775480_custom-printed-foil-breadstick-bags.webp',         backImage: '1746775480_printed-foil-breadstick-bags.webp' },
  { id: 139, catId: '7', title: 'Ornament Packaging',                 slug: 'ornament-packaging',                     frontImage: '1746775777_custom-ornament-packaging-boxes.webp',             backImage: '1746775777_ornament-packaging-boxes-wholesale.webp' },
  { id: 140, catId: '4', title: 'Gusset Mylar Bags',                  slug: 'gusset-mylar-bags',                      frontImage: '1746776072_gusset-bags.webp',                                 backImage: '1746776072_custom-gusset-bag.webp' },
  { id: 141, catId: '7', title: 'Skin Care Packaging',                slug: 'skin-care-packaging',                    frontImage: '1746776314_skincare-packaging.webp',                          backImage: '1746776314_skin-care-packaging-box.webp' },
  { id: 142, catId: '7', title: 'Slip Boxes',                         slug: 'slip-boxes',                             frontImage: '1746776566_printed-slip-boxes.webp',                          backImage: '1746776566_custom-printed-slip-boxes.webp' },
  { id: 143, catId: '4', title: 'Mylar Stand Up Bags',                slug: 'mylar-stand-up-bags',                    frontImage: '1746776881_custom-mylar-stand-up-tray.webp',                  backImage: '1746776881_custom-printed-mylar-stand-up-tray.webp' },
  { id: 144, catId: '7', title: 'Belt Boxes',                         slug: 'belt-boxes',                             frontImage: '1746777244_printed-belt-boxes.webp',                          backImage: '1746777244_printed-belt-boxes-wholesale.webp' },
  { id: 145, catId: '6', title: 'French Fries Boxes',                 slug: 'french-fries-boxes',                     frontImage: '1746778295_custom-french-fries-sleeve-boxes-wholesale.webp',  backImage: '1746778295_french-fries-sleeve-boxes-wholesale.webp' },
  { id: 146, catId: '7', title: 'Supplement Packaging Boxes',         slug: 'supplement-packaging-boxes',             frontImage: '1746778651_custom-supplement-packaging-boxes.webp',           backImage: '1746778651_custom-supplement-packaging-boxes.webp' },
  { id: 147, catId: '6', title: 'Sweet Packaging Boxes',              slug: 'sweet-packaging-boxes',                  frontImage: '1746778942_custom-printed-sweet-boxes.webp',                  backImage: '1746778942_custom-sweet-boxes.webp' },
  { id: 148, catId: '4', title: 'Edible Packaging Bags',              slug: 'edible-packaging-bags',                  frontImage: '1746779309_mylar-bags-for-edible.webp',                       backImage: '1746779309_custom-edible-mylar-bags.webp' },
  { id: 149, catId: '7', title: 'Record Album Shipping Boxes',        slug: 'record-album-shipping-boxes',            frontImage: '1746779918_record-album-box.webp',                            backImage: '1746779918_record-album-boxes.webp' },
  { id: 150, catId: '7', title: 'Clear Lid Packaging',                slug: 'clear-lid-packaging',                    frontImage: '1746797183_clear-lid-box-wholesale.webp',                     backImage: '1746797183_custom-printed-clear-lid-boxes.webp' },
  { id: 151, catId: '4', title: 'Heat Seal Packaging Bags',           slug: 'heat-seal-packaging-bags',               frontImage: '1746797543_printed-heat-seal-bags.webp',                      backImage: '1746797543_custom-printed-heat-seal-bags.webp' },
  { id: 152, catId: '7', title: 'Wine Packaging',                     slug: 'wine-packaging',                         frontImage: '1746798275_custom-wine-bottle.webp',                          backImage: '1746798275_wine-bottle.webp' },
  { id: 153, catId: '4', title: 'Paper Bread Bags',                   slug: 'paper-bread-bags',                       frontImage: '1746798761_paper-bread-bags.webp',                            backImage: '1746798761_custom-printed-paper-bread-bags.webp' },
  { id: 154, catId: '7', title: 'Vitamin Packaging Boxes',            slug: 'vitamin-packaging',                      frontImage: '1747142968_custom-vitamin-packaging.webp',                    backImage: '1747142968_printed-vitamin-packaging.webp' },
  { id: 155, catId: '7', title: 'Game Boxes',                         slug: 'game-boxes',                             frontImage: '1747143248_game-boxes.webp',                                  backImage: '1747143248_custom-game-boxes.webp' },
  { id: 156, catId: '6', title: 'Stevia Packaging Boxes',             slug: 'stevia-packaging',                       frontImage: '1747143761_custom-printed-stevia-packaging.webp',             backImage: '1747143761_stevia-box-packaging.webp' },
  { id: 157, catId: '6', title: 'Sandwich Boxes',                     slug: 'sandwich-boxes',                         frontImage: '1747143980_custom-printed-sandwich-boxes.webp',               backImage: '1747143980_sandwich-box-wholesale.webp' },
  { id: 158, catId: '6', title: 'Cupcake Boxes',                      slug: 'cupcake-boxes',                          frontImage: '1747144235_boxes-for-single-cupcake.webp',                    backImage: '1747144235_custom-printed-boxes-for-single-cupcakes.webp' },
  { id: 159, catId: '6', title: 'Cookies Boxes',                      slug: 'cookies-boxes',                          frontImage: '1747144496_cookie-packaging-boxes.webp',                      backImage: '1747144496_custom-cookie-packaging-boxes-wholesale.webp' },
  { id: 160, catId: '7', title: 'Massager Packaging Boxes',           slug: 'massager-packaging',                     frontImage: '1747144765_massager-packaging.webp',                          backImage: '1747144765_massager-packaging-boxes.webp' },
  { id: 161, catId: '4', title: 'Poly Mailer Bags',                   slug: 'poly-mailer-bags',                       frontImage: '1747145142_custom-poly-mailers.webp',                         backImage: '1747145142_custom-printed-poly-mailers.webp' },
  { id: 162, catId: '6', title: 'Sushi Boxes',                        slug: 'sushi-boxes',                            frontImage: '1747145438_custom-printed-sushi-boxes.webp',                  backImage: '1747145438_custom-sushi-boxes.webp' },
  { id: 163, catId: '4', title: 'Blister Bags',                       slug: 'blister-bags',                           frontImage: '1747218595_blister-bag-wholesale.webp',                       backImage: '1747218595_custom-printed-blister-bag.webp' },
  { id: 164, catId: '8', title: 'PDQ Display Boxes',                  slug: 'pdq-display-boxes',                      frontImage: '1747225679_pdq-display-box.webp',                             backImage: '1747225679_printed-pdq-display-boxes.webp' },
  { id: 165, catId: '7', title: 'Custom Sleeves Boxes',               slug: 'custom-sleeves-boxes',                   frontImage: '1747230899_custom-printed-sleeve-boxes.webp',                 backImage: '1747230899_sleeve-boxes.webp' },
]

async function seed() {
  const payload = await getPayload({ config: configPromise })
  console.log('\n🚀 Starting OPS seed...\n')

  // ── Step 1: Create Categories ──────────────────────────────────────────────
  const categoryMap: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      categoryMap[cat.oldId] = existing.docs[0].id as number
      console.log(`  ⏭  Category exists: ${cat.title}`)
      continue
    }

    const created = await payload.create({
      collection: 'categories',
      data: { title: cat.title, slug: cat.slug },
    })
    categoryMap[cat.oldId] = created.id as number
    console.log(`  ✅ Created category: ${cat.title}`)
  }

  // ── Step 2: Create Products ────────────────────────────────────────────────
  console.log(`\n📦 Seeding ${PRODUCTS.length} products...\n`)
  let created = 0, skipped = 0

  for (const p of PRODUCTS) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) { skipped++; continue }

    const catId = categoryMap[p.catId]

    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        slug: p.slug,
        _status: 'published',
        meta: { title: p.title },
        ...(catId ? { categories: [catId] } : {}),
        specifications: [
          { label: 'Dimension',   value: 'All Custom Sizes & Shapes' },
          { label: 'Quantity',    value: '100 - 500,000' },
          { label: 'Paper Stock', value: '10pt to 28pt Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock' },
          { label: 'Printing',   value: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors' },
          { label: 'Finishing',  value: 'Gloss Lamination, Matte Lamination, Spot UV, Embossing, Foiling' },
          { label: 'Turnaround', value: '4 - 8 Business Days, RUSH' },
        ],
      } as any,
    })

    created++
    if (created % 20 === 0) console.log(`  📦 ${created}/${PRODUCTS.length} done...`)
  }

  console.log(`
════════════════════════════════════
✅ SEED COMPLETE
   Categories : ${CATEGORIES.length}
   Products   : ${created} created, ${skipped} skipped
════════════════════════════════════
  `)
  process.exit(0)
}

seed().catch(err => { console.error('❌ Failed:', err); process.exit(1) })