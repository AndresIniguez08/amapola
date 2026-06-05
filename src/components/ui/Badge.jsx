/**
 * @param {'featured'|'tag'|'success'|'error'} variant
 */
export default function Badge({ children, variant = 'featured', className = '' }) {
  const variants = {
    featured: 'bg-primary text-white',
    tag: 'bg-stone-100 text-text-secondary',
    success: 'bg-green-50 text-success',
    error: 'bg-red-50 text-error',
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
