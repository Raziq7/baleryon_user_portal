// src/types/cart.ts

export interface CartData {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}


export interface ProductInCart {
  _id: string;
  productName: string;
  image: string[];
  price: number;
  discount:number;
}

export interface CartProduct {
  _id: string;
  productId: ProductInCart;
  quantity: number;
  size: string;
  color: string;
  price: number;
  productName: string;
  image: string[];
}

export interface CartResponse {
  items: CartProduct[];
  total: number;
  message?: string;
  subtotal: number;
  userId: string;
}



export interface updateCartQuantity {
  userId: string;
  cartId: string;
  productId: string;
  quantity: number;
}

export interface ApiErrorResponse {
  message: string;
}
