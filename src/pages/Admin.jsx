import React, { useState, useEffect } from 'react';
import {
  Settings, ImageIcon, Type, Palette, Save,
  ChevronRight, Sparkles, Eye, LayoutGrid, ChevronDown, ChevronUp,
  Phone, Instagram, Star, UserPlus, Menu, X as XIcon
} from 'lucide-react';
import { useContent, DEFAULTS } from '../context/ContentContext';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import UsuariosTab from './UsuariosTab';

/* ════════════════════════════════════════════════════════════
   ESTILOS SCOPED (reutiliza la paleta del sitio)
════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@300;400;600&display=swap');

  .ap * { box-sizing: border-box; margin: 0; padding: 0; }
  .ap { font-family: 'Montserrat', sans-serif; min-height: 100vh; background: #ffe7ea; color: #776265; }

  /* Noise overlay */
  .ap::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  /* Sidebar tab */
  .ap-tab {
    display: flex; align-items: center; gap: .75rem;
    padding: .8rem 1rem; border-radius: 1rem;
    font-size: .85rem; font-weight: 600; color: #aa8286;
    cursor: pointer; transition: all .2s ease;
    border: 1.5px solid transparent; background: transparent; width: 100%; text-align: left;
  }
  .ap-tab:hover { background: #fff0f2; color: #dd435f; }
  .ap-tab.active { background: #fff8f9; border-color: #f9bac2; color: #dd435f; box-shadow: 0 4px 18px rgba(221,67,95,.1); }

  /* Accordion */
  .ap-accordion-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1rem 1.2rem; border-radius: 1rem; cursor: pointer;
    background: #fff0f2; border: 1.5px solid #f9bac2;
    font-weight: 700; font-size: .88rem; color: #dd435f;
    transition: background .2s ease; margin-bottom: .5rem;
    user-select: none;
  }
  .ap-accordion-header:hover { background: #ffe0e4; }
  .ap-accordion-body { margin-bottom: 1rem; }

  /* Input */
  .ap-input {
    width: 100%; background: #fff8f9; border: 1.5px solid #f9bac2;
    border-radius: .9rem; padding: .75rem 1rem;
    font-family: 'Montserrat', sans-serif; font-size: .88rem; color: #776265;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .ap-input:focus { border-color: #dd435f; box-shadow: 0 0 0 3px rgba(221,67,95,.1); }
  .ap-input::placeholder { color: #c9a0a8; }
  .ap-ta { resize: vertical; min-height: 78px; }

  /* Label */
  .ap-label {
    display: block; font-size: .7rem; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase; color: #aa8286; margin-bottom: .4rem;
  }

  /* Field wrapper */
  .ap-field { margin-bottom: 1.1rem; }

  /* Color swatch row */
  .ap-cswatch {
    display: flex; align-items: center; gap: 1rem;
    background: #fff8f9; border: 1.5px solid #f9bac2;
    border-radius: .9rem; padding: .65rem 1rem; transition: border-color .2s;
  }
  .ap-cswatch:hover { border-color: #dd435f; }

  /* Drop zone */
  .ap-drop {
    border: 2px dashed #f9bac2; border-radius: 1.4rem; padding: 2rem 1rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; cursor: pointer; transition: all .22s ease; background: #fff8f9;
  }
  .ap-drop:hover { border-color: #dd435f; background: #fff0f2; transform: translateY(-2px); }

  /* Save button */
  .ap-save {
    display: inline-flex; align-items: center; gap: .45rem;
    background: #dd435f; color: #fff8f9;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: .8rem;
    letter-spacing: .08em; text-transform: uppercase;
    border: none; border-radius: 100px; padding: .8rem 1.8rem; cursor: pointer;
    transition: transform .2s, box-shadow .2s;
    box-shadow: 0 6px 24px rgba(221,67,95,.35);
  }
  .ap-save:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 10px 32px rgba(221,67,95,.45); }
  .ap-save.ok { background: #5aaa7e; box-shadow: 0 6px 24px rgba(90,170,126,.35); }

  /* Divider */
  .ap-hr { border: none; border-top: 1.5px solid rgba(249,186,194,.45); margin: 1.4rem 0; }

  /* Image preview thumb */
  .ap-thumb { width: 80px; height: 56px; border-radius: .7rem; object-fit: cover; border: 2px solid #f9bac2; flex-shrink: 0; }

  /* Dot decoration */
  .ap-dots {
    background-image: radial-gradient(#f9bac2 1.5px, transparent 1.5px);
    background-size: 20px 20px; opacity: .35;
  }

  /* Scrollbar */
  .ap-scroll::-webkit-scrollbar { width: 5px; }
  .ap-scroll::-webkit-scrollbar-track { background: #ffe7ea; }
  .ap-scroll::-webkit-scrollbar-thumb { background: #f9bac2; border-radius: 100px; }

  /* Pill */
  .ap-pill {
    display: inline-flex; align-items: center; gap: .35rem;
    font-size: .68rem; font-weight: 700; letter-spacing: .09em; text-transform: uppercase;
    color: #dd435f; background: #fff0f2; border: 1.5px solid #f9bac2;
    border-radius: 100px; padding: .28rem .8rem; text-decoration: none;
    transition: background .2s;
  }
  .ap-pill:hover { background: #ffe0e4; }

  /* Live preview box */
  .ap-preview {
    background: #ffe7ea; border-radius: 1rem; padding: 1.2rem 1.4rem;
    border: 1.5px solid #f9bac2; margin-top: .6rem;
  }
  .ap-preview-label {
    font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: #aa8286; margin-bottom: .7rem;
  }

  /* Quick color palette */
  .ap-swatch-btn {
    width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.14); transition: transform .15s ease;
    padding: 0; border: 2.5px solid transparent;
  }
  .ap-swatch-btn:hover { transform: scale(1.15); }
  .ap-swatch-btn.selected { border-color: #776265; }

  /* ── Hamburger (mobile only) ── */
  .ap-menu-btn {
    display: none; background: none; border: 1.5px solid #f9bac2;
    border-radius: .7rem; cursor: pointer; padding: .42rem .55rem;
    color: #dd435f; align-items: center; justify-content: center; transition: all .2s;
  }
  .ap-menu-btn:hover { background: #fff0f2; }

  /* ── Overlay (mobile sidebar backdrop) ── */
  .ap-overlay {
    display: none; position: fixed; inset: 0; z-index: 40;
    background: rgba(80,30,40,.35); backdrop-filter: blur(2px);
    cursor: pointer;
  }
  .ap-overlay.open { display: block; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    /* Hamburger visible */
    .ap-menu-btn { display: flex !important; }

    /* Layout: single column */
    .ap-layout {
      grid-template-columns: 1fr !important;
      gap: 0 !important;
      padding: 1.2rem 1rem 5rem !important;
    }

    /* Sidebar: fixed drawer */
    .ap-sidebar {
      position: fixed !important;
      top: 66px; left: 0; bottom: 0; width: 270px; z-index: 45;
      background: #ffe7ea; overflow-y: auto; padding: 1.2rem;
      transform: translateX(-110%);
      transition: transform .32s cubic-bezier(.4,0,.2,1);
      border-right: 1.5px solid #f9bac2;
      box-shadow: 4px 0 28px rgba(221,67,95,.12);
    }
    .ap-sidebar.open { transform: translateX(0); }

    /* Main content: reduce padding + radius */
    .ap-main {
      padding: 1.4rem 1.1rem !important;
      border-radius: 1.4rem !important;
    }

    /* Header: reduce padding */
    .ap-header { padding: 0 1rem !important; }

    /* Hide desktop-only items */
    .ap-desk-only { display: none !important; }
  }

  @media (max-width: 480px) {
    /* Save button: icon only */
    .ap-save-label { display: none !important; }
  }
`;

/* ════════════════════════════════════════════════════════════
   SECCIÓN ACORDEÓN
════════════════════════════════════════════════════════════ */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div className="ap-accordion-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && <div className="ap-accordion-body">{children}</div>}
    </div>
  );
}

/* ── Wrapper de campo ── */
function Field({ label, children }) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      {children}
    </div>
  );
}

/* ── Dropzone ── */
function ImgField({ label, currentUrl }) {
  return (
    <div className="ap-field">
      <label className="ap-label">{label}</label>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '.5rem' }}>
        {currentUrl && <img src={currentUrl} className="ap-thumb" alt="" />}
        <div style={{ fontSize: '.78rem', color: '#aa8286' }}>URL actual (Unsplash / Firebase Storage)</div>
      </div>
      <div className="ap-drop"
        onClick={() => {
          const inp = document.createElement('input');
          inp.type = 'file'; inp.accept = 'image/*'; inp.click();
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: '#fff0f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '.7rem', border: '1.5px solid #f9bac2',
        }}>
          <ImageIcon size={20} color="#dd435f" />
        </div>
        <p style={{ fontWeight: 700, color: '#dd435f', fontSize: '.85rem', marginBottom: '.2rem' }}>
          Toca para elegir una foto
        </p>
        <p style={{ fontSize: '.73rem', color: '#aa8286' }}>PNG, JPG o WEBP · Máx 3 MB</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   PANEL PRINCIPAL
──────────────────────────────────────────────────────────── */
export default function Admin() {
  const { content: remoteContent, saveContent } = useContent();
  const [c, setC]     = useState(DEFAULTS);
  const [tab,     setTab]     = useState('colores');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [userName, setUserName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Carga el nombre del usuario logueado desde Firestore
  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    getDoc(doc(db, 'usuarios', u.uid)).then(snap => {
      if (snap.exists()) setUserName(snap.data().nombre || u.email.split('@')[0]);
      else setUserName(u.displayName || u.email.split('@')[0]);
    }).catch(() => {
      setUserName(u.displayName || u.email.split('@')[0]);
    });
  }, []);

  // Cuando Firestore cargue los datos remotos, sincronizamos el form
  useEffect(() => { setC(remoteContent); }, [remoteContent]);

  const set = (key, val) => { setC(prev => ({ ...prev, [key]: val })); setSaved(false); };
  const inp = (key) => ({ className: 'ap-input', value: c[key] ?? '', onChange: e => set(key, e.target.value) });
  const ta  = (key) => ({ className: 'ap-input ap-ta', value: c[key] ?? '', onChange: e => set(key, e.target.value) });

  // Convierte URL de Drive SOLO cuando el texto es una URL completa de Drive
  const convertDriveUrl = (url) => {
    const m1 = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/);
    if (m1) return `https://drive.google.com/thumbnail?id=${m1[1]}&sz=w1200`;
    const m2 = url.match(/drive\.google\.com\/[^?]*[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (m2) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w1200`;
    return url;
  };

  // Componente de campo de imagen reutilizable
  const ImageUrlField = ({ imgKey, label }) => {
    const [localVal, setLocalVal] = React.useState(c[imgKey] ?? '');
    const [uploading, setUploading] = React.useState(false);

    React.useEffect(() => { setLocalVal(c[imgKey] ?? ''); }, [c[imgKey]]);

    // Comprime imagen a base64 usando Canvas
    const compressAndEncode = (file) => new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        let w = img.width, h = img.height;
        if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = URL.createObjectURL(file);
    });

    const handleFile = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const dataUrl = await compressAndEncode(file);
        setLocalVal(dataUrl);
        set(imgKey, dataUrl);
      } catch (err) {
        alert('Error al procesar la imagen: ' + err.message);
      } finally {
        setUploading(false);
      }
    };

    const handlePaste = (e) => {
      const pasted = e.clipboardData.getData('text');
      const converted = convertDriveUrl(pasted);
      setLocalVal(converted);
      set(imgKey, converted);
      e.preventDefault();
    };

    const handleBlur = () => {
      const converted = convertDriveUrl(localVal);
      if (converted !== localVal) {
        setLocalVal(converted);
        set(imgKey, converted);
      } else {
        set(imgKey, localVal);
      }
    };

    const currentImg = c[imgKey];
    const isBase64 = currentImg?.startsWith('data:');

    return (
      <div className="ap-field">
        <label className="ap-label">{label}</label>

        {/* Preview */}
        {currentImg && (
          <div style={{ marginBottom: '.8rem' }}>
            <img src={currentImg} className="ap-thumb"
              style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: '1rem' }}
              alt="" onError={e => e.target.style.opacity = 0.3} />
            {isBase64 && (
              <div style={{ fontSize: '.7rem', color: '#5aaa7e', marginTop: '.3rem', fontWeight: 600 }}>
                ✓ Imagen subida desde tu dispositivo
              </div>
            )}
          </div>
        )}

        {/* Upload from device */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: '.6rem',
          background: '#fff0f2', border: '1.5px dashed #f9bac2',
          borderRadius: '.9rem', padding: '.7rem 1rem', cursor: 'pointer',
          transition: 'all .2s', marginBottom: '.6rem',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#dd435f'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#f9bac2'}
        >
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <ImageIcon size={16} color="#dd435f" />
          <span style={{ fontSize: '.83rem', fontWeight: 600, color: '#dd435f' }}>
            {uploading ? 'Procesando...' : 'Subir foto desde mi dispositivo'}
          </span>
        </label>

        {/* URL input */}
        <div style={{ fontSize: '.68rem', color: '#aa8286', marginBottom: '.3rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
          O pegar URL (Drive, Imgur, Unsplash...)
        </div>
        <input
          className="ap-input"
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onPaste={handlePaste}
          onBlur={handleBlur}
          placeholder="https://... o enlace de Google Drive"
        />
        <div style={{ fontSize: '.7rem', color: '#aa8286', marginTop: '.3rem', lineHeight: 1.5 }}>
          💡 Si usas Drive: activa "Cualquiera con el enlace puede ver" antes de pegar.
        </div>
      </div>
    );
  };

  // Helper simple para campos de texto
  const imgInp = (key) => ({
    className: 'ap-input',
    value: c[key] ?? '',
    placeholder: 'https://...',
    onChange: e => set(key, e.target.value),
    onPaste: (e) => {
      const pasted = e.clipboardData.getData('text');
      const converted = convertDriveUrl(pasted);
      if (converted !== pasted) { e.preventDefault(); set(key, converted); }
    },
    onBlur: (e) => {
      const converted = convertDriveUrl(e.target.value);
      if (converted !== e.target.value) set(key, converted);
    },
  });


  const handleSave = async () => {
    try {
      setSaving(true);
      await saveContent(c);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('❌ Error al guardar: ' + err.message + '\n\nRevisa las reglas de Firestore en la consola de Firebase.');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'colores',    label: 'Colores',       icon: <Palette size={16} /> },
    { id: 'hero',       label: 'Hero',          icon: <Star size={16} /> },
    { id: 'servicios',  label: 'Servicios',     icon: <LayoutGrid size={16} /> },
    { id: 'productos',  label: 'Productos',     icon: <LayoutGrid size={16} /> },
    { id: 'manifiesto', label: 'Manifiesto',    icon: <Type size={16} /> },
    { id: 'pedidos',    label: 'Pedidos / CTA', icon: <Phone size={16} /> },
    { id: 'footer',     label: 'Footer',        icon: <Settings size={16} /> },
    { id: 'imagenes',   label: 'Imágenes',      icon: <ImageIcon size={16} /> },
    { id: 'usuarios',   label: 'Usuarios',      icon: <UserPlus size={16} /> },
  ];

  const QUICK_COLORS = ['#dd435f','#e07b5a','#9b59b6','#2c7be5','#27ae60','#d4a017','#aa5f3b','#555555'];

  return (
    <>
      <style>{CSS}</style>
      <div className="ap">

        {/* ── Overlay (mobile sidebar backdrop) ── */}
        <div className={`ap-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* ══ TOPBAR ══ */}
        <header className="ap-header" style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(255,231,234,0.85)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1.5px solid #f9bac2',
          padding: '0 2rem', height: 66,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            {/* Hamburger — mobile only */}
            <button className="ap-menu-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Menú">
              {sidebarOpen ? <XIcon size={18} /> : <Menu size={18} />}
            </button>
            <img
              src="/logok.png"
              alt="Kari's Bakery"
              style={{
                width: 42, height: 42, borderRadius: '50%',
                objectFit: 'cover',
                boxShadow: '0 4px 16px rgba(221,67,95,.25)',
                border: '2px solid rgba(249,186,194,.6)',
              }}
            />
            <div>
              <span style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.4rem', color: '#dd435f', display: 'block', lineHeight: 1 }}>
                Kari's Bakery
              </span>
              <span style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#aa8286' }}>
                Panel de Gestión
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <a href="/" target="_blank" rel="noreferrer" className="ap-pill ap-desk-only">
              <Eye size={11} /> Ver sitio
            </a>
            <button
              onClick={() => signOut(auth)}
              className="ap-desk-only"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '.35rem',
                background: 'transparent', border: '1.5px solid #f9bac2',
                borderRadius: '100px', padding: '.55rem 1rem',
                fontFamily: 'Montserrat, sans-serif', fontWeight: 700,
                fontSize: '.72rem', letterSpacing: '.07em', textTransform: 'uppercase',
                color: '#aa8286', cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#dd435f'; e.currentTarget.style.color='#dd435f'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='#f9bac2'; e.currentTarget.style.color='#aa8286'; }}
            >
              ↩ Salir
            </button>
            <button className={`ap-save${saved ? ' ok' : ''}`} onClick={handleSave} disabled={saving}>
              <Save size={14} />
              <span className="ap-save-label">
                {saving ? 'Guardando...' : saved ? '¡Guardado! ✓' : 'Guardar cambios'}
              </span>
            </button>
          </div>
        </header>

        {/* ══ LAYOUT ══ */}
        <div className="ap-layout" style={{
          maxWidth: 1200, margin: '0 auto', padding: '2.4rem 2rem 5rem',
          display: 'grid', gridTemplateColumns: '210px 1fr', gap: '1.8rem', alignItems: 'start',
        }}>

          {/* ── Sidebar ── */}
          <aside className={`ap-sidebar${sidebarOpen ? ' open' : ''}`}>
            {/* Greeting */}
            <div style={{
              background: '#fff8f9', borderRadius: '1.4rem', padding: '1.3rem',
              marginBottom: '.9rem', border: '1.5px solid #f9bac2', position: 'relative', overflow: 'hidden',
            }}>
              <div className="ap-dots" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '.64rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#aa8286', marginBottom: '.25rem' }}>
                  Panel de administración
                </div>
                <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#dd435f', lineHeight: 1.2 }}>
                  ¡Hola, {userName || '…'}! 🎂
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
              <div style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#aa8286', padding: '.5rem .3rem .3rem' }}>
                Secciones del sitio
              </div>
              {TABS.map(t => (
                <button key={t.id} className={`ap-tab${tab === t.id ? ' active' : ''}`}
                  onClick={() => { setTab(t.id); setSidebarOpen(false); }}>
                  {t.icon} {t.label}
                  {tab === t.id && <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#dd435f' }} />}
                </button>
              ))}

              {/* Salir (visible solo en mobile dentro del sidebar) */}
              <button
                onClick={() => signOut(auth)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.6rem',
                  marginTop: '1.2rem', padding: '.7rem 1rem',
                  background: 'none', border: '1.5px solid #f9bac2', borderRadius: '1rem',
                  fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.8rem',
                  color: '#aa8286', cursor: 'pointer', width: '100%', transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#dd435f'; e.currentTarget.style.borderColor = '#dd435f'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#aa8286'; e.currentTarget.style.borderColor = '#f9bac2'; }}
              >
                ↩ Cerrar sesión
              </button>
            </nav>
          </aside>

          {/* ── Panel principal ── */}
          <main className="ap-main ap-scroll" style={{
            background: '#fff8f9', borderRadius: '2rem', padding: '2rem 2.4rem',
            border: '1.5px solid #f9bac2', boxShadow: '0 12px 50px rgba(221,67,95,.08)',
            position: 'relative', overflow: 'hidden', minHeight: 500,
          }}>
            {/* Dots decoration */}
            <div className="ap-dots" style={{
              position: 'absolute', top: 0, right: 0,
              width: 140, height: 140, borderRadius: '0 2rem 0 100%', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Panel header */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', color: '#dd435f', lineHeight: 1.1, marginBottom: '.3rem' }}>
                  {TABS.find(t => t.id === tab)?.label}
                </h1>
                <p style={{ fontSize: '.82rem', color: '#aa8286' }}>
                  Edita los contenidos de esta sección. Los cambios se guardan al presionar "Guardar cambios".
                </p>
              </div>
              <hr className="ap-hr" />

              {/* ══════ TAB: COLORES ══════ */}
              {tab === 'colores' && (
                <div>
                  {[
                    { label: 'Color Principal (botones, íconos, énfasis)', key: 'primaryColor', hint: 'Afecta botones, badges y detalles activos' },
                    { label: 'Color de Acento (bordes y fondos suaves)', key: 'accentColor', hint: 'Afecta tarjetas, bordes y fondos pastel' },
                    { label: 'Color de Fondo General', key: 'bgColor', hint: 'Fondo de todas las secciones' },
                  ].map(({ label, key, hint }) => (
                    <div className="ap-field" key={key}>
                      <label className="ap-label">{label}</label>
                      <div className="ap-cswatch">
                        <div style={{ width: 44, height: 44, borderRadius: '.75rem', background: c[key], flexShrink: 0, position: 'relative', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,.14)' }}>
                          <input type="color" value={c[key]} onChange={e => set(key, e.target.value)}
                            style={{ position: 'absolute', top: -6, left: -6, width: 'calc(100% + 12px)', height: 'calc(100% + 12px)', border: 'none', padding: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '.9rem', color: '#776265' }}>{c[key].toUpperCase()}</div>
                          <div style={{ fontSize: '.73rem', color: '#aa8286', marginTop: 2 }}>{hint}</div>
                        </div>
                        <div style={{ marginLeft: 'auto', padding: '.28rem .9rem', borderRadius: '100px', background: c[key], color: '#fff8f9', fontSize: '.68rem', fontWeight: 700 }}>
                          Preview
                        </div>
                      </div>
                    </div>
                  ))}

                  <hr className="ap-hr" />
                  <label className="ap-label">Paleta rápida para el color principal</label>
                  <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.5rem' }}>
                    {QUICK_COLORS.map(col => (
                      <button key={col} className={`ap-swatch-btn${c.primaryColor === col ? ' selected' : ''}`}
                        style={{ background: col }} title={col}
                        onClick={() => set('primaryColor', col)} />
                    ))}
                  </div>
                </div>
              )}

              {/* ══════ TAB: HERO ══════ */}
              {tab === 'hero' && (
                <div>
                  <Accordion title="🏷️ Badge y palabras clave" defaultOpen>
                    <Field label="Texto del badge superior"><input {...inp('heroBadge')} /></Field>
                    <Field label="Frase principal (palabras normales)"><input {...inp('heroWords')} /></Field>
                    <Field label="Palabra en cursiva / drama"><input {...inp('heroDrama')} /></Field>
                    <Field label="Subtítulo descriptivo"><textarea {...ta('heroSubtitle')} /></Field>
                  </Accordion>
                  <Accordion title="🔘 Botones del Hero">
                    <Field label="Botón primario (CTA)"><input {...inp('heroCta1')} /></Field>
                    <Field label="Botón secundario"><input {...inp('heroCta2')} /></Field>
                  </Accordion>
                  <Accordion title="📊 Estadísticas">
                    {[
                      ['Estadística 1 — Número', 'heroStat1Num'],
                      ['Estadística 1 — Etiqueta', 'heroStat1Label'],
                      ['Estadística 2 — Número', 'heroStat2Num'],
                      ['Estadística 2 — Etiqueta', 'heroStat2Label'],
                      ['Estadística 3 — Número', 'heroStat3Num'],
                      ['Estadística 3 — Etiqueta', 'heroStat3Label'],
                    ].map(([label, key]) => (
                      <Field key={key} label={label}><input {...inp(key)} /></Field>
                    ))}
                  </Accordion>
                  <Accordion title="📌 Badge flotante">
                    <Field label="Texto principal del badge"><input {...inp('heroBadgeFloat')} /></Field>
                    <Field label="Subtexto del badge"><input {...inp('heroBadgeSub')} /></Field>
                  </Accordion>

                  {/* Live preview */}
                  <div className="ap-preview">
                    <div className="ap-preview-label">👁 Vista previa del Hero</div>
                    <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 900, fontSize: '1.5rem', color: '#776265', marginBottom: '.2rem' }}>
                      {c.heroWords}{' '}
                      <span style={{ fontFamily: "'Dancing Script',cursive", color: c.primaryColor, fontStyle: 'italic' }}>{c.heroDrama}</span>
                    </div>
                    <p style={{ fontSize: '.82rem', color: '#776265', marginBottom: '.9rem', lineHeight: 1.6 }}>{c.heroSubtitle}</p>
                    <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
                      <span style={{ background: c.primaryColor, color: '#fff8f9', borderRadius: 100, padding: '.45rem 1.2rem', fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em' }}>{c.heroCta1}</span>
                      <span style={{ border: `2px solid ${c.accentColor}`, color: c.primaryColor, borderRadius: 100, padding: '.45rem 1.2rem', fontSize: '.72rem', fontWeight: 700 }}>{c.heroCta2}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════ TAB: SERVICIOS ══════ */}
              {tab === 'servicios' && (
                <div>
                  <Accordion title="📌 Encabezado de sección" defaultOpen>
                    <Field label="Supertítulo"><input {...inp('serviciosSuper')} /></Field>
                    <Field label="Título principal"><input {...inp('serviciosTitulo')} /></Field>
                    <Field label="Palabra en cursiva (drama)"><input {...inp('serviciosDrama')} /></Field>
                  </Accordion>
                  {[
                    ['🎂 Servicio 1 — Pasteles', 's1', c.s1Img],
                    ['🍪 Servicio 2 — Postres', 's2', c.s2Img],
                    ['🚚 Servicio 3 — Corporativos', 's3', c.s3Img],
                  ].map(([title, prefix, img]) => (
                    <Accordion key={prefix} title={title}>
                      <Field label="Tag / categoría"><input {...inp(`${prefix}Tag`)} /></Field>
                      <Field label="Título"><input {...inp(`${prefix}Titulo`)} /></Field>
                      <Field label="Palabra drama (cursiva grande)"><input {...inp(`${prefix}Drama`)} /></Field>
                      <Field label="Descripción"><textarea {...ta(`${prefix}Body`)} /></Field>
                      <Field label="Badge (tiempo / disponibilidad)"><input {...inp(`${prefix}Badge`)} /></Field>
                      <Field label="URL de imagen (pega cualquier URL o de Google Drive)">
                        <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', marginBottom: '.5rem' }}>
                          <img src={img} className="ap-thumb" alt="" />
                        </div>
                        <input {...imgInp(`${prefix}Img`)} />
                      </Field>
                    </Accordion>
                  ))}
                </div>
              )}

              {/* ══════ TAB: PRODUCTOS ══════ */}
              {tab === 'productos' && (
                <div>
                  <Accordion title="📌 Encabezado de sección" defaultOpen>
                    <Field label="Supertítulo"><input {...inp('productosSuper')} /></Field>
                    <Field label="Título principal"><input {...inp('productosTitulo')} /></Field>
                    <Field label="Palabra drama"><input {...inp('productosDrama')} /></Field>
                    <Field label="Descripción debajo del título"><input {...inp('productosDesc')} /></Field>
                  </Accordion>
                  {[
                    ['🍪 Producto 1 — Crumble Cookies', 'p1', c.p1Img],
                    ['🍮 Producto 2 — Cuchareables',    'p2', c.p2Img],
                    ['🥧 Producto 3 — Pyes & Tartas',   'p3', c.p3Img],
                    ['🎂 Producto 4 — Pasteles',         'p4', c.p4Img],
                  ].map(([title, prefix, img]) => (
                    <Accordion key={prefix} title={title}>
                      <Field label="Nombre del producto"><input {...inp(`${prefix}Titulo`)} /></Field>
                      <Field label="Subtítulo / descripción corta"><input {...inp(`${prefix}Subtitle`)} /></Field>
                      <Field label="Descripción"><textarea {...ta(`${prefix}Desc`)} /></Field>
                      <Field label="Etiqueta de badge">
                        <input {...inp(`${prefix}Tag`)} />
                      </Field>
                      <Field label="URL de imagen (pega cualquier URL o de Google Drive)">
                        <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', marginBottom: '.5rem' }}>
                          <img src={img} className="ap-thumb" alt="" />
                        </div>
                        <input {...imgInp(`${prefix}Img`)} />
                      </Field>
                    </Accordion>
                  ))}
                </div>
              )}

              {/* ══════ TAB: MANIFIESTO ══════ */}
              {tab === 'manifiesto' && (
                <div>
                  <Accordion title="📌 Etiqueta y frase del botón" defaultOpen>
                    <Field label="Etiqueta superior"><input {...inp('manifiestoLabel')} /></Field>
                    <Field label="Texto del botón CTA"><input {...inp('manifiestoBtn')} /></Field>
                    <Field label="URL imagen de fondo (parallax)">
                      <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center', marginBottom: '.5rem' }}>
                        <img src={c.manifiestoImgUrl} className="ap-thumb" alt="" />
                      </div>
                      <input {...imgInp('manifiestoImgUrl')} />
                    </Field>
                  </Accordion>
                  {[
                    ['✍️ Frase 1', 'm1Normal', 'm1Drama'],
                    ['✍️ Frase 2', 'm2Normal', 'm2Drama'],
                    ['✍️ Frase 3', 'm3Normal', 'm3Drama'],
                  ].map(([title, normalKey, dramaKey]) => (
                    <Accordion key={normalKey} title={title}>
                      <Field label="Parte normal (Montserrat)"><input {...inp(normalKey)} /></Field>
                      <Field label="Parte drama (Dancing Script)"><input {...inp(dramaKey)} /></Field>
                      <div className="ap-preview">
                        <div className="ap-preview-label">Preview</div>
                        <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#776265' }}>{c[normalKey]}</div>
                        <div style={{ fontFamily: "'Dancing Script',cursive", fontStyle: 'italic', fontSize: '1.5rem', color: c.primaryColor }}>{c[dramaKey]}</div>
                      </div>
                    </Accordion>
                  ))}
                </div>
              )}

              {/* ══════ TAB: PEDIDOS / CTA ══════ */}
              {tab === 'pedidos' && (
                <div>
                  <Accordion title="📌 Columna de información" defaultOpen>
                    <Field label="Supertítulo"><input {...inp('ctaSuper')} /></Field>
                    <Field label="Título principal"><input {...inp('ctaTitulo')} /></Field>
                    <Field label="Palabra drama (cursiva)"><input {...inp('ctaDrama')} /></Field>
                    <Field label="Párrafo descriptivo"><textarea {...ta('ctaDesc')} /></Field>
                  </Accordion>
                  <Accordion title="📲 Contacto">
                    <Field label="Número de WhatsApp"><input {...inp('ctaWhatsapp')} /></Field>
                    <Field label="Instagram"><input {...inp('ctaInstagram')} /></Field>
                  </Accordion>
                  <Accordion title="💬 Testimonio">
                    <Field label="Cita del testimonio"><textarea {...ta('testimonioQuote')} /></Field>
                    <Field label="Nombre del autor"><input {...inp('testimonioAutor')} /></Field>
                  </Accordion>
                  <Accordion title="📝 Formulario — Textos y etiquetas">
                    <Field label="Título del formulario"><input {...inp('formTitulo')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Label campo Nombre"><input {...inp('formLabelNombre')} /></Field>
                    <Field label="Placeholder campo Nombre"><input {...inp('formPhNombre')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Label campo WhatsApp"><input {...inp('formLabelWsp')} /></Field>
                    <Field label="Placeholder campo WhatsApp"><input {...inp('formPhWsp')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Label selector de producto"><input {...inp('formLabelProd')} /></Field>
                    <Field label="Opción por defecto del selector"><input {...inp('formOptDefault')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Label campo de detalles"><input {...inp('formLabelDetalle')} /></Field>
                    <Field label="Placeholder campo de detalles"><textarea {...ta('formPhDetalle')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Texto del botón enviar"><input {...inp('ctaFormBtn')} /></Field>
                    <Field label="Texto pequeño debajo del botón"><input {...inp('ctaRespuesta')} /></Field>
                    <hr className="ap-hr" />
                    <Field label="Título de confirmación (tras enviar)"><input {...inp('formConfTitulo')} /></Field>
                    <Field label="Texto de confirmación (tras enviar)"><textarea {...ta('formConfTexto')} /></Field>
                  </Accordion>

                  <Accordion title="💬 Mensaje de WhatsApp">
                    <div className="ap-field">
                      <label className="ap-label">Plantilla del mensaje</label>
                      <div style={{ background: 'rgba(249,186,194,.18)', borderRadius: '.75rem', padding: '.6rem .9rem', marginBottom: '.5rem', fontSize: '.73rem', color: '#776265', lineHeight: 1.7 }}>
                        <strong>Variables disponibles:</strong><br/>
                        <code style={{ background: '#fff0f2', borderRadius: '.3rem', padding: '0 .35rem' }}>{'{nombre}'}</code> · nombre del cliente<br/>
                        <code style={{ background: '#fff0f2', borderRadius: '.3rem', padding: '0 .35rem' }}>{'{whatsapp}'}</code> · su número<br/>
                        <code style={{ background: '#fff0f2', borderRadius: '.3rem', padding: '0 .35rem' }}>{'{producto}'}</code> · producto seleccionado<br/>
                        <code style={{ background: '#fff0f2', borderRadius: '.3rem', padding: '0 .35rem' }}>{'{detalle}'}</code> · descripción del pedido
                      </div>
                      <textarea {...ta('ctaWpMensaje')} style={{ minHeight: 140, fontFamily: 'monospace', fontSize: '.82rem' }} />
                    </div>
                    <div className="ap-preview">
                      <div className="ap-preview-label">👁 Preview del mensaje de WhatsApp</div>
                      <pre style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '.82rem', color: '#776265', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                        {(c.ctaWpMensaje ?? '')
                          .replace('{nombre}', 'María García')
                          .replace('{whatsapp}', '+51 987 654 321')
                          .replace('{producto}', 'Crumble Cookies')
                          .replace('{detalle}', 'Quiero 12 unidades para el sábado.')
                        }
                      </pre>
                    </div>
                  </Accordion>
                </div>
              )}

              {tab === 'footer' && (
                <div>
                  <Accordion title="📌 Textos del footer" defaultOpen>
                    <Field label="Descripción de la marca"><textarea {...ta('footerDesc')} /></Field>
                    <Field label="Instagram"><input {...inp('footerInstagram')} /></Field>
                    <Field label="Ubicación"><input {...inp('footerUbicacion')} /></Field>
                    <Field label="Texto de copyright"><input {...inp('footerCopy')} /></Field>
                  </Accordion>
                </div>
              )}

              {/* ══════ TAB: USUARIOS ══════ */}
              {tab === 'usuarios' && <UsuariosTab Accordion={Accordion} Field={Field} />}

              {/* ══════ TAB: IMÁGENES ══════ */}
              {tab === 'imagenes' && (
                <div>
                  <div style={{ background: 'rgba(90,170,126,.1)', borderRadius: '.9rem', padding: '.8rem 1rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'flex-start', gap: '.6rem', border: '1.5px solid rgba(90,170,126,.25)' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>✅</span>
                    <div style={{ fontSize: '.78rem', color: '#3d7a5a', lineHeight: 1.6 }}>
                      <strong>Recomendado:</strong> usa el botón <em>"Subir foto desde mi dispositivo"</em> — funciona siempre, directamente desde tu computadora o celular.<br/>
                      También puedes pegar una URL de <strong>Imgur.com</strong> o <strong>Unsplash</strong>.
                    </div>
                  </div>

                  {[
                    ['🏠 Hero — Imagen circular', 'heroImgUrl'],
                    ['🎂 Servicio 1 — Pasteles', 's1Img'],
                    ['🍪 Servicio 2 — Postres & Cookies', 's2Img'],
                    ['🚚 Servicio 3 — Corporativos', 's3Img'],
                    ['🍪 Producto — Crumble Cookies', 'p1Img'],
                    ['🍮 Producto — Cuchareables', 'p2Img'],
                    ['🥧 Producto — Pyes & Tartas', 'p3Img'],
                    ['🎂 Producto — Pasteles personalizados', 'p4Img'],
                    ['🌿 Manifiesto — Fondo parallax', 'manifiestoImgUrl'],
                  ].map(([title, key]) => (
                    <Accordion key={key} title={title} defaultOpen={key === 'heroImgUrl'}>
                      <ImageUrlField imgKey={key} label={title} />
                    </Accordion>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
