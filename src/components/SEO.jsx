import { Helmet } from 'react-helmet-async'
import { runtimeConfig } from '../utils/runtime.js'

export default function SEO({
  title = 'Sandhaikart - Premium Shopping',
  description = 'Shop the best products at Sandhaikart. Electronics, Fashion, Home & Kitchen and more.',
  keywords = 'sandhaikart, online shopping, buy online',
  ogImage = runtimeConfig.ogImageUrl,
  schema,
  noindex = false,
}) {
  const fullTitle = title.includes('Sandhaikart') ? title : `${title} | Sandhaikart`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={runtimeConfig.appName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}
