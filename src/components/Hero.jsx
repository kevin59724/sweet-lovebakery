import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, ChevronDown } from 'lucide-react';
import { useContent } from '../context/ContentContext';

function DoodleShape({ style, type = 'star' }) {
    const shapes = { star: '✦', heart: '♡', dot: '●', flower: '✿', spark: '✸' };
    return (
        <span style={{
            position: 'absolute', userSelect: 'none', pointerEvents: 'none',
            color: 'var(--accent)', opacity: 0.65, fontSize: '1.2rem',
            fontFamily: 'serif', ...style,
        }}>{shapes[type]}</span>
    );
}

export default function Hero() {
    const { content } = useContent();
    const heroRef  = useRef(null);
    const headRef  = useRef(null);
    const subRef   = useRef(null);
    const ctaRef   = useRef(null);
    const imgRef   = useRef(null);
    const doodlesRef = useRef([]);

    const headWords  = content.heroWords.split(' ');
    const dramaWord  = content.heroDrama;

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            tl.from(headRef.current.querySelectorAll('.word'), {
                y: 80, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.8
            })
                .from(subRef.current,           { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
                .from(ctaRef.current.children,  { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
                .from(imgRef.current,           { scale: 0.82, opacity: 0, duration: 1.1, ease: 'back.out(1.4)' }, '-=0.8');

            gsap.from(doodlesRef.current, {
                scale: 0, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'back.out(2)', delay: 1.4,
            });
            doodlesRef.current.forEach((el, i) => {
                if (!el) return;
                gsap.to(el, {
                    y: `${i % 2 === 0 ? -14 : 14}`, x: `${i % 3 === 0 ? 8 : -8}`,
                    rotation: `${(i % 2 === 0 ? 1 : -1) * 12}`,
                    duration: 2.5 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut',
                });
            });

            const onMove = (e) => {
                const { clientX, clientY } = e;
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                gsap.to(imgRef.current, {
                    x: (clientX - cx) * 0.025, y: (clientY - cy) * 0.025,
                    duration: 0.9, ease: 'power1.out',
                });
            };
            heroRef.current?.addEventListener('mousemove', onMove);
        }, heroRef);
        return () => ctx.revert();
    }, [content.heroWords]); // re-run if words change

    const stats = [
        { num: content.heroStat1Num, label: content.heroStat1Label },
        { num: content.heroStat2Num, label: content.heroStat2Label },
        { num: content.heroStat3Num, label: content.heroStat3Label },
    ];

    return (
        <section ref={heroRef} style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            padding: '8rem 2rem 4rem', position: 'relative', overflow: 'hidden',
        }}>
            {/* BG blobs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,186,194,0.45) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-5%', left: '-5%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(221,67,95,0.12) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />

            {/* Doodles */}
            {[
                { style: { top: '18%', left: '8%', fontSize: '1.6rem' }, type: 'heart' },
                { style: { top: '12%', right: '28%', fontSize: '1rem' }, type: 'star' },
                { style: { top: '38%', left: '15%', fontSize: '0.9rem' }, type: 'dot' },
                { style: { top: '65%', right: '15%', fontSize: '1.3rem' }, type: 'flower' },
                { style: { bottom: '22%', left: '30%', fontSize: '1rem' }, type: 'spark' },
                { style: { top: '25%', right: '10%', fontSize: '0.8rem' }, type: 'dot' },
                { style: { bottom: '35%', right: '32%', fontSize: '1.4rem' }, type: 'heart' },
            ].map((d, i) => (
                <span key={i} ref={el => doodlesRef.current[i] = el}
                    style={{ position: 'absolute', userSelect: 'none', pointerEvents: 'none', color: 'var(--accent)', opacity: 0.65, fontSize: d.style.fontSize, ...d.style }}>
                    {{ heart: '♡', star: '✦', dot: '●', flower: '✿', spark: '✸' }[d.type]}
                </span>
            ))}

            <div className="doodle-dots" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

            <div className="section-container grid-hero">
                {/* Text side */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(249,186,194,0.35)', borderRadius: '100px',
                        padding: '0.4rem 1.1rem', marginBottom: '1.5rem',
                        border: '1px solid rgba(221,67,95,0.2)',
                    }}>
                        <Heart size={13} color="var(--primary)" fill="var(--primary)" />
                        <span style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {content.heroBadge}
                        </span>
                    </div>

                    <h1 ref={headRef} style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 900, lineHeight: 1.1, fontSize: 'clamp(2.8rem, 5vw, 4.4rem)', color: 'var(--text)', overflow: 'hidden', marginBottom: '0.4rem' }}>
                        {headWords.map((w, i) => (
                            <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{w}</span>
                        ))}
                        <br />
                        <span className="word font-drama" style={{ display: 'inline-block', fontStyle: 'italic', fontSize: 'clamp(3rem, 5.5vw, 5rem)', color: 'var(--primary)' }}>
                            {dramaWord}
                        </span>
                    </h1>

                    <p ref={subRef} style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text)', maxWidth: '420px', marginTop: '1.4rem', marginBottom: '2.4rem', opacity: 0.88 }}>
                        {content.heroSubtitle}
                    </p>

                    <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <a href="#pedidos" style={{ textDecoration: 'none' }}>
                            <button className="btn-primary">
                                <Heart size={16} fill="rgba(255,255,255,0.6)" />
                                {content.heroCta1}
                            </button>
                        </a>
                        <a href="#menú" style={{ textDecoration: 'none' }}>
                            <button className="btn-ghost">{content.heroCta2}</button>
                        </a>
                    </div>

                    <div className="hero-stats" style={{ marginTop: '3rem', display: 'flex', gap: '2.5rem' }}>
                        {stats.map(({ num, label }) => (
                            <div key={label}>
                                <div style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.45rem', color: 'var(--primary)', lineHeight: 1 }}>{num}</div>
                                <div style={{ fontFamily: 'Open Sans', fontSize: '0.72rem', color: 'var(--text)', opacity: 0.7, letterSpacing: '0.04em', marginTop: '0.2rem' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image side */}
                <div ref={imgRef} className="hero-img-col" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', inset: '-20px', border: '2px dashed rgba(249,186,194,0.7)', borderRadius: '50%', animation: 'spin 30s linear infinite' }} />
                    <div style={{ width: 'clamp(280px, 38vw, 440px)', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: '6px solid var(--white)', boxShadow: '0 20px 80px rgba(221,67,95,0.22), 0 0 0 2px var(--accent)', position: 'relative' }}>
                        <img src={content.heroImgUrl} alt="postres Kari's Bakery" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '10%', left: '0', background: 'var(--white)', borderRadius: '1.5rem', padding: '0.9rem 1.3rem', boxShadow: '0 8px 30px rgba(221,67,95,0.18)', border: '1px solid rgba(249,186,194,0.5)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>🎂</span>
                        <div>
                            <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{content.heroBadgeFloat}</div>
                            <div style={{ fontFamily: 'Open Sans', fontSize: '0.7rem', color: 'var(--text)', opacity: 0.8 }}>{content.heroBadgeSub}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', animation: 'bounceY 2s ease-in-out infinite', opacity: 0.55 }}>
                <span style={{ fontFamily: 'Open Sans', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text)' }}>Descubrir</span>
                <ChevronDown size={18} color="var(--primary)" />
            </div>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounceY { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
      `}</style>
        </section>
    );
}
