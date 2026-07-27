'use client'

import { Product } from '@/payload-types'
import { CartItem } from '@/types/cart'
import { useCart } from '@/context/CartContext'

import React, { useState, useEffect } from 'react'

const buttonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
}

export function QuantitySelector({ product, price }: { product: Product, price: number }) {
    // Definimos el estado 'quantity' iniciando en 1
    const [quantity, setQuantity] = useState(1)
    const { addToCart, items } = useCart()

    const handleIncrement = () => setQuantity((prev) => prev + 1)
    const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

    const handleAddToCart = () => {
        const item: CartItem = {
            product,
            quantity,
        }

        addToCart(item)
        console.log('Ítem añadido:', item)
    }

    //esto se va a ejecutar cada vez que items cambie
    useEffect(() => {
        console.log('Carrito (estado previo al render):', items)
    }, [items])

    return (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>

            {/* Botones de incremento/decremento */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '1.1rem', marginRight: '1rem' }}><strong>Cantidad:</strong></label>
                <button
                    onClick={handleDecrement}
                    style={buttonStyle}
                >
                    -
                </button>
                <span style={{ fontSize: '1.2rem', padding: '0 0.75rem', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
                <button
                    onClick={handleIncrement}
                    style={buttonStyle}
                >
                    +
                </button>
            </div>

            {/* Precio total calculado dinámicamente */}
            <p style={{ fontSize: '1.1rem' }}>
                <strong>Subtotal:</strong> ${price * quantity}
            </p>

            {/* Botón de añadir al carrito */}
            <button
                onClick={handleAddToCart}
                style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                }}
            >
                Añadir al Carrito
            </button>
            {/* Botón para ir al carrito */}
            {items.length > 0 && (
                <button
                    onClick={() => window.location.href = '/checkout'}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    Ir al Carrito
                </button>
            )}

        </div>
    )
}
