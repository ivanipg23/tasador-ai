// Importamos los tipos de Netlify y el cliente de Gemini
import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Esta es la estructura de una función nativa de Netlify
const handler: Handler = async (event: HandlerEvent) => {
  // 1. Verificamos que la petición sea del tipo POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    // 2. Obtenemos el prompt del cuerpo de la petición
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'El prompt es requerido' }),
      };
    }
    
    // 3. Inicializamos y llamamos a la API de Gemini (esta parte es igual)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // 4. Devolvemos la respuesta en el formato que Netlify espera
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