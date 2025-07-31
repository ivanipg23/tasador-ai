import { useState } from 'react';
import PrivacyPolicy from './PrivacyPolicy';

function App() {
  const [view, setView] = useState('landing');
  // ... (el resto de los estados y funciones se quedan igual) ...

  const handleSubmit = async (e: React.FormEvent) => { /* ...código sin cambios... */ };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { /* ...código sin cambios... */ };

  if (view === 'privacy') {
    return <PrivacyPolicy onBack={() => setView('landing')} />;
  }

  if (view === 'demo') {
    // ... (la vista de la demo no cambia) ...
    return (
        <main className="container">
          {/* ...código de la demo sin cambios... */}
        </main>
    );
  }

  // --- VISTA 'LANDING' MODIFICADA Y SIMPLIFICADA ---
  return (
    <main className="container">
      <div className="card">
        <h1>Tasación Instantánea con IA</h1>
        <p>
          Descubre el valor real de cualquier objeto en segundos.
        </p>
        
        {/* ÚNICA LLAMADA A LA ACCIÓN */}
        <button onClick={() => setView('demo')} style={{width: '100%', marginTop: '2rem'}}>
          Acceder a la Demo
        </button>

        {/* Enlace discreto a la política de privacidad */}
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