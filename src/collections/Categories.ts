import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'emoji',
            type: 'text',
            admin: {
                description: 'Emoji representativo para la categoría (ej: 🍔)',
            },
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'imageUrl',
            type: 'text',
            admin: {
                description: 'URL externa de la imagen (ej: Unsplash) si no se sube un archivo',
            },
        },
    ],
}
