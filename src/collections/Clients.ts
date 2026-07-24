import type { CollectionConfig } from "payload";

export const Clients: CollectionConfig = {
    slug: 'clients',
    fields: [
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'phone',
            type: 'text',
        },
    ],
}