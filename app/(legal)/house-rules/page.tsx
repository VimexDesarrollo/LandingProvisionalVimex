import { getLegalPageMetadata } from '@/content/legal'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { getLegalPageContent } from '@/services/server/legalContentService'

export async function generateMetadata() {
  return getLegalPageMetadata(await getLegalPageContent('houseRules'))
}

export default async function Page() {
  const page = await getLegalPageContent('houseRules')
  return <LegalPageLayout page={page} />
}
