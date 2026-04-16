import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Para el momento sin lógica de autenticación
    navigate('/');
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ 
            color: 'var(--primary)', 
            fontSize: '3rem', 
            fontWeight: '900', 
            margin: 0,
            letterSpacing: '-1.5px'
          }}>Rappi <span style={{ fontWeight: 400, fontSize: '1.5rem' }}>Delivery</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.5rem' }}>¡Genera ingresos con libertad!</p>
        </div>

        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 700, 
          marginBottom: '1.5rem', 
          textAlign: 'center' 
        }}>Ingreso para Repartidores</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: '#444' }}>
              Correo electrónico
            </label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              className="input-field"
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#444' }}>Contraseña</label>
              <a href="#" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            Iniciar Sesión
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            ¿No tienes cuenta? <span 
              onClick={() => navigate('/signup')} 
              style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
