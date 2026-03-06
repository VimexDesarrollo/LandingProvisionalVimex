'use client'

import { FeaturedResidencesSection } from '@/components/home/FeaturedResidencesSection'
import { HeroSection } from '@/components/home/HeroSection'
import { SearchWidget } from '@/components/home/SearchWidget'
import { WhySection } from '@/components/home/WhySection'
import type { HomePageContent } from '@/types/content'

interface HomePageProps {
  content: HomePageContent
}

export function HomePage({ content }: HomePageProps) {
  return (
    <main>
      <HeroSection content={content.hero} />
      <SearchWidget content={content.searchWidget} />
      <WhySection
        title={content.whyVimexTitle}
        subtitle={content.whyVimexSubtitle}
        features={content.whyFeatures}
        className="pt-[calc(var(--space-section)+5rem)]"
      />
      <FeaturedResidencesSection
        title={content.featuredResidencesTitle}
        cta={content.featuredResidencesCta}
        residences={content.featuredResidences}
      />
    </main>
  )
}
