import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function ProtectedRoute({ children }) {
  const [user, setUser]       = useState(undefined); // undefined = cargando
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecked(true);
    });
    return unsub;
  }, []);

  // Mientras Firebase comprueba la sesión, mostramos una pantalla de carga
  if (!checked) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#ffe7ea', fontFamily: 'Montserrat, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg,#dd435f,#f9bac2)',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#aa8286', fontSize: '.85rem', fontWeight: 600 }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Sin sesión → redirigir al login
  if (!user) return <Navigate to="/login" replace />;

  // Con sesión → mostrar el panel
  return children;
}
