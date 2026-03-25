import type { Metadata } from 'next'

export interface LegalLink {
  href: string
  label: string
}

export interface LegalSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface LegalPageContent {
  href: string
  title: string
  description: string
  updatedAt: string
  intro: string[]
  sections: LegalSection[]
  relatedLinks?: LegalLink[]
}

export const LEGAL_PAGE_LINKS: LegalLink[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cancellation-policy', label: 'Cancellation Policy' },
  { href: '/payment-policy', label: 'Payment & Refund Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/house-rules', label: 'House Rules' },
]

export const CHECKOUT_CONSENT_LINKS = {
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
} as const

const LAST_UPDATED = 'June 1, 2023'

function withRelatedLinks(currentHref: string): LegalLink[] {
  return LEGAL_PAGE_LINKS.filter((link) => link.href !== currentHref)
}

export const legalPages: Record<string, LegalPageContent> = {
  privacyPolicy: {
    href: '/privacy-policy',
    title: 'Privacy Policy — Aviso de Privacidad',
    description:
      'Oppim Group, S.A. de C.V. (Vimex Vacation Rentals) is responsible for the use and protection of your personal data under the Mexican Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP).',
    updatedAt: LAST_UPDATED,
    intro: [
      'Oppim Group, S.A. de C.V., operating as Vimex Vacation Rentals, is the entity responsible for the use and protection of your personal data. This Privacy Policy is issued in compliance with the Mexican Federal Law on Protection of Personal Data Held by Private Parties (Ley Federal de Protección de Datos Personales en Posesión de los Particulares — LFPDPPP).',
      'By contacting us, browsing this website, or requesting our services, you acknowledge that you have read and understood this notice.',
    ],
    sections: [
      {
        heading: 'Purposes for Which We Use Your Personal Data',
        paragraphs: [
          'The personal data we collect from you will be used for the following purposes:',
        ],
        bullets: [
          'To provide the services you have requested and inform you of any changes to them.',
          'To fulfill the obligations we have acquired with you or those established by applicable law.',
          'To create, update, and maintain a client file.',
          'To issue invoices and collect payments for services.',
          'To send you information about our offers and promotions.',
        ],
      },
      {
        heading: 'Personal Data We Collect',
        paragraphs: [
          'To carry out the purposes described in this notice, we may collect the following categories of personal data:',
        ],
        bullets: [
          'Identification data: full name, marital status, RFC, CURP, place and date of birth, nationality, age, and photograph.',
          'Contact data: home address, email address, landline, and mobile phone number.',
          'Employment data: position and work address.',
          'Financial or patrimonial data: location and characteristics of real and personal property, credit card number, and banking details.',
        ],
      },
      {
        heading: 'Sensitive Personal Data',
        paragraphs: [
          'We do not require sensitive personal data as defined under the LFPDPPP, including racial or ethnic origin, current or future health status, genetic information, religious, philosophical or moral beliefs, union membership, political opinions, or sexual preference.',
        ],
      },
      {
        heading: 'How We Obtain Your Personal Data',
        paragraphs: [
          'We may collect your personal data through the following means:',
        ],
        bullets: [
          'By telephone or email.',
          'When you provide the information to us directly.',
          'From publicly accessible sources permitted by law, such as telephone directories, professional directories, or websites.',
        ],
      },
      {
        heading: 'Data Sharing',
        paragraphs: [
          'Your personal data will not be disclosed, shared, or transferred to third parties under any circumstances, except where required by law or ordered by a competent authority.',
        ],
      },
      {
        heading: 'ARCO Rights — Access, Rectification, Cancellation & Opposition',
        paragraphs: [
          'You have the right to know what personal data we hold about you, how we use it, and the conditions of that use (Access). You also have the right to request correction of inaccurate or incomplete data (Rectification); to request deletion from our records when you believe the data is not being used in accordance with applicable law (Cancellation); and to object to the use of your data for specific purposes (Opposition). These are known as ARCO rights.',
          'To exercise any ARCO right, please send your request by email to gerenciavimex@gmail.com.',
        ],
      },
      {
        heading: 'Privacy Department Contact',
        paragraphs: [
          'Mexico: +52 (984) 803 2231 | US & Canada: +1 (510) 990 3091',
          'Address: Calle 12 entre 15 y 20 Avenida, Col. Centro, Playa del Carmen, Q. Roo, 77710, México',
          'Email: gerenciavimex@gmail.com',
        ],
      },
      {
        heading: 'Revoking Your Consent',
        paragraphs: [
          'You may revoke the consent you have granted for the processing of your personal data at any time. Please note that in some cases we may be legally required to continue processing your data, or that revocation may prevent us from continuing to provide the service you requested.',
          'To revoke consent, please send a request to gerenciavimex@gmail.com.',
        ],
      },
      {
        heading: 'Tracking Technologies',
        paragraphs: [
          'Our website (www.vimexmx.com) uses cookies, web beacons, and similar technologies that allow us to monitor your behavior as an Internet user, provide a better service and user experience, and offer new products and services based on your preferences.',
          'The personal data obtained through these tracking technologies includes: browsing schedule, time spent on our website, sections visited, and pages accessed before arriving at our site.',
        ],
      },
      {
        heading: 'Changes to This Privacy Policy',
        paragraphs: [
          'This Privacy Policy may be modified, changed, or updated due to new legal requirements, changes in our products or services, privacy practices, business model adjustments, or other causes. Any changes will be published on our website at www.vimexmx.com.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/privacy-policy'),
  },
  terms: {
    href: '/terms',
    title: 'Terms of Service',
    description: 'Review the rules, responsibilities, and limitations that apply when using the Vimex platform.',
    updatedAt: LAST_UPDATED,
    intro: [
      'These Terms of Service govern access to the Vimex platform, including browsing properties, submitting reservation requests, and communicating with our team.',
      'By using the platform, you agree to follow these terms together with any property-specific requirements shared during the reservation process.',
    ],
    sections: [
      {
        heading: 'Acceptance of Terms',
        paragraphs: [
          'By accessing or using the platform, you agree to be bound by these Terms of Service and any policies referenced within them.',
          'If you do not agree with these terms, you should not use the platform or submit a booking request.',
        ],
      },
      {
        heading: 'Use of the Platform',
        paragraphs: [
          'Users must provide accurate information, use the platform lawfully, and avoid any action that interferes with site operations, security, or other guests.',
          'We may suspend access or decline service when platform misuse, fraudulent activity, or policy violations are detected.',
        ],
      },
      {
        heading: 'Booking Process',
        paragraphs: [
          'Submitting a reservation request does not guarantee acceptance until availability, pricing, guest details, and payment requirements are confirmed.',
          'Additional property-specific agreements, house rules, identification checks, or security deposits may apply before a stay is finalized.',
        ],
      },
      {
        heading: 'Limitation of Liability',
        paragraphs: [
          'To the extent permitted by law, Vimex is not liable for indirect, incidental, special, consequential, or punitive damages arising from platform use or reservation activity.',
          'Our total liability for a claim related to the platform will generally be limited to the amounts directly paid to us for the booking at issue.',
        ],
      },
      {
        heading: 'Governing Law',
        paragraphs: [
          'These terms are governed by the laws applicable to the jurisdiction in which the relevant booking and service operations are managed, unless mandatory local law requires otherwise.',
          'Any dispute should first be raised directly with our team so both parties can attempt to resolve the matter in good faith.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/terms'),
  },
  cancellationPolicy: {
    href: '/cancellation-policy',
    title: 'Cancellation Policy',
    description: 'Understand how booking cancellations, modifications, and no-show situations are handled by Vimex.',
    updatedAt: LAST_UPDATED,
    intro: [
      'This Cancellation Policy describes the standard handling of booking cancellations, modifications, and no-show scenarios for reservations made through the platform.',
    ],
    sections: [
      {
        heading: 'Cancellation Windows',
        paragraphs: [
          'Cancellation terms may vary by property, season, booking channel, and stay length, and the applicable window will be shown before a reservation is finalized.',
          'When no property-specific policy overrides this standard, guests should expect stricter terms as the arrival date approaches.',
        ],
      },
      {
        heading: 'Refund Eligibility',
        paragraphs: [
          'Refund eligibility depends on the timing of the cancellation, the payment status of the reservation, and any non-refundable fees disclosed during checkout.',
          'Approved refunds are subject to the payment and processing terms described in our Payment & Refund Policy.',
        ],
      },
      {
        heading: 'No-show Policy',
        paragraphs: [
          'If a guest fails to arrive and does not communicate with our team within the applicable arrival window, the reservation may be treated as a no-show.',
          'No-show reservations are generally non-refundable unless required by law or a written exception is granted by Vimex.',
        ],
      },
      {
        heading: 'Modification Policy',
        paragraphs: [
          'Requests to change dates, occupancy, or property selection are subject to availability, revised pricing, and approval by Vimex or the property representative.',
          'A requested modification may be treated as a cancellation and rebooking if the original reservation can no longer be honored on the same terms.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/cancellation-policy'),
  },
  paymentPolicy: {
    href: '/payment-policy',
    title: 'Payment & Refund Policy',
    description: 'Review accepted payment methods, deposit expectations, refund timing, and dispute handling rules.',
    updatedAt: LAST_UPDATED,
    intro: [
      'This policy explains how Vimex handles payments, deposits, refunds, and payment disputes for reservations made through the platform.',
    ],
    sections: [
      {
        heading: 'Payment Methods',
        paragraphs: [
          'Accepted payment methods may include major cards, bank transfers, or other approved methods presented during the reservation flow.',
          'We may limit available payment methods based on location, booking timing, fraud signals, or operational requirements.',
        ],
      },
      {
        heading: 'Deposit Requirements',
        paragraphs: [
          'Some reservations require an advance payment, installment schedule, or security deposit before the booking is confirmed or before check-in instructions are released.',
          'Deposit terms, due dates, and any consequences of non-payment will be communicated as part of the booking process.',
        ],
      },
      {
        heading: 'Refund Processing Time',
        paragraphs: [
          'Once a refund is approved, we will initiate it using the original payment method when possible.',
          'Posting times vary by financial institution and payment network, so reflected funds may take several business days after processing begins.',
        ],
      },
      {
        heading: 'Dispute Handling',
        paragraphs: [
          'Guests should contact Vimex first with any payment concern so we can review the reservation record and attempt a prompt resolution.',
          'Chargebacks or formal disputes may pause refunds or booking actions while supporting documentation is reviewed by the relevant provider.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/payment-policy'),
  },
  cookiePolicy: {
    href: '/cookie-policy',
    title: 'Cookie Policy',
    description: 'See how cookies and similar technologies are used across the Vimex website and booking experience.',
    updatedAt: LAST_UPDATED,
    intro: [
      'This Cookie Policy explains how Vimex uses cookies and similar technologies to operate the website, remember preferences, and understand platform usage.',
    ],
    sections: [
      {
        heading: 'What Cookies Are',
        paragraphs: [
          'Cookies are small text files placed on a device to help websites remember activity, preferences, and technical session details.',
          'Related technologies such as local storage, pixels, and tags may serve similar operational or measurement purposes.',
        ],
      },
      {
        heading: 'Types of Cookies Used',
        paragraphs: [
          'We may use essential cookies to support site functionality, performance cookies to understand usage patterns, and preference cookies to remember choices you make.',
        ],
        bullets: [
          'Essential cookies help core site features work correctly.',
          'Analytics cookies help us understand visits and improve usability.',
          'Preference cookies help remember user settings and booking flow selections.',
        ],
      },
      {
        heading: 'Third Party Cookies',
        paragraphs: [
          'Some cookies may be set by third-party services that support analytics, embedded content, security tooling, or payment-related workflows.',
          'Those providers manage their own technologies under their own privacy terms.',
        ],
      },
      {
        heading: 'Managing Cookie Preferences',
        paragraphs: [
          'Users can manage or disable cookies through browser settings, though doing so may affect site functionality or parts of the reservation experience.',
          'If we introduce a cookie preference center in the future, this policy will be updated to reflect those controls.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/cookie-policy'),
  },
  houseRules: {
    href: '/house-rules',
    title: 'House Rules',
    description: 'Review baseline guest conduct expectations, occupancy rules, and prohibited activities for Vimex stays.',
    updatedAt: LAST_UPDATED,
    intro: [
      'These House Rules provide a baseline standard for guest behavior across Vimex-managed stays. Individual properties may add stricter rules that guests must also follow.',
    ],
    sections: [
      {
        heading: 'Guest Conduct',
        paragraphs: [
          'Guests must respect neighbors, staff, property owners, and community rules throughout the stay.',
          'Excessive noise, abusive conduct, or misuse of the property may result in immediate intervention or termination of the stay.',
        ],
      },
      {
        heading: 'Maximum Occupancy',
        paragraphs: [
          'Occupancy limits are set for safety, licensing, and property protection reasons and may not be exceeded without written approval.',
          'Unregistered overnight guests or events that exceed permitted occupancy are not allowed unless explicitly authorized.',
        ],
      },
      {
        heading: 'Check-in / Check-out',
        paragraphs: [
          'Guests must follow the confirmed arrival and departure schedule, including any identification, access, or pre-arrival requirements communicated before check-in.',
          'Late departures or unapproved early arrivals may lead to additional charges when they interfere with operations or housekeeping schedules.',
        ],
      },
      {
        heading: 'Prohibited Activities',
        paragraphs: [
          'Illegal activity, smoking in non-smoking areas, unauthorized parties, property damage, and unsafe use of amenities are prohibited.',
        ],
        bullets: [
          'No illegal substances or unlawful conduct on the premises.',
          'No commercial filming, events, or parties without written approval.',
          'No tampering with security, safety, or owner-only systems.',
        ],
      },
    ],
    relatedLinks: withRelatedLinks('/house-rules'),
  },
}

export function getLegalPageMetadata(page: LegalPageContent): Metadata {
  return {
    title: `${page.title} — Vimex`,
    description: page.description,
    alternates: {
      canonical: page.href,
    },
  }
}

export function getLegalSlugFromHref(href: string): string {
  return href.replace(/^\//, '')
}
