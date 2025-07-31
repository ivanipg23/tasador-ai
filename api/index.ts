import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import cors from 'cors';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Inicializar el cliente de Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// La ruta de la API ahora es la raíz: /api/
app.post('/api', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error("Error en la llamada a la API de Gemini:", error);
    res.status(500).json({ error: 'Error al contactar con la API de Gemini' });
  }
});

// Exportar la app para que Vercel la use como serverless function
export default app;