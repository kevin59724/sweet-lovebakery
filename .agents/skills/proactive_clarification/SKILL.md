---
name: proactive_clarification
description: Instruye al agente a detenerse y pedir aclaraciones ofreciendo una lista de opciones cuando tenga dudas o encuentre vacíos en las indicaciones.
---

# proactive_clarification

## Descripción
Esta habilidad define un comportamiento reactivo y persistente: cada vez que el agente tenga dudas sobre cómo realizar una implementación técnica o encuentre "agujeros" (ambigüedades, falta de detalles u omisiones) en las indicaciones dadas por el usuario, deberá detenerse. En lugar de asumir y tomar decisiones arbitrarias, el agente debe formular una pregunta clara al usuario proporcionando una lista estructurada de opciones con las posibles formas de hacerlo, al estilo del asistente Cursor.

## Cuándo activar esta habilidad (Triggers)
- Las instrucciones del usuario son ambiguas o muy genéricas.
- Hay múltiples enfoques técnicos válidos para una implementación y el usuario no especificó cuál usar.
- Faltan detalles críticos de negocio o de diseño (ej. manejo de errores, esquemas de bases de datos, estilos CSS, edge cases).
- La implementación sugerida por el usuario podría entrar en conflicto con la arquitectura actual del proyecto.

## Lógica de Ejecución

1. **Detención Temprana**: No escribas, elimines ni modifiques código si no estás completamente seguro del camino a tomar.
2. **Identificación del Problema**: Identifica claramente cuál es la duda, el vacío de información o la decisión crítica de diseño.
3. **Formulación de Opciones**: Genera un conjunto de 2 a 4 opciones viables que resuelvan el problema. Debes pensar proactivamente en las mejores alternativas.
4. **Estructura de la Consulta**: Responde al usuario con el siguiente formato:
   - **Contexto**: Explica brevemente y de forma amigable qué falta o por qué hay dudas.
   - **Opciones Enumeradas**: Presenta las opciones. Cada opción debe tener:
     - Un título descriptivo.
     - Un breve resumen de cómo se haría.
     - (Opcional) Pros y contras breves para ayudar al usuario a decidir.
   - **Llamado a la Acción**: Pregunta al usuario cuál de las opciones prefiere, o si tiene una solución distinta en mente.
5. **Espera de Confirmación**: Espera la respuesta del usuario antes de proceder con cualquier modificación de código.

## Ejemplo de Salida (Output) esperado en el Chat

"Para implementar [funcionalidad solicitada], noto que no se especificó [vacío de información]. Existen varias formas de abordar esto. ¿Cuál de estas opciones prefieres?

1. **[Opción 1: Enfoque A]**: [Breve explicación de cómo se haría]. Es ideal si buscas más rendimiento.
2. **[Opción 2: Enfoque B]**: [Breve explicación de cómo se haría]. Es más rápido de implementar pero menos escalable.
3. **[Opción 3: Enfoque C]**: [Breve explicación]. 
4. **Ninguna de las anteriores**: [Dime qué tenías en mente y lo adaptamos].

Indícame tu preferencia y procederé de inmediato con la implementación."
