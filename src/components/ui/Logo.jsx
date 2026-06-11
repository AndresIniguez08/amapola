export default function Logo({ className = '', size = 150 }) {
  return (
    <img
      src="/amapola-logo.png"
      alt="Amapola Panificados"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}
