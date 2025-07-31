// En el archivo: src/PrivacyPolicy.tsx

// Definimos una 'prop' para que el componente pueda recibir la función de volver atrás
type PrivacyPolicyProps = {
  onBack: () => void;
};

function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="container card text-left">
      <h1>Política de Privacidad</h1>
      <p><strong>Última actualización:</strong> 31 de julio de 2025</p>

      <p>
        En Tasador.ai, tu privacidad es importante para nosotros. Esta política de privacidad
        explica qué datos personales recogemos y cómo los utilizamos.
      </p>

      <h3>1. ¿Qué datos recogemos?</h3>
      <p>
        Recogemos la dirección de correo electrónico que nos proporcionas voluntariamente
        a través de nuestro formulario de suscripción.
      </p>

      <h3>2. ¿Para qué usamos tus datos?</h3>
      <p>
        Utilizamos tu correo electrónico exclusivamente para los siguientes fines:
        <ul>
          <li>Notificarte sobre el lanzamiento oficial de nuestra aplicación.</li>
          <li>Enviarte ocasionalmente noticias y actualizaciones relevantes sobre el proyecto (newsletter).</li>
        </ul>
        No compartiremos tus datos con terceros.
      </p>
      
      <h3>3. ¿Dónde se almacenan tus datos?</h3>
      <p>
        Los datos recogidos a través del formulario se almacenan de forma segura en los servidores
        de Netlify (nuestro proveedor de hosting), que actúa como "Encargado del Tratamiento"
        y cumple con la normativa RGPD.
      </p>

      <h3>4. Tus derechos</h3>
      <p>
        Tienes derecho a acceder, rectificar o suprimir tus datos en cualquier momento.
        Para ejercer estos derechos, por favor, contáctanos en el siguiente correo electrónico: 
        <strong>info@tasador.ai</strong>.
      </p>
      
      <button onClick={onBack} style={{ marginTop: '2rem' }}>
        Volver a la página principal
      </button>
    </div>
  );
}

export default PrivacyPolicy;