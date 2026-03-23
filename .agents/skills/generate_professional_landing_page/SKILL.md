---
name: generate_professional_landing_page
description: Construye una landing page Awwwards-Level (Instrumento Digital). Diseño premium, GSAP interactivo, estética modificable sin ser genérica. Requiere mini-brief.
---

# generate_professional_landing_page

## Descripción
Esta habilidad fusiona la obtención rápida de requerimientos (mini-brief) con la construcción de una landing page "Pixel Perfect" de extrema complejidad técnica (Estilo Awwwards / Instrumento Digital). El objetivo no es hacer "una web", sino un instrumento digital interactivo donde la estética, los colores y la vibra se adaptan a la marca, pero manteniendo un estándar técnico inflexible (GSAP, texturas, interacciones de súper élite).

## Comportamiento Inicial (Mini-brief)
Cuando el usuario pida "hazme una web", NO empieces a generar el código. Pide estos 7 puntos de golpe en una sola caja de preguntas, sin repreguntar:

1. **Marca / Proyecto + Qué vendes** (1-2 líneas).
2. **Público objetivo** (A quién va dirigido).
3. **Oferta y CTA** (Qué problema resuelve + Botón principal, ej: "Reserva una llamada").
4. **Identidad estética / Vibe** (Ej: "Tecnología premium + boutique", "Minimalismo brutalista", "Startup Cyberpunk", "Orgánico y terrenal").
5. **Paleta de Colores (Opcional)**: Si decides omitirlo, crearé una paleta premium. Si deseas especificarla, indícame los códigos Hex para estos 4 roles:
   - `Background`: Fondo principal.
   - `Primary`: Color dominante / Títulos.
   - `Accent`: Botones / Interacciones.
   - `Text`: Texto de lectura.
6. **Tipografías (Opcional)**: Nombra las fuentes de Google Fonts que deseas para estos 3 roles. Si las omites, elegiré una triada de élite:
   - `Main`: Para lectura y estructura UI (Ej: *Inter*, *Outfit*).
   - `Drama`: Para dar énfasis en titulares, típicamente usada en itálica (Ej: *Cormorant Garamond*).
   - `Data`: Fuente monospace para barras de estado o telemetría (Ej: *Roboto Mono*).
7. **Bloques de Instrumento / Componentes de Élite (Opcional)**: Nombra los bloques exactos que deseas usar (ej. *Hero Cinemático*, *Telemetría Pura*, *Tarjetas Apilables*, etc.). Si omites esto, elegiré estratégicamente 4 o 5 bloques de mi catálogo que mejor se adapten a tu producto.

## Lógica de Ejecución (Una vez se tiene el mini-brief)

### 1. Sistema de Diseño Adaptativo (Estricto en su estructura)
Dependiendo del **Vibe** elegido (o los datos provistos en el mini-brief), debes definir e implementar:
- **Paleta de 4 colores exactos (Hex):**
  - **`Background`**: El color de fondo principal de todo el documento.
  - **`Primary`**: Color principal de la marca, usado a menudo para grandes titulares o secciones de fondo alterado.
  - **`Accent`**: Color de acento de muchísima personalidad, para botones, interacciones, `text-cyan-400`, etc.
  - **`Text`**: El color para el texto de lectura principal (asegurando siempre alto contraste).
- **Tipografías:** En total son 3 tipografías. No hay restricciones de familia mientras existan en Google Fonts y el resultado sea de élite. Si el usuario no las especifica, elige una triada:
  - **`Main`**: Tipografía sin serifa principal (Ej: *Plus Jakarta Sans*, *Outfit* o *Inter*).
  - **`Drama`**: Tipografía con muchísima personalidad para palabras clave o citas (Ej: *Cormorant Garamond* o *Playfair Display*, usándolas a menudo en *itálica*).
  - **`Data`**: Tipografía monospace impecable para datos o textos que simulan terminal (Ej: *Roboto Mono*, *JetBrains Mono*).
- **Textura Visual:** Aplica OBLIGATORIAMENTE un overlay global en CSS de ruido (noise) usando SVG turbulence a opacidad `0.05` para evitar que la interfaz se vea plana.
- **Formas:** Radios de borde grandes (entre `2rem` y `3rem`) para contenedores principales, dando un aspecto de hardware o interfaz de laboratorio.

### 2. Stack Tecnológico Obligatorio
- **React** (+ Tailwind CSS)
- **GSAP 3** (OBLIGATORIO usar `ScrollTrigger` e implementar `gsap.context()` en los `useEffect`).
- **Lucide React** (para Iconografía).

### 3. Biblioteca de Bloques de Instrumento (Componentes de Élite)
La página ya no usa una estructura lineal aburrida. Tienes una librería de "Bloques de Instrumento". Analiza lo que el cliente vende, **elige estratégicamente solo 4 o 5 bloques** de este catálogo que mejor cuenten la historia (a menos que el usuario especifique cuáles usar en el punto 7), y ensámblalos fluidamente.

**Catálogo de Bloques Base:**
- **Navbar (Isla Flotante) (Universal):** Píldora que cambia a glassmorphism con scroll.
- **Hero Cinemático (100vh):** Fondo inmersivo y titular escalonado mezclando sans con *itálica serif* para contraste.
- **Hero de Producto Flotante:** Un solo objeto o mockup central masivo rodeado de UI minimalista. Perfecto para E-commerce.
- **Baraja Diagnóstica:** 3 tarjetas que alternan verticalmente de forma cíclica para mostrar características sin usar grids mundanos.
- **Telemetría Pura:** Terminal monospaciado con un cursor escribiendo en vivo cómo opera el producto/software.
- **Protocolo Automatizado:** Un cursor o elemento "fantasma" operando parte de una interfaz (marcando una agenda, etc) sobre un lienzo.
- **Manifiesto Parallax:** Sección de altísimo contraste donde el copy entra por partes (*split text*) revelando el por qué de la marca.
- **Tarjetas Apilables (Scroll Stacking):** Bloques a pantalla completa; al entrar uno de abajo, el que estaba arriba choca, escala a 0.9, baja opacidad y se desenfoca (`blur: 20px`).
- **Acordeón Fotográfico Expansivo:** Tiras de imágenes/proyectos colapsadas que al hacer hover se ensanchan fluidamente (Excelente para estudios creativos o portfolios).

**Regla de Interacción:** 
Todos los botones deben ser obligatoriamente "Magnéticos" u ostentar desplazamiento de fondo suave. Nada es estático.

### 4. Copy y Activos
- **Cero Clichés:** Prohibido usar "Impulsa tu negocio" o "Somos líderes". Escribe con un tono asertivo, maduro y técnico de alto impacto.
- **Imágenes:** Selecciona URLs de fotos de Unsplash que encajen *perfectamente* con el Vibe. Las fotos no deben sentirse baratas.

## Formato de Retorno
1. Explica brevemente el Sistema de Diseño adoptado (Colores y Tipos).
2. Proporciona el código de React completo e integral para ser utilizado como Artefacto navegable.
3. El resultado debe ser asombroso. Nada de UI IA genérica.
