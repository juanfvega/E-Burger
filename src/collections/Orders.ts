import type { CollectionConfig } from "payload";
import { DELIVERY_FEE } from "../constants/delivery";

export const Orders: CollectionConfig = {
    slug: 'orders',
    hooks: {
        beforeChange: [
            async ({ data, req }) => {
                // Validamos que existan ítems en la orden
                if (data.items && Array.isArray(data.items)) {
                    let calculatedTotal = 0;
                    for (const item of data.items) {
                        // Obtenemos el ID del producto (manejando si viene como ID string o como objeto populado)
                        const productId = typeof item.product === 'object' ? item.product?.id : item.product;
                        if (productId) {
                            // Buscamos el producto en la base de datos usando la API local de Payload
                            const product = await req.payload.findByID({
                                collection: 'products',
                                id: productId,
                                req, // Pasamos el contexto del request
                            });
                            if (product) {
                                // Asignamos el precio actual del producto al precio de compra de este ítem
                                const price = product.price || 0;
                                item.priceAtPurchase = price;
                                // Calculamos cantidad * precio y lo sumamos al total acumulado
                                const quantity = item.quantity || 1;
                                calculatedTotal += quantity * price;
                            }
                        }
                    }
                    // Si es delivery, sumamos el costo de envío
                    if (data.deliveryType === 'delivery') {
                        calculatedTotal += DELIVERY_FEE;
                    }
                    // Asignamos el total calculado al campo 'total' de la orden
                    data.total = calculatedTotal;
                }
                return data;
            }
        ]
    },
    // en la interfaz de Payload, para el campo client voy a querer que se busque en la coleccion clients y me traiga todos los clientes disponibles.

    fields: [
        {
            name: 'client',
            type: 'relationship',
            relationTo: 'clients',
            required: true,
        },
        {
            name: 'items',
            type: 'array',
            fields: [
                {
                    name: 'product',
                    type: 'relationship',
                    relationTo: 'products',
                    required: true,
                },
                {
                    name: 'quantity',
                    type: 'number',
                    required: true,
                    defaultValue: 1,
                },
                {
                    name: 'priceAtPurchase',
                    label: 'Price at Purchase',
                    type: 'number',
                    required: true,
                    admin: {
                        readOnly: true, // para que no se pueda editar
                        description: 'The price of the product at the time of purchase',
                    },
                },
            ],
        },
        {
            name: 'deliveryType',
            type: 'select',
            options: [
                { label: 'Delivery', value: 'delivery' },
                { label: 'Pickup', value: 'pickup' },
            ],
            defaultValue: 'delivery',
            required: true,
            admin: {
                readOnly: true,
                description: 'The delivery type of the order',
            }
        },
        {
            name: 'address',
            type: 'text',
            required: true,
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'The address of the client',
            }
        },
        {
            name: 'addressNumber',
            type: 'text',
            required: true,
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'The number of the address',
            }
        },
        {
            name: 'floor',
            type: 'text',
            required: false,
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'The floor of the address',
            }
        },
        {
            name: 'apartment',
            type: 'text',
            required: false,
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'The apartment of the address',
            }
        },
        {
            name: 'references',
            type: 'text',
            required: false,
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'References of the address',
            }
        },
        {
            name: 'total',
            type: 'number',
            required: true,
            admin: {
                readOnly: true, // para que no se pueda editar
            },
        },
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
            defaultValue: 'pending',
        },
    ],
}