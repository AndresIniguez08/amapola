/**
 * @param {'sm'|'md'|'lg'} size
 */
export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-[3px]',
  }
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={`inline-block rounded-full border-primary border-t-transparent animate-spin ${sizes[size]} ${className}`}
    />
  )
}
