'use client'

import type { Media as MediaType, Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { GridTileImage } from '@/components/Grid/tile'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  gallery: NonNullable<Product['gallery']>
}

// Isolated component so useSearchParams doesn't suspend the whole Gallery
function GallerySync({
  gallery,
  api,
  setCurrent,
}: {
  gallery: Props['gallery']
  api: CarouselApi | undefined
  setCurrent: (i: number) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values && api) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      if (index !== -1) {
        setCurrent(index)
        api.scrollTo(index, true)
      }
    }
  }, [searchParams, api, gallery, setCurrent])

  return null
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  return (
    <div>
      {/* useSearchParams isolated in Suspense so it never blocks the image */}
      <Suspense fallback={null}>
        <GallerySync gallery={gallery} api={api} setCurrent={setCurrent} />
      </Suspense>

      <div className="relative w-full overflow-hidden mb-8" style={{ aspectRatio: '1 / 1' }}>
        {typeof gallery[current].image === 'object' && gallery[current].image ? (
          <Media
            fill
            resource={gallery[current].image}
            imgClassName="w-full rounded-lg object-contain"
            priority
          />
        ) : null}
      </div>

      <Carousel setApi={setApi} className="w-full" opts={{ align: 'start', loop: false }}>
        <CarouselContent>
          {gallery.map((item, i) => {
            if (typeof item.image !== 'object') return null

            return (
              <CarouselItem
                className="basis-1/5"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
              >
                <GridTileImage active={i === current} media={item.image} />
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
