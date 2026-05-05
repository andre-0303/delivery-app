import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  role: 'cliente' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }
    next();
  });
}

export function requireCliente(req: Request, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'cliente') {
      res.status(403).json({ error: 'Acesso restrito a clientes' });
      return;
    }
    next();
  });
}
