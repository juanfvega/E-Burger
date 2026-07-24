'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export function CartIcon() {
    const { items, totalItems, removeFromCart, clearCart } = useCart()
    const [isOpen, setIsOpen] = useState(false)

    // Calculamos el costo total acumulado
    const grandTotal = items.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0)

    return (
        <div style={{ position: 'relative' }}>
            {/* 🛒 Ícono del Carrito con Insignia (Badge) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    backgroundColor: '#ffc107',
                    border: 'none',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
            >
                🛒
                {totalItems > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            backgroundColor: '#e53e3e',
                            color: 'white',
                            borderRadius: '50%',
                            minWidth: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            border: '2px solid #1a1a1a',
                        }}
                    >
                        {totalItems}
                    </span>
                )}
            </button>

            {/* 📜 Desplegable con el Detalle del Carrito */}
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        width: '320px',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        color: '#333',
                    }}
                >
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                        Tu Carrito
                    </h3>

                    {items.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center' }}>El carrito está vacío</p>
                    ) : (
                        <>
                            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {items.map((item) => (
                                    <div
                                        key={item.product.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        <div>
                                            <strong>{item.product.name}</strong>
                                            <div style={{ color: '#666' }}>
                                                {item.quantity} x ${item.product.price}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.product.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#e53e3e',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                            }}
                                            title="Eliminar producto"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #eee' }}>
                                <p style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>Total:</span>
                                    <span>${grandTotal}</span>
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button
                                        onClick={clearCart}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            backgroundColor: '#555252ff',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Vaciar
                                    </button>

                                    <Link
                                        href="/checkout"
                                        style={{
                                            flex: 2,
                                            padding: '0.5rem',
                                            backgroundColor: '#ffc107',
                                            color: 'white',
                                            textAlign: 'center',
                                            textDecoration: 'none',
                                            borderRadius: '4px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Ir a Pagar
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
