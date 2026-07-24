import React from 'react'
import Link from 'next/link'
import { CartIcon } from './CartIcon'

export function Navbar() {
    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#1a1a1a',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            {/* Logo o Nombre de la Marca */}
            <Link
                href="/categories"
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#ffc107',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}
            >
                Burger House 🍔
            </Link>

            {/* Ícono del Carrito Flotante/Desplegable */}
            <CartIcon />
        </header>
    )
}
