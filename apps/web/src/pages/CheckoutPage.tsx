import { useState } from 'react';
import { MapPin, CreditCard, Zap, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';

type PayMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';

const paymentOptions: { value: PayMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'pix',           label: 'Pix',               icon: <Zap size={20} />,        desc: 'Aprovação instantânea' },
  { value: 'cartao_credito', label: 'Cartão de crédito', icon: <CreditCard size={20} />, desc: 'Visa, Master, Elo' },
  { value: 'cartao_debito',  label: 'Cartão de débito',  icon: <Wallet size={20} />,     desc: 'Visa, Master, Elo' },
  { value: 'dinheiro',       label: 'Dinheiro',          icon: <Banknote size={20} />,   desc: 'Pague na entrega' },
];

function formatPrice(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

const FRETE = 5.0;

export default function CheckoutPage() {
  const [address, setAddress] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('pix');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { items, total, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  async function handleOrder() {
    if (!address.trim()) {
      setError('Informe o endereço de entrega');
      return;
    }
    if (!token) return;

    setError('');
    setLoading(true);
    try {
      const res = await api.orders.create({
        formaPagamento: payMethod,
        enderecoEntrega: address,
        valorFrete: FRETE.toFixed(2),
        itens: items.map(i => ({ idProduto: i.produto.id, quantidade: i.quantidade })),
      }, token);
      clearCart();
      navigate(`/payment/${res.pedido.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer pedido');
      setLoading(false);
    }
  }

  return (
    <div className="content-page" style={{ paddingBottom: 120 }}>
      <Header title="Finalizar pedido" showBack />

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Address */}
        <section className="checkout-section">
          <h3 className="checkout-section-title">
            <MapPin size={18} color="var(--dk-accent)" />
            Endereço de entrega
          </h3>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Rua, número, complemento, bairro..."
            rows={3}
            className="checkout-textarea"
          />
        </section>

        {/* Payment */}
        <section className="checkout-section">
          <h3 className="checkout-section-title">
            <CreditCard size={18} color="var(--dk-accent)" />
            Forma de pagamento
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {paymentOptions.map(opt => {
              const active = payMethod === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPayMethod(opt.value)}
                  className={`pay-option-btn ${active ? 'pay-option-btn--active' : 'pay-option-btn--inactive'}`}
                >
                  <span style={{ color: active ? 'var(--dk-accent)' : 'var(--dk-muted)', flexShrink: 0, display: 'flex' }}>
                    {opt.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <p style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--dk-text)', marginBottom: 1 }}>
                      {opt.label}
                    </p>
                    <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 12, color: 'var(--dk-muted)' }}>
                      {opt.desc}
                    </p>
                  </div>
                  <span style={{ flexShrink: 0, display: 'flex', color: active ? 'var(--dk-accent)' : 'var(--dk-border)', transition: 'color 0.2s' }}>
                    <CheckCircle2 size={18} fill={active ? 'var(--dk-accent)' : 'transparent'} color={active ? 'var(--dk-accent)' : 'var(--dk-border)'} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Summary */}
        <section className="dk-card">
          <p className="dk-card-title">Resumo</p>
          <div className="dk-row">
            <span className="dk-label">Subtotal</span>
            <span className="dk-value">{formatPrice(total)}</span>
          </div>
          <div className="dk-row">
            <span className="dk-label">Entrega</span>
            <span className="dk-value">{formatPrice(FRETE)}</span>
          </div>
          <hr style={{ height: 1, background: 'none', border: 'none', borderTop: '1px dashed var(--dk-border)', margin: '12px 0' }} />
          <div className="dk-total-row">
            <span className="dk-total-label">Total</span>
            <span className="dk-total-value">{formatPrice(total + FRETE)}</span>
          </div>
        </section>

        {error && (
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            textAlign: 'center',
            color: '#FF7055',
            background: 'rgba(232,53,10,0.1)',
            border: '1px solid rgba(232,53,10,0.2)',
            borderRadius: 12,
            padding: '12px 16px',
          }}>
            {error}
          </p>
        )}
      </main>

      <div className="content-cta-bar">
        <div className="content-cta-inner">
          <button
            onClick={handleOrder}
            disabled={loading}
            className="content-cta-btn"
            style={{ justifyContent: 'center', gap: 8 }}
          >
            {loading ? 'Fazendo pedido...' : `Fazer pedido • ${formatPrice(total + FRETE)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
