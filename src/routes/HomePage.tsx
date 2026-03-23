'use client'

import { CommunitiesSection } from '@/components/home/CommunitiesSection'
import { ContactSection } from '@/components/home/ContactSection'
import { FeelAtHomeSection } from '@/components/home/FeelAtHomeSection'
import { HeroSection } from '@/components/home/HeroSection'
import { RivieraMayaSection } from '@/components/home/RivieraMayaSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection'
import type { HomePageContent } from '@/types/content'

interface HomePageProps {
  content: HomePageContent
}

export function HomePage({ content }: HomePageProps) {
  return (
    <main>
      <HeroSection content={content.hero} />
      <FeelAtHomeSection />
      <ServicesSection />
      <RivieraMayaSection />
      <CommunitiesSection />
      <WhyChooseUsSection />
      <ContactSection content={content.footer.contact} />
    </main>
  )
}
