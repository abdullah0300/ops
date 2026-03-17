import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateHomePage: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home page`)
    revalidatePath('/')
  }
  return doc
}

export const revalidateHeader: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating everything for Header update`)
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateFooter: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating everything for Footer update`)
    revalidatePath('/', 'layout')
  }
  return doc
}
