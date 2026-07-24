import React from 'react'
import './styles.css'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/Navbar'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        {/* aca envuelvo a los componentes que necesitan acceso al carrito */}
        <CartProvider>
          {/* este main es el que va a recibir el contenido de las paginas que esten dentro de la carpeta app */}
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
