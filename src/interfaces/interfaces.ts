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
  price: number;
  discount: number;
  tax: number;
  purchaseId: string | number;
  productId: string | number;

  purchase: Purchase;
  product: Product;
}

export interface Purchase {
  id: string | number;
  number: string;
  date: string;
  expectedArrival: string;
  isApproved: boolean;
  isDone: boolean;
  contactId: string | number;

  contact: Contact;
  contacts: Contact[];
  purchaseItems: PurchaseItem[];
  inventories: Inventory[];
}

export interface Inventory {
  id: number | string;
  number: string;
  date: any;
  isArrival: boolean;
  receiptNumber: string;
  description: string | null;
  purchaseId: string | number;

  purchase: Purchase;
  contact: Contact;
  inventoryItems: InventoryItem[];
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
  purchaseId: number | string;

  inventory: Inventory;
  purchase: Purchase;
  debts: Debt[];
}

export interface Debt {
  id: number | string;
  amount: number;
  isPaid: boolean;
  invoiceId: string | number;
  contactId: string | number;

  invoice: Invoice;
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
// export interface CreatePurchase {
//   number: data.number,
//   date: formattedDate,
//   expectedArrival: null,
//   isApproved: false,
//   contactId: selectedContact?.id,
// }
