import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
    {
        emoji: '🍪',
        title: 'Crumble Cookies',
        subtitle: 'La firma de la casa',
        desc: 'Brown butter, chispas de chocolate belga y flor de sal. Cada mordida tiene capas.',
        img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80&auto=format',
        tag: 'Más pedido',
        bg: '#fff0f2',
    },
    {
        emoji: '🍮',
        title: 'Cuchareables',
        subtitle: 'En tarro, para saborear despacio',
        desc: 'Cheesecake de maracuyá, tres leches artesanal, mousse de frutos rojos y más.',
        img: 'https://images.unsplash.com/photo-1645562270357-043bb7c98f3e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Edición limitada',
        bg: '#fdf4f5',
    },
    {
        emoji: '🥧',
        title: 'Pyes & Tartas',
        subtitle: 'Masa corta. Rellenos de autor.',
        desc: 'Tarta de limón merengado, pie de manzana caramelizada o combinaciones personalizadas.',
        img: 'https://images.unsplash.com/photo-1583350229873-e06b12acdb9c?q=80&w=1144&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        tag: 'Para compartir',
        bg: '#fff5f6',
    },
    {
        emoji: '🎂',
        title: 'Pasteles Personalizados',
        subtitle: 'Tu visión, nuestras manos',
        desc: 'Diseños únicos con decoraciones en buttercream, fondant o flores naturales comestibles.',
        img: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=700&q=80&auto=format',
        tag: 'Pedido con 48h',
        bg: '#fef0f2',
    },
];

export default function TarjetasApilables() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current.children, {
                y: 40, opacity: 0, duration: 0.75, stagger: 0.12,
                scrollTrigger: { trigger: titleRef.current, start: 'top 82%' },
            });

            cardsRef.current.forEach((el, i) => {
                if (!el) return;

                // Enter animation
                gsap.from(el, {
                    y: 80, opacity: 0, scale: 0.94, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%' },
                });

                // Stack + blur when next card comes in
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top top',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    onUpdate(self) {
                        const progress = self.progress;
                        if (progress > 0.7) {
                            gsap.to(el, {
                                scale: 1 - (progress - 0.7) * 0.3,
                                filter: `blur(${(progress - 0.7) * 12}px)`,
                                opacity: 1 - (progress - 0.7) * 0.8,
                                duration: 0.1,
                            });
                        } else {
                            gsap.to(el, { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 0.15 });
                        }
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="menú-productos" style={{
            padding: '6rem 2rem 0',
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--bg) 0%, var(--light) 100%)',
        }}>
            <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <p style={{
                    fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--primary)', marginBottom: '0.7rem',
                }}>Nuestro menú</p>
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: 'var(--text)',
                }}>
                    Elaborado{' '}
                    <span className="font-drama" style={{ fontStyle: 'italic', color: 'var(--primary)' }}>
                        con obsesión
                    </span>
                </h2>
                <p style={{
                    fontFamily: 'Open Sans', fontSize: '0.95rem',
                    color: 'var(--text)', opacity: 0.75, maxWidth: '460px',
                    margin: '0.8rem auto 0', lineHeight: 1.7,
                }}>Cada producto se produce por encargo. Sin conservantes, sin shortcuts.</p>
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', gap: '2rem',
                maxWidth: '860px', margin: '0 auto', paddingBottom: '6rem'
            }}>
                {CARDS.map((c, i) => (
                    <div
                        key={i}
                        ref={el => cardsRef.current[i] = el}
                        style={{
                            background: c.bg,
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: '0 8px 40px rgba(119,98,101,0.12)',
                            display: 'grid',
                            gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                            minHeight: '320px',
                            border: '1px solid rgba(249,186,194,0.35)',
                        }}
                    >
                        {/* Image */}
                        <div style={{ order: i % 2 === 0 ? 2 : 1, position: 'relative', overflow: 'hidden' }}>
                            <img src={c.img} alt={c.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div style={{
                                position: 'absolute', top: '1rem', left: '1rem',
                                background: 'rgba(221,67,95,0.9)', color: '#fff',
                                fontFamily: 'Open Sans', fontWeight: 600, fontSize: '0.65rem',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                padding: '0.3rem 0.9rem', borderRadius: '100px',
                            }}>{c.tag}</div>
                        </div>

                        {/* Content */}
                        <div style={{
                            order: i % 2 === 0 ? 1 : 2,
                            padding: '2.5rem',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem',
                        }}>
                            <span style={{ fontSize: '2.5rem' }}>{c.emoji}</span>
                            <div>
                                <p style={{
                                    fontFamily: 'Open Sans', fontSize: '0.7rem',
                                    letterSpacing: '0.14em', textTransform: 'uppercase',
                                    color: 'var(--primary)', marginBottom: '0.3rem'
                                }}>{c.subtitle}</p>
                                <h3 style={{
                                    fontFamily: 'Montserrat', fontWeight: 800,
                                    fontSize: '1.55rem', color: 'var(--text)', lineHeight: 1.2
                                }}>{c.title}</h3>
                            </div>
                            <p style={{
                                fontFamily: 'Open Sans', fontSize: '0.9rem',
                                lineHeight: 1.75, color: 'var(--text)', opacity: 0.82
                            }}>{c.desc}</p>
                            <a href="#pedidos" style={{ textDecoration: 'none', marginTop: '0.4rem' }}>
                                <button className="btn-ghost" style={{ fontSize: '0.78rem' }}>
                                    Pedir este producto →
                                </button>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
