export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  windowSize = 10,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) return null

  const safeCurrent = Math.min(Math.max(currentPage, 1), totalPages)
  const windowStart = Math.floor((safeCurrent - 1) / windowSize) * windowSize + 1
  const windowEnd = Math.min(windowStart + windowSize - 1, totalPages)
  const pages = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i)
  const previousWindowStart = Math.max(1, windowStart - windowSize)
  const nextWindowStart = windowEnd + 1

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page)
  }

  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => goToPage(1)}
        disabled={safeCurrent === 1}
        className="px-3 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        First
      </button>
      <button
        type="button"
        onClick={() => goToPage(previousWindowStart)}
        disabled={windowStart === 1}
        className="px-3 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        -10
      </button>

      {windowStart > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToPage(1)}
            className="w-9 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-primary-500/30"
          >
            1
          </button>
          {windowStart > 2 && <span className="px-1 text-slate-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => goToPage(page)}
          className={`w-9 h-9 rounded-xl text-sm transition-all ${
            safeCurrent === page
              ? 'bg-primary-500 text-white'
              : 'glass text-slate-400 hover:border-primary-500/30'
          }`}
        >
          {page}
        </button>
      ))}

      {windowEnd < totalPages && (
        <>
          {windowEnd < totalPages - 1 && <span className="px-1 text-slate-400">...</span>}
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            className="w-9 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-primary-500/30"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => goToPage(nextWindowStart)}
        disabled={windowEnd === totalPages}
        className="px-3 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        +10
      </button>
      <button
        type="button"
        onClick={() => goToPage(totalPages)}
        disabled={safeCurrent === totalPages}
        className="px-3 h-9 rounded-xl text-sm border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-primary-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Last
      </button>
    </div>
  )
}
