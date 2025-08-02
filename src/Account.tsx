type AccountProps = {
  onBack: () => void;
};

function Account({ onBack }: AccountProps) {
  return (
    <div className="container card">
      <h1>Mi Cuenta</h1>
      <p>Inicia sesión o crea una cuenta para acceder a todas las herramientas.</p>
      
      {/* Aquí iría la lógica de Netlify Identity */}
      <div className="account-form">
        <h3>Iniciar Sesión</h3>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />
        <button>Entrar</button>
      </div>
      
      <hr className="divider" />
      
      <div className="account-form">
        <h3>Crear Cuenta Nueva</h3>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Contraseña" />
        <button>Registrarse</button>
      </div>

      <button className="secondary-button" onClick={onBack}>Volver</button>
    </div>
  );
}

export default Account;