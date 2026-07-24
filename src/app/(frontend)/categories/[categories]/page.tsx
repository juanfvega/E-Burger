// src/app/(frontend)/categories/[categories]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { ProductCard } from '@/components/productCard'
import Link from 'next/link'

//esta es la ruta dinamica que me permite obtener la categoria
interface PageProps {
    params: Promise<{ categories: string }>
}

export default async function CategoryPage({ params }: PageProps) {
    // Obtenemos el nombre de la categoría desde la ruta dinámica (e.g. burger, fries, drink)
    const { categories } = await params

    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Buscamos solo los productos que pertenecen a esta categoría
    const products = await payload.find({
        collection: 'products',
        where: {
            category: {
                equals: categories,
            },
        },
    })

    // Buscamos la categoría en la DB para obtener su nombre amigable
    const categoryResult = await payload.find({
        collection: 'categories' as any,
        where: {
            slug: {
                equals: categories,
            },
        },
    })
    const categoryDoc = categoryResult.docs[0] as any
    const title = categoryDoc ? categoryDoc.name : categories.toUpperCase()

    return (
        <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <Link href="/categories" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
                    ← Volver a Categorías
                </Link>
                <h1 style={{ marginTop: '1rem' }}>{title}</h1>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                justifyContent: 'center',
            }}>
                {products.docs.map((product) => (
                    // Reutilizamos el detalle del producto de burgerMenu/[id] apuntando allí
                    <Link
                        href={`/detailCategories/${product.id}`}
                        key={product.id}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'center' }}
                    >
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </main>
    )
}
