import type { Produto } from '../types';
import { useCart } from '../contexts/CartContext';

function formatPrice(preco: string) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(preco));
}

export default function ProductCard({ produto }: { produto: Produto }) {
  const { addItem, updateQty, getQty } = useCart();
  const qty = getQty(produto.id);

  return (
    <div
      className="prod-card"
      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: 'hidden',
        flexShrink: 0,
        background: 'var(--dk-input)',
      }}>
        {produto.urlImagem ? (
          <img
            src={produto.urlImagem}
            alt={produto.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            🍔
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 700,
          fontSize: 14,
          lineHeight: 1.35,
          color: 'var(--dk-text)',
          marginBottom: 3,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {produto.name}
        </h3>
        {produto.descricao && (
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--dk-muted)',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginBottom: 6,
          }}>
            {produto.descricao}
          </p>
        )}
        <span style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 900,
          fontSize: 15,
          color: 'var(--dk-accent)',
        }}>
          {formatPrice(produto.preco)}
        </span>
      </div>

      {/* Qty controls */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {qty === 0 ? (
          <button
            onClick={() => addItem(produto)}
            aria-label={`Adicionar ${produto.name}`}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--dk-accent)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.4rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.15s, transform 0.1s',
              boxShadow: '0 4px 14px rgba(232, 53, 10, 0.35)',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.9)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            +
          </button>
        ) : (
          <>
            <button
              onClick={() => addItem(produto)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'var(--dk-accent)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.15s',
              }}
            >
              +
            </button>
            <span style={{
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 900,
              fontSize: 14,
              color: 'var(--dk-text)',
              minWidth: 20,
              textAlign: 'center',
            }}>
              {qty}
            </span>
            <button
              onClick={() => updateQty(produto.id, qty - 1)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'transparent',
                color: 'var(--dk-accent)',
                border: '2px solid var(--dk-accent)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.15s',
              }}
            >
              {qty === 1 ? '🗑' : '−'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
