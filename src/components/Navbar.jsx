import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Heart, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
    const navRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial state synchronously so the element never flashes visible
            gsap.set(navRef.current, { y: -80, opacity: 0 });
            gsap.to(navRef.current, {
                y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 0.4
            });
        }, navRef);

        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => { ctx.revert(); window.removeEventListener('scroll', onScroll); };
    }, []);

    const links = ['Menú', 'Pedidos', 'Nosotras', 'Contacto'];

    return (
        <header
            ref={navRef}
            style={{
                position: 'fixed', top: '1.2rem', left: '50%',
                transform: 'translateX(-50%)', zIndex: 1000,
                width: 'calc(100% - 3rem)', maxWidth: '900px',
                background: scrolled ? 'rgba(255,231,234,0.78)' : 'rgba(255,255,255,0.55)',
                backdropFilter: scrolled ? 'blur(22px)' : 'blur(8px)',
                border: '1.5px solid rgba(249,186,194,0.6)',
                borderRadius: '100px',
                padding: '0.85rem 1.8rem',
                boxShadow: scrolled ? '0 8px 40px rgba(221,67,95,0.15)' : '0 4px 20px rgba(119,98,101,0.08)',
                transition: 'background 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                opacity: 0,  /* GSAP will take over immediately on mount */
            }}
        >
            {/* Logo */}
            <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img
                    src="/slb.png"
                    alt="Sweet & Love Bakery"
                    style={{ height: '42px', width: 'auto', objectFit: 'contain', display: 'block' }}
                />
            </a>

            {/* Desktop links */}
            <nav style={{ display: 'flex', gap: '2rem', listStyle: 'none' }} className="hidden md:flex">
                {links.map(l => (
                    <a key={l} href={`#${l.toLowerCase()}`} style={{
                        fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                        fontSize: '0.82rem', letterSpacing: '0.06em',
                        color: 'var(--text)', textDecoration: 'none',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text)'}
                    >{l}</a>
                ))}
            </nav>

            {/* CTA */}
            <a href="#pedidos" className="hidden md:flex" style={{ textDecoration: 'none' }}>
                <button className="btn-primary" style={{ padding: '0.65rem 1.5rem', fontSize: '0.78rem' }}>
                    <ShoppingBag size={15} /> Reservar
                </button>
            </a>

            {/* Mobile burger */}
            <button
                onClick={() => setOpen(!open)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                className="flex md:hidden"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile menu */}
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 1rem)', left: 0, right: 0,
                    background: 'rgba(255,231,234,0.96)', backdropFilter: 'blur(20px)',
                    borderRadius: '2rem', border: '1.5px solid rgba(249,186,194,0.6)',
                    padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem',
                }}>
                    {links.map(l => (
                        <a key={l} href={`#${l.toLowerCase()}`}
                            onClick={() => setOpen(false)}
                            style={{
                                fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                                fontSize: '0.9rem', color: 'var(--text)', textDecoration: 'none',
                                textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                            {l}
                        </a>
                    ))}
                    <button className="btn-primary" style={{ width: 'fit-content' }}>
                        <Heart size={14} /> Reservar pedido
                    </button>
                </div>
            )}
        </header>
    );
}
