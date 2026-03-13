import { getLegalPageMetadata } from '@/content/legal'
import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { getLegalPageContent } from '@/services/server/legalContentService'

export async function generateMetadata() {
  return getLegalPageMetadata(await getLegalPageContent('cookiePolicy'))
}

export default async function Page() {
  const page = await getLegalPageContent('cookiePolicy')
  return <LegalPageLayout page={page} />
}
