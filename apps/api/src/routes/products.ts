import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, tDelProduto, tDelCategoria, eq } from '@repo/database';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const produtoSchema = z.object({
  idCategoria: z.number().int().positive(),
  name: z.string().min(2).max(100),
  descricao: z.string().max(500).optional(),
  preco: z.string().regex(/^\d+(\.\d{1,2})?$/),
  urlImagem: z.string().url().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  const { categoria } = req.query;

  if (categoria) {
    const [cat] = await db.select().from(tDelCategoria).where(eq(tDelCategoria.slug, String(categoria)));
    if (!cat) {
      res.json([]);
      return;
    }
    const produtos = await db.select().from(tDelProduto).where(eq(tDelProduto.idCategoria, cat.id));
    res.json(produtos);
    return;
  }

  const produtos = await db.select().from(tDelProduto);
  res.json(produtos);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [produto] = await db.select().from(tDelProduto).where(eq(tDelProduto.id, id));
  if (!produto) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }
  res.json(produto);
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const result = produtoSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [produto] = await db.insert(tDelProduto).values(result.data).returning();
  res.status(201).json(produto);
});

router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = produtoSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [updated] = await db.update(tDelProduto).set(result.data).where(eq(tDelProduto.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(tDelProduto).where(eq(tDelProduto.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: 'Produto não encontrado' });
    return;
  }

  res.status(204).send();
});

export default router;
