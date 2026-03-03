import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PHRASES = [
    { normal: 'No vendemos postres.', drama: 'Creamos recuerdos.' },
    { normal: 'Cada pastel tiene', drama: 'un propósito.' },
    { normal: 'El detalle es', drama: 'nuestro lenguaje.' },
];

export default function ManifiestoParallax() {
    const sectionRef = useRef(null);
    const linesRef = useRef([]);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax bg
            gsap.to(bgRef.current, {
                yPercent: -25,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            });

            // Split text reveal per line
            linesRef.current.forEach((el, i) => {
                if (!el) return;
                const normal = el.querySelector('.line-normal');
                const drama = el.querySelector('.line-drama');

                gsap.from(normal, {
                    x: -80, opacity: 0, duration: 0.9, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 80%' },
                });
                gsap.from(drama, {
                    x: 80, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.15,
                    scrollTrigger: { trigger: el, start: 'top 80%' },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} style={{
            position: 'relative', overflow: 'hidden',
            background: 'var(--primary)',
            padding: '8rem 2rem',
        }}>
            {/* Parallax BG image */}
            <div ref={bgRef} style={{
                position: 'absolute', inset: '-20%',
                backgroundImage: 'url(https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1400&q=70&auto=format)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: 0.12,
            }} />

            {/* Noise on top */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'repeat', opacity: 0.06,
            }} />

            {/* Doodle overlay */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'radial-gradient(rgba(255,231,234,0.18) 1.5px, transparent 1.5px)',
                backgroundSize: '28px 28px',
            }} />

            <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                    fontFamily: 'Open Sans, sans-serif', fontSize: '0.72rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(255,231,234,0.65)', marginBottom: '3.5rem', textAlign: 'center',
                }}>Nuestro manifiesto</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                    {PHRASES.map((p, i) => (
                        <div key={i} ref={el => linesRef.current[i] = el}
                            style={{
                                display: 'flex', flexDirection: 'column', gap: '0.2rem',
                                alignItems: i % 2 === 0 ? 'flex-start' : 'flex-end',
                                textAlign: i % 2 === 0 ? 'left' : 'right',
                                borderBottom: i < PHRASES.length - 1 ? '1px solid rgba(255,231,234,0.15)' : 'none',
                                paddingBottom: '3.5rem',
                            }}
                        >
                            <span className="line-normal" style={{
                                display: 'block',
                                fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                                fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
                                color: 'rgba(255,240,242,0.75)',
                                letterSpacing: '-0.02em', lineHeight: 1.1,
                            }}>{p.normal}</span>
                            <span className="line-drama font-drama" style={{
                                display: 'block', fontStyle: 'italic',
                                fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
                                color: 'var(--white)',
                                lineHeight: 1.05,
                            }}>{p.drama}</span>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <a href="#pedidos" style={{ textDecoration: 'none' }}>
                        <button style={{
                            background: 'var(--white)', color: 'var(--primary)',
                            fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                            fontSize: '0.88rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                            border: 'none', borderRadius: '100px',
                            padding: '1.1rem 2.5rem', cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-3px) scale(1.03)'; e.target.style.boxShadow = '0 14px 40px rgba(0,0,0,0.3)'; }}
                            onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
                        >
                            Hacer realidad mi pedido →
                        </button>
                    </a>
                </div>
            </div>
        </section>
    );
}
