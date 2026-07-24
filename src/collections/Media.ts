import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  // Configuración de subida con tamaños de imagen personalizados
  upload: {
    imageSizes: [
      {
        name: 'thumbnail', // Miniatura pequeña
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',      // Tamaño para la tarjeta
        width: 400,
        height: 300,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail', // Usa la miniatura dentro del panel de Payload
  },
}
