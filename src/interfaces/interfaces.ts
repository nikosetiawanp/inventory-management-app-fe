export interface Product {
  id: number;
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
  type: "V" | "C";
  debts: Debt[];
}

export interface DebtHistory {
  id: number;
  amount: number;
  createdAt: Date;
  type: "D" | "P";
  date: string;
}

export interface MonthlyDebt {
  id: number;
  name: string;
  code: string;
  initialBalance: number;
  totalDebt: number;
  totalPayment: number;
  currentBalance: number;
  histories: DebtHistory[];
}

export interface TransactionItem {
  items(items: any): unknown;
  id: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  transactionId: string | number;
  productId: string | number;
  arrivedQuantity: number;

  transaction: Transaction;
  product: Product;
}

export interface Transaction {
  id: number;
  number: string;
  date: string;
  expectedArrival: string;
  isApproved: boolean;
  isDone: boolean;
  contactId: string;

  contact: Contact;
  contacts: Contact[];
  transactionItems: TransactionItem[];
  inventories: Inventory[];
}

export interface Inventory {
  id: number | string;
  number: string;
  date: any;
  type: "A" | "D";
  receiptNumber: string;
  description: string | null;
  transactionId: string | number;

  transaction: Transaction;
  contact: Contact;
  inventoryItems: InventoryItem[];
  invoices: Invoice[];
}

export interface InventoryItem {
  id: number | string;
  quantity: number;
  productId: string | number;
  inventoryId: string | number;
  product: Product;
}

export interface Invoice {
  id: number | string;
  number: string;
  date: string;
  dueDate: string;
  inventoryId: number | string;
  transactionId: number | string;

  inventory: Inventory;
  transaction: Transaction;
  debts: Debt[];
}

export interface Debt {
  id: number | string;
  amount: number;
  type: "D" | "R";
  isPaid: boolean;
  invoiceId: string | number;
  contactId: string | number;

  invoice: Invoice;
  contact: Contact;
  payments: Payment[];
}

export interface Payment {
  id: number | string;
  date: string;
  amount: number;
  debtId: number | string;

  debt: Debt;
}

export interface Account {
  id: number | string;
  number: string;
  name: string;
}
export interface Cash {
  id: number | string;
  date: string;
  number: string;
  description: string;
  amount: number;
  accountId: number | string;

  account: Account;
}

export interface Alert {
  open: boolean;
  color: "neutral" | "success" | "danger";
  message: string;
}
