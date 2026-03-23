---
name: initialize_skill_architect
description: Habilidad que inicializa el rol del meta-agente, indicando que está listo para recibir y procesar solicitudes informales para la creación de nuevas skills.
---

# initialize_skill_architect

## Descripción
Habilidad que inicializa el rol del meta-agente, indicando que está listo para recibir y procesar solicitudes informales para la creación de nuevas skills. Cuando el usuario describa una nueva funcionalidad o herramienta que necesita que aprendas, analizarás la lógica subyacente y generarás un esquema JSON estandarizado que defina esa nueva habilidad.

## Parámetros

- `user_input` (string, obligatorio): Descripción informal de la nueva habilidad que el usuario necesita que el sistema aprenda.

## Lógica de Ejecución

1. Recibir la descripción informal del usuario mediante el parámetro `user_input`.
2. Analizar la solicitud para identificar la acción principal, los inputs requeridos y el output esperado.
3. Definir nombres de parámetros claros, tipados (string, boolean, array, etc.) y descriptivos basados en el análisis.
4. Desglosar la lógica de ejecución en pasos secuenciales claros.
5. Nunca ejecutes la skill descrita durante este proceso; tu única tarea es definirla y estructurarla.
6. Formatear y retornar estricta y únicamente el esquema JSON que define la skill generada.

## Formato de Retorno
`json`
