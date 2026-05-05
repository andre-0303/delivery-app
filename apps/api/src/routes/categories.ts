import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db, tDelCategoria, eq } from '@repo/database';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const categoriaSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
});

router.get('/', async (_req: Request, res: Response) => {
  const categorias = await db.select().from(tDelCategoria);
  res.json(categorias);
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const result = categoriaSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [categoria] = await db.insert(tDelCategoria).values(result.data).returning();
  res.status(201).json(categoria);
});

router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = categoriaSchema.partial().safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const [updated] = await db.update(tDelCategoria).set(result.data).where(eq(tDelCategoria.id, id)).returning();
  if (!updated) {
    res.status(404).json({ error: 'Categoria não encontrada' });
    return;
  }

  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const [deleted] = await db.delete(tDelCategoria).where(eq(tDelCategoria.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: 'Categoria não encontrada' });
    return;
  }

  res.status(204).send();
});

export default router;
