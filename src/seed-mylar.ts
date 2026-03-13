/**
 * MYLAR BAGS COMPLETE SEED SCRIPT
 * Seeds all 34 Mylar Bag products with:
 *   - Full descriptions (converted to Lexical format)
 *   - Product specs (dimension, quantity, paper stock, printing, finishing, turnaround)
 *   - Size-based quantity pricing (mapped to tiers)
 *   - Global Add-ons (Child Resistance, Metallic Printing, etc.)
 *   - Gallery images (downloaded and uploaded to Payload)
 * 
 * Run:  npx tsx --env-file=.env src/seed-mylar.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import sharp from 'sharp'

const IMAGE_BASE = 'https://onlinepackagingstore.com/assets/images/products/'
const TMP_DIR = path.resolve(process.cwd(), '.mylar-tmp')

const GLOBAL_ADDONS = [
  {
    label: 'Child Resistance',
    tieredPricing: [
      { quantity: 250, price: 12 },
      { quantity: 500, price: 12 },
      { quantity: 1000, price: 14 },
      { quantity: 2500, price: 19 },
      { quantity: 5000, price: 23 },
      { quantity: 10000, price: 35 },
      { quantity: 25000, price: 80 },
    ],
  },
  {
    label: 'Spot Gloss / UV',
    tieredPricing: [
      { quantity: 250, price: 36 },
      { quantity: 500, price: 36 },
      { quantity: 1000, price: 44 },
      { quantity: 2500, price: 75 },
      { quantity: 5000, price: 91 },
      { quantity: 10000, price: 155 },
      { quantity: 25000, price: 375 },
    ],
  },
  {
    label: 'Silver Metallic Printing',
    price: 0,
  },
  {
    label: 'Gold Metallic Printing',
    tieredPricing: [
      { quantity: 250, price: 40 },
      { quantity: 500, price: 40 },
      { quantity: 1000, price: 53 },
      { quantity: 2500, price: 85 },
      { quantity: 5000, price: 125 },
      { quantity: 10000, price: 240 },
      { quantity: 25000, price: 490 },
    ],
  },
  {
    label: 'Inside / Interior Bag Printing',
    tieredPricing: [
      { quantity: 250, price: 32 },
      { quantity: 500, price: 32 },
      { quantity: 1000, price: 42 },
      { quantity: 2500, price: 82 },
      { quantity: 5000, price: 124 },
      { quantity: 10000, price: 310 },
      { quantity: 25000, price: 532 },
    ],
  },
]

const TIERED_SIZES = [
  {
    label: '3.5 x 5',
    quantityPricing: [
      { quantity: 250, price: 400 },
      { quantity: 500, price: 520 },
      { quantity: 1000, price: 600 },
      { quantity: 2500, price: 1190 },
      { quantity: 5000, price: 1855 },
      { quantity: 10000, price: 1990 },
      { quantity: 25000, price: 3370 },
    ],
  },
  {
    label: '3.5 x 5 x 2',
    quantityPricing: [
      { quantity: 250, price: 420 },
      { quantity: 500, price: 548 },
      { quantity: 1000, price: 635 },
      { quantity: 2500, price: 1270 },
      { quantity: 5000, price: 1925 },
      { quantity: 10000, price: 2049 },
      { quantity: 25000, price: 3429 },
    ],
  },
  {
    label: '6 x 4 x 2',
    quantityPricing: [
      { quantity: 250, price: 470 },
      { quantity: 500, price: 660 },
      { quantity: 1000, price: 790 },
      { quantity: 2500, price: 1380 },
      { quantity: 5000, price: 2040 },
      { quantity: 10000, price: 2595 },
      { quantity: 25000, price: 3745 },
    ],
  },
  {
    label: '8 x 5 x 2',
    quantityPricing: [
      { quantity: 250, price: 680 },
      { quantity: 500, price: 830 },
      { quantity: 1000, price: 955 },
      { quantity: 2500, price: 1720 },
      { quantity: 5000, price: 2430 },
      { quantity: 10000, price: 3599 },
      { quantity: 25000, price: 5480 },
    ],
  },
  {
    label: '9 x 6 x 3',
    quantityPricing: [
      { quantity: 250, price: 530 },
      { quantity: 500, price: 740 },
      { quantity: 1000, price: 880 },
      { quantity: 2500, price: 1770 },
      { quantity: 5000, price: 2430 },
      { quantity: 10000, price: 3945 },
      { quantity: 25000, price: 6220 },
    ],
  },
  {
    label: '13 x 9 x 6',
    quantityPricing: [
      { quantity: 250, price: 725 },
      { quantity: 500, price: 880 },
      { quantity: 1000, price: 1170 },
      { quantity: 2500, price: 2390 },
      { quantity: 5000, price: 3590 },
      { quantity: 10000, price: 5985 },
      { quantity: 25000, price: 10450 },
    ],
  },
]

// ─── All 34 Mylar Bag products from SQL dump ────────────────────────────────
const MYLAR_PRODUCTS = [
  {
    id: 4,
    title: 'Ziplock Mylar Bags',
    slug: 'ziplock-mylar-bags',
    shortDescription: 'Premium smell-proof ziplock bags designed for maximum freshness and durability. Perfect for retail and long-term storage.',
    cat_id: 2,
    image: '1747639337_zip-lock-thc-bags.webp',
    gallery: ['1745416802_custom-zip-lock-thc-mylar-bags.webp', '1745416802_custom-zip-lock-thc-mylar-bag.webp'],
    description: 'Get your hands on our zip-lock mylar bags today at OPS! These high-quality bags are perfect for storing and preserving a wide range of products. Made from premium materials, our ziplock mylar bags offer exceptional durability and protection against moisture, light, and oxygen. Whether you need them for food storage, cannabis packaging, or other applications, our zip-lock bags provide a reliable seal to keep contents fresh and secure.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [
      { size: '2.2x4.5', prices: { '100': 492, '200': 544, '300': 687, '500': 734, '1000': 1321, '2000': 1699, '3000': 2362, '5000': 2404 } },
    ],
  },
  {
    id: 5,
    title: 'Weed Mylar Bags',
    slug: 'weed-mylar-bags',
    image: '1747651746_custom-weed-mylar-bags-wholesale.webp',
    gallery: ['1747651746_weed-mylar-bags.webp', '1747651746_custom-weed-mylar-bags.webp'],
    description: 'Looking for high-quality weed mylar bags? OPS has you covered with premium custom cannabis packaging that keeps your product fresh, potent, and protected. Our weed mylar bags are crafted from top-grade materials that provide an oxygen and moisture barrier, preserving the quality and aroma of your cannabis. Available in a range of sizes and fully customizable with your branding.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 6,
    title: 'Smell Proof Bags',
    slug: 'smell-proof-bags',
    image: '1747651145_printed-smell-proof-mylar-bags.webp',
    gallery: ['1747651145_custom-printed-smell-proof-mylar-bags.webp', '1747651145_custom-smell-proof-mylar-bags.webp'],
    description: 'Get your hands on our premium smell proof bags at OPS. Engineered with advanced odor-blocking technology, these bags keep aromas completely contained while providing excellent product protection. Perfect for cannabis, herbs, and any product requiring discreet, odor-free storage. Our smell proof mylar bags combine functionality with professional custom printing options.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 7,
    title: 'Food Storage Bags',
    slug: 'food-storage-bags',
    image: '1747651280_custom-food-storage-mylar-bags.webp',
    gallery: ['1747651280_food-storage-mylar-bags.webp', '1747651280_food-storage-mylar-bags-wholesale.webp', '1747651280_food-storage-mylar-packaging-bags.webp', '1747651280_food-storage-printed-mylar-bags.webp'],
    description: 'Our custom food storage mylar bags are the ideal solution for preserving the freshness and quality of your food products. Made from food-grade materials, these bags feature excellent barrier properties against moisture, oxygen, and light - the three main factors that cause food degradation. From dry goods to freeze-dried meals, our food storage bags keep your products safe and fresh for extended periods.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 8,
    title: 'Die Cut Mylar Bags',
    slug: 'die-cut-mylar-bags',
    image: '1747651437_custom-shaped-die-cut-mylar-bags.webp',
    gallery: ['1747651437_die-cut-mylar-bags-wholesale.webp', '1747651437_die-cut-mylar-bags-packaging.webp'],
    description: 'Our die-cut mylar bags offer a versatile and convenient packaging solution for a wide range of products. Cut into custom shapes that perfectly match your brand identity, these bags stand out on any shelf. The precision die-cutting process ensures consistent quality and a professional finish. Whether you need character shapes, logo-shaped bags, or unique custom forms, our die-cut mylar bags deliver exceptional visual impact.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 9,
    title: 'Mylar Envelopes',
    slug: 'mylar-envelopes',
    image: '1747727724_custom-mylar-envelope-bags.webp',
    gallery: ['1745413306_mylar-envelope-wholesale.webp', '1745413306_custom-mylar-envelope.webp'],
    description: 'Our custom mylar envelopes provide superior protection for documents, photos, seeds, and sensitive items. The reflective mylar material shields contents from light, moisture, and static, making them ideal for archival storage and shipping. Available in a range of standard and custom sizes with full-color printing options to represent your brand professionally.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 10,
    title: 'Pet Food Bags',
    slug: 'pet-food-mylar-bags',
    image: '1747727832_pet-food-bags.webp',
    gallery: ['1747727832_pet-food-bag.webp', '1747727832_pet-food-bags-wholesale.webp'],
    description: 'Our custom pet food bags are designed to keep pet food fresh, tasty, and nutritious for longer. Made from food-safe mylar materials with superior barrier properties, these bags effectively block moisture, air, and light that can degrade pet food quality. Available in various sizes for treats, kibble, wet food, and supplements, with vibrant custom printing to showcase your brand.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 11,
    title: 'Direct Print Bags',
    slug: 'direct-print-bags',
    image: '1749707160_direct-print-mylar-bags.webp',
    gallery: ['1747651946_custom-direct-print-mylar-bags-wholesale.webp', '1747651946_direct-printed-mylar-bags.webp'],
    description: 'Place your order for our premium direct print mylar bags at OPS. Using state-of-the-art digital printing technology, we print your designs directly onto the bag surface for sharp, vibrant, photo-quality results. No laminated labels needed - the print is part of the bag itself, offering exceptional durability and a premium feel that customers notice.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 12,
    title: 'Candy Mylar Bags',
    slug: 'candy-mylar-bags',
    image: '1747726341_candy-mylar-bags.webp',
    gallery: ['1747726341_custom-candy-mylar-bag.webp', '1747726341_candy-mylar-bag.webp'],
    description: 'Don\'t miss out on our eye-catching candy mylar bags at OPS. Designed specifically for confectionery products, these bags keep candy fresh while delivering maximum shelf appeal. The high-barrier mylar material maintains flavor and texture, while the printable surface lets you create packaging as fun and vibrant as the candy inside. Perfect for gummies, chocolates, hard candy, and specialty confections.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 13,
    title: 'Kraft Mylar Bags',
    slug: 'kraft-mylar-bags',
    image: '1747652420_kraft-mylar-bags.webp',
    gallery: ['1747652420_custom-kraft-mylar-bag.webp', '1747652420_kraft-mylar-bag-wholesale.webp'],
    description: 'If you are in search of kraft mylar bags, look no further than OPS. Our kraft mylar bags combine the natural, eco-friendly aesthetic of kraft paper with the superior barrier properties of mylar. This hybrid construction gives you packaging that looks organic and sustainable while still protecting contents from moisture, oxygen, and light. Ideal for coffee, tea, snacks, and health food brands.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 14,
    title: 'Edible Gummy Bags',
    slug: 'edible-gummy-bags',
    image: '1747727268_edibles-gummy-mylar-bags.webp',
    gallery: ['1747727268_custom-edibles-gummy-mylar-bag.webp', '1747727268_printed-edible-gummy-mylar-bag.webp'],
    description: 'Discover our premium edible gummy bags that will keep your gummy products fresh and irresistible. Designed specifically for the edibles market, these bags provide child-resistant options while maintaining compliance requirements. The high-barrier mylar construction locks in freshness and prevents moisture degradation of your gummy candies, edibles, and confections.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 15,
    title: 'Lollipop Mylar Bags',
    slug: 'lollipop-mylar-bag',
    image: '1747727581_custom-lollipop-mylar-bag-wholesale.webp',
    gallery: ['1747727581_printed-lollipop-mylar-bag.webp', '1747727581_custom-lollipop-mylar-bags.webp'],
    description: 'Get our unique lollipop bags at wholesale prices from OPS. Our lollipop mylar bags are specifically sized and designed to perfectly accommodate single or multi-pack lollipops and similar stick confections. With a clear window option to showcase your product and full-color printing capabilities, these bags make your lollipops look irresistible while keeping them fresh.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 16,
    title: 'Coffee Mylar Bags',
    slug: 'coffee-mylar-bag',
    image: '1747726815_coffee-mylar-bags.webp',
    gallery: ['1747726815_coffee-mylar-bag.webp', '1742195763_coffee-mylar-bag-wholesale.webp'],
    description: 'Looking to stock up on high-quality coffee & tea mylar bags? OPS offers premium coffee packaging bags that preserve aroma, flavor, and freshness. Our coffee mylar bags feature degassing valves and superior oxygen barrier properties to keep roasted coffee at peak quality. Available with stand-up pouches, ziplock closures, and full custom printing to make your coffee brand shine.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 17,
    title: '8 Oz Mylar Bags',
    slug: '8-oz-mylar-bags',
    image: '1747637586_8-oz-mylar-bags.webp',
    gallery: ['1742196104_8-oz-mylar-bag.webp', '1742196104_8-oz-mylar-bags-wholesale.webp'],
    description: 'Our 8 oz mylar bags offer superior quality and durability for ideal product protection. This popular size is perfect for packaging a half pound of cannabis, coffee, protein powder, dried herbs, and many other products. The 8 oz capacity makes these bags ideal for retail-sized portions. Fully customizable with your branding and available with resealable zipper closures.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 18,
    title: 'Powder Mylar Bags',
    slug: 'powder-mylar-bags',
    image: '1747728027_powder-mylar-bags.webp',
    gallery: ['1747728027_custom-powder-mylar-bag.webp', '1747728027_powder-mylar-bag.webp'],
    description: 'Introducing our Powder Mylar Bags - the ultimate solution for packaging protein powders, supplements, spices, and other powdered products. Our powder mylar bags feature reinforced seals that prevent leakage and cross-contamination. The superior barrier properties keep moisture out and preserve powder consistency and efficacy. Available with wide-mouth openings for easy filling and dispensing.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 19,
    title: 'Vacuum Sealed Mylar Bags',
    slug: 'vacuum-sealed-mylar-bags',
    image: '1747728062_sealed-mylar-bag.webp',
    gallery: ['1742199245_sealed-mylar-bag.webp', '1742199245_custom-sealed-mylar-bags.webp'],
    description: 'Our vacuum sealed mylar bags provide the ultimate in long-term food storage and product preservation. By removing all air from the package, vacuum sealing extends shelf life dramatically - up to 5x longer than conventional storage. The heavy-duty mylar material withstands the vacuum sealing process without cracking or compromising the barrier. Ideal for emergency food storage, meal prep, and premium product packaging.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 20,
    title: 'Capsule Mylar Bags',
    slug: 'capsule-mylar-bags',
    image: '1747637856_capsule-mylar-bag.webp',
    gallery: ['1747726592_capsule-mylar-bags.webp', '1747726592_custom-capsule-mylar-bag.webp'],
    description: 'Take advantage of our bulk rate offer and purchase our high-quality capsule bags at OPS. Designed specifically for dietary supplements, vitamins, and pharmaceutical capsules, our capsule mylar bags protect contents from moisture, light, and oxidation that can degrade potency. Available with child-resistant closures and tamper-evident seals for compliance with supplement industry standards.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 21,
    title: 'Vape Mylar Bags',
    slug: 'vape-mylar-bags',
    image: '1747728139_custom-vape-mylar-bags.webp',
    gallery: ['1747728139_vape-mylar-bag.webp', '1742201526_custom-vape-mylar-bags.webp'],
    description: 'You can rely on us to provide vape mylar bags with premium quality and professional printing. Our vape mylar bags are specifically designed for the vaping industry, accommodating cartridges, disposables, pods, and accessories. The anti-static mylar material protects sensitive electronic components while the customizable exterior displays your brand prominently on the shelf.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 22,
    title: 'Pill Pouch Bags',
    slug: 'pill-pouch-bags',
    image: '1747727951_custom-pill-pouch-bag.webp',
    gallery: ['1742201806_pill-pouch-bags-wholesale.webp', '1742201806_custom-pill-pouch-bags.webp'],
    description: 'We not only provide high-quality pill pouch bags, but we also offer them at competitive wholesale prices. Our pill pouch bags are designed for pharmaceutical, supplement, and nutraceutical products. Features include moisture-resistant mylar construction, easy-open tear notches, and resealable zip closures for patient convenience. Child-resistant options available for compliance with packaging regulations.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 23,
    title: 'Display Boxes For Mylar Bags',
    slug: 'display-boxes-for-mylar-bags',
    image: '1747728254_display-box-for-mylar-bag.webp',
    gallery: ['1742202074_display-boxes-for-mylar-bags-wholesale.webp', '1742202074_custom-display-boxes-for-mylar-bags.webp'],
    description: 'Maximize the retail impact of your mylar bag products with our custom display boxes. These counter display boxes are specifically designed to hold and showcase mylar bags in retail environments, gas stations, dispensaries, and convenience stores. Create a branded display that attracts customer attention and makes your products impossible to ignore on the shelf.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 86,
    title: 'Child Resistant Mylar Bags',
    slug: 'child-resistant-mylar-bags',
    image: '1746435363_custom-child-resistant-mylar-bag.webp',
    gallery: ['1746435363_printed-child-resistant-mylar-bag.webp', '1746435363_printed-child-resistant-mylar-bags.webp', '1746435363_child-resistant-mylar-bags-wholesale.webp', '1746435363_custom-child-resistant-mylar-bags.webp'],
    description: 'Our child resistant mylar bags provide the safety compliance you need without compromising on packaging quality. Certified child-resistant closures meet CPSC and regulatory requirements for cannabis, pharmaceutical, and other regulated products. The mylar construction still provides full barrier protection while the CR mechanism gives parents peace of mind and helps brands maintain compliance.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 90,
    title: 'Custom Mylar Bags',
    slug: 'custom-mylar-bags',
    image: '1746602492_vacuum-sealed-mylar-packaging-bags.webp',
    gallery: ['1746602492_custom-lemon-cherry-gelato-bags.webp', '1746602492_hemp-seed-mylar-bags.webp', '1746602492_custom-resealable-mylar-bags.webp', '1746602492_coffee-mylar-bags.webp'],
    description: 'Our custom mylar bags are completely tailored to your brand specifications. From size and shape to printing and finishing, every aspect is customizable. OPS works with you from concept to completion to create mylar bags that perfectly represent your brand and product. Whether you need a small batch for a startup or large-scale production, we deliver consistent quality at competitive prices.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 108,
    title: 'Custom ZA Bags',
    slug: 'custom-za-bags',
    image: '1746703005_custom-printed-za-bags.webp',
    gallery: ['1746703005_za-bags.webp', '1746703005_za-bag.webp', '1746703005_custom-za-bags.webp', '1746703005_printed-za-bags.webp'],
    description: 'Our custom ZA bags are premium mylar packaging bags popular in the cannabis and exotic market. These bags feature the iconic ZA-style design with vibrant printing options to make your product stand out. Available in multiple sizes to accommodate different quantities, with child-resistant zipper options for compliance. Perfect for exotic strain packaging and premium cannabis branding.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 110,
    title: 'Paper Mailing Bags',
    slug: 'paper-mailing-bags',
    image: '1746704725_poly-mailers.webp',
    gallery: ['1746704725_poly-mailers-packaging.webp', '1746704725_custom-poly-mailers.webp', '1746704725_custom-printed-poly-mailers.webp', '1746704725_printed-poly-mailers-packaging.webp'],
    description: 'Our paper mailing bags combine the eco-friendly appeal of paper with durability needed for shipping. These bags are tear-resistant, water-resistant, and feature a strong self-adhesive seal to keep contents secure during transit. Fully customizable with your branding, our paper mailing bags make every shipment a brand touchpoint and are a sustainable alternative to plastic poly mailers.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 117,
    title: 'Christmas Bags',
    slug: 'christmas-bags',
    image: '1746709376_custom-printed-christmas-boxes-wholesale.webp',
    gallery: ['1746709376_christmas-packaging-boxes.webp', '1746709376_custom-christmas-boxes.webp', '1746709376_custom-christmas-boxes-wholesale.webp', '1746709376_custom-christmas-packaging-boxes.webp'],
    description: 'Celebrate the holiday season with our custom Christmas bags. Available in festive designs or fully customizable with your own artwork, our Christmas mylar bags add a premium touch to gift-giving. Whether for retail, corporate gifting, or seasonal product packaging, these bags make a memorable impression. Order early to ensure delivery in time for the holiday rush.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 123,
    title: 'Exotic Weed Bags',
    slug: 'exotic-weed-bags',
    image: '1747651642_custom-exotic-weed-bag.webp',
    gallery: [],
    description: 'Our exotic weed bags are designed for premium cannabis brands looking to make a statement. These high-end mylar bags feature exotic design capabilities including specialty finishes, holographic effects, and premium printing that commands attention on any shelf. Perfect for exotic strain drops, limited editions, and luxury cannabis products that deserve exceptional packaging.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 138,
    title: 'Custom Foil Breadstick Bags',
    slug: 'custom-foil-breadstick-bags',
    image: '1746775480_custom-printed-foil-breadstick-bags.webp',
    gallery: [],
    description: 'Our custom foil breadstick bags are the perfect solution for bakeries and food producers packaging long, slender baked goods. The foil construction keeps breadsticks fresh and crispy by blocking moisture and air. Custom printing lets you brand each bag with your bakery logo and product information, creating a professional retail-ready package for artisan bread products.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 140,
    title: 'Gusset Mylar Bags',
    slug: 'gusset-mylar-bags',
    image: '1746776072_gusset-bags.webp',
    gallery: [],
    description: 'Our gusset mylar bags feature expandable side or bottom gussets that allow the bag to hold more volume while maintaining pacity.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 143,
    title: 'Mylar Stand Up Bags',
    slug: 'mylar-stand-up-bags',
    image: '1746776881_custom-mylar-stand-up-tray.webp',
    gallery: [],
    description: 'Our mylar stand up bags are the retail-ready packaging solution that maximizes shelf presence. The reinforced bottom gusset allows these bags to stand upright independently, creating a commanding display in any retail environment. Available with resealable zippers, tear notches, and window panels, these stand-up pouches are perfect for snacks, coffee, tea, supplements, and cannabis products.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 148,
    title: 'Edible Packaging Bags',
    slug: 'edible-packaging-bags',
    image: '1746779309_mylar-bags-for-edible.webp',
    gallery: [],
    description: 'Our edible packaging bags are specially designed for the rapidly growing edibles market. Compliant with cannabis packaging regulations and food safety standards, these bags protect edible products from contamination and degradation. Available with child-resistant closures, opaque designs to prevent light exposure, and child-appealing design restrictions to meet regulatory requirements in various markets.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 151,
    title: 'Heat Seal Packaging Bags',
    slug: 'heat-seal-packaging-bags',
    image: '1746797543_printed-heat-seal-bags.webp',
    gallery: [],
    description: 'Our heat seal packaging bags provide a tamper-evident, airtight seal for maximum product protection. Using industrial heat sealing equipment, these bags create a permanent bond that preserves freshness and indicates to consumers that the product has not been opened. Ideal for food products, medical devices, supplements, and any product requiring sterile or tamper-evident packaging.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 153,
    title: 'Paper Bread Bags',
    slug: 'paper-bread-bags',
    image: '1746798761_paper-bread-bags.webp',
    gallery: [],
    description: 'Our paper bread bags are the traditional yet effective solution for artisan bakeries and commercial bread producers. Made from food-safe paper with optional wax or poly liner coatings, these bags breathe just enough to keep crusty breads crispy while preventing excessive moisture loss. Custom printing options allow you to showcase your bakery brand on every loaf.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 161,
    title: 'Poly Mailer Bags',
    slug: 'poly-mailer-bags',
    image: '1747145142_custom-poly-mailers.webp',
    gallery: [],
    description: 'Our custom poly mailer bags are the lightweight, durable shipping solution for e-commerce businesses. Made from co-extruded polyethylene, these mailers are waterproof, tear-resistant, and feature a strong tamper-evident adhesive seal. Custom printing turns every delivery into a branded experience. Available in standard sizes and custom dimensions with standard or bubble-lined options.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
  {
    id: 163,
    title: 'Blister Bags',
    slug: 'blister-bags',
    image: '1747218595_blister-bag-wholesale.webp',
    gallery: [],
    description: 'Our blister bags combine the product-visibility of blister packaging with the flexibility of a bag format. The rigid thermoformed front panel provides a clear product window while the backing bag offers additional storage space. Ideal for hardware, electronics accessories, small toys, and retail products that benefit from visible product display while maintaining packaging structure.',
    dimension: 'All Custom Sizes & Shapes',
    quantity: '100 - 500,000',
    paper_stock: '10pt to 28pt (60lb to 400lb) Eco-Friendly Kraft, E-flute Corrugated, Bux Board, Cardstock',
    printing: 'No Printing, CMYK, CMYK + 1 PMS color, CMYK + 2 PMS colors',
    finishing: 'Gloss Lamination, Matte Lamination, Gloss AQ, Gloss UV, Matte UV, Spot UV, Embossing, Foiling',
    turnaround: '4 - 8 Business Days, RUSH',
    size_pricing: [],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    }).on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

async function downloadAndUploadImage(
  payload: any,
  filename: string,
  label: string
): Promise<string | null> {
  // Check if already uploaded
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename.replace('.webp', '.jpg') } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    console.log(`  ✓ Already uploaded: ${filename}`)
    return existing.docs[0].id
  }

  const webpPath = path.join(TMP_DIR, filename)
  const jpgFilename = filename.replace('.webp', '.jpg')
  const jpgPath = path.join(TMP_DIR, jpgFilename)
  const url = IMAGE_BASE + filename.replace(/ /g, '%20')

  try {
    console.log(`  ↓ Downloading: ${filename}`)
    await downloadFile(url, webpPath)

    // Convert webp -> jpg
    await sharp(webpPath).jpeg({ quality: 90 }).toFile(jpgPath)

    console.log(`  ↑ Uploading: ${jpgFilename}`)
    const fileBuffer = fs.readFileSync(jpgPath)
    const result = await payload.create({
      collection: 'media',
      data: { alt: label },
      file: {
        data: fileBuffer,
        mimetype: 'image/jpeg',
        name: jpgFilename,
        size: fileBuffer.length,
      },
    })

    fs.unlinkSync(webpPath)
    if (fs.existsSync(jpgPath)) fs.unlinkSync(jpgPath)

    return result.id
  } catch (err: any) {
    console.log(`  ✗ Failed ${filename}: ${err.message}`)
    return null
  }
}

function convertToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text,
              type: 'text',
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Mylar Bags seed...\n')

  if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true })

  const payload = await getPayload({ config: configPromise })

  // 1. Find or create Mylar Bags category
  console.log('📁 Setting up category...')
  let categoryId: string | null = null
  const existingCat = await payload.find({
    collection: 'categories',
    where: { slug: { equals: 'mylar-bags' } },
    limit: 1,
  })
  if (existingCat.docs.length > 0) {
    categoryId = (existingCat.docs[0] as any).id
    console.log(`  ✓ Found existing category: ${categoryId}`)
  } else {
    const cat = await payload.create({
      collection: 'categories',
      data: { title: 'Mylar Bags', slug: 'mylar-bags' },
    })
    categoryId = String(cat.id)
    console.log(`  ✓ Created category: ${categoryId}`)
  }

  // 2. Seed each product
  let created = 0
  let skipped = 0
  let failed = 0

  for (const p of MYLAR_PRODUCTS) {
    console.log(`\n[${MYLAR_PRODUCTS.indexOf(p) + 1}/${MYLAR_PRODUCTS.length}] ${p.title}`)

    // Check if exists
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: p.slug } },
      limit: 1,
    })

    // Download + upload main image
    let metaImageId: string | null = null
    if (p.image) {
      metaImageId = await downloadAndUploadImage(payload, p.image, p.title)
    }

    // Download + upload gallery images
    const galleryIds = []
    if (p.gallery && p.gallery.length > 0) {
      for (const galImg of p.gallery) {
        const id = await downloadAndUploadImage(payload, galImg, `${p.title} Gallery`)
        if (id) galleryIds.push({ image: id })
      }
    }

    // Build specifications array
    const specifications = [
      { label: 'Dimension', value: p.dimension || 'All Custom Sizes & Shapes' },
      { label: 'Quantity', value: p.quantity || '100 - 500,000' },
      { label: 'Paper Stock', value: p.paper_stock || '10pt to 28pt Cardstock' },
      { label: 'Printing', value: p.printing || 'CMYK' },
      { label: 'Finishing', value: p.finishing || 'Gloss Lamination, Matte Lamination' },
      { label: 'Turnaround', value: p.turnaround || '4 - 8 Business Days' },
    ]

    const productData = {
      title: p.title,
      slug: p.slug,
      _status: 'published',
      shortDescription: (p as any).shortDescription || '',
      categories: [categoryId],
      description: convertToLexical(p.description),
      gallery: galleryIds,
      specifications,
      sizes: TIERED_SIZES,
      addons: GLOBAL_ADDONS,
      meta: {
        title: p.title,
        description: p.description?.substring(0, 200) || '',
        ...(metaImageId ? { image: metaImageId } : {}),
      },
    } as any

    try {
      if (existing.docs.length > 0) {
        const id = existing.docs[0].id
        await payload.update({
          collection: 'products',
          id,
          data: productData,
        })
        console.log(`  ✅ Updated`)
      } else {
        await payload.create({
          collection: 'products',
          data: productData,
        })
        console.log(`  ✅ Created`)
      }
      created++
    } catch (err: any) {
      console.log(`  ❌ Failed: ${err.message}`)
      failed++
    }
  }

  // Cleanup
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true })
  }

  console.log(`\n${'─'.repeat(50)}`)
  console.log(`✅ Created:  ${created}`)
  console.log(`⏭  Skipped:  ${skipped}`)
  console.log(`❌ Failed:   ${failed}`)
  console.log(`Total:      ${MYLAR_PRODUCTS.length}`)
  console.log(`${'─'.repeat(50)}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
