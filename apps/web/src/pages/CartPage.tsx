import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';

function formatPrice(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const FRETE = 5.0;

export default function CartPage() {
  const { items, updateQty, total, count } = useCart();
  const navigate = useNavigate();

  if (count === 0) {
    return (
      <div className="content-page">
        <Header title="Carrinho" showBack />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', padding: '0 24px' }}>
          <p style={{ fontSize: '3.5rem', marginBottom: 16 }}>🛒</p>
          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 20, color: 'var(--dk-text)', marginBottom: 8 }}>
            Carrinho vazio
          </h2>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--dk-muted)', textAlign: 'center', marginBottom: 32, lineHeight: 1.5 }}>
            Adicione produtos para fazer seu pedido
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 32px',
              background: 'var(--dk-accent)',
              color: 'white',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 14,
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(232,53,10,0.35)',
            }}
          >
            Ver cardápio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-page" style={{ paddingBottom: 120 }}>
      <Header title="Meu carrinho" showBack />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Items */}
        <div className="cart-items-card">
          {items.map(({ produto, quantidade }) => (
            <div key={produto.id} className="cart-item-row">
              <div style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--dk-input)',
              }}>
                {produto.urlImagem ? (
                  <img src={produto.urlImagem} alt={produto.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>🍔</div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--dk-text)', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {produto.name}
                </p>
                <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, color: 'var(--dk-accent)' }}>
                  {formatPrice(parseFloat(produto.preco) * quantidade)}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <button
                  onClick={() => updateQty(produto.id, quantidade - 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: quantidade === 1 ? 'rgba(232,53,10,0.12)' : 'var(--dk-card)',
                    border: `1.5px solid ${quantidade === 1 ? 'rgba(232,53,10,0.35)' : 'var(--dk-border)'}`,
                    color: quantidade === 1 ? 'var(--dk-accent)' : 'var(--dk-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {quantidade === 1
                    ? <Trash2 size={14} />
                    : <span style={{ fontSize: '1.1rem', lineHeight: 1, fontWeight: 700 }}>−</span>
                  }
                </button>

                <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 15, color: 'var(--dk-text)', minWidth: 20, textAlign: 'center' }}>
                  {quantidade}
                </span>

                <button
                  onClick={() => updateQty(produto.id, quantidade + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--dk-accent)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.3rem',
                    lineHeight: 1,
                    boxShadow: '0 3px 10px rgba(232,53,10,0.3)',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="dk-card">
          <p className="dk-card-title">Resumo do pedido</p>
          <div className="dk-row">
            <span className="dk-label">Subtotal</span>
            <span className="dk-value">{formatPrice(total)}</span>
          </div>
          <div className="dk-row">
            <span className="dk-label">Taxa de entrega</span>
            <span className="dk-value">{formatPrice(FRETE)}</span>
          </div>
          <hr style={{ height: 1, background: 'none', border: 'none', borderTop: '1px dashed var(--dk-border)', margin: '12px 0' }} />
          <div className="dk-total-row">
            <span className="dk-total-label">Total</span>
            <span className="dk-total-value">{formatPrice(total + FRETE)}</span>
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="content-cta-bar">
        <div className="content-cta-inner">
          <button onClick={() => navigate('/checkout')} className="content-cta-btn" style={{ justifyContent: 'center' }}>
            Ir para entrega
          </button>
        </div>
      </div>
    </div>
  );
}
