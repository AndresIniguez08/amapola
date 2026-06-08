import { supabase } from './supabase'

export async function saveOrder(items, formData, storeConfig) {
  const deliveryFee = formData.deliveryMethod === 'envio'
    ? Number(storeConfig.delivery_fee ?? 0)
    : 0

  const subtotal = items.reduce((sum, { product, variant, quantity }) => {
    const price = variant?.price ?? product.price
    return sum + price * quantity
  }, 0)

  const payload = {
    customer_name:    formData.name,
    customer_phone:   formData.phone,
    customer_address: formData.address ?? null,
    items: items.map(({ product, variant, quantity }) => {
      const price = variant?.price ?? product.price
      const cost = variant?.cost ?? product.cost ?? 0
      return {
        id:           product.id,
        name:         product.name,
        variant_id:   variant?.id ?? null,
        variant_name: variant?.name ?? null,
        price,
        cost,
        quantity,
        subtotal:     price * quantity,
        cost_total:   cost * quantity,
      }
    }),
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
