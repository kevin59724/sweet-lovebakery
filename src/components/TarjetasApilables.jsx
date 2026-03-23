import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function TarjetasApilables() {
    const { content } = useContent();
    const outerRef  = useRef(null);
    const stickyRef = useRef(null);
    const titleRef  = useRef(null);
    const cardRefs  = useRef([]);

    const CARDS = [
        { emoji: '🍪', title: content.p1Titulo, subtitle: content.p1Subtitle, desc: content.p1Desc, img: content.p1Img, tag: content.p1Tag, bg: '#fff0f2' },
        { emoji: '🍮', title: content.p2Titulo, subtitle: content.p2Subtitle, desc: content.p2Desc, img: content.p2Img, tag: content.p2Tag, bg: '#fdf4f5' },
        { emoji: '🥧', title: content.p3Titulo, subtitle: content.p3Subtitle, desc: content.p3Desc, img: content.p3Img, tag: content.p3Tag, bg: '#fff5f6' },
        { emoji: '🎂', title: content.p4Titulo, subtitle: content.p4Subtitle, desc: content.p4Desc, img: content.p4Img, tag: content.p4Tag, bg: '#fef0f2' },
    ];
    const N = CARDS.length;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(titleRef.current.children, {
                y: 40, opacity: 0, duration: 0.75, stagger: 0.12,
                scrollTrigger: { trigger: titleRef.current, start: 'top 82%' },
            });
            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.set(el, { y: i === 0 ? 0 : '72vh', scale: 1, opacity: i === 0 ? 1 : 0, filter: 'blur(0px)' });
            });
            ScrollTrigger.create({
                trigger: outerRef.current, start: 'top top', end: 'bottom bottom', scrub: 1,
                onUpdate(self) {
                    const p = self.progress;
                    const step = 1 / (N - 1);
                    cardRefs.current.forEach((el, i) => {
                        if (!el) return;
                        const enterStart = (i - 1) * step;
                        const peak = i * step;
                        const exitEnd = (i + 1) * step;
                        if (i === 0) {
                            const t = Math.min(1, p / step);
                            gsap.set(el, { y: 0, scale: 1 - t * 0.08, filter: `blur(${t * 10}px)`, opacity: p < exitEnd ? Math.max(0, 1 - t * 0.7) : 0 });
                        } else if (i === N - 1) {
                            if (p >= enterStart) {
                                const t = Math.min(1, (p - enterStart) / step);
                                gsap.set(el, { y: `${(1 - t) * 72}vh`, opacity: Math.min(1, t * 2), scale: 1, filter: 'blur(0px)' });
                            }
                        } else {
                            if (p < enterStart) {
                                gsap.set(el, { y: '72vh', opacity: 0, scale: 1, filter: 'blur(0px)' });
                            } else if (p >= enterStart && p < peak) {
                                const t = (p - enterStart) / step;
                                gsap.set(el, { y: `${(1 - t) * 72}vh`, opacity: Math.min(1, t * 2), scale: 1, filter: 'blur(0px)' });
                            } else if (p >= peak && p < exitEnd) {
                                const t = (p - peak) / step;
                                gsap.set(el, { y: 0, scale: 1 - t * 0.08, filter: `blur(${t * 10}px)`, opacity: Math.max(0, 1 - t * 0.7) });
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
        <section id="menú-productos" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--light) 100%)' }}>
            <div ref={titleRef} style={{ textAlign: 'center', padding: '6rem 2rem 4rem' }}>
                <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.7rem' }}>
                    {content.productosSuper}
                </p>
                <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text)' }}>
                    {content.productosTitulo}{' '}
                    <span className="font-drama" style={{ fontStyle: 'italic', color: 'var(--primary)' }}>{content.productosDrama}</span>
                </h2>
                <p style={{ fontFamily: 'Open Sans', fontSize: '0.95rem', color: 'var(--text)', opacity: 0.75, maxWidth: '460px', margin: '0.8rem auto 0', lineHeight: 1.7 }}>
                    {content.productosDesc}
                </p>
            </div>

            <div ref={outerRef} style={{ height: `${N * 100}vh`, position: 'relative' }}>
                <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '0 2rem', background: 'linear-gradient(180deg, var(--bg) 0%, var(--light) 100%)' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '860px' }}>
                        {CARDS.map((c, i) => (
                            <div key={i} ref={el => cardRefs.current[i] = el} className="product-card"
                                style={{
                                    ...(i > 0 ? { position: 'absolute', top: 0, left: 0, right: 0 } : {}),
                                    zIndex: i + 1, background: c.bg,
                                    gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr',
                                    transformOrigin: 'center center', willChange: 'transform, opacity, filter',
                                }}>
                                <div className="product-card-img" style={{ order: i % 2 === 0 ? 2 : 1, position: 'relative', overflow: 'hidden' }}>
                                    <img src={c.img} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(221,67,95,0.9)', color: '#fff', fontFamily: 'Open Sans', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 0.9rem', borderRadius: '100px' }}>{c.tag}</div>
                                </div>
                                <div className="product-card-content" style={{ order: i % 2 === 0 ? 1 : 2, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.8rem' }}>
                                    <span style={{ fontSize: '2.5rem' }}>{c.emoji}</span>
                                    <div>
                                        <p style={{ fontFamily: 'Open Sans', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.3rem' }}>{c.subtitle}</p>
                                        <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.55rem', color: 'var(--text)', lineHeight: 1.2 }}>{c.title}</h3>
                                    </div>
                                    <p style={{ fontFamily: 'Open Sans', fontSize: '0.9rem', lineHeight: 1.75, color: 'var(--text)', opacity: 0.82 }}>{c.desc}</p>
                                    <a href="#pedidos" style={{ textDecoration: 'none', marginTop: '0.4rem' }}>
                                        <button className="btn-ghost" style={{ fontSize: '0.78rem' }}>Pedir este producto →</button>
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
