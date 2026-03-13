export interface ApiLegalSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface ApiLegalPageResponse {
  slug: string
  title: string
  description: string
  updated_at: string
  intro: string[]
  sections: ApiLegalSection[]
}
