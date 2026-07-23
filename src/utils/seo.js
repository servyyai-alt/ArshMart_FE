import { runtimeConfig } from './runtime.js'

export const generateProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.images?.[0]?.url,
  description: product.description,
  sku: product._id,
  brand: { '@type': 'Brand', name: product.brand || 'Sandhaikart' },
  offers: {
    '@type': 'Offer',
    url: `${runtimeConfig.siteUrl}/products/${product._id}`,
    priceCurrency: 'INR',
    price: product.price,
    availability: product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
    seller: { '@type': 'Organization', name: 'Sandhaikart' },
  },
  aggregateRating: product.ratings > 0 ? {
    '@type': 'AggregateRating',
    ratingValue: product.ratings,
    reviewCount: product.numReviews,
  } : undefined,
})

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: runtimeConfig.appName,
  url: runtimeConfig.siteUrl,
  description: 'Premium online shopping destination in India',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${runtimeConfig.siteUrl}/products?keyword={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
})

export const generateBreadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${runtimeConfig.siteUrl}${crumb.path}`,
  })),
})

export const defaultMeta = {
  title: 'Sandhaikart - Premium Shopping',
  description: 'Shop the best products at Sandhaikart. Electronics, Fashion, Home & Kitchen and more with fast delivery across India.',
  keywords: 'sandhaikart, online shopping, buy online, india ecommerce',
  ogImage: runtimeConfig.ogImageUrl,
}
