import SEO from '../../components/SEO.jsx'

export default function PolicyLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO title={title} noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="page-header">{title}</h1>
          {subtitle && <p className="text-slate-500 text-sm mt-2">{subtitle}</p>}
        </div>

        <div className="glass-card p-6 md:p-8 prose prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}

