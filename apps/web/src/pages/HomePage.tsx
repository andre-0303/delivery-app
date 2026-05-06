import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { Categoria, Produto } from '../types';
import Header from '../components/Header';
import CategoryBar from '../components/CategoryBar';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Skeleton() {
  return (
    <div className="prod-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} className="animate-dk-shimmer" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ height: 14, width: '65%', borderRadius: 5 }} className="animate-dk-shimmer" />
        <div style={{ height: 12, width: '85%', borderRadius: 4 }} className="animate-dk-shimmer" />
        <div style={{ height: 12, width: '55%', borderRadius: 4 }} className="animate-dk-shimmer" />
        <div style={{ height: 15, width: 52, borderRadius: 4, marginTop: 2 }} className="animate-dk-shimmer" />
      </div>
      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} className="animate-dk-shimmer" />
    </div>
  );
}

function formatPrice(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

export default function HomePage() {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [products, setProducts] = useState<Produto[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { count, total } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.categories.list().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.products.list(activeSlug ?? undefined)
      .then(setProducts)
      .catch(() => setError('Não foi possível carregar os produtos. Verifique se a API está rodando.'))
      .finally(() => setLoading(false));
  }, [activeSlug]);

  return (
    <div className="content-page">
      <Header />
      <CategoryBar categories={categories} active={activeSlug} onSelect={setActiveSlug} />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px', paddingBottom: 120 }}>
        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--dk-muted)',
            marginBottom: 4,
          }}>
            Olá, <span style={{ color: 'var(--dk-text)', fontWeight: 900 }}>{user?.name?.split(' ')[0]}</span> 👋
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2.1rem',
            color: 'var(--dk-text)',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
          }}>
            O que você quer hoje?
          </h2>
        </div>

        {error && (
          <div style={{
            background: 'rgba(232, 53, 10, 0.1)',
            border: '1px solid rgba(232, 53, 10, 0.25)',
            color: '#FF7055',
            borderRadius: 12,
            padding: '12px 16px',
            fontSize: 13,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 16,
            fontFamily: 'Nunito, sans-serif',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <p style={{ fontSize: '3rem', marginBottom: 12 }}>🍽️</p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, color: 'var(--dk-muted)' }}>
              Nenhum produto encontrado
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products.map(p => <ProductCard key={p.id} produto={p} />)}
          </div>
        )}
      </main>

      {/* Sticky cart button */}
      {count > 0 && (
        <div className="content-cta-bar">
          <div className="content-cta-inner">
            <button onClick={() => navigate('/cart')} className="content-cta-btn">
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: 13,
                fontWeight: 900,
                width: 28,
                height: 28,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {count}
              </span>
              <span>Ver carrinho</span>
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.9 }}>{formatPrice(total)}</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop logout */}
      <button
        onClick={logout}
        className="fixed top-4 right-16 hidden sm:block text-xs transition-colors"
        style={{ color: 'var(--dk-muted)', fontFamily: 'Nunito, sans-serif' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--dk-text)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--dk-muted)')}
      >
        Sair
      </button>
    </div>
  );
}
