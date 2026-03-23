import { useState, useEffect } from 'react';
import { initializeApp, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  signOut as signOutSecondary,
} from 'firebase/auth';
import {
  collection, getDocs, setDoc, updateDoc, deleteDoc, doc, orderBy, query, getDoc
} from 'firebase/firestore';
import { firebaseConfig, db, auth } from '../firebase';
import { UserPlus, Pencil, Trash2, X, Check, RefreshCw, KeyRound } from 'lucide-react';

/* ─── App secundaria para crear usuarios sin perder la sesión del admin ─── */
function getSecondaryAuth() {
  try { return getAuth(getApp('creator')); }
  catch { return getAuth(initializeApp(firebaseConfig, 'creator')); }
}

/* ─── Helpers ─────────────────────────────────────────────────────────── */
const USER_ERRORS = {
  'auth/email-already-in-use':  'Ya existe una cuenta con ese email.',
  'auth/invalid-email':         'El email no tiene un formato válido.',
  'auth/weak-password':         'La contraseña debe tener al menos 6 caracteres.',
  'auth/requires-recent-login': 'Por seguridad, cierra sesión, vuelve a entrar y luego cambia la contraseña.',
};

function Avatar({ nombre, size = 38 }) {
  const letter = (nombre || '?')[0].toUpperCase();
  const colors = ['#dd435f','#e07b5a','#9b59b6','#2c7be5','#27ae60','#d4a017'];
  const bg = colors[letter.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: 'Montserrat,sans-serif', fontWeight: 700,
      fontSize: size * .4, flexShrink: 0,
    }}>{letter}</div>
  );
}

/* ─── Componente principal ────────────────────────────────────────────── */
export default function UsuariosTab({ Accordion, Field }) {
  /* ── Estado crear cuenta ── */
  const [newName,    setNewName]    = useState('');
  const [newEmail,   setNewEmail]   = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [newPw2,     setNewPw2]     = useState('');
  const [creating,   setCreating]   = useState(false);
  const [createMsg,  setCreateMsg]  = useState(null);

  /* ── Estado lista de usuarios ── */
  const [users,      setUsers]      = useState([]);
  const [loadingU,   setLoadingU]   = useState(true);

  /* ── Estado editar nombre ── */
  const [editingId,  setEditingId]  = useState(null);
  const [editName,   setEditName]   = useState('');

  /* ── Estado cambiar contraseña ── */
  const [pwUserId,   setPwUserId]   = useState(null); // uid del que está cambiando pw
  const [newPwVal,   setNewPwVal]   = useState('');
  const [newPwVal2,  setNewPwVal2]  = useState('');
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwMsg,      setPwMsg]      = useState(null);

  /* ── Estado eliminar ── */
  const [deletingId, setDeletingId] = useState(null);

  /* ── Cargar usuarios desde Firestore ── */
  const loadUsers = async () => {
    setLoadingU(true);
    try {
      // Upsert del usuario actual (por si fue creado antes de este sistema)
      const currentUser = auth.currentUser;
      if (currentUser) {
        const ref = doc(db, 'usuarios', currentUser.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, {
            nombre: currentUser.displayName || currentUser.email.split('@')[0],
            email:  currentUser.email,
            createdAt: new Date().toISOString(),
          });
        }
      }

      const snap = await getDocs(query(collection(db, 'usuarios'), orderBy('createdAt', 'desc')));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.warn('No se pudieron cargar los usuarios:', e.message);
    } finally {
      setLoadingU(false);
    }
  };
  useEffect(() => { loadUsers(); }, []);

  /* ── Crear cuenta ── */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (newPw !== newPw2) { setCreateMsg({ type: 'err', text: 'Las contraseñas no coinciden.' }); return; }
    setCreating(true); setCreateMsg(null);
    try {
      const secAuth = getSecondaryAuth();
      const cred = await createUserWithEmailAndPassword(secAuth, newEmail, newPw);
      await updateProfile(cred.user, { displayName: newName });
      await signOutSecondary(secAuth);

      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        nombre: newName, email: newEmail,
        createdAt: new Date().toISOString(),
      });

      setCreateMsg({ type: 'ok', text: `✓ Cuenta creada para ${newEmail}` });
      setNewName(''); setNewEmail(''); setNewPw(''); setNewPw2('');
      loadUsers();
    } catch (err) {
      setCreateMsg({ type: 'err', text: USER_ERRORS[err.code] || err.message });
    } finally {
      setCreating(false);
    }
  };

  /* ── Editar nombre ── */
  const startEdit = (u) => { setEditingId(u.id); setEditName(u.nombre); setPwUserId(null); };
  const cancelEdit = () => { setEditingId(null); setEditName(''); };
  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, 'usuarios', id), { nombre: editName });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, nombre: editName } : u));
      setEditingId(null);
    } catch (e) { alert('Error al guardar: ' + e.message); }
  };

  /* ── Cambiar contraseña ── */
  const startPw = (u) => { setPwUserId(u.id); setNewPwVal(''); setNewPwVal2(''); setPwMsg(null); setEditingId(null); };
  const cancelPw = () => { setPwUserId(null); setNewPwVal(''); setNewPwVal2(''); setPwMsg(null); };
  const savePw = async (uid) => {
    if (newPwVal !== newPwVal2) { setPwMsg({ type: 'err', text: 'Las contraseñas no coinciden.' }); return; }
    if (newPwVal.length < 6)    { setPwMsg({ type: 'err', text: 'Mínimo 6 caracteres.' }); return; }
    setPwLoading(true); setPwMsg(null);
    try {
      await updatePassword(auth.currentUser, newPwVal);
      setPwMsg({ type: 'ok', text: '✓ Contraseña actualizada.' });
      setNewPwVal(''); setNewPwVal2('');
      setTimeout(() => { setPwUserId(null); setPwMsg(null); }, 1800);
    } catch (err) {
      setPwMsg({ type: 'err', text: USER_ERRORS[err.code] || err.message });
    } finally {
      setPwLoading(false);
    }
  };

  /* ── Eliminar ── */
  const confirmDelete = async (id, email) => {
    if (!window.confirm(`¿Eliminar el usuario ${email} del panel?`)) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'usuarios', id));
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) { alert('Error al eliminar: ' + e.message); }
    finally { setDeletingId(null); }
  };

  /* ── UI ── */
  const btnStyle = {
    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
    borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'all .15s',
  };
  const msgBox = (msg) => msg ? (
    <div style={{
      borderRadius: '.65rem', padding: '.5rem .8rem', fontSize: '.75rem', fontWeight: 600,
      background: msg.type === 'ok' ? 'rgba(90,170,126,.12)' : 'rgba(221,67,95,.1)',
      border: `1.5px solid ${msg.type === 'ok' ? 'rgba(90,170,126,.4)' : 'rgba(221,67,95,.3)'}`,
      color: msg.type === 'ok' ? '#3d7a5a' : '#dd435f', marginTop: '.4rem',
    }}>{msg.text}</div>
  ) : null;

  const isCurrentUser = (uid) => auth.currentUser?.uid === uid;

  return (
    <div>
      {/* ── Sección crear ── */}
      <Accordion title="👤 Crear nueva cuenta" defaultOpen>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
          <Field label="Nombre o alias del usuario">
            <input className="ap-input" type="text" required
              placeholder="Ej: Kari, Asistente 1..."
              value={newName} onChange={e => { setNewName(e.target.value); setCreateMsg(null); }} />
          </Field>
          <Field label="Email">
            <input className="ap-input" type="email" required
              placeholder="nueva@cuenta.com"
              value={newEmail} onChange={e => { setNewEmail(e.target.value); setCreateMsg(null); }} />
          </Field>
          <Field label="Contraseña (mín. 6 caracteres)">
            <input className="ap-input" type="password" required minLength={6}
              placeholder="••••••••"
              value={newPw} onChange={e => { setNewPw(e.target.value); setCreateMsg(null); }} />
          </Field>
          <Field label="Repetir contraseña">
            <input className="ap-input" type="password" required minLength={6}
              placeholder="••••••••"
              value={newPw2} onChange={e => { setNewPw2(e.target.value); setCreateMsg(null); }}
              style={{ borderColor: newPw2 && newPw !== newPw2 ? '#dd435f' : '' }} />
            {newPw2 && newPw !== newPw2 && (
              <div style={{ fontSize: '.72rem', color: '#dd435f', marginTop: '.3rem', fontWeight: 600 }}>
                Las contraseñas no coinciden
              </div>
            )}
          </Field>

          {createMsg && (
            <div style={{
              borderRadius: '.75rem', padding: '.65rem 1rem',
              fontSize: '.8rem', fontWeight: 600,
              background: createMsg.type === 'ok' ? 'rgba(90,170,126,.12)' : 'rgba(221,67,95,.1)',
              border: `1.5px solid ${createMsg.type === 'ok' ? 'rgba(90,170,126,.4)' : 'rgba(221,67,95,.3)'}`,
              color: createMsg.type === 'ok' ? '#3d7a5a' : '#dd435f',
            }}>
              {createMsg.text}
            </div>
          )}

          <button type="submit" className="ap-save"
            disabled={creating || Boolean(newPw2 && newPw !== newPw2)}
            style={{ marginTop: '.2rem' }}>
            <UserPlus size={14} />
            {creating ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
      </Accordion>

      {/* ── Sección usuarios existentes ── */}
      <Accordion title={`📋 Usuarios existentes${users.length ? ` (${users.length})` : ''}`} defaultOpen>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '.8rem' }}>
          <button onClick={loadUsers} style={{ ...btnStyle, color: '#aa8286', gap: '.35rem', fontSize: '.72rem', fontFamily: 'Montserrat,sans-serif', fontWeight: 700, letterSpacing: '.06em' }}>
            <RefreshCw size={12} /> Actualizar
          </button>
        </div>

        {loadingU ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#aa8286', fontSize: '.83rem' }}>
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#aa8286', fontSize: '.83rem', fontStyle: 'italic' }}>
            No hay usuarios registrados aún.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
            {users.map(u => (
              <div key={u.id} style={{
                background: '#fff0f2', border: '1.5px solid #f9bac2',
                borderRadius: '1rem', padding: '.9rem 1.1rem',
              }}>
                {/* ── Fila principal ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem' }}>
                  <Avatar nombre={u.nombre} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editingId === u.id ? (
                      <input
                        className="ap-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        autoFocus
                        style={{ padding: '.4rem .8rem', fontSize: '.85rem', marginBottom: '.2rem' }}
                      />
                    ) : (
                      <div style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 700, fontSize: '.88rem', color: '#776265', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.nombre}
                        {isCurrentUser(u.id) && (
                          <span style={{ marginLeft: '.5rem', fontSize: '.65rem', fontWeight: 700, background: '#dd435f', color: '#fff', borderRadius: '20px', padding: '1px 7px', verticalAlign: 'middle' }}>Tú</span>
                        )}
                      </div>
                    )}
                    <div style={{ fontSize: '.72rem', color: '#aa8286', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email}
                    </div>
                    {u.createdAt && (
                      <div style={{ fontSize: '.65rem', color: '#c9a0a8', marginTop: '.15rem' }}>
                        Creado {new Date(u.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '.3rem', flexShrink: 0 }}>
                    {editingId === u.id ? (
                      <>
                        <button style={{ ...btnStyle, color: '#3d7a5a' }}
                          title="Guardar nombre" onClick={() => saveEdit(u.id)}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(90,170,126,.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <Check size={15} />
                        </button>
                        <button style={{ ...btnStyle, color: '#aa8286' }}
                          title="Cancelar" onClick={cancelEdit}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,130,134,.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Editar nombre — siempre disponible */}
                        <button style={{ ...btnStyle, color: '#aa8286' }}
                          title="Editar nombre" onClick={() => startEdit(u)}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(170,130,134,.15)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <Pencil size={14} />
                        </button>

                        {/* Cambiar contraseña — solo para el usuario logueado */}
                        {isCurrentUser(u.id) && (
                          <button style={{ ...btnStyle, color: pwUserId === u.id ? '#dd435f' : '#aa8286' }}
                            title="Cambiar contraseña"
                            onClick={() => pwUserId === u.id ? cancelPw() : startPw(u)}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(221,67,95,.12)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                            <KeyRound size={14} />
                          </button>
                        )}

                        {/* Eliminar */}
                        <button
                          style={{ ...btnStyle, color: deletingId === u.id ? '#c0392b' : '#aa8286' }}
                          title="Eliminar del panel" onClick={() => confirmDelete(u.id, u.email)}
                          disabled={deletingId === u.id}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(221,67,95,.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* ── Panel cambiar contraseña (inline) ── */}
                {pwUserId === u.id && (
                  <div style={{ marginTop: '.75rem', paddingTop: '.75rem', borderTop: '1px solid rgba(249,186,194,.6)', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: '#aa8286' }}>
                      🔑 Nueva contraseña
                    </div>
                    <input className="ap-input" type="password" minLength={6}
                      placeholder="Nueva contraseña (mín. 6 caracteres)"
                      value={newPwVal}
                      onChange={e => { setNewPwVal(e.target.value); setPwMsg(null); }}
                      style={{ padding: '.55rem .9rem', fontSize: '.83rem' }}
                    />
                    <input className="ap-input" type="password" minLength={6}
                      placeholder="Repetir nueva contraseña"
                      value={newPwVal2}
                      onChange={e => { setNewPwVal2(e.target.value); setPwMsg(null); }}
                      style={{
                        padding: '.55rem .9rem', fontSize: '.83rem',
                        borderColor: newPwVal2 && newPwVal !== newPwVal2 ? '#dd435f' : '',
                      }}
                    />
                    {msgBox(pwMsg)}
                    <div style={{ display: 'flex', gap: '.5rem' }}>
                      <button className="ap-save" onClick={() => savePw(u.id)}
                        disabled={pwLoading || !newPwVal || !newPwVal2}
                        style={{ flex: 1, fontSize: '.75rem', padding: '.55rem 1rem' }}>
                        {pwLoading ? 'Guardando...' : 'Guardar contraseña'}
                      </button>
                      <button onClick={cancelPw} style={{
                        background: 'none', border: '1.5px solid #f9bac2', borderRadius: '100px',
                        padding: '.55rem 1rem', cursor: 'pointer', fontSize: '.72rem',
                        color: '#aa8286', fontFamily: 'Montserrat,sans-serif', fontWeight: 700,
                      }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Accordion>
    </div>
  );
}
