/**
 * fix-product-descriptions.ts
 *
 * Repairs products whose `description` field contains a raw string (or
 * double-stringified JSON) instead of a proper Lexical editor object.
 *
 * Run with:
 *   npx tsx fix-product-descriptions.ts
 *
 * The script is idempotent – products that already have a valid Lexical
 * object are left untouched.
 */

import { getPayload } from 'payload'
import configPromise from './src/payload.config'

/** Minimal valid Lexical root object the editor can accept. */
function wrapInLexical(text: string) {
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
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children: [
            {
              type: 'text',
              format: 0,
              mode: 'normal',
              style: '',
              detail: 0,
              version: 1,
              text,
            },
          ],
        },
      ],
    },
  }
}

/**
 * Returns true when `value` is already a valid Lexical root object
 * (i.e. has { root: { children: [] } } structure).
 */
function isValidLexical(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (!v.root || typeof v.root !== 'object') return false
  const root = v.root as Record<string, unknown>
  return Array.isArray(root.children)
}

async function fixProductDescriptions() {
  const payload = await getPayload({ config: configPromise })

  // Fetch every product (draft + published) with depth 0 to keep it fast.
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
    pagination: false,
  })

  console.log(`\nChecking ${products.length} product(s)…\n`)

  let fixed = 0
  let skipped = 0

  for (const product of products) {
    const raw = (product as any).description

    // Already a valid Lexical object → nothing to do.
    if (isValidLexical(raw)) {
      console.log(`  ✅  "${product.title}" — description OK`)
      skipped++
      continue
    }

    // Figure out what we have and build the replacement.
    let fixedDescription: object

    if (typeof raw === 'string') {
      // Could be JSON.stringify(lexicalObject) or plain text.
      try {
        const parsed = JSON.parse(raw)
        if (isValidLexical(parsed)) {
          // It was double-stringified — just use the parsed object.
          fixedDescription = parsed
        } else {
          // Parsed to something else (e.g. a plain string scalar).
          const inner = typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
          fixedDescription = wrapInLexical(inner)
        }
      } catch {
        // Not JSON at all — treat as plain text.
        fixedDescription = wrapInLexical(raw)
      }
    } else if (raw === null || raw === undefined) {
      // No description set — leave it empty but valid.
      fixedDescription = wrapInLexical('')
    } else {
      // Unexpected type — convert to string and wrap.
      fixedDescription = wrapInLexical(String(raw))
    }

    // Update via Payload local API so all hooks/validation run properly.
    await payload.update({
      collection: 'products',
      id: product.id,
      data: { description: fixedDescription } as any,
      overrideAccess: true,
    })

    console.log(`  🔧  "${product.title}" — description repaired`)
    fixed++
  }

  console.log(`\nDone. Fixed: ${fixed}  |  Already OK: ${skipped}\n`)
  process.exit(0)
}

fixProductDescriptions().catch((err) => {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
})
