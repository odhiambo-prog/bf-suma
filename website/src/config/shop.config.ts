export const SHOP_CONFIG = {
  name: 'BF SUMA Eagle Shop',
  tagline: "Nairobi's Premier Wellness Destination",
  heroSubtitle: 'Premium, science-backed supplements designed to optimize your health. From immune boosters to anti-aging wonders, BFSUMA Eagleshop brings Los Angeles quality to Nairobi.',
  logo: '/site-logo.png',

  brand: {
    primary: '#059669',
    accent: '#2563EB',
    light: '#D1FAE5',
    background: '#FAFAFA',
  },

  contact: {
    phone: '+254 (0)716626037',
    email: 'info@eagleshop.co.ke',
    whatsapp: '+254716626037',
    address: '6th Floor, Utumishi House, Mamlaka Road, Nairobi, Kenya',
  },

  social: {
    facebook: '',
    instagram: 'https://www.instagram.com/bfsumaeagleshop',
    tiktok: '',
    youtube: '',
  },

  api: {
    inventoryBaseUrl: import.meta.env.VITE_INVENTORY_BASE_URL ?? '',
    inventoryApiKey: import.meta.env.VITE_INVENTORY_API_KEY ?? '',
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  },

  seo: {
    title: 'BF SUMA Eagle Shop | Elevating Wellness in Nairobi',
    description: 'Premium health supplements and wellness services in Nairobi.',
    ogImage: '/og-image.jpg',
    siteUrl: 'https://eagleshop.co.ke',
  },

  features: {
    showEvents: true,
    showReviews: true,
    showJoinUs: true,
    showFAQ: true,
    publicReviewSubmission: true,
  },

  distributorProgram: {
    name: 'Eagle Distributor Program',
    ctaLabel: 'Become a Distributor',
    ctaLink: 'https://register.bfsuma.com',
  },
}
