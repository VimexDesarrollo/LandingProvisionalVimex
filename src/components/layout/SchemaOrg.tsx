export function SchemaOrg() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LodgingBusiness',
        '@id': 'https://vimexmx.com/#business',
        name: 'Vimex Vacation Rentals & Property Management',
        description:
          'Luxury vacation rentals and property management services in Playa del Carmen, Riviera Maya, Mexico. 20 years of experience connecting guests with private vacation homes.',
        url: 'https://vimexmx.com',
        telephone: ['+5219841311019', '+5219841857696', '+15109903091'],
        email: 'info@vimexmx.com',
        foundingDate: '2004',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '80 Av. Norte entre Calle 30 Norte y 30 Bis Norte MZ 11',
          addressLocality: 'Playa del Carmen',
          addressRegion: 'Quintana Roo',
          postalCode: '77712',
          addressCountry: 'MX',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 20.6296,
          longitude: -87.0739,
        },
        areaServed: [
          { '@type': 'City', name: 'Playa del Carmen' },
          { '@type': 'City', name: 'Tulum' },
          { '@type': 'City', name: 'Akumal' },
          { '@type': 'State', name: 'Riviera Maya' },
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+5219841311019',
            contactType: 'customer service',
            areaServed: 'MX',
            availableLanguage: ['Spanish', 'English'],
          },
          {
            '@type': 'ContactPoint',
            telephone: '+15109903091',
            contactType: 'customer service',
            areaServed: 'US',
            availableLanguage: 'English',
          },
        ],
        sameAs: [
          'https://facebook.com',
          'https://instagram.com',
          'https://pinterest.com',
        ],
        priceRange: '$$–$$$',
        currenciesAccepted: 'USD, MXN',
        paymentAccepted: 'Credit Card, Cash, Bank Transfer',
        hasMap: 'https://maps.google.com/?q=Playa+del+Carmen+Quintana+Roo+Mexico',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://vimexmx.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I book a vacation rental with Vimex?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Contact us directly via WhatsApp, phone, or the form on our website. Our bilingual team will confirm availability, walk you through the property details, and coordinate everything from booking confirmation to a seamless arrival.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is included in a Vimex vacation rental?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All properties come fully furnished with kitchen essentials, linens, and towels. Many feature private pools, air conditioning, and high-speed Wi-Fi. Each listing clearly states what is provided.',
            },
          },
          {
            '@type': 'Question',
            name: 'What areas of the Riviera Maya do you cover?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We specialize in Playa del Carmen and its premier communities — Playacar Fase 1 & 2, Coco Bay, Mamitas Beach, and the Little Italy district. We also have properties in Tulum and Akumal.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer property management services?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. We offer full-service property management including guest communications, maintenance coordination, marketing, dynamic pricing, and financial reporting — all designed to maximize your rental income.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is 24/7 support available during my stay?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our bilingual team is available around the clock to assist with any questions, emergencies, or special requests — from restaurant recommendations to urgent maintenance issues.',
            },
          },
          {
            '@type': 'Question',
            name: 'How far is Playa del Carmen from Cancún airport?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Playa del Carmen is approximately 60 km south of Cancún International Airport — about a 45-minute drive via the federal highway.',
            },
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://vimexmx.com/#website',
        url: 'https://vimexmx.com',
        name: 'Vimex Vacation Rentals',
        description: 'Luxury vacation rentals in Playa del Carmen, Riviera Maya, Mexico.',
        publisher: { '@id': 'https://vimexmx.com/#business' },
        inLanguage: 'en',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
