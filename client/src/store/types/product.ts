export interface ProductSize {
  size: string;
  quantity: number;
  _id: string;
}

export interface ProductDetail {
  _id: string;
  productName: string;
  description: string;
  price: number;
  discount: number;
  image: string[];
  category: string;
  note: string;
  sizes: ProductSize[];
  file: string;
  color: string;
  productDetails: string;
  isReturn: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
