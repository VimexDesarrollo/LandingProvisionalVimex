import type { ApiHomeResponse } from '@/types/content'

export const homeMock: ApiHomeResponse = {
  header: {
    menu_items: [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'residences', label: 'Residences', href: '/residences' },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        href: 'https://wa.me/529848032231?text=Hello%20Vimex%2C%20I%20want%20help%20with%20a%20reservation',
      },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
  },
  footer: {
    background_image:
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2400&q=80',
    logo_badge_background: '#44B8CE',
    contact: {
      title: 'Contact Us',
      address_lines: ['12th Street between 15 & 20 Avenue', 'Playa del Carmen, Quintana Roo, Mexico 77710'],
      phones: ['Toll Free: US & Canada +1 510 990 3091', 'Local: Mexico +52 984 803 2231'],
      email: 'info@vimexvacationrentals.com',
    },
    socialize: {
      title: 'Socialize',
      links: [
        { id: 'social-facebook', label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
        { id: 'social-instagram', label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
        { id: 'social-pinterest', label: 'Pinterest', href: 'https://pinterest.com', icon: 'pinterest' },
      ],
    },
    extra_links: {
      title: 'Extra Links',
      links: [
        { id: 'extra-reviews', label: 'Guest Reviews', href: '/residences' },
        { id: 'extra-contact', label: 'Contact Us', href: '/#site-footer' },
        { id: 'extra-management', label: 'Property Management', href: '/' },
        { id: 'extra-owner', label: 'Owner Login', href: '/property-owners' },
      ],
    },
    rental_jump: {
      title: 'Jump to a Rental',
      placeholder: 'Select Rental',
      options: ['Casa del Mar', 'Villa Tranquila', 'Oceanview Penthouse'],
    },
    legal_text: 'Powered by Vimex Vacation Rentals Platform | Terms of Use | Privacy Policy | Sitemap',
    copyright: '© 2026 Vimex Vacation Rentals & Property Management. All rights reserved.',
  },
  search_widget: {
    select_fields: [
      {
        id: 'destination',
        placeholder: 'All Destination',
        options: ['Playa del Carmen', 'Tulum', 'Akumal'],
      },
      {
        id: 'category',
        placeholder: 'All Category',
        options: ['Oceanfront Villa', 'Penthouse', 'Family Home'],
      },
      {
        id: 'beds',
        placeholder: 'Beds',
        options: ['1+', '2+', '3+', '4+'],
      },
      {
        id: 'guests',
        placeholder: 'Guests',
        options: ['2+', '4+', '6+', '8+'],
      },
    ],
    date_range_field: {
      id: 'stayDates',
      placeholder: 'Select stay dates',
      start_field_name: 'checkin',
      end_field_name: 'checkout',
    },
    search_button_label: 'Search',
    helper_text: 'Looking for a specific home?',
    helper_href: '/residences',
  },
  hero: {
    eyebrow: 'Curated Coastal Living',
    title: 'Premium vacation rentals in Playa del Carmen',
    subtitle: 'Handpicked residences, private concierge, and local expertise available 24/7.',
    background_image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=2400&q=80',
    primary_cta: {
      label: 'Explore Residences',
      href: '/residences',
    },
    secondary_cta: {
      label: 'Property Owners',
      href: '/property-owners',
    },
  },
  why_vimex: {
    title: 'Why Vimex?',
    subtitle: 'Experience elevated coastal living with a trusted luxury property team.',
    features: [
      {
        id: 'experience',
        title: '15+ Years Managing Luxury Homes',
        description: 'Operational excellence and guest care with measurable consistency.',
        icon: 'experience',
      },
      {
        id: 'support',
        title: 'Local Team On-Site 24/7',
        description: 'Bilingual concierge support across your entire reservation lifecycle.',
        icon: 'support',
      },
      {
        id: 'verified',
        title: 'Curated Verified Properties',
        description: 'Each home is reviewed against quality, comfort, and service standards.',
        icon: 'verified',
      },
    ],
  },
  featured_residences: {
    title: 'Featured Residences in Playa del Carmen',
    cta: {
      label: 'View All Residences',
      href: '/residences',
    },
    items: [
      {
        id: 'casa-del-mar',
        name: 'Casa del Mar',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 450,
        rating: 4.9,
        image_url:
          'https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&fit=crop&w=1600&q=80',
        slug: 'casa-del-mar',
      },
      {
        id: 'villa-tranquila',
        name: 'Villa Tranquila',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 360,
        rating: 4.8,
        image_url:
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        slug: 'villa-tranquila',
      },
      {
        id: 'oceanview-penthouse',
        name: 'Oceanview Penthouse',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 520,
        rating: 5,
        image_url:
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
        slug: 'oceanview-penthouse',
      },
    ],
  },
}
