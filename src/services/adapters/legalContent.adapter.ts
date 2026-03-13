import { z } from 'zod'
import type { LegalPageContent } from '@/content/legal'
import type { ApiLegalPageResponse } from '@/types/legal'

const legalSectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)).optional(),
})

const legalPageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  updated_at: z.string().min(1),
  intro: z.array(z.string().min(1)).min(1),
  sections: z.array(legalSectionSchema).min(1),
})

export function adaptLegalPageContent(input: ApiLegalPageResponse, href: string, relatedLinks: LegalPageContent['relatedLinks']): LegalPageContent {
  const parsed = legalPageSchema.parse(input)

  return {
    href,
    title: parsed.title,
    description: parsed.description,
    updatedAt: new Date(`${parsed.updated_at}T00:00:00Z`).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }),
    intro: parsed.intro,
    sections: parsed.sections,
    relatedLinks,
  }
}
