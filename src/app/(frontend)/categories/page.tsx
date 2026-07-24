// src/app/(frontend)/categories/page.tsx
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function CategoriesPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const categories = await payload.find({
        collection: 'categories' as any,
        limit: 100,
        sort: 'createdAt',
    })

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: 'clamp(1.5rem, 6vw, 2.2rem)',
                fontWeight: 'bold',
                lineHeight: '1.2'
            }}>¿Qué te gustaría comer hoy?</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {categories.docs.map((cat: any) => {
                    const imageUrl = cat.imageUrl || (typeof cat.image === 'object' ? (cat.image as any)?.url : '')
                    return (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                            <div style={{
                                padding: '1.5rem 1rem',
                                borderRadius: '16px',
                                backgroundImage: imageUrl
                                    ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${imageUrl})`
                                    : 'none',
                                backgroundColor: imageUrl ? '#000000' : '#ffeb3b22',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                color: imageUrl ? 'white' : 'black',
                                border: '0px solid rgba(0,0,0,0.08)',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: '0 0 4px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '180px',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}>
                                <h3 style={{
                                    margin: 0,
                                    fontFamily: 'sans-serif',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    wordBreak: 'break-word',
                                    width: '100%',
                                    textShadow: imageUrl ? '1px 1px 3px rgba(0,0,0,0.8)' : 'none',
                                }}>
                                    {cat.name}
                                </h3>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </main>
    )
}
