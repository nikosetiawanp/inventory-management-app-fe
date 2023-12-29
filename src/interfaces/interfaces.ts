import { ReactNode } from "react";

export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
}

export interface Vendor {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Item {
  id: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  purchaseId: string | number;
  productId: string | number;

  product: Product;
}

export interface Purchase {
  id: string;
  vendorId: string | number;

  prDate: any;
  prNumber: string;

  poDate: any;
  poNumber: string;

  vendor: Vendor;
  items: Item[];
}
