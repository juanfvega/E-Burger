// src/app/(frontend)/burgerMenu/[id]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'
import { QuantitySelector } from '@/components/QuantitySelector'
import Link from 'next/link'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })


    // Obtenemos el ID de la URL
    const { id } = await params;

    // Buscamos el producto específico por su ID
    const product = await payload.findByID({
        collection: 'products',
        id,
    })

    return (
        <main style={{ padding: '1rem', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link href="/categories" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Volver a Categorías
            </Link>
            <h1>{product.name}</h1>
            <p style={{ fontSize: '1.2rem' }}>{product.description}</p>
            <p style={{ fontSize: '1.2rem' }}>Precio: ${product.price}</p>
            {((product as any).imageUrl || product.image) && (
                <img
                    src={(product as any).imageUrl || (product.image as any)?.sizes?.thumbnail?.url || (product.image as any)?.url || ''}
                    alt={product.name || 'Imagen'}
                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, alignSelf: 'center' }}
                />
            )}

            {/* aca llamo a un componente para poder manejar la cantidad de productos a comprar */}
            <QuantitySelector product={product} price={product.price || 0} />

        </main>
    )
}
