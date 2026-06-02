import Masonry from 'react-masonry-css'
import { getTransformedUrl } from '../utils/cloudinary.js'

const breakpointCols = {
  default: 4,
  1280: 3,
  768: 2,
  480: 1,
}

export default function GalleryMasonry({ images = [] }) {
  if (!images.length) return null

  return (
    <Masonry
      breakpointCols={breakpointCols}
      className="masonry-grid"
      columnClassName="masonry-grid-col"
    >
      {images.map((image, index) => (
        <GalleryItem key={image._id || index} image={image} />
      ))}
    </Masonry>
  )
}

function GalleryItem({ image }) {
  const url = getTransformedUrl(image.url, { width: 600, quality: 'auto' })

  return (
    <div className="mb-4 group relative overflow-hidden rounded-2xl glass-card p-0">
      <img
        src={url}
        alt={image.caption || 'Gallery image'}
        className="w-full object-contain bg-white/5 transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-dark-950/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm font-medium">{image.caption}</p>
        </div>
      )}
    </div>
  )
}
