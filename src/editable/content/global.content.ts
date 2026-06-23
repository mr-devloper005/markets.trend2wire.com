import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Media distribution insights and announcements',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    announcement: 'Media distribution insights, practical release strategy, and timely communication updates.',
    announcementCta: { label: 'Explore now', href: '/media-distribution' },
    primaryLinks: [
      { label: 'PR services', href: '/media-distribution' },
      { label: 'Sectors', href: '/article' },
      { label: 'Locations', href: '/listing' },
      { label: 'About', href: '/about' },
    ],
    actions: {
      primary: { label: 'Talk with an expert', href: '/contact' },
      secondary: { label: 'Search archive', href: '/search' },
    },
  },
  footer: {
    tagline: 'Media distribution, strategy, and newsroom guidance',
    description: 'Editorial coverage, release strategy, distribution options, and practical updates designed for organizations that need credible visibility.',
    columns: [
      {
        title: 'About',
        links: [
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
          { label: 'Log in', href: '/login' },
          { label: 'Sign up', href: '/signup' },
        ],
      },
      {
        title: '',
        links: [],
      },
      {
        title: '',
        links: [],
      },
    ],
    offices: [
      { city: 'Amsterdam', meta: 'Herengracht 252, 1016 BV, Amsterdam, Netherlands' },
      { city: 'Austin', meta: '10900 Research Blvd, Austin, TX 78759, USA' },
      { city: 'Stockholm', meta: 'Torsgatan 2, 111 75 Stockholm, Sweden' },
      { city: 'Madrid', meta: 'Princesa St. 31, Moncloa, Madrid, Spain' },
    ],
    bottomNote: 'Prepared for media teams, founders, and communication leads who need sharper distribution decisions.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
