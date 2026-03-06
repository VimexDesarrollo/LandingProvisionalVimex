import { describe, it, expect } from 'vitest'
import { adaptHomeContent } from '@/services/adapters/homeContent.adapter'
import { homeMock } from '@/services/mocks/home.mock'

describe('adaptHomeContent', () => {
  it('maps snake_case API fields to camelCase domain fields', () => {
    const result = adaptHomeContent(homeMock)

    expect(result.header.menuItems).toEqual(homeMock.header.menu_items)
    expect(result.footer.backgroundImage).toBe(homeMock.footer.background_image)
    expect(result.footer.logoBadgeBackground).toBe(homeMock.footer.logo_badge_background)
    expect(result.footer.contact.addressLines).toEqual(homeMock.footer.contact.address_lines)
    expect(result.footer.extraLinks.links).toEqual(homeMock.footer.extra_links.links)
    expect(result.footer.rentalJump.placeholder).toBe(homeMock.footer.rental_jump.placeholder)
    expect(result.footer.legalText).toBe(homeMock.footer.legal_text)
    expect(result.footer.copyright).toBe(homeMock.footer.copyright)
    expect(result.searchWidget.dateRangeField.startFieldName).toBe(
      homeMock.search_widget.date_range_field.start_field_name,
    )
    expect(result.searchWidget.dateRangeField.endFieldName).toBe(
      homeMock.search_widget.date_range_field.end_field_name,
    )
    expect(result.searchWidget.searchButtonLabel).toBe(homeMock.search_widget.search_button_label)
    expect(result.hero.backgroundImage).toBe(homeMock.hero.background_image)
    expect(result.hero.primaryCta).toEqual(homeMock.hero.primary_cta)
    expect(result.hero.secondaryCta).toEqual(homeMock.hero.secondary_cta)
    expect(result.whyVimexTitle).toBe(homeMock.why_vimex.title)
    expect(result.whyVimexSubtitle).toBe(homeMock.why_vimex.subtitle)
    expect(result.whyFeatures).toEqual(homeMock.why_vimex.features)
    expect(result.featuredResidencesTitle).toBe(homeMock.featured_residences.title)
    expect(result.featuredResidencesCta).toEqual(homeMock.featured_residences.cta)
  })

  it('maps featured residence items to camelCase', () => {
    const result = adaptHomeContent(homeMock)
    const source = homeMock.featured_residences.items[0]
    const mapped = result.featuredResidences[0]

    expect(mapped.id).toBe(source.id)
    expect(mapped.name).toBe(source.name)
    expect(mapped.nightlyRateUsd).toBe(source.nightly_rate_usd)
    expect(mapped.imageUrl).toBe(source.image_url)
  })

  it('throws when required fields are missing', () => {
    const invalid = { ...homeMock, hero: undefined }
    expect(() => adaptHomeContent(invalid as never)).toThrow()
  })

  it('throws when a URL field is not a valid URL', () => {
    const invalid = {
      ...homeMock,
      footer: { ...homeMock.footer, background_image: 'not-a-url' },
    }
    expect(() => adaptHomeContent(invalid)).toThrow()
  })
})
