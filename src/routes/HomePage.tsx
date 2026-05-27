'use client'

import { CommunitiesSection } from '@/components/home/CommunitiesSection'
import { ContactSection } from '@/components/home/ContactSection'
import { FaqSection } from '@/components/home/FaqSection'
import { FeelAtHomeSection } from '@/components/home/FeelAtHomeSection'
import { GuestySearchWidget } from '@/components/home/GuestySearchWidget'
import { HeroSection } from '@/components/home/HeroSection'
import { RivieraMayaSection } from '@/components/home/RivieraMayaSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { StackedOverlay } from '@/components/home/StackedOverlay'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection'
import type { HomePageContent } from '@/types/content'

interface HomePageProps {
  content: HomePageContent
}

export function HomePage({ content }: HomePageProps) {
  return (
    <main>
      <HeroSection content={content.hero} />
      <GuestySearchWidget />
      <FeelAtHomeSection />
      <ServicesSection />
      <StatsSection />
      <RivieraMayaSection />
      <StackedOverlay
        baseSection={<CommunitiesSection />}
        overlaySection={<WhyChooseUsSection />}
      />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection content={content.footer.contact} />
    </main>
  )
}
