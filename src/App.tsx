import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  const [view, setView] = useState('landing');
  const [description, setDescription] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: description }),
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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('submitting');

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      // --- CAMBIO CLAVE AQUÍ ---
      // Enviamos los datos a la acción "/thank-you.html", igual que en el index.html
      const response = await fetch('/thank-you.html', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setNewsletterStatus('success');
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      setNewsletterStatus('error');
    }
  };


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
            <>
              <div className="response-box">
                <h2>Tasación Estimada:</h2>
                <p>{response}</p>
              </div>

              <hr className="divider" />

              {newsletterStatus === 'success' ? (
                <div className="newsletter-success">
                  <h3>¡Gracias por suscribirte!</h3>
                  <p>Te avisaremos en cuanto la aplicación esté disponible.</p>
                </div>
              ) : (
                <form name="newsletter" method="POST" action="/thank-you.html" onSubmit={handleNewsletterSubmit} data-netlify="true" netlify-honeypot="bot-field">
                  <input type="hidden" name="form-name" value="newsletter" />
                  <p className="newsletter-text">
                    ¿Te gusta lo que ves? ¡Suscríbete para saber cuándo lanzamos la versión completa!
                  </p>
                  <div className="newsletter-group">
                    <input type="email" name="email" placeholder="tu.email@ejemplo.com" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required />
                    <button type="submit" disabled={newsletterStatus === 'submitting'}>
                      {newsletterStatus === 'submitting' ? 'Enviando...' : 'Notificarme'}
                    </button>
                  </div>
                  <div className="consent-group">
                    <input type="checkbox" name="consent" id="consent" required />
                    <label htmlFor="consent">
                      Acepto recibir comunicaciones y he leído la&nbsp;
                      <span className="privacy-link" onClick={() => setView('privacy')}>
                        Política de Privacidad
                      </span>.
                    </label>
                  </div>
                  {newsletterStatus === 'error' && <p className="error">No se pudo enviar el formulario. Inténtalo de nuevo.</p>}
                </form>
              )}
            </>
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