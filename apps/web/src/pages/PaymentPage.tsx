import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PAYMENT_LABELS: Record<string, { label: string; icon: string }> = {
  pix: { label: 'Pix', icon: '⚡' },
  cartao_credito: { label: 'Cartão de crédito', icon: '💳' },
  cartao_debito: { label: 'Cartão de débito', icon: '💰' },
  dinheiro: { label: 'Dinheiro', icon: '🤑' },
};

function FakeQR() {
  return (
    <div className="pay-qr-card">
      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: 10,
        fontWeight: 700,
        color: 'var(--dk-muted)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}>
        Escaneie para pagar
      </p>
      <div className="pay-qr-inner">
        <div className="pay-qr-grid">
          {Array.from({ length: 49 }).map((_, i) => (
            <div
              key={i}
              className="pay-qr-cell"
              style={{ background: Math.random() > 0.45 ? '#1A1A1A' : 'transparent' }}
            />
          ))}
        </div>
      </div>
      <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--dk-muted)' }}>
        Confirmação automática
      </p>
    </div>
  );
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [stage, setStage] = useState<'processing' | 'approved'>('processing');

  const payMethod = sessionStorage.getItem('payMethod') ?? 'pix';
  const payInfo = PAYMENT_LABELS[payMethod] ?? PAYMENT_LABELS.pix;

  useEffect(() => {
    const t = setTimeout(() => setStage('approved'), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pay-page">
      <div className="dk-glow-top" />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 360 }}>
        {stage === 'processing' ? (
          <div className="animate-fade-up">
            {/* Animated concentric rings */}
            <div className="pay-rings">
              <div className="pay-ring" />
              <div className="pay-ring" />
              <div className="pay-ring" />
              <div className="pay-icon-circle">{payInfo.icon}</div>
            </div>

            <h2 className="pay-title">Processando pagamento</h2>
            <p className="pay-subtitle">{payInfo.label}</p>

            {payMethod === 'pix' && <FakeQR />}

            <div className="pay-dots">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="pay-dot"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fade-up">
            <div className="pay-success-circle">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  d="M12 22l8 8 12-12"
                  stroke="#22c55e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="40"
                  strokeDashoffset="0"
                  style={{ animation: 'check-draw 0.5s ease-out forwards' }}
                />
              </svg>
            </div>

            <h2 className="pay-title" style={{ fontSize: '1.6rem', marginBottom: 8 }}>
              Pagamento aprovado!
            </h2>
            <p className="pay-subtitle" style={{ marginBottom: 36 }}>
              Seu pedido foi confirmado com sucesso
            </p>

            <button
              onClick={() => navigate(`/confirmation/${orderId}`)}
              className="confirm-btn"
            >
              Ver meu pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
