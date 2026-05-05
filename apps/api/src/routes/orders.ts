import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, tDelPedido, tDelItemPedido, tDelProduto, eq, inArray } from '@repo/database';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

const itemSchema = z.object({
  idProduto: z.number().int().positive(),
  quantidade: z.number().int().positive(),
});

const pedidoSchema = z.object({
  formaPagamento: z.enum(['pix', 'cartao_credito', 'cartao_debito', 'dinheiro']),
  enderecoEntrega: z.string().min(5).max(500),
  valorFrete: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  itens: z.array(itemSchema).min(1),
});

const statusSchema = z.object({
  status: z.enum(['pendente', 'em_preparo', 'pronto', 'saiu_para_entrega', 'entregue', 'cancelado']),
});

router.post('/', verifyToken, async (req: Request, res: Response) => {
  if (req.user?.role !== 'cliente') {
    res.status(403).json({ error: 'Somente clientes podem criar pedidos' });
    return;
  }

  const result = pedidoSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { formaPagamento, enderecoEntrega, valorFrete = '0', itens } = result.data;

  const produtosIds = itens.map((i) => i.idProduto);
  const produtos = await db.select().from(tDelProduto).where(inArray(tDelProduto.id, produtosIds));

  const produtoMap = new Map(produtos.map((p) => [String(p.id), p]));

  let valorTotal = parseFloat(valorFrete);
  let qtdeProdutos = 0;

  const itensPrepared = itens.map((item) => {
    const produto = produtoMap.get(String(item.idProduto));
    if (!produto) throw new Error(`Produto ${item.idProduto} não encontrado`);
    const precoUnitario = parseFloat(produto.preco);
    const subtotal = precoUnitario * item.quantidade;
    valorTotal += subtotal;
    qtdeProdutos += item.quantidade;
    return {
      idProduto: item.idProduto,
      quantidade: item.quantidade,
      precoUnitario: produto.preco,
      subtotal: subtotal.toFixed(2),
    };
  });

  const [pedido] = await db.insert(tDelPedido).values({
    idCliente: req.user!.id,
    formaPagamento,
    enderecoEntrega,
    valorFrete,
    qtdeProdutos: qtdeProdutos.toString(),
    valorTotal: valorTotal.toFixed(2),
    status: 'pendente',
  }).returning();

  const itensFinal = itensPrepared.map((i) => ({ ...i, idPedido: pedido.id }));
  await db.insert(tDelItemPedido).values(itensFinal);

  res.status(201).json({ pedido, itens: itensFinal });
});

router.get('/', verifyToken, async (req: Request, res: Response) => {
  if (req.user?.role === 'admin') {
    const pedidos = await db.select().from(tDelPedido).orderBy(tDelPedido.createdAt);
    res.json(pedidos);
    return;
  }

  const pedidos = await db.select().from(tDelPedido).where(eq(tDelPedido.idCliente, req.user!.id));
  res.json(pedidos);
});

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [pedido] = await db.select().from(tDelPedido).where(eq(tDelPedido.id, id));

  if (!pedido) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  if (req.user?.role !== 'admin' && pedido.idCliente !== req.user?.id) {
    res.status(403).json({ error: 'Acesso negado' });
    return;
  }

  const itens = await db.select().from(tDelItemPedido).where(eq(tDelItemPedido.idPedido, id));
  res.json({ pedido, itens });
});

router.patch('/:id/status', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = statusSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [updated] = await db.update(tDelPedido).set({ status: result.data.status }).where(eq(tDelPedido.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  res.json(updated);
});

export default router;
