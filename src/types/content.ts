export interface Cta {
  label: string
  href: string
}

export interface HeaderMenuItem {
  id: string
  label: string
  href: string
}

export interface HeaderContent {
  menuItems: HeaderMenuItem[]
}

export interface FooterLink {
  id: string
  label: string
  href: string
}

export interface FooterSocialLink extends FooterLink {
  icon: 'facebook' | 'instagram' | 'pinterest'
}

export interface FooterContactContent {
  title: string
  addressLines: string[]
  phones: string[]
  email: string
}

export interface FooterListContent {
  title: string
  links: FooterLink[]
}

export interface FooterRentalJumpContent {
  title: string
  placeholder: string
  options: string[]
}

export interface FooterContent {
  backgroundImage: string
  logoBadgeBackground: string
  contact: FooterContactContent
  socialize: {
    title: string
    links: FooterSocialLink[]
  }
  extraLinks: FooterListContent
  rentalJump: FooterRentalJumpContent
  legalText: string
  copyright: string
}

export interface SearchSelectField {
  id: string
  placeholder: string
  options: string[]
}

export interface SearchDateRangeField {
  id: string
  placeholder: string
  startFieldName: string
  endFieldName: string
}

export interface SearchWidgetContent {
  selectFields: SearchSelectField[]
  dateRangeField: SearchDateRangeField
  searchButtonLabel: string
  helperText: string
  helperHref: string
}

export interface HeroContent {
  eyebrow: string
  title: string
  subtitle: string
  backgroundImage: string
  primaryCta: Cta
  secondaryCta: Cta
}

export interface WhyFeature {
  id: string
  title: string
  description: string
  icon: 'experience' | 'support' | 'verified'
}

export interface Residence {
  id: string
  name: string
  location: string
  nightlyRateUsd: number
  promotionalNightlyRateUsd?: number
  minNights?: number
  rating: number
  imageUrl: string
  imageGallery?: string[]
  slug: string
}

export interface ResidenceListing extends Residence {
  destination: string
  category: string
  beds: number
  guests: number
  amenities: string[]
  latitude: number
  longitude: number
  mapLocationUrl: string
}

export interface ResidenceReview {
  id: string
  guestName: string
  guestLocation: string
  rating: number
  comment: string
  stayDateLabel: string
}

export interface ResidenceRoomDetail {
  id: string
  label: string
  value: string
}

export interface ResidenceDetail extends ResidenceListing {
  descriptionTitle: string
  shortDescription: string
  amenitiesTitle: string
  fullAmenities: string[]
  locationSection: {
    title: string
    description: string
  }
  reviewsSection: {
    title: string
    cta: Cta
    items: ResidenceReview[]
  }
  roomDetailsSection: {
    title: string
    items: ResidenceRoomDetail[]
  }
  mapSection: {
    title: string
    badgeLabel: string
    cta: Cta
  }
}

export interface NightRate {
  date: string  // "2025-12-20"
  rate: number  // USD
}

export interface ResidencePricing {
  nights: NightRate[]
  nightsCount: number
  subtotal: number
}

export interface HomePageContent {
  header: HeaderContent
  footer: FooterContent
  searchWidget: SearchWidgetContent
  hero: HeroContent
  whyVimexTitle: string
  whyVimexSubtitle: string
  whyFeatures: WhyFeature[]
  featuredResidencesTitle: string
  featuredResidencesCta: Cta
  featuredResidences: Residence[]
}

export interface ApiHomeResponse {
  header: {
    menu_items: HeaderMenuItem[]
  }
  footer: {
    background_image: string
    logo_badge_background: string
    contact: {
      title: string
      address_lines: string[]
      phones: string[]
      email: string
    }
    socialize: {
      title: string
      links: Array<{
        id: string
        label: string
        href: string
        icon: FooterSocialLink['icon']
      }>
    }
    extra_links: {
      title: string
      links: FooterLink[]
    }
    rental_jump: {
      title: string
      placeholder: string
      options: string[]
    }
    legal_text: string
    copyright: string
  }
  search_widget: {
    select_fields: Array<{
      id: string
      placeholder: string
      options: string[]
    }>
    date_range_field: {
      id: string
      placeholder: string
      start_field_name: string
      end_field_name: string
    }
    search_button_label: string
    helper_text: string
    helper_href: string
  }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    background_image: string
    primary_cta: Cta
    secondary_cta: Cta
  }
  why_vimex: {
    title: string
    subtitle: string
    features: Array<{
      id: string
      title: string
      description: string
      icon: WhyFeature['icon']
    }>
  }
  featured_residences: {
    title: string
    cta: Cta
    items: Array<{
      id: string
      name: string
      location: string
      nightly_rate_usd: number
      rating: number
      image_url: string
      slug: string
    }>
  }
}

export interface ApiResidenceDetailResponse {
  id: string
  name: string
  location: string
  destination: string
  category: string
  beds: number
  guests: number
  amenities: string[]
  nightly_rate_usd: number
  promotional_nightly_rate_usd?: number
  min_nights?: number
  rating: number
  image_url: string
  image_gallery?: string[]
  slug: string
  latitude: number
  longitude: number
  map_location_url?: string
  description_title: string
  short_description: string
  amenities_title: string
  full_amenities: string[]
  location_section: {
    title: string
    description: string
  }
  reviews_section: {
    title: string
    cta: Cta
    items: Array<{
      id: string
      guest_name: string
      guest_location: string
      rating: number
      comment: string
      stay_date_label: string
    }>
  }
  room_details_section: {
    title: string
    items: Array<{
      id: string
      label: string
      value: string
    }>
  }
  map_section: {
    title: string
    badge_label: string
    cta: Cta
  }
}
