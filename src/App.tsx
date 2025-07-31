// En el archivo: src/App.tsx

import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  const [view, setView] = useState('landing');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Ahora solo enviamos la descripción en crudo. El backend se encarga del resto.
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description }), // <- El cuerpo ahora es más simple
      });

      if (!res.ok) {
        throw new Error('La respuesta del servidor no fue válida.');
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setError('No se pudo obtener una tasación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // El resto del archivo (las vistas de 'privacy', 'demo' y 'landing') no necesita cambios.
  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => setView('landing')} />;
  }

  if (view === 'demo') {
    return (
      <main className="container">
        <div className="card">
          <h1>Demo Tasador.ai</h1>
          <p>Describe con el mayor detalle posible el objeto que quieres tasar para obtener una estimación precisa.</p>
          <form className="demo-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="descripcion">Descripción del objeto</label>
              <textarea 
                id="descripcion" 
                rows={5} 
                placeholder="Ej: Anillo de oro de 18k con un diamante de 0.5 quilates..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Tasando...' : 'Obtener Tasación'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          {isLoading && <p>La IA está analizando tu objeto, por favor espera...</p>}
          {response && (
            <div className="response-box">
              <h2>Tasación Estimada:</h2>
              <p>{response}</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Tasación Instantánea con IA</h1>
        <p>
          Descubre el valor real de cualquier objeto en segundos.
        </p>
        <form name="newsletter" method="POST" data-netlify="true">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="newsletter-text">
            La herramienta está en desarrollo. ¡Introduce tu email para ser el primero en saber cuándo se lanza!
          </p>
          <div className="newsletter-group">
            <input type="email" name="email" placeholder="tu.email@ejemplo.com" required />
            <button type="submit">Notificarme</button>
          </div>
          <div className="consent-group">
            <input type="checkbox" name="consent" id="consent" required />
            <label htmlFor="consent">
              Acepto recibir comunicaciones y he leído la 
              <span className="privacy-link" onClick={() => setView('privacy')}>
                Política de Privacidad
              </span>.
            </label>
          </div>
        </form>
        <hr className="divider" />
        <button className="secondary-button" onClick={() => setView('demo')}>
          O accede a la Demo
        </button>
      </div>
    </main>
  );
}

export default App;