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

const N = CARDS.length;

export default function TarjetasApilables() {
    const outerRef = useRef(null);   // tall scroll driver
    const stickyRef = useRef(null);   // 100vh sticky viewport
    const titleRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Title entrance ── */
            gsap.from(titleRef.current.children, {
                y: 40, opacity: 0, duration: 0.75, stagger: 0.12,
                scrollTrigger: { trigger: titleRef.current, start: 'top 82%' },
            });

            /* ── Initial states ── */
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.set(el, {
                    y: i === 0 ? 0 : '72vh', // cards 1-3 start just below the sticky viewport clip boundary
                    scale: 1,
                    opacity: i === 0 ? 1 : 0,
                    filter: 'blur(0px)',
                });
            });

            /* ── Single ScrollTrigger drives everything ── */
            ScrollTrigger.create({
                trigger: outerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                onUpdate(self) {
                    const p = self.progress;              // 0 → 1
                    const step = 1 / (N - 1);               // progress per card transition

                    cardRefs.current.forEach((el, i) => {
                        if (!el) return;

                        const enterStart = (i - 1) * step;  // when card starts rising
                        const peak = i * step;         // card is fully in view
                        const exitEnd = (i + 1) * step;  // card fully gone

                        /* ── FIRST card: starts visible, only recedes ── */
                        if (i === 0) {
                            const t = Math.min(1, p / step);
                            gsap.set(el, {
                                y: 0,
                                scale: 1 - t * 0.08,
                                filter: `blur(${t * 10}px)`,
                                opacity: p < exitEnd ? Math.max(0, 1 - t * 0.7) : 0,
                            });

                            /* ── LAST card: enters and stays ── */
                        } else if (i === N - 1) {
                            if (p >= enterStart) {
                                const t = Math.min(1, (p - enterStart) / step);
                                gsap.set(el, {
                                    y: `${(1 - t) * 72}vh`,
                                    opacity: Math.min(1, t * 2),
                                    scale: 1,
                                    filter: 'blur(0px)',
                                });
                            }

                            /* ── MIDDLE cards: enter then recede ── */
                        } else {
                            if (p < enterStart) {
                                // Below viewport, not yet visible
                                gsap.set(el, { y: '72vh', opacity: 0, scale: 1, filter: 'blur(0px)' });

                            } else if (p >= enterStart && p < peak) {
                                // ENTERING from below — slides up over the previous card
                                const t = (p - enterStart) / step;
                                gsap.set(el, {
                                    y: `${(1 - t) * 72}vh`,
                                    opacity: Math.min(1, t * 2),
                                    scale: 1,
                                    filter: 'blur(0px)',
                                });

                            } else if (p >= peak && p < exitEnd) {
                                // RECEDING — scale + blur while fully in view
                                const t = (p - peak) / step;
                                gsap.set(el, {
                                    y: 0,
                                    scale: 1 - t * 0.08,
                                    filter: `blur(${t * 10}px)`,
                                    opacity: Math.max(0, 1 - t * 0.7),
                                });

                            } else {
                                gsap.set(el, { opacity: 0 });
                            }
                        }
                    });
                },
            });
        }, outerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="menú-productos" style={{
            background: 'linear-gradient(180deg, var(--bg) 0%, var(--light) 100%)',
        }}>
            {/* Title — above the sticky zone */}
            <div ref={titleRef} style={{
                textAlign: 'center', padding: '6rem 2rem 4rem',
            }}>
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

            {/* ── SCROLL DRIVER: N × 100vh tall ── */}
            <div ref={outerRef} style={{ height: `${N * 100}vh`, position: 'relative' }}>

                {/* ── STICKY VIEWPORT: clips and centers all cards ── */}
                <div ref={stickyRef} style={{
                    position: 'sticky', top: 0,
                    height: '100vh',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '0 2rem',
                    background: 'linear-gradient(180deg, var(--bg) 0%, var(--light) 100%)',
                }}>
                    {/* Cards container — sized by card 0; others are absolute stacked on top */}
                    <div style={{
                        position: 'relative',
                        width: '100%', maxWidth: '860px',
                    }}>
                        {CARDS.map((c, i) => (
                            <div
                                key={i}
                                ref={el => cardRefs.current[i] = el}
                                className="product-card"
                                style={{
                                    /* Card 0 defines the container height (in flow).
                                       Cards 1-3 are absolute overlays stacked on top. */
                                    ...(i > 0 ? {
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0,
                                    } : {}),
                                    zIndex: i + 1,
                                    background: c.bg,
                                    gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                                    transformOrigin: 'center center',
                                    willChange: 'transform, opacity, filter',
                                }}
                            >
                                {/* Image */}
                                <div className="product-card-img" style={{
                                    order: i % 2 === 0 ? 2 : 1,
                                    position: 'relative', overflow: 'hidden',
                                }}>
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
                                <div className="product-card-content" style={{
                                    order: i % 2 === 0 ? 1 : 2,
                                    padding: '2.5rem',
                                    display: 'flex', flexDirection: 'column',
                                    justifyContent: 'center', gap: '0.8rem',
                                }}>
                                    <span style={{ fontSize: '2.5rem' }}>{c.emoji}</span>
                                    <div>
                                        <p style={{
                                            fontFamily: 'Open Sans', fontSize: '0.7rem',
                                            letterSpacing: '0.14em', textTransform: 'uppercase',
                                            color: 'var(--primary)', marginBottom: '0.3rem',
                                        }}>{c.subtitle}</p>
                                        <h3 style={{
                                            fontFamily: 'Montserrat', fontWeight: 800,
                                            fontSize: '1.55rem', color: 'var(--text)', lineHeight: 1.2,
                                        }}>{c.title}</h3>
                                    </div>
                                    <p style={{
                                        fontFamily: 'Open Sans', fontSize: '0.9rem',
                                        lineHeight: 1.75, color: 'var(--text)', opacity: 0.82,
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
                </div>
            </div>

            <div style={{ paddingBottom: '5rem' }} />
        </section>
    );
}
