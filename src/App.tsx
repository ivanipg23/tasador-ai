import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  // Estado para controlar qué vista mostramos: 'landing', 'demo' o 'privacy'
  const [view, setView] = useState('landing');
  
  // Estados para el formulario de la demo
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    const fullPrompt = `Realiza una tasación de mercado estimada para el siguiente objeto: "${description}". Proporciona un rango de precios razonable y justifica brevemente tu valoración, mencionando factores clave a considerar.`;

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }),
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

  // Función para manejar el evento de presionar una tecla
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // --- RENDERIZADO CONDICIONAL DE VISTAS ---

  // Si la vista es 'privacy', muestra la página de política de privacidad
  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => setView('landing')} />;
  }

  // Si la vista es 'demo', muestra la demo
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

  // Por defecto, muestra la vista 'landing' minimalista
  return (
    <main className="container">
      <div className="card">
        <h1>Tasación Instantánea con IA</h1>
        <p>
          Descubre el valor real de cualquier objeto en segundos.
        </p>
        
        <button onClick={() => setView('demo')} style={{width: '100%', marginTop: '2rem'}}>
          Acceder a la Demo
        </button>

        <p className="footer-link">
          <span onClick={() => setView('privacy')}>
            Política de Privacidad
          </span>
        </p>
      </div>
    </main>
  );
}

export default App;