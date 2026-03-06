import { HomePage } from '@/routes/HomePage'
import { getFeaturedResidences, getHomeContent } from '@/services/server/contentService'

export default async function Page() {
  const [homeContent, featuredResidences] = await Promise.all([
    getHomeContent(),
    getFeaturedResidences(3),
  ])

  const content = featuredResidences.length > 0
    ? { ...homeContent, featuredResidences }
    : homeContent

  return <HomePage content={content} />
}
