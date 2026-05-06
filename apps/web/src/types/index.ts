export interface Produto {
  id: number;
  idCategoria: number;
  name: string;
  descricao: string | null;
  preco: string;
  urlImagem: string | null;
}

export interface Categoria {
  id: number;
  name: string;
  slug: string;
}

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Pedido {
  id: number;
  idCliente: number;
  status: string;
  qtdeProdutos: string;
  valorFrete: string;
  valorTotal: string;
  formaPagamento: string;
  enderecoEntrega: string;
  createdAt: string;
}
