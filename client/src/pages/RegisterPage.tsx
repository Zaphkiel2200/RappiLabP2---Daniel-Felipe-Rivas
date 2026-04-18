import React, { useState } from 'react';
import { useUser } from '../providers/UserProvider';
import { AuthForm } from '../components/AuthForm';
import { AuthInput } from '../components/AuthInput';
import { SubmitButton } from '../components/SubmitButton';
import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const { register, loading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password, userName);
  };

  return (
    <AuthForm
      icon={<Icon name="user-plus" size={28} />}
      title="Crea tu cuenta"
      subtitle="Únete a la comunidad de Rappi"
      footer={
        <>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <AuthInput
          id="userName"
          label="Nombre de Usuario"
          type="text"
          placeholder="Ej: DanielRivas"
          value={userName}
          onChange={setUserName}
          required
        />
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
          loadingText="Creando cuenta..."
          text="Registrarse"
        />
      </form>
    </AuthForm>
  );
};

export default RegisterPage;
