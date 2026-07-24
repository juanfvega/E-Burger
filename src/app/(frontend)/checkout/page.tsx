'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useWhatsApp } from '@/hooks/useWhatsApp'
import { DELIVERY_FEE } from '@/constants/delivery'

export default function CheckoutPage() {
    const { items, clearCart } = useCart()
    const { sendOrderToWhatsApp } = useWhatsApp()


    // Estados del formulario
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        deliveryType: '',
        address: '',
        addressNumber: '',
        floor: '',
        apartment: '',
        references: '',
    })

    // aca calculo el total y subtotal del carrito
    const subtotal = items.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0)
    const deliveryFee = formData.deliveryType === 'delivery' ? DELIVERY_FEE : 0
    const grandTotal = subtotal + deliveryFee

    // aca manejo los cambios del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    /*
        [Navegador(Cliente)]
        │
        │  1. Un solo POST con { formData, items }
        ▼
        [Route Handler: /api/checkout/route.ts](Servidor Next.js)
        │
        ├─► 2. payload.create({ collection: 'clients', ... })  ──► Guarda Cliente en DB
        │
        ├─► 3. payload.create({ collection: 'orders', ... })   ──► Guarda Orden en DB (se ejecuta tu hook)
        │
        ▼  4. Devuelve { success: true, orderId: "..." }
        [Navegador(Cliente)] ──► Vacía el carrito y muestra pantalla de éxito
    */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (items.length === 0) {
            alert('Tu carrito está vacío')
            return
        }

        try {
            // Enviamos todo en una sola petición a nuestra API interna
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formData,
                    items,
                }),
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert(`¡Pedido #${result.orderId} realizado con éxito!`)
                console.log('Pedido realizado con éxito:', result)

                // Enviamos el mensaje detallado a WhatsApp
                sendOrderToWhatsApp({
                    orderId: result.orderId,
                    formData,
                    items,
                    total: grandTotal,
                })

                clearCart() // Vaciamos el carrito
                // Opcional: router.push('/order-success')
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error)
            alert('Ocurrió un error de red al intentar enviar tu pedido.')
        }
    }


    return (
        <main className="checkout-main">
            <h1>Finalizar Pedido</h1>

            <div className="checkout-container">
                {/* Formulario de Envío */}
                <form onSubmit={handleSubmit} className="checkout-form">
                    <h3>Datos de Entrega</h3>

                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Teléfono de contacto"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <select
                        name="deliveryType"
                        value={formData.deliveryType}
                        onChange={handleChange}
                        required
                        style={{
                            padding: '0.75rem',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            backgroundColor: 'white',
                        }}
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="delivery">Envío a domicilio</option>
                        <option value="pickup">Retiro en local</option>
                    </select>

                    <input
                        type="text"
                        name="address"
                        placeholder="Calle / Dirección"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />

                    <div className="form-row">
                        <input
                            type="text"
                            name="addressNumber"
                            placeholder="Número"
                            value={formData.addressNumber}
                            onChange={handleChange}
                            required
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="text"
                            name="floor"
                            placeholder="Piso (opcional)"
                            value={formData.floor}
                            onChange={handleChange}
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: '#ffc107',
                            color: 'black',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                        }}
                    >
                        Confirmar Pedido (${grandTotal})
                    </button>
                </form>

                {/* Resumen del Carrito */}
                <div className="checkout-summary">
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.5rem' }}>Resumen del Carrito</h3>
                    {items.map((item) => (
                        <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: '500' }}>
                            <span>{item.quantity}x {item.product.name}</span>
                            <span>${(item.product.price || 0) * item.quantity}</span>
                        </div>
                    ))}

                    {formData.deliveryType === 'delivery' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: '500' }}>
                            <span>Envío a domicilio</span>
                            <span>${DELIVERY_FEE}</span>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.15)', margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Total:</span>
                        <span>${grandTotal}</span>
                    </div>
                </div>
            </div>
        </main>
    )
}
