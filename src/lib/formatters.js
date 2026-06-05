const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * @param {number} amount
 * @returns {string} e.g. "$1.800"
 */
export function formatPrice(amount) {
  return priceFormatter.format(amount)
}

/**
 * @param {string} dateStr - ISO date string
 * @returns {string} formatted date in es-AR locale
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}
