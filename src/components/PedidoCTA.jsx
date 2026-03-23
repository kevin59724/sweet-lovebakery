import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Heart, Instagram, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

gsap.registerPlugin(ScrollTrigger);

export default function PedidoCTA() {
    const { content } = useContent();
    const sectionRef = useRef(null);
    const formRef    = useRef(null);
    const infoRef    = useRef(null);
    const [sent, setSent]   = useState(false);
    const [form, setForm]   = useState({ nombre: '', whatsapp: '', producto: '', detalle: '' });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(infoRef.current.children, { x: -60, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
            gsap.from(formRef.current,          { x: 60,  opacity: 0, duration: 0.9, ease: 'power3.out',                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        const num = content.ctaWhatsapp.replace(/[^0-9]/g, '');
        const template = content.ctaWpMensaje ||
            "Hola Kari's Bakery! Quiero hacer un pedido 🎂\n\n*Nombre:* {nombre}\n*WhatsApp:* {whatsapp}\n*Producto:* {producto}\n*Detalles:* {detalle}";
        const mensaje = template
            .replace('{nombre}',    form.nombre)
            .replace('{whatsapp}',  form.whatsapp)
            .replace('{producto}',  form.producto)
            .replace('{detalle}',   form.detalle);
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`, '_blank');
        setSent(true);
    };

    const inputStyle = {
        width: '100%', border: '1.5px solid rgba(249,186,194,0.6)', borderRadius: '1rem',
        padding: '0.9rem 1.2rem', fontFamily: 'Open Sans, sans-serif', fontSize: '0.9rem',
        color: 'var(--text)', background: 'var(--light)', outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s', boxShadow: 'none',
    };
    const focusOn  = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(221,67,95,0.12)'; };
    const focusOff = e => { e.target.style.borderColor = 'rgba(249,186,194,0.6)'; e.target.style.boxShadow = 'none'; };

    return (
        <section ref={sectionRef} id="pedidos" style={{ padding: '8rem 2rem', position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
            <div style={{ position: 'absolute', top: '5%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,186,194,0.35) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

            <div className="section-container grid-cta">
                {/* Info side */}
                <div ref={infoRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    <div>
                        <p style={{ fontFamily: 'Open Sans', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.7rem' }}>
                            {content.ctaSuper}
                        </p>
                        <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', lineHeight: 1.15 }}>
                            {content.ctaTitulo}{' '}
                            <span className="font-drama" style={{ fontStyle: 'italic', color: 'var(--primary)', fontSize: '115%' }}>{content.ctaDrama}</span>
                        </h2>
                    </div>
                    <p style={{ fontFamily: 'Open Sans', fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text)', opacity: 0.85 }}>
                        {content.ctaDesc}
                    </p>

                    {/* Contact chips */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { icon: <Phone    size={18} color="var(--primary)" />, label: 'WhatsApp', value: content.ctaWhatsapp },
                            { icon: <Instagram size={18} color="var(--primary)" />, label: 'Instagram', value: content.ctaInstagram },
                        ].map(({ icon, label, value }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--white)', borderRadius: '1.2rem', padding: '0.9rem 1.4rem', boxShadow: '0 4px 16px rgba(119,98,101,0.09)', border: '1px solid rgba(249,186,194,0.4)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(249,186,194,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                                <div>
                                    <div style={{ fontFamily: 'Open Sans', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text)', opacity: 0.6 }}>{label}</div>
                                    <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius-sm)', padding: '1.6rem', color: 'var(--white)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', fontFamily: 'Dancing Script', fontSize: '4rem', opacity: 0.2, lineHeight: 1 }}>"</div>
                        <p className="font-drama" style={{ fontStyle: 'italic', fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                            {content.testimonioQuote}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', backgroundImage: 'url(https://i.pravatar.cc/36?img=47)', backgroundSize: 'cover' }} />
                            <div>
                                <div style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.85rem' }}>{content.testimonioAutor}</div>
                                <div style={{ fontFamily: 'Open Sans', fontSize: '0.7rem', opacity: 0.75 }}>★★★★★</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div ref={formRef}>
                    <div className="form-card" style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '2.8rem', boxShadow: '0 20px 60px rgba(119,98,101,0.12)', border: '1px solid rgba(249,186,194,0.35)' }}>
                        {sent ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <span style={{ fontSize: '3.5rem' }}>🎂</span>
                                <h3 className="font-drama" style={{ fontStyle: 'italic', fontSize: '2rem', color: 'var(--primary)', margin: '1rem 0 0.5rem' }}>
                                    {content.formConfTitulo}
                                </h3>
                                <p style={{ fontFamily: 'Open Sans', fontSize: '0.95rem', color: 'var(--text)', opacity: 0.8, lineHeight: 1.7 }}>
                                    {content.formConfTexto}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.4rem' }}>
                                    {content.formTitulo} <Heart size={16} color="var(--primary)" fill="var(--primary)" style={{ display: 'inline', marginLeft: '0.5rem' }} />
                                </h3>
                                <div className="grid-form-row">
                                    <div>
                                        <label style={{ fontFamily: 'Open Sans', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.7, display: 'block', marginBottom: '0.4rem' }}>{content.formLabelNombre}</label>
                                        <input type="text" name="nombre" required placeholder={content.formPhNombre} value={form.nombre} onChange={handleChange} style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
                                    </div>
                                    <div>
                                        <label style={{ fontFamily: 'Open Sans', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.7, display: 'block', marginBottom: '0.4rem' }}>{content.formLabelWsp}</label>
                                        <input type="tel" name="whatsapp" required placeholder={content.formPhWsp} value={form.whatsapp} onChange={handleChange} style={inputStyle} onFocus={focusOn} onBlur={focusOff} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontFamily: 'Open Sans', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.7, display: 'block', marginBottom: '0.4rem' }}>{content.formLabelProd}</label>
                                    <select name="producto" required style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.producto} onChange={handleChange} onFocus={focusOn} onBlur={focusOff}>
                                        <option value="">{content.formOptDefault}</option>
                                        <option>{content.p1Titulo}</option>
                                        <option>{content.p2Titulo}</option>
                                        <option>{content.p3Titulo}</option>
                                        <option>{content.p4Titulo}</option>
                                        <option>{content.s3Titulo}</option>
                                        <option>Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontFamily: 'Open Sans', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', opacity: 0.7, display: 'block', marginBottom: '0.4rem' }}>{content.formLabelDetalle}</label>
                                    <textarea name="detalle" required rows={4} placeholder={content.formPhDetalle} value={form.detalle} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} onFocus={focusOn} onBlur={focusOff} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Send size={16} /> {content.ctaFormBtn}
                                </button>
                                <p style={{ fontFamily: 'Open Sans', fontSize: '0.7rem', textAlign: 'center', color: 'var(--text)', opacity: 0.55, lineHeight: 1.5 }}>
                                    {content.ctaRespuesta}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
