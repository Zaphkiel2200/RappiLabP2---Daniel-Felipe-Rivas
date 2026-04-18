import React, { useState } from 'react';
import { useUser } from '../providers/UserProvider';
import { AuthForm } from '../components/AuthForm';
import { AuthInput } from '../components/AuthInput';
import { SubmitButton } from '../components/SubmitButton';
import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <AuthForm
      icon={<Icon name="map" size={28} />}
      title="¡Bienvenido de nuevo!"
      subtitle="Ingresa tus credenciales para continuar"
      footer={
        <>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Regístrate aquí
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <AuthInput
          id="email"
          label="Correo Electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={setEmail}
          required
        />
        <AuthInput
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          required
        />
        <SubmitButton
          loading={loading}
          loadingText="Iniciando sesión..."
          text="Iniciar Sesión"
        />
      </form>
    </AuthForm>
  );
};

export default LoginPage;
