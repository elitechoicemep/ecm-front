import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://elitechoicemep.com';
export const SITE_NAME = 'Elite Choice Electromechanical Contracting LLC';
export const DEFAULT_IMAGE = `${SITE_URL}/assets/images/emec_logo.jpeg`;

const company = {
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'Elite Choice MEP',
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  image: DEFAULT_IMAGE,
  telephone: '+971585716322',
  email: 'inquiry@elitechoicemep.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Al Yarmook, behind Sharjah Consultative Office, No. G1 & G2',
    addressLocality: 'Sharjah',
    addressCountry: 'AE',
  },
  areaServed: ['Sharjah', 'Dubai', 'United Arab Emirates'],
  foundingDate: '2019',
  priceRange: '$$',
  description: 'UAE-based MEP contractor providing electrical, plumbing, HVAC, fire fighting and turnkey electromechanical services.',
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const serviceCatalog = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MEP Services',
  itemListElement: [
    'Electrical Works',
    'Plumbing Systems',
    'HVAC and Ducting',
    'Fire Fighting Systems',
    'Full MEP Turnkey',
  ].map((name, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'United Arab Emirates',
    },
  })),
};

export const seoPages = {
  home: {
    path: '/',
    title: 'MEP Contractor in UAE | Elite Choice Electromechanical Contracting LLC',
    description: 'Elite Choice Electromechanical Contracting LLC provides complete MEP contracting, electrical, plumbing, HVAC, fire fighting and turnkey services across the UAE.',
    keywords: 'MEP contractor UAE, electromechanical contractor Sharjah, electrical works Dubai, HVAC contractor UAE, plumbing contractor Sharjah',
    schema: [
      { '@context': 'https://schema.org', ...company },
      website,
      serviceCatalog,
    ],
  },
  about: {
    path: '/about',
    title: 'About Elite Choice | UAE Electromechanical Contracting Company',
    description: 'Learn about Elite Choice Electromechanical Contracting LLC, a UAE MEP contractor established in 2019 for residential, commercial and industrial projects.',
  },
  services: {
    path: '/services',
    title: 'MEP Services in UAE | Electrical, Plumbing, HVAC and Fire Fighting',
    description: 'Explore Elite Choice MEP services including electrical works, plumbing systems, HVAC and ducting, fire fighting systems and full turnkey MEP delivery.',
    keywords: 'MEP services UAE, electrical contractor UAE, plumbing systems Sharjah, HVAC ducting Dubai, fire fighting systems UAE',
    schema: [serviceCatalog],
  },
  projects: {
    path: '/projects',
    title: 'MEP Projects in Dubai and Sharjah | Elite Choice Portfolio',
    description: 'View completed Elite Choice MEP projects across Dubai and Sharjah, including schools, retail outlets, villas and commercial facilities.',
  },
  clients: {
    path: '/clients',
    title: 'Elite Choice Clients | Trusted UAE MEP Contracting Partner',
    description: 'See clients and partners that trust Elite Choice for electromechanical contracting and complete MEP solutions across the UAE.',
  },
  licenses: {
    path: '/licenses',
    title: 'Licenses and Certifications | Elite Choice Electromechanical',
    description: 'Review Elite Choice trade license, registration and official documentation issued by Sharjah Economic Development Department.',
  },
  careers: {
    path: '/careers',
    title: 'MEP Careers in UAE | Join Elite Choice Electromechanical',
    description: 'Apply for MEP engineering, electrical, HVAC, plumbing and site roles with Elite Choice Electromechanical Contracting LLC in the UAE.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Elite Choice | MEP Contractor in Sharjah, UAE',
    description: 'Contact Elite Choice Electromechanical Contracting LLC for MEP project quotes, consultations and service enquiries across the UAE.',
    schema: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Elite Choice Electromechanical Contracting LLC',
        url: `${SITE_URL}/contact`,
        mainEntity: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  },
  private: {
    path: '/dashboard',
    title: 'Secure Portal | Elite Choice Electromechanical',
    description: 'Secure staff, supplier and admin portal for Elite Choice Electromechanical Contracting LLC.',
    noIndex: true,
  },
  resetPassword: {
    path: '/reset-password',
    title: 'Reset Password | Elite Choice Portal',
    description: 'Reset your Elite Choice portal password.',
    noIndex: true,
  },
  verifyEmail: {
    path: '/verify-email',
    title: 'Verify Email | Elite Choice Portal',
    description: 'Confirm your email address for the Elite Choice portal.',
    noIndex: true,
  },
  verifyPending: {
    path: '/verify-pending',
    title: 'Verify Your Email | Elite Choice Portal',
    description: 'Verify your email address to access the Elite Choice portal.',
    noIndex: true,
  },
  notFound: {
    path: '/404',
    title: 'Page Not Found | Elite Choice Electromechanical',
    description: 'The requested page could not be found.',
    noIndex: true,
  },
};

function canonicalFor(path) {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path}`;
}

function breadcrumbSchema(page) {
  if (page.noIndex) return null;
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];

  if (page.path !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: page.title.split('|')[0].trim(),
      item: canonicalFor(page.path),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function SEO({ pageKey }) {
  const page = seoPages[pageKey] || seoPages.notFound;
  const canonical = canonicalFor(page.path);
  const robots = page.noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';
  const schema = [breadcrumbSchema(page), ...(page.schema || [])].filter(Boolean);

  return (
    <Helmet>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.keywords && <meta name="keywords" content={page.keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {schema.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
