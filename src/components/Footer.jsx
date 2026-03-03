import { Instagram, Heart, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const links = {
        Productos: ['Crumble Cookies', 'Cuchareables', 'Pyes & Tartas', 'Pasteles Personalizados'],
        Servicios: ['Pedidos al por mayor', 'Catering & Eventos', 'Corporativo', 'Consultas gratis'],
        'Sweet & Love': ['Nuestra historia', 'Galería', 'Reseñas', 'Políticas de pedido'],
    };

    return (
        <footer style={{
            background: 'var(--text)',
            color: 'rgba(255,231,234,0.8)',
            padding: '5rem 2rem 2.5rem',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Top doodle line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: 'linear-gradient(90deg, var(--primary), var(--accent), var(--primary))',
            }} />

            {/* Noise */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'repeat',
            }} />

            <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="grid-footer">
                    {/* Brand */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src="/slb.png"
                                alt="Sweet & Love Bakery"
                                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
                            />
                        </div>
                        <p style={{
                            fontFamily: 'Open Sans', fontSize: '0.88rem', lineHeight: 1.75,
                            color: 'rgba(255,231,234,0.65)', maxWidth: '240px'
                        }}>
                            Bakery artesanal en Lima, Perú. Postres personalizados que
                            convierten cada celebración en un recuerdo.
                        </p>
                        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: <Instagram size={18} />, label: '@sweet_love.bakery' },
                                { icon: <Phone size={18} />, label: 'WhatsApp' },
                            ].map(({ icon, label }) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                                    background: 'rgba(249,186,194,0.12)', borderRadius: '100px',
                                    padding: '0.4rem 0.9rem', color: 'var(--accent)',
                                    fontFamily: 'Open Sans', fontSize: '0.72rem', cursor: 'pointer',
                                    transition: 'background 0.2s',
                                }}>
                                    {icon} {label}
                                </div>
                            ))}
                        </div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontFamily: 'Open Sans', fontSize: '0.75rem',
                            color: 'rgba(255,231,234,0.5)'
                        }}>
                            <MapPin size={13} /> Lima, Perú
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 style={{
                                fontFamily: 'Montserrat', fontWeight: 700,
                                fontSize: '0.78rem', letterSpacing: '0.12em',
                                textTransform: 'uppercase', color: 'var(--accent)',
                                marginBottom: '1.2rem'
                            }}>{section}</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" style={{
                                            fontFamily: 'Open Sans', fontSize: '0.83rem',
                                            color: 'rgba(255,231,234,0.6)', textDecoration: 'none',
                                            transition: 'color 0.2s',
                                        }}
                                            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                                            onMouseLeave={e => e.target.style.color = 'rgba(255,231,234,0.6)'}
                                        >{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(249,186,194,0.12)',
                    paddingTop: '2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '1rem',
                }}>
                    <p style={{
                        fontFamily: 'Open Sans', fontSize: '0.75rem',
                        color: 'rgba(255,231,234,0.4)'
                    }}>
                        © 2025 Sweet & Love Bakery. Todos los derechos reservados.
                    </p>
                    <p style={{
                        fontFamily: 'Open Sans', fontSize: '0.75rem',
                        color: 'rgba(255,231,234,0.4)',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                    }}>
                        Hecho con <Heart size={12} color="var(--primary)" fill="var(--primary)" /> en Lima, Perú.
                    </p>
                </div>
            </div>
        </footer>
    );
}
