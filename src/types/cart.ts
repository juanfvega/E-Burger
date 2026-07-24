// src/types/cart.ts
import type { Product } from '@/payload-types'

export interface CartItem {
    product: Product; // El objeto completo del producto
    quantity: number; // La cantidad seleccionada por el usuario
}
