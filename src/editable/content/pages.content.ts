import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Media distribution insights and release strategy',
      description: 'Explore distribution guides, communication strategy, release examples, and editorial updates through a premium reading-first experience.',
      openGraphTitle: 'Media distribution insights and release strategy',
      openGraphDescription: 'A polished editorial destination for release strategy, announcement planning, and media distribution coverage.',
      keywords: ['media distribution', 'press release strategy', 'announcement planning', 'editorial insights'],
    },
    hero: {
      badge: 'Updated guidance for media distribution',
      title: ['Practical release strategy,', 'distribution choices, and editorial insight.'],
      description: 'Compare distribution options, review current communication themes, and move from headline to detail in a calmer, premium reading environment.',
      primaryCta: { label: 'Browse media distribution', href: '/media-distribution' },
      secondaryCta: { label: 'Open latest articles', href: '/article' },
      searchPlaceholder: 'Search distribution guides, examples, and communication topics',
      focusLabel: 'Featured',
      featureCardBadge: 'Lead briefing',
      featureCardTitle: 'The homepage centers the strongest current story without changing the publishing backend.',
      featureCardDescription: 'Posts still flow from the existing data sources while the front end presents them in a more editorial, intentional format.',
    },
    intro: {
      badge: 'Why this site',
      title: 'A premium editorial surface for media distribution content.',
      paragraphs: [
        'The site brings together release strategy, topical commentary, visual examples, and supporting resources in one consistent reading flow.',
        'Visitors can move from overview sections to deeper article pages, then continue into related items without losing context.',
        'Everything stays connected through the existing post data while the presentation feels more considered and more useful.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Editorial homepage with a stronger hero and reading rhythm.',
        'Guide-style detail pages with side rails and cleaner navigation.',
        'Archive pages that balance discovery, filtering, and scan speed.',
        'Card variety for featured, compact, list, and image-led content.',
      ],
      primaryLink: { label: 'Browse guides', href: '/media-distribution' },
      secondaryLink: { label: 'Explore visuals', href: '/image' },
    },
    cta: {
      badge: 'Need support',
      title: 'Make stronger distribution decisions with clearer editorial context.',
      description: 'Review release options, compare formats, and explore practical examples before your next announcement goes live.',
      primaryCta: { label: 'Talk with our team', href: '/contact' },
      secondaryCta: { label: 'Browse latest posts', href: '/search' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A sharper way to browse media distribution content.',
    description: `${slot4BrandConfig.siteName} is designed to make strategy content, release examples, and editorial guidance feel easier to read and easier to trust.`,
    paragraphs: [
      'The experience prioritizes pace, clarity, and connection between formats so each page leads naturally to the next useful resource.',
      'From article-style reading to image-led discovery and supporting listings, the goal is a more intentional public-facing publication.',
    ],
    values: [
      {
        title: 'Clear editorial structure',
        description: 'Longer reads, side rails, and overview sections help visitors scan first and dive deeper when they are ready.',
      },
      {
        title: 'Connected discovery',
        description: 'Articles, media distribution posts, resources, and supporting formats stay linked through a shared visual system.',
      },
      {
        title: 'Practical tone',
        description: 'The copy stays grounded, informative, and suitable for a public audience without inflated claims.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Start a conversation about your next release, update, or communication push.',
    description: 'Share the context, timeline, or distribution goal and we will route it through the right follow-up path.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, categories, and topics across the full site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, resources, and release guidance faster.',
      description: 'Search the full library of articles, visuals, listings, and supporting resources from one cleaner archive page.',
      placeholder: 'Search by keyword, category, topic, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
