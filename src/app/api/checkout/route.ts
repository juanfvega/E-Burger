// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
    try {
        // 1. Leemos los datos enviados desde el formulario
        const { formData, items } = await request.json()

        // Validaciones básicas de seguridad
        if (!formData.name || !formData.phone || !formData.address) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 })
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
        }

        // 2. Inicializamos Payload en el servidor
        const payloadConfig = await config
        const payload = await getPayload({ config: payloadConfig })

        // 3. PASO A: Crear el cliente en la colección 'clients'
        const client = await payload.create({
            collection: 'clients',
            data: {
                name: formData.name,
                phone: formData.phone,
            },
        })

        // 4. Formatear la lista de productos para la relación de Payload
        const formattedItems = items.map((item: any) => ({
            product: item.product.id,
            quantity: item.quantity,
        }))

        // 5. PASO B: Crear la orden asociada al ID del cliente recién creado
        // (Nota: Tu hook beforeChange en Orders calculará automáticamente priceAtPurchase y total)
        const order = await payload.create({
            collection: 'orders',
            data: {
                client: client.id,
                items: formattedItems,
                deliveryType: formData.deliveryType,
                address: formData.address,
                addressNumber: formData.addressNumber,
                floor: formData.floor || null,
                apartment: formData.apartment || null,
                references: formData.references || null,
                status: 'pending',
                total: 0, // El hook lo recalculará
            },
        })

        // 6. Respondemos con éxito al cliente
        return NextResponse.json({
            success: true,
            orderId: order.id,
            message: 'Orden creada exitosamente',
        })

    } catch (error: any) {
        console.error('Error procesando checkout:', error)
        return NextResponse.json(
            { error: error.message || 'Error interno al procesar la orden' },
            { status: 500 }
        )
    }
}
