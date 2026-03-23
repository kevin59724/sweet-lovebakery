import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/* ════════════════════════════════════════════════════════
   VALORES POR DEFECTO — igual a los del sitio original
════════════════════════════════════════════════════════ */
export const DEFAULTS = {
  // Colores
  primaryColor: '#dd435f',
  accentColor:  '#f9bac2',
  bgColor:      '#ffe7ea',

  // Hero
  heroBadge:      'Hecho con amor · Lima, Perú',
  heroWords:      'Cada bocado, una historia',
  heroDrama:      'dulce.',
  heroSubtitle:   'Postres de autor hechos a medida para tus momentos más especiales. Pasteles de cumpleaños, crumble cookies, cuchareables y más — pensados al detalle, entregados con cariño.',
  heroCta1:       'Reservar mi pedido',
  heroCta2:       'Ver el menú',
  heroStat1Num:   '+500', heroStat1Label: 'pedidos entregados',
  heroStat2Num:   '100%', heroStat2Label: 'hecho a mano',
  heroStat3Num:   '★ 5.0', heroStat3Label: 'valoración general',
  heroBadgeFloat: 'Pedidos especiales',
  heroBadgeSub:   'Personalizamos cada detalle',
  heroImgUrl:     'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=700&q=80&auto=format',

  // Servicios
  serviciosSuper:  'Nuestros servicios',
  serviciosTitulo: 'Lo que hacemos',
  serviciosDrama:  'con amor',
  s1Tag: 'SERVICIO PRINCIPAL', s1Titulo: 'Pasteles de Cumpleaños', s1Drama: 'Personalizados',
  s1Body: 'Diseñamos cada pastel desde cero, adaptando temáticas, sabores y tamaños a tu visión. Desde naked cakes florales hasta estructuras de múltiples pisos.',
  s1Badge: 'Desde un día antes',
  s1Img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80&auto=format',
  s2Tag: 'LÍNEA GOURMET', s2Titulo: 'Postres & Crumble Cookies', s2Drama: 'Al por mayor y menor',
  s2Body: 'Crumble cookies artesanales, cuchareables en tarro, pyes y más postres de autor. Ideales para regalos, eventos o simplemente darte un capricho.',
  s2Badge: 'Pide desde 1 unidad',
  s2Img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80&auto=format',
  s3Tag: 'CATERING', s3Titulo: 'Pedidos Corporativos', s3Drama: 'Volumen & Eventos',
  s3Body: 'Cerramos caterings para empresas, reuniones y eventos sociales. Menú personalizable, presentación profesional y entrega garantizada.',
  s3Badge: 'Cotización sin compromiso',
  s3Img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80&auto=format',

  // Productos
  productosSuper:  'Nuestro menú',
  productosTitulo: 'Elaborado',
  productosDrama:  'con obsesión',
  productosDesc:   'Cada producto se produce por encargo. Sin conservantes, sin shortcuts.',
  p1Titulo: 'Crumble Cookies', p1Subtitle: 'La firma de la casa', p1Tag: 'Más pedido',
  p1Desc: 'Brown butter, chispas de chocolate belga y flor de sal. Cada mordida tiene capas.',
  p1Img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=700&q=80&auto=format',
  p2Titulo: 'Cuchareables', p2Subtitle: 'En tarro, para saborear despacio', p2Tag: 'Edición limitada',
  p2Desc: 'Cheesecake de maracuyá, tres leches artesanal, mousse de frutos rojos y más.',
  p2Img: 'https://images.unsplash.com/photo-1645562270357-043bb7c98f3e?q=80&w=687&auto=format',
  p3Titulo: 'Pyes & Tartas', p3Subtitle: 'Masa corta. Rellenos de autor.', p3Tag: 'Para compartir',
  p3Desc: 'Tarta de limón merengado, pie de manzana caramelizada o combinaciones personalizadas.',
  p3Img: 'https://images.unsplash.com/photo-1583350229873-e06b12acdb9c?q=80&w=1144&auto=format',
  p4Titulo: 'Pasteles Personalizados', p4Subtitle: 'Tu visión, nuestras manos', p4Tag: 'Pedido con 48h',
  p4Desc: 'Diseños únicos con decoraciones en buttercream, fondant o flores naturales comestibles.',
  p4Img: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=700&q=80&auto=format',

  // Manifiesto
  manifiestoLabel: 'Nuestro manifiesto',
  m1Normal: 'No vendemos postres.', m1Drama: 'Creamos recuerdos.',
  m2Normal: 'Cada pastel tiene',    m2Drama: 'un propósito.',
  m3Normal: 'El detalle es',        m3Drama: 'nuestro lenguaje.',
  manifiestoBtn: 'Hacer realidad mi pedido →',
  manifiestoImgUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1400&q=70&auto=format',

  // CTA / Pedidos
  ctaSuper:    'Hablemos',
  ctaTitulo:   'Tu pedido merece',
  ctaDrama:    'atención especial.',
  ctaDesc:     'Dinos qué tienes en mente y con gusto te asesoramos sin compromiso. Atendemos pedidos personalizados, bodas, corporativos y más.',
  ctaWhatsapp: '+51 978 919 450',
  ctaInstagram: '@sweet_love.bakery',
  testimonioQuote: 'El pastel de mi cumple fue increíble. Exactamente lo que imaginé.',
  testimonioAutor: 'Valentina M.',
  ctaFormBtn:   'Enviar mi pedido',
  ctaRespuesta: 'Te respondemos en menos de 24 horas 🩷 sin compromiso.',
  ctaWpMensaje: "Hola Kari's Bakery! Quiero hacer un pedido:\n\n*Nombre:* {nombre}\n*WhatsApp:* {whatsapp}\n*Producto:* {producto}\n*Detalles:* {detalle}",

  // Formulario — labels, placeholders y textos de confirmación
  formTitulo:       'Reserva tu pedido',
  formLabelNombre:  'Nombre',
  formPhNombre:     'Tu nombre',
  formLabelWsp:     'WhatsApp',
  formPhWsp:        '+51 9XX XXX XXX',
  formLabelProd:    '¿Qué deseas pedir?',
  formOptDefault:   'Selecciona un producto',
  formLabelDetalle: 'Cuéntanos más',
  formPhDetalle:    'Describe tu pedido: fecha, cantidad, diseño o inspiración...',
  formConfTitulo:   '¡Recibido!',
  formConfTexto:    'Te contactaremos por WhatsApp en las próximas horas para coordinar todos los detalles de tu pedido especial. 🩷',

  // Footer
  footerDesc:      'Bakery artesanal en Lima, Perú. Postres personalizados que convierten cada celebración en un recuerdo.',
  footerInstagram: '@sweet_love.bakery',
  footerUbicacion: 'Lima, Perú',
  footerCopy:      '© 2025 Kari\'s Bakery. Todos los derechos reservados.',
};

/* ════════════════════════════════════════════════════════
   CONTEXTO
════════════════════════════════════════════════════════ */
const ContentContext = createContext({
  content: DEFAULTS,
  loading: true,
  saveContent: async () => {},
});

const CACHE_KEY = 'kbakery_content_v1';

/* Lee el caché del localStorage y lo mezcla con los defaults */
function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (_) {/* ignore */}
  return null;
}

export function ContentProvider({ children }) {
  // 1. Inicial: caché de localStorage (instantáneo) o DEFAULTS
  const cached = readCache();
  const [content, setContent] = useState(cached ?? DEFAULTS);
  const [loading, setLoading] = useState(!cached); // si hay caché, no "cargando"

  // 2. Siempre consultamos Firestore en segundo plano para tener datos frescos
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'config', 'sitio'));
        if (snap.exists()) {
          const fresh = { ...DEFAULTS, ...snap.data() };
          setContent(fresh);
          // Actualizar caché local con los datos más recientes
          localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
        }
      } catch (e) {
        console.warn('Firestore no disponible, usando caché local.', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 3. Al guardar: escribe en Firestore Y actualiza caché local al instante
  const saveContent = async (newData) => {
    await setDoc(doc(db, 'config', 'sitio'), newData);
    setContent(newData);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
  };

  return (
    <ContentContext.Provider value={{ content, loading, saveContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
