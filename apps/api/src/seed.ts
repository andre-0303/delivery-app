import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db, tDelAdmin } from '@repo/database';
import { eq } from 'drizzle-orm';

async function seed() {
  const email = 'admin@lanchonete.com';
  const password = '123456';

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await db.select().from(tDelAdmin).where(eq(tDelAdmin.email, email));

  if (existing.length > 0) {
    await db.update(tDelAdmin).set({ passwordHash }).where(eq(tDelAdmin.email, email));
    console.log('Admin atualizado com hash correto.');
  } else {
    await db.insert(tDelAdmin).values({ name: 'Admin', email, passwordHash });
    console.log('Admin criado com sucesso.');
  }

  console.log(`Email: ${email}`);
  console.log(`Senha: ${password}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
