// src/hooks/useWhatsApp.ts
import type { CartItem } from '@/types/cart'
import { DELIVERY_FEE } from '@/constants/delivery'

interface SendWhatsAppProps {
    orderId: string;
    formData: {
        name: string;
        phone: string;
        deliveryType: string;
        address: string;
        addressNumber: string;
        floor?: string;
        apartment?: string;
        references?: string;
    };
    items: CartItem[];
    total: number;
}

export function useWhatsApp() {
    // Reemplaza esto con el número oficial de tu hamburguesería (Código país + Código área + Número)
    const RESTAURANT_PHONE = '16505434800'

    const sendOrderToWhatsApp = ({ orderId, formData, items, total }: SendWhatsAppProps) => {
        const isDelivery = formData.deliveryType === 'delivery'
        const deliveryFee = isDelivery ? DELIVERY_FEE : 0
        const subtotal = total - deliveryFee

        // 1. Formateamos la lista de hamburguesas
        const itemsList = items
            .map(
                (item) =>
                    `• *${item.quantity}x* ${item.product.name} _($${(item.product.price || 0) * item.quantity})_`
            )
            .join('\n')

        // 2. Construimos el mensaje con formato enriquecido
        const message =
            `🍔 *¡NUEVO PEDIDO RECIBIDO!* 🍔\n` +
            `*Orden N°:* #${orderId}\n\n` +
            `👤 *DATOS DEL CLIENTE*\n` +
            `• *Nombre:* ${formData.name}\n` +
            `• *Teléfono:* ${formData.phone}\n\n` +
            `🛵 *MÉTODO DE ENTREGA*\n` +
            (isDelivery 
                ? `• *Tipo:* Envío a domicilio\n` +
                  `• *Dirección:* ${formData.address} N° ${formData.addressNumber}\n` +
                  (formData.floor ? `• *Piso/Dpto:* ${formData.floor} ${formData.apartment || ''}\n` : '') +
                  (formData.references ? `• *Referencias:* ${formData.references}\n` : '')
                : `• *Tipo:* Retiro en local\n`
            ) +
            `\n🛒 *DETALLE DEL PEDIDO*\n` +
            `${itemsList}\n\n` +
            `💵 *DESGLOSE DE PRECIOS*\n` +
            `• *Subtotal:* $${subtotal}\n` +
            (isDelivery ? `• *Envío:* $${DELIVERY_FEE}\n` : '') +
            `• *TOTAL A PAGAR:* *$${total}*\n\n` +
            `----------------------------------\n` +
            `_Por favor confirme la recepción de este pedido._`

        // 3. Codificamos el mensaje para que sea válido en URL
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${RESTAURANT_PHONE}?text=${encodedMessage}`

        // 4. Abrimos WhatsApp Web / App en una nueva pestaña
        window.open(whatsappUrl, '_blank')
    }

    return { sendOrderToWhatsApp }
}
