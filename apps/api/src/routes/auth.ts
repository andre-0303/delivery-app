import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db, tDelCliente, tDelAdmin, eq } from '@repo/database';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req: Request, res: Response) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { name, email, password, phone } = result.data;

  const existing = await db.select().from(tDelCliente).where(eq(tDelCliente.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: 'Email já cadastrado' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [cliente] = await db.insert(tDelCliente).values({ name, email, passwordHash, phone }).returning();

  const token = jwt.sign(
    { id: cliente.id, email: cliente.email, role: 'cliente' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.status(201).json({ token, cliente: { id: cliente.id, name: cliente.name, email: cliente.email } });
});

router.post('/login', async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;
  const [cliente] = await db.select().from(tDelCliente).where(eq(tDelCliente.email, email));

  if (!cliente || !(await bcrypt.compare(password, cliente.passwordHash))) {
    res.status(401).json({ error: 'Email ou senha inválidos' });
    return;
  }

  const token = jwt.sign(
    { id: cliente.id, email: cliente.email, role: 'cliente' },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ token, cliente: { id: cliente.id, name: cliente.name, email: cliente.email } });
});

router.post('/admin/login', async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;
  const [admin] = await db.select().from(tDelAdmin).where(eq(tDelAdmin.email, email));

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    res.status(401).json({ error: 'Email ou senha inválidos' });
    return;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '8h' }
  );

  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
});

export default router;
