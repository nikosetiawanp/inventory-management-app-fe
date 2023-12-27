export interface Product {
  id: string;
  code: string;
  name: string;
  unit: string;
}

export interface Vendor {
  id: string | any;
  code: string | any;
  name: string | any;
  address: string | any;
  phone: string | any;
  email: string | any;
}

export interface Purchase {
  id: string;
  prDate: Date;
  prNumber: string;

  vendor: Vendor;
}
