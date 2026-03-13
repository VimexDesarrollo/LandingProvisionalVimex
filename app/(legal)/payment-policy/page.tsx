import { getLegalPageMetadata } from '@/content/legal'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { getLegalPageContent } from '@/services/server/legalContentService'

export async function generateMetadata() {
  return getLegalPageMetadata(await getLegalPageContent('paymentPolicy'))
}

export default async function Page() {
  const page = await getLegalPageContent('paymentPolicy')
  return <LegalPageLayout page={page} />
}
