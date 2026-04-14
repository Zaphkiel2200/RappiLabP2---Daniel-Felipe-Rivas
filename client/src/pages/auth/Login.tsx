import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#FF441F', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>Rappi</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>¡De todo para todos!</p>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333' }}>Inicia sesión</h2>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '0.8rem',
              border: '1px solid #ddd',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '0.8rem',
              border: '1px solid #ddd',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          
          <button style={{
            backgroundColor: '#FF441F',
            color: '#fff',
            border: 'none',
            padding: '1rem',
            borderRadius: '0.8rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem',
            transition: 'background-color 0.2s'
          }}>
            Ingresar
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', color: '#666' }}>
          ¿No tienes cuenta? <a href="/signup" style={{ color: '#FF441F', fontWeight: '600', textDecoration: 'none' }}>Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
