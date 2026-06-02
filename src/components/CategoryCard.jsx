import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getTransformedUrl } from '../utils/cloudinary.js'

export default function CategoryCard({ category }) {
  const imageUrl = category.image
    ? getTransformedUrl(category.image, { width: 300, height: 200 })
    : null

  return (
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group relative overflow-hidden rounded-2xl aspect-[5/3] block"
    >
      {/* Background */}
      <div className="absolute inset-0 group-hover:bg-dark-900/30 transition-colors duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-fit bg-white/5 group-hover:opacity-80 group-hover:scale-110 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-dark-800" />
        )}
      </div>

      {/* Gradient overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/30 to-transparent" /> */}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div className='bg-black/30 p-2 rounded-md'>
            <h3 className="text-dark font-display font-semibold leading-tight">
              {category.name}
            </h3>
            <p className="text-white font-bold text-sm mt-0.5">
              {category.productCount || 0} products
            </p>
          </div>
          <div className="w-30 h-9 px-3 rounded-lg bg-green-500 flex items-center justify-center transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            {/* <ArrowRight className="w-4 h-4 text-white" /> */}
            Shop now <ArrowRight className="w-4 h-4 ml-2 text-white" /> 
          </div>
        </div>
      </div>

      {/* Border glow */}
      <div className="absolute border-2 inset-0 rounded-2xl border-white/10 group-hover:border-primary-500/30 transition-colors duration-300" />
    </Link>
  )
}
