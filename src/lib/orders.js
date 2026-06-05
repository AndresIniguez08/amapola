import { supabase } from './supabase'

export async function saveOrder(items, formData, storeConfig) {
  const deliveryFee = formData.deliveryMethod === 'envio'
    ? Number(storeConfig.delivery_fee ?? 0)
    : 0

  const subtotal = items.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  )

  const payload = {
    customer_name:    formData.name,
    customer_phone:   formData.phone,
    customer_address: formData.address ?? null,
    items: items.map(({ product, quantity }) => ({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      quantity,
      subtotal: product.price * quantity,
    })),
    subtotal,
    delivery_fee: deliveryFee,
    total:        subtotal + deliveryFee,
    payment_method:  formData.paymentMethod,
    delivery_method: formData.deliveryMethod,
    schedule:        formData.schedule,
    notes:           formData.notes ?? null,
    status:          'pendiente',
  }

  const { data, error } = await supabase.from('orders').insert(payload).select().single()
  if (error) throw error
  return data
}
