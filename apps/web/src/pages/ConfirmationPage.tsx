import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { Pedido } from '../types';

function formatPrice(v: string) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(v));
}

const STATUS_MAP: Record<string, string> = {
  pendente: 'Aguardando confirmação',
  em_preparo: 'Em preparo',
  pronto: 'Pronto para entrega',
  saiu_para_entrega: 'Saiu para entrega',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const PAY_MAP: Record<string, string> = {
  pix: 'Pix',
  cartao_credito: 'Cartão de crédito',
  cartao_debito: 'Cartão de débito',
  dinheiro: 'Dinheiro',
};

export default function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    if (!orderId || !token) return;
    api.orders.get(Number(orderId), token)
      .then(res => setPedido(res.pedido))
      .catch(() => {});
  }, [orderId, token]);

  return (
    <div className="confirm-page">
      <div className="dk-glow-top" />

      {/* Hero */}
      <div className="confirm-hero animate-bounce-in">
        <div className="confirm-check-wrap">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path
              d="M10 22l8 8 16-16"
              stroke="#22c55e"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="confirm-title">Pedido Confirmado!</h1>
        <p className="confirm-subtitle">
          Pedido #{orderId} · {pedido ? STATUS_MAP[pedido.status] : 'Aguardando...'}
        </p>
      </div>

      {/* Content */}
      <main className="confirm-content animate-fade-up">
        {/* ETA */}
        <div className="dk-card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2.8rem', marginBottom: 10 }}>🛵</p>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontWeight: 900,
            color: 'var(--dk-text)',
            fontSize: 16,
            marginBottom: 5,
          }}>
            Chegando em ~40 minutos
          </p>
          <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 600, color: 'var(--dk-muted)' }}>
            {pedido?.enderecoEntrega ?? 'Carregando endereço...'}
          </p>
        </div>

        {/* Order details */}
        {pedido && (
          <div className="dk-card">
            <p className="dk-card-title">Detalhes do pedido</p>

            <div className="dk-row">
              <span className="dk-label">Subtotal</span>
              <span className="dk-value">
                {formatPrice((parseFloat(pedido.valorTotal) - parseFloat(pedido.valorFrete)).toFixed(2))}
              </span>
            </div>
            <div className="dk-row">
              <span className="dk-label">Taxa de entrega</span>
              <span className="dk-value">{formatPrice(pedido.valorFrete)}</span>
            </div>
            <div className="dk-row">
              <span className="dk-label">Pagamento</span>
              <span className="dk-value">{PAY_MAP[pedido.formaPagamento] ?? pedido.formaPagamento}</span>
            </div>
            <hr className="dk-divider" />
            <div className="dk-total-row">
              <span className="dk-total-label">Total</span>
              <span className="dk-total-value">{formatPrice(pedido.valorTotal)}</span>
            </div>
          </div>
        )}

        {/* Notification badge */}
        <div className="dk-card" style={{
          borderColor: 'rgba(232, 53, 10, 0.2)',
          background: 'rgba(232, 53, 10, 0.06)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--dk-accent)',
          }}>
            🔔 Você receberá atualizações do status do pedido
          </p>
        </div>
      </main>

      {/* CTA */}
      <div className="confirm-cta-bar">
        <div className="confirm-cta-inner">
          <button className="confirm-btn" onClick={() => navigate('/')}>
            Voltar ao cardápio
          </button>
        </div>
      </div>
    </div>
  );
}
