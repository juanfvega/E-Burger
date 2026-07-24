import type { CollectionConfig } from "payload";

export const Receipt: CollectionConfig = {
    slug: 'receipts',
    // 1. Hook para autogenerar el número secuencial antes de guardar
    hooks: {
        beforeChange: [
            async ({ data, req, operation }) => {
                if (operation === 'create') {
                    // Buscamos el último recibo creado ordenando por fecha descendente
                    const lastReceipts = await req.payload.find({
                        collection: 'receipts',
                        sort: '-createdAt', // Trae el más reciente primero
                        limit: 1,
                        req,
                    });
                    let nextNumber = 1;
                    // Si ya existe al menos un recibo, leemos su número e incrementamos
                    if (lastReceipts.docs && lastReceipts.docs.length > 0) {
                        const lastReceipt = lastReceipts.docs[0];

                        // Extraemos la parte numérica (ej: de "FAC-000125" extrae "000125")
                        const match = lastReceipt.receiptNumber?.match(/\d+/);
                        if (match) {
                            const lastNum = parseInt(match[0], 10);
                            nextNumber = lastNum + 1;
                        }
                    }
                    // Formateamos el número con ceros a la izquierda (ej: FAC-000001)
                    const formattedNumber = `FAC-${String(nextNumber).padStart(6, '0')}`;

                    // Asignamos el valor generado
                    data.receiptNumber = formattedNumber;
                }

                return data;
            }
        ]
    },

    fields: [
        {
            name: 'order',
            type: 'relationship',
            relationTo: 'orders', // Apunta a la colección 'orders'
            required: true,
            unique: true, // <-- ¡CLAVE! Hace que la relación sea estrictamente 1 a 1
            admin: {
                description: 'La orden asociada a este recibo (solo puede haber una por recibo)',
            }
        },
        // Aquí puedes agregar campos propios de un recibo
        {
            name: 'receiptNumber',
            label: 'Receipt Number',
            type: 'text',
            required: true,
            unique: true, // Cada recibo tiene un número de factura único
            admin: {
                readOnly: true, // para que no se pueda editar
                description: 'Generado automáticamente de forma secuencial (FAC-XXXXXX)',
            }
        },
        {
            name: 'paymentMethod',
            label: 'Payment Method',
            type: 'select',
            options: [
                { label: 'Cash', value: 'cash' },
                { label: 'Credit Card', value: 'card' },
                { label: 'Transfer', value: 'transfer' },
            ],
            required: true,
        },
        {
            name: 'issuedAt',
            label: 'Issued At',
            type: 'date',
            defaultValue: () => new Date(),
        }
    ],
}
