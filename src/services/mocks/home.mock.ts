import type { ApiHomeResponse } from '@/types/content'

export const homeMock: ApiHomeResponse = {
  header: {
    menu_items: [
      { id: 'about', label: 'About Us', href: '/#feel-at-home' },
      { id: 'property-management', label: 'Property Management', href: '/#why-vimex-heading' },
      { id: 'contact', label: 'Contact Us', href: '/#contact' },
    ],
  },
  footer: {
    background_image:
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2400&q=80',
    logo_badge_background: '#44B8CE',
    contact: {
      title: 'Contact Us',
      address_lines: ['80 Av. Norte entre Calle 30 Norte y 30 Bis Norte MZ 11', 'Ejidal 77712, Solidaridad, Playa del Carmen, Quintana Roo'],
      phones: ['+52 (984) 131 1019', '+52 (984) 185 7696', '+1 (510) 990 3091'],
      email: 'info@vimexmx.com',
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
        { id: 'extra-contact', label: 'Contact Us', href: '/#contact' },
        { id: 'extra-management', label: 'Property Management', href: '/#why-vimex-heading' },
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
    helper_href: '/#contact',
  },
  hero: {
    eyebrow: 'Vimex Vacation Rentals',
    title: 'Welcome Home to Playa del Carmen',
    subtitle: 'Let our family show your family the way home.',
    background_image:
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2400&q=80',
    primary_cta: {
      label: 'Contact Us',
      href: '/#contact',
    },
    secondary_cta: {
      label: 'Property Management',
      href: '/#why-vimex-heading',
    },
  },
  why_vimex: {
    title: 'What We Offer',
    subtitle: 'Vimex Vacation Rentals has been providing top vacation rental services in and around Playa Del Carmen passionately since 2006. With over fifty unique homes, villas, condos and apartments to choose from, we\'re confident we have an inclusive vacation rental that defines your taste and budget.',
    features: [
      {
        id: 'experience',
        title: '50+ Unique Homes',
        description: 'Villas, condos, apartments and houses for romantic getaways, family gatherings or a break from the everyday.',
        icon: 'experience',
      },
      {
        id: 'support',
        title: 'Bilingual Concierge',
        description: 'Personal attention by our dedicated bilingual staff who share their knowledge of the Riviera Maya from start to finish.',
        icon: 'support',
      },
      {
        id: 'verified',
        title: 'Since 2006',
        description: 'Over 20 years of professional, passionate vacation rental services with consistent top guest satisfaction.',
        icon: 'verified',
      },
    ],
  },
  featured_residences: {
    title: 'Featured Playa Del Carmen Rentals',
    cta: {
      label: 'View All Residences',
      href: '/#contact',
    },
    items: [
      {
        id: 'aldea-thai',
        name: 'Aldea Thai Beachfront Condo w/Private Pool',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 420,
        rating: 4.9,
        image_url:
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1600&q=80',
        slug: 'aldea-thai',
      },
      {
        id: 'lovely-studio-38th',
        name: 'Lovely Studio/Prime location on 38th St!',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 95,
        rating: 4.8,
        image_url:
          'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?auto=format&fit=crop&w=1600&q=80',
        slug: 'lovely-studio-38th',
      },
      {
        id: 'villa-brianna',
        name: 'Luxury Villa Brianna Beachfront/Private Pool',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 680,
        rating: 5,
        image_url:
          'https://images.unsplash.com/photo-1613553497126-a44624272024?auto=format&fit=crop&w=1600&q=80',
        slug: 'villa-brianna',
      },
      {
        id: 'tropical-1bd',
        name: 'Tropical 1BD Condo - Best Location in Playa!',
        location: 'Playa del Carmen, Mexico',
        nightly_rate_usd: 130,
        rating: 4.9,
        image_url:
          'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1600&q=80',
        slug: 'tropical-1bd',
      },
    ],
  },
}
