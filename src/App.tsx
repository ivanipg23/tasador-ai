import { useState } from 'react';

function App() {
  const [isDemo, setIsDemo] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShowDemo = () => {
    setIsDemo(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError('No se pudo obtener una respuesta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDemo) {
    return (
      <div className="container">
        <h1>Página en Desarrollo</h1>
        <p>El proyecto final está casi listo. ¿Quieres probar una demo?</p>
        <button onClick={handleShowDemo}>Acceder a la Demo</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Demo - IA</h1>
      <p>Escribe una pregunta y la IA te responderá.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: ¿Cuál es la capital de España?"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Pensando...' : 'Enviar'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-box">
          <h2>Respuesta:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;