import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
    slug: 'products',

    access: {
        // Cualquiera (público) puede leer los productos
        read: () => true,
        // Solo usuarios autenticados (admins) pueden crear, actualizar o borrar productos
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => Boolean(user),

    },
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'price',
            type: 'number',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'imageUrl',
            type: 'text',
            admin: {
                description: 'URL externa de la imagen (ej: Unsplash) si no se sube un archivo',
            },
        },
        {
            name: 'description',
            type: 'text',
        },
        {
            name: 'stock',
            type: 'number',
        },
        {
            name: 'category',
            type: 'select',
            options: [
                { label: 'Burger', value: 'burger' },
                { label: 'Fries', value: 'fries' },
                { label: 'Drink', value: 'drink' },
            ],
        },
        {
            name: 'createdBy',
            type: 'relationship',
            relationTo: 'admin',
            hooks: {
                beforeChange: [
                    ({ req, operation, value }) => {
                        // si es operacion create y hay usuario logueado, se guarda el id del usuario
                        if (operation === 'create' && req.user) {
                            return req.user.id
                        }
                        return value
                    }
                ],
            }
        }
    ],
}