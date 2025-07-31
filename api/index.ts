import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 3001;

// Middlewares
app.use(express.json());
app.use(cors()); // Permite peticiones desde el frontend

// Inicializar el cliente de Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Ruta de la API
app.post('/api/demo', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    res.json({ response: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contactar con la API de Gemini' });
  }
});

// Vercel exportará la app automáticamente, pero para pruebas locales, puedes usar esto:
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// Exportar la app para que Vercel la use como serverless function
export default app;