import { formatPrice } from './formatters'

/**
 * @param {Array} items - cart items [{product, quantity}]
 * @param {Object} formData - checkout form values
 * @param {Object} storeConfig - key/value store settings
 * @returns {string} formatted WhatsApp message
 */
export function generateWhatsAppMessage(items, formData, storeConfig) {
  const deliveryFee =
    formData.deliveryMethod === 'envio'
      ? Number(storeConfig.delivery_fee ?? 0)
      : 0

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0,
  )
  const total = subtotal + deliveryFee

  const productLines = items
    .map(({ product, quantity }) => {
      const lineTotal = product.price * quantity
      return `• ${quantity}x ${product.name} — ${formatPrice(lineTotal)}`
    })
    .join('\n')

  const deliveryLabel =
    formData.deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en local'

  const scheduleMap = {
    manana: 'Mañana (8–12)',
    mediodia: 'Mediodía (12–15)',
    tarde: 'Tarde (15–19)',
  }

  const paymentMap = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia bancaria',
    mercadopago: 'Mercado Pago',
  }

  const lines = [
    `🌸 *Hola Amapola!* Quiero hacer el siguiente pedido:`,
    ``,
    `🛒 *Productos:*`,
    productLines,
    ``,
    `💰 *Subtotal:* ${formatPrice(subtotal)}`,
    deliveryFee > 0 ? `🚚 *Envío:* ${formatPrice(deliveryFee)}` : null,
    `💳 *Total: ${formatPrice(total)}*`,
    ``,
    `📦 *Entrega:* ${deliveryLabel}`,
    `🕐 *Horario preferido:* ${scheduleMap[formData.schedule] ?? formData.schedule}`,
    `💳 *Forma de pago:* ${paymentMap[formData.paymentMethod] ?? formData.paymentMethod}`,
    ``,
    `👤 *Mis datos:*`,
    `Nombre: ${formData.name}`,
    `Teléfono: ${formData.phone}`,
    formData.deliveryMethod === 'envio' ? `Dirección: ${formData.address}` : null,
    formData.notes ? `\n📝 *Observaciones:* ${formData.notes}` : null,
  ]

  return lines.filter(l => l !== null).join('\n')
}

/**
 * @param {string} message
 * @param {string} phoneNumber - digits only, with country code e.g. 5492236001234
 */
export function openWhatsApp(message, phoneNumber) {
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
