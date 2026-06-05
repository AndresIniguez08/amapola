import { formatPrice } from './formatters'

const wave   = String.fromCodePoint(0x1F44B)
const cart   = String.fromCodePoint(0x1F6D2)
const money  = String.fromCodePoint(0x1F4B0)
const truck  = String.fromCodePoint(0x1F69A)
const check  = String.fromCodePoint(0x2705)
const box    = String.fromCodePoint(0x1F4E6)
const clock  = String.fromCodePoint(0x1F550)
const card   = String.fromCodePoint(0x1F4B3)
const person = String.fromCodePoint(0x1F464)
const memo   = String.fromCodePoint(0x1F4DD)

export function generateWhatsAppMessage(items, formData, storeConfig) {
  const deliveryFee = formData.deliveryMethod === 'envio' ? Number(storeConfig.delivery_fee ?? 0) : 0
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0)
  const total = subtotal + deliveryFee
  const productLines = items.map(({ product, quantity }) => '- ' + quantity + 'x ' + product.name + ' - ' + formatPrice(product.price * quantity)).join('\n')
  const deliveryLabel = formData.deliveryMethod === 'envio' ? 'Envio a domicilio' : 'Retiro en local'
  const scheduleMap = { manana: 'Manana (8-12)', mediodia: 'Mediodia (12-15)', tarde: 'Tarde (15-19)' }
  const paymentMap = { efectivo: 'Efectivo', transferencia: 'Transferencia bancaria', mercadopago: 'Mercado Pago' }
  const lines = [
    wave + ' *Hola Amapola!* Quiero hacer el siguiente pedido:',
    '',
    cart + ' *Productos:*',
    productLines,
    '',
    money + ' *Subtotal:* ' + formatPrice(subtotal),
    deliveryFee > 0 ? truck + ' *Envio:* ' + formatPrice(deliveryFee) : null,
    check + ' *Total: ' + formatPrice(total) + '*',
    '',
    box + ' *Entrega:* ' + deliveryLabel,
    clock + ' *Horario:* ' + (scheduleMap[formData.schedule] ?? formData.schedule),
    card + ' *Pago:* ' + (paymentMap[formData.paymentMethod] ?? formData.paymentMethod),
    '',
    person + ' *Mis datos:*',
    'Nombre: ' + formData.name,
    'Tel: ' + formData.phone,
    formData.deliveryMethod === 'envio' ? 'Dir: ' + formData.address : null,
    formData.notes ? memo + ' *Obs:* ' + formData.notes : null,
  ]
  return lines.filter(l => l !== null).join('\n')
}

export function openWhatsApp(message, phoneNumber) {
  console.log('MENSAJE RAW CHARCODE:', [...message.slice(0,5)].map(c => c.codePointAt(0).toString(16)))
  const encoded = encodeURIComponent(message)
  const url = 'https://api.whatsapp.com/send?phone=' + phoneNumber + '&text=' + encoded
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  a.click()
}