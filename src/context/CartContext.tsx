'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem } from '@/types/cart' // Usamos la interfaz que creaste

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
}

// Creo el contexto
//esto es un hook personalizado para poder usar el contexto en cualquier componente
//esencialmente es una forma de pasar datos entre componentes sin tener que pasarlos manualmente
const CartContext = createContext<CartContextType | undefined>(undefined)


//esto es un componente que envuelve a los componentes que necesitan acceso al carrito
//esto es necesario para que el contexto pueda ser usado por los componentes
//en resumen, este componente es el proveedor de datos

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    // 1. (Opcional) Cargar el carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('burger_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Error al cargar el carrito:', e)
            }
        }
    }, [])

    // 2. Guardar en localStorage cada vez que cambien los ítems
    useEffect(() => {
        localStorage.setItem('burger_cart', JSON.stringify(items))
    }, [items])

    // Función para agregar productos al carrito
    const addToCart = (newItem: CartItem) => {
        setItems((prevItems) => {
            // Verificamos si el producto ya existe en el carrito
            const existingIndex = prevItems.findIndex(
                (item) => item.product.id === newItem.product.id
            )

            if (existingIndex > -1) {
                // Si existe, creamos un nuevo objeto de forma inmutable
                return prevItems.map((item, index) => {
                    if (index === existingIndex) {
                        return {
                            ...item,
                            quantity: item.quantity + newItem.quantity,
                        }
                    }
                    return item
                })
            } else {
                // Si no existe, lo agregamos como nuevo ítem
                return [...prevItems, newItem]
            }
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    )
}

// Hook personalizado para consumir el carrito en cualquier componente
export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider')
    }
    return context
}
