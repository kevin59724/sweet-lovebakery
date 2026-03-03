import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Truck, Cake } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
    {
        icon: <Cake size={28} color="var(--primary)" strokeWidth={1.8} />,
        tag: 'SERVICIO PRINCIPAL',
        title: 'Pasteles de Cumpleaños',
        drama: 'Personalizados',
        body: 'Diseñamos cada pastel desde cero, adaptando temáticas, sabores y tamaños a tu visión. Desde naked cakes florales hasta estructuras de múltiples pisos.',
        img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format',
        badge: 'Desde un día antes',
        accent: '#dd435f',
    },
    {
        icon: <Star size={28} color="var(--primary)" strokeWidth={1.8} />,
        tag: 'LÍNEA GOURMET',
        title: 'Postres & Crumble Cookies',
        drama: 'Al por mayor y menor',
        body: 'Crumble cookies artesanales, cuchareables en tarro, pyes y más postres de autor. Ideales para regalos, eventos o simplemente darte un capricho.',
        img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80&auto=format',
        badge: 'Pide desde 1 unidad',
        accent: '#c73a55',
    },
    {
        icon: <Truck size={28} color="var(--primary)" strokeWidth={1.8} />,
        tag: 'CATERING',
        title: 'Pedidos Corporativos',
        drama: 'Volumen & Eventos',
        body: 'Cerramos caterings para empresas, reuniones y eventos sociales. Menú personalizable, presentación profesional y entrega garantizada.',
        img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&auto=format',
        badge: 'Cotización sin compromiso',
        accent: '#a83049',
    },
];

export default function BarajaDiagnostica() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const [active, setActive] = useState(0);
    const cardRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current.children, {
                y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
                scrollTrigger: { trigger: titleRef.current, start: 'top 80%' },
            });

            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.from(el, {
                    x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 0.7,
                    ease: 'power3.out', delay: i * 0.12,
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                });
            });
        }, sectionRef);

        // Auto-cycle
        const interval = setInterval(() => {
            setActive(prev => (prev + 1) % CARDS.length);
        }, 4000);

        return () => { ctx.revert(); clearInterval(interval); };
    }, []);

    // Animate card swap
    useEffect(() => {
        const el = cardRefs.current[active];
        if (el) {
            gsap.from(el, { scale: 0.96, opacity: 0.6, duration: 0.5, ease: 'power2.out' });
        }
    }, [active]);

    return (
        <section ref={sectionRef} id="menú" style={{
            padding: '7rem 2rem', position: 'relative', overflow: 'hidden',
        }}>
            {/* BG blob */}
            <div style={{
                position: 'absolute', top: '10%', left: '-8%',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249,186,194,0.3) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />

            <div className="section-container">
                {/* Title */}
                <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{
                        fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem',
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'var(--primary)', marginBottom: '0.7rem',
                    }}>Nuestros servicios</p>
                    <h2 style={{
                        fontFamily: 'Montserrat, sans-serif', fontWeight: 900,
                        fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                        color: 'var(--text)', lineHeight: 1.15,
                    }}>
                        Lo que hacemos{' '}
                        <span className="font-drama" style={{
                            fontStyle: 'italic', color: 'var(--primary)',
                            fontSize: '110%',
                        }}>con amor</span>
                    </h2>
                </div>

                {/* Baraja layout */}
                <div className="grid-baraja">
                    {/* Tab selectors */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {CARDS.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                style={{
                                    border: 'none', cursor: 'pointer', textAlign: 'left',
                                    padding: '1.4rem 1.8rem',
                                    borderRadius: '1.8rem',
                                    background: active === i ? 'var(--primary)' : 'var(--white)',
                                    color: active === i ? 'var(--white)' : 'var(--text)',
                                    boxShadow: active === i
                                        ? '0 10px 40px rgba(221,67,95,0.35)'
                                        : '0 4px 20px rgba(119,98,101,0.08)',
                                    transition: 'all 0.35s ease',
                                    transform: active === i ? 'translateX(8px)' : 'translateX(0)',
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                }}
                            >
                                <span style={{
                                    width: '42px', height: '42px', borderRadius: '50%',
                                    background: active === i ? 'rgba(255,255,255,0.2)' : 'rgba(249,186,194,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{ filter: active === i ? 'brightness(10)' : 'none' }}>
                                        {c.icon}
                                    </span>
                                </span>
                                <div>
                                    <div style={{
                                        fontFamily: 'Open Sans', fontSize: '0.68rem',
                                        letterSpacing: '0.12em', textTransform: 'uppercase',
                                        opacity: 0.75, marginBottom: '0.2rem',
                                    }}>{c.tag}</div>
                                    <div style={{
                                        fontFamily: 'Montserrat', fontWeight: 700,
                                        fontSize: '0.95rem', lineHeight: 1.2,
                                    }}>{c.title}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Active card detail */}
                    {CARDS.map((c, i) => (
                        <div
                            key={i}
                            ref={el => cardRefs.current[i] = el}
                            style={{
                                display: active === i ? 'block' : 'none',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px rgba(221,67,95,0.18)',
                            }}
                        >
                            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                                <img src={c.img} alt={c.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to bottom, transparent 50%, rgba(221,67,95,0.6) 100%)',
                                }} />
                                <div style={{
                                    position: 'absolute', bottom: '1.2rem', left: '1.5rem',
                                    background: 'rgba(255,255,255,0.92)', borderRadius: '100px',
                                    padding: '0.35rem 1rem', backdropFilter: 'blur(10px)',
                                }}>
                                    <span style={{
                                        fontFamily: 'Open Sans', fontSize: '0.72rem',
                                        fontWeight: 600, color: 'var(--primary)'
                                    }}>⏰ {c.badge}</span>
                                </div>
                            </div>
                            <div style={{
                                background: 'var(--white)', padding: '2rem',
                            }}>
                                <h3 className="font-drama" style={{
                                    fontStyle: 'italic', fontSize: '2rem',
                                    color: 'var(--primary)', marginBottom: '0.8rem', lineHeight: 1.2,
                                }}>{c.drama}</h3>
                                <p style={{
                                    fontFamily: 'Open Sans', fontSize: '0.95rem',
                                    lineHeight: 1.8, color: 'var(--text)', opacity: 0.9,
                                    marginBottom: '1.5rem',
                                }}>{c.body}</p>
                                <a href="#pedidos" style={{ textDecoration: 'none' }}>
                                    <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.75rem 1.6rem' }}>
                                        Quiero este servicio
                                    </button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
