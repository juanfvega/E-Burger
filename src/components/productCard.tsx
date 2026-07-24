import React from 'react'
import { Product } from '../payload-types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            padding: '0.5rem',
            borderRadius: '8px',
            gap: '0.5rem'
        }}>
            {/* Columna Izquierda: Información */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{product.name || 'Nombre no disponible'}</h2>
                <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>{product.description || 'Descripción no disponible'}</p>
                <p style={{ margin: '0' }}><strong>Precio:</strong> ${product.price || 'Precio no disponible'}</p>
            </div>

            {/* Columna Derecha: Imagen */}
            {(product.imageUrl || (product.image && typeof product.image !== 'string')) && (
                <img
                    src={product.imageUrl || (typeof product.image === 'object' && product.image ? product.image.sizes?.thumbnail?.url || product.image.url || '' : '')}
                    alt={product.name || 'Imagen'}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />
            )}

            {/* Si necesitas un botón interactivo (ej. "Añadir al carrito"), 
          puedes importar aquí un componente con "use client" */}
        </div>
    )
}
