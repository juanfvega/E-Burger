// @vitest-environment node
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Colección de Pedidos (Orders)', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('debe calcular el total de la orden correctamente', async () => {
    // 1. Crear un producto de prueba temporal
    const productoTemp = await payload.create({
      collection: 'products',
      data: {
        name: 'Hamburguesa Test',
        price: 1000,
        // ... otros campos obligatorios
      }
    })

    // 2. Crear un cliente de prueba temporal
    const clienteTemp = await payload.create({
      collection: 'clients',
      data: {
        name: 'Cliente Test',
        phone: '1123456789',
      }
    })

    // 3. Crear la orden usando los IDs reales de arriba
    const orden = await payload.create({
      collection: 'orders',
      data: {
        client: clienteTemp.id,
        items: [
          { product: productoTemp.id, quantity: 2, priceAtPurchase: 1000 },
        ],
        deliveryType: 'delivery',
        total: 2000,
        address: 'Calle Test',
        addressNumber: '123',
        floor: '1',
        apartment: '1',
        references: 'Ref Test',
        status: 'pending',
      },
    })

    // 4. Verificar que se calculó el total
    expect(orden.total).toBe(2004)
    expect(orden.deliveryType).toBe('delivery')
    expect(orden.address).toBe('Calle Test')
    expect(orden.addressNumber).toBe('123')
    expect(orden.floor).toBe('1')
    expect(orden.apartment).toBe('1')
    expect(orden.references).toBe('Ref Test')
    expect(orden.status).toBe('pending')
    // 5. LIMPIEZA: Borrar los registros temporales para no dejar basura en la base de datos
    await payload.delete({ collection: 'orders', id: orden.id })
    await payload.delete({ collection: 'clients', id: clienteTemp.id })
    await payload.delete({ collection: 'products', id: productoTemp.id })
  })


  it('debe calcular el total de la orden correctamente - Retiro en el local (pickup)', async () => {
    // 1. Crear un producto de prueba temporal
    const productoTemp = await payload.create({
      collection: 'products',
      data: {
        name: 'Hamburguesa Test 2',
        price: 1000,
        // ... otros campos obligatorios
      }
    })

    // 2. Crear un cliente de prueba temporal
    const clienteTemp = await payload.create({
      collection: 'clients',
      data: {
        name: 'Cliente Test 2',
        phone: '1123456789',
      }
    })

    // 3. Crear la orden usando los IDs reales de arriba (con pickup)
    const orden = await payload.create({
      collection: 'orders',
      data: {
        client: clienteTemp.id,
        items: [
          { product: productoTemp.id, quantity: 2, priceAtPurchase: 1000 },
        ],
        deliveryType: 'pickup',
        total: 2000,
        address: 'Calle Test',
        addressNumber: '123',
        floor: '1',
        apartment: '1',
        references: 'Ref Test',
        status: 'pending',
      },
    })

    // 4. Verificar que se calculó el total (debe ser exactamente 2000 sin costo de envío)
    expect(orden.total).toBe(2000)
    expect(orden.deliveryType).toBe('pickup')
    expect(orden.address).toBe('Calle Test')
    expect(orden.addressNumber).toBe('123')
    expect(orden.floor).toBe('1')
    expect(orden.apartment).toBe('1')
    expect(orden.references).toBe('Ref Test')
    expect(orden.status).toBe('pending')
    // 5. LIMPIEZA: Borrar los registros temporales para no dejar basura en la base de datos
    await payload.delete({ collection: 'orders', id: orden.id })
    await payload.delete({ collection: 'clients', id: clienteTemp.id })
    await payload.delete({ collection: 'products', id: productoTemp.id })
  })

  it('debe generar números de factura correlativos automáticamente para los recibos', async () => {
    // 1. Crear producto y cliente de prueba
    const productoTemp = await payload.create({
      collection: 'products',
      data: { name: 'Comida Test', price: 500 }
    })
    const clienteTemp = await payload.create({
      collection: 'clients',
      data: { name: 'Comprador Test', phone: '123456' }
    })

    // 2. Crear Orden 1 y su Recibo
    const orden1 = await payload.create({
      collection: 'orders',
      data: {
        client: clienteTemp.id,
        items: [{ product: productoTemp.id, quantity: 1, priceAtPurchase: 500 }],
        deliveryType: 'pickup',
        total: 500,
        address: 'Calle 1',
        addressNumber: '10',
        status: 'pending'
      }
    })
    const recibo1 = await payload.create({
      collection: 'receipts',
      data: {
        order: orden1.id,
        paymentMethod: 'cash',
        receiptNumber: 'TEMP',
      }
    })

    // 3. Crear Orden 2 y su Recibo
    const orden2 = await payload.create({
      collection: 'orders',
      data: {
        client: clienteTemp.id,
        items: [{ product: productoTemp.id, quantity: 1, priceAtPurchase: 500 }],
        deliveryType: 'pickup',
        total: 500,
        address: 'Calle 2',
        addressNumber: '20',
        status: 'pending'
      }
    })
    const recibo2 = await payload.create({
      collection: 'receipts',
      data: {
        order: orden2.id,
        paymentMethod: 'cash',
        receiptNumber: 'TEMP',
      }
    })

    // 4. VERIFICACIÓN: El número del recibo 2 debe ser exactamente el siguiente del recibo 1
    // Extraemos la parte numérica del código de factura de ambos recibos
    const num1 = parseInt(recibo1.receiptNumber!.match(/\d+/)![0], 10)
    const num2 = parseInt(recibo2.receiptNumber!.match(/\d+/)![0], 10)

    expect(num2).toBe(num1 + 1) // El segundo debe ser el primero + 1
    expect(recibo1.receiptNumber).toMatch(/^FAC-\d{6}$/) // Debe cumplir el formato (ej. FAC-000001)

    // 5. LIMPIEZA
    await payload.delete({ collection: 'receipts', id: recibo1.id })
    await payload.delete({ collection: 'receipts', id: recibo2.id })
    await payload.delete({ collection: 'orders', id: orden1.id })
    await payload.delete({ collection: 'orders', id: orden2.id })
    await payload.delete({ collection: 'clients', id: clienteTemp.id })
    await payload.delete({ collection: 'products', id: productoTemp.id })
  })
})

