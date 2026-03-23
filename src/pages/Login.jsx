import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Montserrat:wght@400;600;700;900&family=Open+Sans:wght@300;400;600&display=swap');

  .lp * { box-sizing: border-box; margin: 0; padding: 0; }
  .lp {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #ffe7ea; font-family: 'Montserrat', sans-serif; padding: 2rem;
    position: relative; overflow: hidden;
  }
  .lp::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  /* blobs decorativos */
  .lp-blob1 {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    width: 520px; height: 520px; top: -140px; right: -160px;
    background: radial-gradient(circle, rgba(249,186,194,0.45) 0%, transparent 70%);
    filter: blur(60px);
  }
  .lp-blob2 {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    width: 400px; height: 400px; bottom: -100px; left: -100px;
    background: radial-gradient(circle, rgba(221,67,95,0.2) 0%, transparent 70%);
    filter: blur(70px);
  }

  .lp-card {
    position: relative; z-index: 1;
    background: #fff8f9; border-radius: 2rem; padding: 3rem 2.8rem;
    border: 1.5px solid #f9bac2;
    box-shadow: 0 24px 80px rgba(221,67,95,0.12), 0 4px 16px rgba(221,67,95,0.06);
    width: 100%; max-width: 420px;
    animation: lp-fadein .5s ease both;
  }
  @keyframes lp-fadein { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

  .lp-input-wrap {
    position: relative;
  }
  .lp-input {
    width: 100%; background: #fff0f2; border: 1.5px solid #f9bac2;
    border-radius: .9rem; padding: .85rem 1rem .85rem 2.8rem;
    font-family: 'Montserrat', sans-serif; font-size: .9rem; color: #776265;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .lp-input:focus { border-color: #dd435f; box-shadow: 0 0 0 3px rgba(221,67,95,0.12); background: #fff; }
  .lp-input::placeholder { color: #c9a0a8; }
  .lp-icon {
    position: absolute; left: .9rem; top: 50%; transform: translateY(-50%);
    color: #aa8286; pointer-events: none;
  }
  .lp-eye {
    position: absolute; right: .9rem; top: 50%; transform: translateY(-50%);
    color: #aa8286; background: none; border: none; cursor: pointer; padding: 2px;
    transition: color .2s;
  }
  .lp-eye:hover { color: #dd435f; }

  .lp-btn {
    width: 100%; background: #dd435f; color: #fff8f9;
    font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: .88rem;
    letter-spacing: .08em; text-transform: uppercase;
    border: none; border-radius: 100px; padding: 1rem;
    cursor: pointer; transition: transform .2s, box-shadow .2s, background .2s;
    box-shadow: 0 8px 28px rgba(221,67,95,.35);
  }
  .lp-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 36px rgba(221,67,95,.45); }
  .lp-btn:disabled { opacity: .65; cursor: not-allowed; }

  .lp-error {
    background: rgba(221,67,95,.1); border: 1.5px solid rgba(221,67,95,.3);
    border-radius: .75rem; padding: .65rem 1rem;
    font-size: .8rem; color: #dd435f; font-weight: 600; text-align: center;
    animation: lp-fadein .3s ease both;
  }

  .lp-dots {
    background-image: radial-gradient(#f9bac2 1.5px, transparent 1.5px);
    background-size: 20px 20px; opacity: .3;
    position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Si ya tiene sesión activa, redirigir directamente al panel
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/admin', { replace: true });
    });
    return unsub;
  }, [navigate]);

  const ERRORS = {
    'auth/user-not-found':     'No existe una cuenta con ese email.',
    'auth/wrong-password':     'Contraseña incorrecta. Inténtalo de nuevo.',
    'auth/invalid-email':      'El email no tiene un formato válido.',
    'auth/too-many-requests':  'Demasiados intentos. Espera unos minutos.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin', { replace: true }); // ← redirección tras login exitoso
    } catch (err) {
      setError(ERRORS[err.code] || 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">
        <div className="lp-blob1" />
        <div className="lp-blob2" />

        <div className="lp-card">
          <div className="lp-dots" />

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg,#dd435f,#f9bac2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto .9rem',
              boxShadow: '0 8px 28px rgba(221,67,95,.35)',
            }}>
              <Sparkles size={26} color="#fff8f9" />
            </div>
            <h1 style={{
              fontFamily: "'Dancing Script', cursive", fontSize: '2.2rem',
              color: '#dd435f', lineHeight: 1, marginBottom: '.25rem',
            }}>
              Kari's Bakery
            </h1>
            <p style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#aa8286' }}>
              Panel de Gestión
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
            <div>
              <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: '#aa8286', marginBottom: '.4rem' }}>
                Email
              </label>
              <div className="lp-input-wrap">
                <Mail size={15} className="lp-icon" />
                <input
                  type="email" required autoComplete="email"
                  className="lp-input" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="kari@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color: '#aa8286', marginBottom: '.4rem' }}>
                Contraseña
              </label>
              <div className="lp-input-wrap">
                <Lock size={15} className="lp-icon" />
                <input
                  type={showPw ? 'text' : 'password'} required autoComplete="current-password"
                  className="lp-input" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button type="button" className="lp-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <div className="lp-error">{error}</div>}

            <button type="submit" className="lp-btn" disabled={loading} style={{ marginTop: '.4rem' }}>
              {loading ? 'Iniciando sesión...' : 'Entrar al panel'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '.7rem', color: '#aa8286', marginTop: '1.4rem', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            Acceso exclusivo para administradores 🩷
          </p>
        </div>
      </div>
    </>
  );
}
