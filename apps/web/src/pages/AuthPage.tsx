import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'login' | 'register';

function DarkInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="auth-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="auth-input"
      />
    </div>
  );
}

function LoginForm({ onSuccess, onSwitch }: { onSuccess: () => void; onSwitch: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      login(res.token, res.cliente);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <DarkInput label="E-mail" type="email" value={email} onChange={setEmail}
        placeholder="seu@email.com" autoComplete="email" />
      <DarkInput label="Senha" type="password" value={password} onChange={setPassword}
        placeholder="••••••••" autoComplete="current-password" />

      {error && (
        <div className="auth-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      <p className="auth-switch-text">
        Não tem conta?{' '}
        <button type="button" onClick={onSwitch} className="auth-switch-link">
          Criar agora
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSuccess, onSwitch }: { onSuccess: () => void; onSwitch: () => void }) {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.register({ name, email, password, phone: phone || undefined });
      login(res.token, res.cliente);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <DarkInput label="Nome completo" value={name} onChange={setName}
        placeholder="João Silva" autoComplete="name" />
      <DarkInput label="E-mail" type="email" value={email} onChange={setEmail}
        placeholder="seu@email.com" autoComplete="email" />
      <DarkInput label="Celular" type="tel" value={phone} onChange={setPhone}
        placeholder="(11) 99999-9999" autoComplete="tel" />
      <DarkInput label="Senha" type="password" value={password} onChange={setPassword}
        placeholder="Mínimo 6 caracteres" autoComplete="new-password" />

      {error && (
        <div className="auth-error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      <p className="auth-switch-text">
        Já tem conta?{' '}
        <button type="button" onClick={onSwitch} className="auth-switch-link">
          Entrar
        </button>
      </p>
    </form>
  );
}

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="dk-glow-top" />

      {/* Logo & branding */}
      <div className="auth-hero">
        <div className="auth-logo-ring">
          <div className="auth-logo-wrap">
            <img src="/logo.png" alt="Logo" className="auth-logo-img" />
          </div>
        </div>
        <h1 className="auth-brand-name">Lanchonete</h1>
        <p className="auth-brand-tagline">Peça agora, chegue rápido 🛵</p>
      </div>

      {/* Form card */}
      <div className="auth-form-card">
        <div className="auth-tabs">
          {(['login', 'register'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`auth-tab ${tab === t ? 'auth-tab--active' : 'auth-tab--inactive'}`}
            >
              {t === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <div key={tab} className="animate-fade-up">
          {tab === 'login'
            ? <LoginForm onSuccess={() => navigate('/')} onSwitch={() => setTab('register')} />
            : <RegisterForm onSuccess={() => navigate('/')} onSwitch={() => setTab('login')} />
          }
        </div>
      </div>
    </div>
  );
}
