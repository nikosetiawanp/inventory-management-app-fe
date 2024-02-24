import { ReactNode } from "react";

export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
  quantity: number;
}

export interface Contact {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  is_supplier: boolean;
}

export interface PurchaseItem {
  items(items: any): unknown;
  id: string;
  quantity: number;
  prPrice: number;
  poPrice: number;
  discount: number;
  tax: number;
  purchaseId: string | number;
  productId: string | number;

  product: Product;
}

export interface Purchase {
  id: string | any;
  vendorId: string | number | undefined;
  status: "PR" | "PO";

  prDate: any;
  prNumber: string;

  poDate: any | null;
  poNumber: string | null;

  vendor: Vendor;
  purchaseItems: PurchaseItem[];
}

export interface Inventory {
  id: number | string;
  date: any;
  letterNumber: string;
  invoiceNumber: string;
  description: string | null;
  type: "A" | "D";

  purchaseId: string | number;
  purchase: Purchase;
  vendor: Vendor;
  inventoryItems: InventoryItem[];
}

export interface InventoryItem {
  id: number | string;
  quantity: number;
  stockAfter: number;
  product: Product;
  productId: string | number;
}

export interface Invoice {
  id: number | string;
  date: string;
  dueDate: string;
  totalDebt: number;
  invoiceNumber: string;

  inventoryId: number | string;
  purchaseId: number | string;

  inventory: Inventory;
  purchase: Purchase;
}

export interface Debt {
  id: number | string;
  debtAmount: number;
  status: "PAID" | "UNPAID";
  paidDate: string;
  receiptNumber: string;
  paidAmount: number;
  invoiceId: number | string;
  invoice: Invoice;
  balance: number;
  debtPayments: DebtPayment[];
}

export interface DebtPayment {
  id: number | string;
  receiptNumber: string;
  paidDate: string;
  paidAmount: number;
  balance: number;
  debtId: number;
  debt: Debt;
}

export interface CreatePurchaseRequisition {
  vendorId: string | number | undefined;
  prDate: string;
  prNumber: string;
}
