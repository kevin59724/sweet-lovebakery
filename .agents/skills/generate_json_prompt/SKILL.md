---
name: generate_json_prompt
description: Genera un prompt estructurado en formato JSON a partir de una descripción en lenguaje natural proporcionada por el usuario.
---

# generate_json_prompt

## Descripción
Genera un prompt estructurado en formato JSON a partir de una descripción en lenguaje natural proporcionada por el usuario. Útil para transformar ideas u objetivos en instrucciones modulares, delimitadas y fáciles de procesar por otros agentes o sistemas.

## Parámetros

- `user_input` (string, obligatorio): Descripción informal o en lenguaje natural del prompt que se desea generar.

## Lógica de Ejecución

1. Analizar 'user_input' para identificar el objetivo principal, el rol del sistema, el contexto y cualquier restricción o regla específica.
2. Diseñar la estructura del prompt dividiéndola en campos lógicos (ej. 'role', 'context', 'objective', 'rules', 'output_format').
3. Asegurar que las instrucciones sean claras y que el formato de salida esté bien definido dentro de la estructura.
4. Convertir y empaquetar la estructura diseñada en un objeto JSON válido.
5. Retornar estricta y únicamente el objeto JSON resultante.

## Formato de Retorno
`json`
