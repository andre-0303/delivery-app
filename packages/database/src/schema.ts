import { pgTable, serial, varchar, numeric, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const statusPedidoEnum = pgEnum('status_pedido', [
  'pendente',
  'em_preparo',
  'pronto',
  'saiu_para_entrega',
  'entregue',
  'cancelado',
]);

export const formaPagamentoEnum = pgEnum('forma_pagamento', [
  'pix',
  'cartao_credito',
  'cartao_debito',
  'dinheiro',
]);

export const tDelCategoria = pgTable('t_del_categoria', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 60 }).notNull().unique(),
});

export const tDelProduto = pgTable('t_del_produto', {
  id: serial('id').primaryKey(),
  idCategoria: integer('id_categoria').notNull().references(() => tDelCategoria.id),
  name: varchar('name', { length: 100 }).notNull(),
  descricao: varchar('descricao', { length: 500 }),
  preco: numeric('preco', { precision: 10, scale: 2 }).notNull(),
  urlImagem: varchar('url_imagem', { length: 255 }),
});

export const tDelCliente = pgTable('t_del_cliente', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tDelAdmin = pgTable('t_del_admin', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tDelPedido = pgTable('t_del_pedido', {
  id: serial('id').primaryKey(),
  idCliente: integer('id_cliente').notNull().references(() => tDelCliente.id),
  status: statusPedidoEnum('status').notNull().default('pendente'),
  qtdeProdutos: numeric('qtde_produtos', { precision: 12, scale: 2 }).notNull(),
  valorFrete: numeric('valor_frete', { precision: 12, scale: 2 }).notNull().default('0'),
  valorTotal: numeric('valor_total', { precision: 12, scale: 2 }).notNull(),
  formaPagamento: formaPagamentoEnum('forma_pagamento').notNull(),
  enderecoEntrega: varchar('endereco_entrega', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tDelItemPedido = pgTable('t_del_item_pedido', {
  id: serial('id').primaryKey(),
  idPedido: integer('id_pedido').notNull().references(() => tDelPedido.id),
  idProduto: integer('id_produto').notNull().references(() => tDelProduto.id),
  quantidade: integer('quantidade').notNull(),
  precoUnitario: numeric('preco_unitario', { precision: 12, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
});

export type Categoria = typeof tDelCategoria.$inferSelect;
export type NewCategoria = typeof tDelCategoria.$inferInsert;
export type Produto = typeof tDelProduto.$inferSelect;
export type NewProduto = typeof tDelProduto.$inferInsert;
export type Cliente = typeof tDelCliente.$inferSelect;
export type NewCliente = typeof tDelCliente.$inferInsert;
export type Admin = typeof tDelAdmin.$inferSelect;
export type NewAdmin = typeof tDelAdmin.$inferInsert;
export type Pedido = typeof tDelPedido.$inferSelect;
export type NewPedido = typeof tDelPedido.$inferInsert;
export type ItemPedido = typeof tDelItemPedido.$inferSelect;
export type NewItemPedido = typeof tDelItemPedido.$inferInsert;
