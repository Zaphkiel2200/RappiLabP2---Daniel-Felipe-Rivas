import React from 'react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Para el momento sin lógica de autenticación
    navigate('/');
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'var(--primary)', 
            fontSize: '2.5rem', 
            fontWeight: '900', 
            margin: 0,
            letterSpacing: '-1.5px'
          }}>Rappi <span style={{ fontWeight: 400, fontSize: '1.2rem' }}>Delivery</span></h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '0.4rem' }}>Regístrate como repartidor</p>
        </div>

        <h2 style={{ 
          fontSize: '1.4rem', 
          fontWeight: 700, 
          marginBottom: '1.5rem', 
          textAlign: 'center' 
        }}>Crea tu perfil de Repartidor</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>
                Nombre
              </label>
              <input type="text" placeholder="Juan" className="input-field" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>
                Apellido
              </label>
              <input type="text" placeholder="Pérez" className="input-field" required />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>
              Correo electrónico
            </label>
            <input type="email" placeholder="ejemplo@correo.com" className="input-field" required />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>
              Teléfono
            </label>
            <input type="tel" placeholder="300 123 4567" className="input-field" required />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#444' }}>
              Contraseña
            </label>
            <input type="password" placeholder="Mínimo 8 caracteres" className="input-field" required />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }}>
            Crear Cuenta
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.2rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            ¿Ya tienes una cuenta? <span 
              onClick={() => navigate('/login')} 
              style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
