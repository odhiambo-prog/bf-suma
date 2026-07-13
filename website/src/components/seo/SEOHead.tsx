/* eslint-disable react-refresh/only-export-components */
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { SHOP_CONFIG } from '@/config/shop.config'

interface SEOHeadProps {
  title: string
  description: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown>[]
}

const SITE_URL = 'https://eagleshop.co.ke'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BF SUMA Eagle Shop',
  alternateName: 'BFSUMA Eagleshop',
  url: SITE_URL,
  logo: `${SITE_URL}/site-logo.png`,
  description: SHOP_CONFIG.seo.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6th Floor, Utumishi House, Mamlaka Road',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SHOP_CONFIG.contact.phone,
    contactType: 'customer service',
    email: SHOP_CONFIG.contact.email,
  },
  sameAs: [
    SHOP_CONFIG.social.facebook,
    SHOP_CONFIG.social.instagram,
    SHOP_CONFIG.social.tiktok,
    SHOP_CONFIG.social.youtube,
  ].filter(Boolean),
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'BF SUMA Eagle Shop',
  image: `${SITE_URL}/site-logo.png`,
  url: SITE_URL,
  telephone: SHOP_CONFIG.contact.phone,
  email: SHOP_CONFIG.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6th Floor, Utumishi House, Mamlaka Road',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  priceRange: '$$',
}

export default function SEOHead({
  title,
  description,
  ogImage,
  canonical,
  noindex,
  jsonLd,
}: SEOHeadProps) {
  const location = useLocation()
  const fullTitle = `${title} | BF SUMA Eagleshop`
  const og = ogImage || `${SITE_URL}${SHOP_CONFIG.seo.ogImage}`
  const url = canonical || `${SITE_URL}${location.pathname}`

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    ...location.pathname.split('/').filter(Boolean).map((part, _, parts) => ({
      name: part.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      path: '/' + parts.slice(0, parts.indexOf(part) + 1).join('/'),
    })),
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }

  const schemas = [
    organizationSchema,
    localBusinessSchema,
    breadcrumbSchema,
    ...(jsonLd || []),
  ]

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={og} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="BF SUMA Eagleshop" />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={og} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
