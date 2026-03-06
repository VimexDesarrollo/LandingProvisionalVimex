import { z } from 'zod'
import type { ApiHomeResponse, HomePageContent } from '@/types/content'

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

const homeResponseSchema = z.object({
  header: z.object({
    menu_items: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        href: z.string().min(1),
      }),
    ),
  }),
  footer: z.object({
    background_image: z.string().url(),
    logo_badge_background: z.string().min(1),
    contact: z.object({
      title: z.string().min(1),
      address_lines: z.array(z.string().min(1)).min(1),
      phones: z.array(z.string().min(1)).min(1),
      email: z.string().email(),
    }),
    socialize: z.object({
      title: z.string().min(1),
      links: z.array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          href: z.string().min(1),
          icon: z.enum(['facebook', 'instagram', 'pinterest']),
        }),
      ),
    }),
    extra_links: z.object({
      title: z.string().min(1),
      links: z.array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
          href: z.string().min(1),
        }),
      ),
    }),
    rental_jump: z.object({
      title: z.string().min(1),
      placeholder: z.string().min(1),
      options: z.array(z.string().min(1)).min(1),
    }),
    legal_text: z.string().min(1),
    copyright: z.string().min(1),
  }),
  search_widget: z.object({
    select_fields: z.array(
      z.object({
        id: z.string().min(1),
        placeholder: z.string().min(1),
        options: z.array(z.string().min(1)).min(1),
      }),
    ),
    date_range_field: z.object({
      id: z.string().min(1),
      placeholder: z.string().min(1),
      start_field_name: z.string().min(1),
      end_field_name: z.string().min(1),
    }),
    search_button_label: z.string().min(1),
    helper_text: z.string().min(1),
    helper_href: z.string().min(1),
  }),
  hero: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    subtitle: z.string().min(1),
    background_image: z.string().url(),
    primary_cta: ctaSchema,
    secondary_cta: ctaSchema,
  }),
  why_vimex: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    features: z.array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.enum(['experience', 'support', 'verified']),
      }),
    ),
  }),
  featured_residences: z.object({
    title: z.string().min(1),
    cta: ctaSchema,
    items: z.array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        location: z.string().min(1),
        nightly_rate_usd: z.number().positive(),
        rating: z.number().min(0).max(5),
        image_url: z.string().url(),
        slug: z.string().min(1),
      }),
    ),
  }),
})

export function adaptHomeContent(input: ApiHomeResponse): HomePageContent {
  const parsed = homeResponseSchema.parse(input)

  return {
    header: {
      menuItems: parsed.header.menu_items,
    },
    footer: {
      backgroundImage: parsed.footer.background_image,
      logoBadgeBackground: parsed.footer.logo_badge_background,
      contact: {
        title: parsed.footer.contact.title,
        addressLines: parsed.footer.contact.address_lines,
        phones: parsed.footer.contact.phones,
        email: parsed.footer.contact.email,
      },
      socialize: {
        title: parsed.footer.socialize.title,
        links: parsed.footer.socialize.links,
      },
      extraLinks: {
        title: parsed.footer.extra_links.title,
        links: parsed.footer.extra_links.links,
      },
      rentalJump: {
        title: parsed.footer.rental_jump.title,
        placeholder: parsed.footer.rental_jump.placeholder,
        options: parsed.footer.rental_jump.options,
      },
      legalText: parsed.footer.legal_text,
      copyright: parsed.footer.copyright,
    },
    searchWidget: {
      selectFields: parsed.search_widget.select_fields,
      dateRangeField: {
        id: parsed.search_widget.date_range_field.id,
        placeholder: parsed.search_widget.date_range_field.placeholder,
        startFieldName: parsed.search_widget.date_range_field.start_field_name,
        endFieldName: parsed.search_widget.date_range_field.end_field_name,
      },
      searchButtonLabel: parsed.search_widget.search_button_label,
      helperText: parsed.search_widget.helper_text,
      helperHref: parsed.search_widget.helper_href,
    },
    hero: {
      eyebrow: parsed.hero.eyebrow,
      title: parsed.hero.title,
      subtitle: parsed.hero.subtitle,
      backgroundImage: parsed.hero.background_image,
      primaryCta: parsed.hero.primary_cta,
      secondaryCta: parsed.hero.secondary_cta,
    },
    whyVimexTitle: parsed.why_vimex.title,
    whyVimexSubtitle: parsed.why_vimex.subtitle,
    whyFeatures: parsed.why_vimex.features,
    featuredResidencesTitle: parsed.featured_residences.title,
    featuredResidencesCta: parsed.featured_residences.cta,
    featuredResidences: parsed.featured_residences.items.map((item) => ({
      id: item.id,
      name: item.name,
      location: item.location,
      nightlyRateUsd: item.nightly_rate_usd,
      rating: item.rating,
      imageUrl: item.image_url,
      slug: item.slug,
    })),
  }
}
