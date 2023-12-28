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

export interface Purchase {
  id: string;
  prDate: Date;
  prNumber: string;

  vendor: Vendor;
}
