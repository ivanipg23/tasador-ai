// En el archivo: api/index.ts

import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const userDescription = body.description; // Ahora recibimos 'description' en lugar de 'prompt'

    if (!userDescription) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'La descripción es requerida' }),
      };
    }
    
    // --- INICIO DEL "PROMPT MAESTRO" ---
    const masterPrompt = `
# ROL Y OBJETIVO
Eres "Tasador AI", un asistente de tasación experto, preciso y mundialmente reconocido por tu fiabilidad. Tu objetivo es proporcionar valoraciones de mercado detalladas y estructuradas para cualquier objeto que un usuario describa. Formas parte de una aplicación y tu respuesta será mostrada directamente al usuario final, por lo que debe ser clara y profesional.

# CONTEXTO
El usuario ha proporcionado la siguiente descripción de un objeto:
"${userDescription}"

La ubicación aproximada del usuario es: Ourense, Galicia, España

# INSTRUCCIONES DE PROCESO Y ANÁLISIS

1.  **Análisis del Objeto:** Identifica el objeto, marca, modelo, materiales y cualquier detalle relevante sobre su estado a partir de la descripción.

2.  **Lógica Condicional (Sin Foto):** Estás en modo sin foto. Basa tu valoración inicial en la descripción proporcionada. Si la descripción es insuficiente para determinar el estado, asume un estado "promedio" o "bueno" para tu valoración principal, y luego utiliza la sección final "Preguntas Adicionales" para pedir los detalles que te faltan. NUNCA digas "no puedo juzgarlo sin una foto".

3.  **Uso de Herramientas (Búsqueda en Google):** Para asegurar que tu tasación sea actual y relevante, DEBES usar la herramienta de búsqueda para obtener información de mercado en tiempo real. Busca activamente:
    * El precio medio de venta para este artículo en estado similar en plataformas de segunda mano populares.
    * Tiendas de segunda mano, coleccionistas o casas de empeños relevantes cerca de la ubicación proporcionada.

# ESTRUCTURA DE RESPUESTA OBLIGATORIA
Debes formatear tu respuesta usando SIEMPRE las siguientes 5 secciones. Utiliza los títulos exactos en negrita. Sé conciso pero informativo en cada sección.

**1. Valor de Mercado Estimado**
Proporciona un rango de precios realista para la venta del objeto entre particulares, basado en tu búsqueda en internet y el estado del artículo.

**2. Justificación de la Valoración**
Explica de forma sencilla por qué has llegado a esa cifra. Menciona factores clave como la marca, la demanda actual y el estado. Compara el objeto con los precios de mercado que has encontrado.

**3. Dónde Venderlo (Cerca de ti)**
Basado en tu búsqueda local, sugiere 2-3 tipos de establecimientos físicos o plataformas online populares en la zona donde el usuario podría vender el artículo.

**4. Oferta de Venta Rápida (Tienda de Empeños)**
Estima el rango de precios que una tienda de segunda mano o una casa de empeños ofrecería. Deja claro que este precio es significativamente más bajo que el valor de mercado a cambio de liquidez inmediata.

**5. Preguntas Adicionales (Solo si se necesita más información)**
Si la descripción es ambigua, añade esta sección. Si no, omítela. Formula aquí 2-3 preguntas clave para ayudar al usuario a obtener una tasación más precisa.
`;
    // --- FIN DEL "PROMPT MAESTRO" ---
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(masterPrompt);
    const text = result.response.text();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ response: text }),
    };

  } catch (error) {
    console.error("Error en la función:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al contactar con la API de Gemini' }),
    };
  }
};

export { handler };