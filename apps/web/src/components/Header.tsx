import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="app-header"
      style={{ boxShadow: '0 1px 0 rgba(232,53,10,0.12), 0 6px 24px rgba(0,0,0,0.35)' }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left */}
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'var(--dk-card)',
              border: '1px solid var(--dk-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
              flexShrink: 0,
            }}
            aria-label="Voltar"
          >
            <ArrowLeft size={18} strokeWidth={2.5} color="var(--dk-text)" />
          </button>
        ) : (
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              width: 42,
              height: 42,
              background: 'white',
              borderRadius: 12,
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 0 1.5px rgba(232,53,10,0.55), 0 0 22px rgba(232,53,10,0.22), 0 4px 14px rgba(0,0,0,0.5)',
            }}>
              <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.2rem',
                letterSpacing: '0.08em',
                color: 'var(--dk-text)',
              }}>
                Lanchonete
              </span>
              <span style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dk-accent)',
                marginTop: 1,
              }}>
                Delivery
              </span>
            </div>
          </button>
        )}

        {/* Center title */}
        {title && (
          <h1 style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--dk-text)',
            whiteSpace: 'nowrap',
          }}>
            {title}
          </h1>
        )}

        {/* Right — greeting (desktop) + cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!title && (
            <span className="hidden sm:block" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--dk-muted)' }}>
              Olá, <span style={{ color: 'var(--dk-text)', fontWeight: 900 }}>{user?.name?.split(' ')[0]}</span> 👋
            </span>
          )}

          <button
            onClick={() => navigate('/cart')}
            style={{
              position: 'relative',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'var(--dk-card)',
              border: '1px solid var(--dk-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            aria-label="Carrinho"
          >
            <ShoppingBag size={20} strokeWidth={2} color="var(--dk-text)" />
            {count > 0 && (
              <span
                className="animate-bounce-in"
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  background: 'var(--dk-accent)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 900,
                  borderRadius: 99,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  fontFamily: 'Nunito, sans-serif',
                  boxShadow: '0 2px 8px rgba(232,53,10,0.5)',
                }}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
