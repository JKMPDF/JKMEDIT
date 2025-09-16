export type CompanyType = 'Private' | 'Public' | 'Proprietor' | 'LLP' | 'Firm' | '';

export interface CompanyDetails {
  name: string;
  address: string;
  country: string;
  state: string;
  pincode: string;
  email: string;
  financialYear: string;
  currencySymbol: string;
  companyType: CompanyType;
  gstApplicable: boolean;
  gstNo: string;
  tdsApplicable: boolean;
  prevYearTurnover: number | '';
}

export interface Ledger {
  id: string;
  name: string;
  group: string;
  // Future fields for when Sundry Creditor/Debtor is selected
  address?: string;
  state?: string;
  pincode?: string;
  gstNo?: string;
  panNo?: string;
}

export interface StockItem {
  id: string;
  name: string;
  unit: string;
  hsnCode?: string;
  gstRate?: number; // e.g., 18 for 18%
}

export interface InventoryAllocation {
  stockItemId: string;
  quantity: number;
  rate: number;
}

export interface VoucherEntry {
  type: 'Dr' | 'Cr';
  ledgerId: string;
  amount: number;
  inventoryAllocations?: InventoryAllocation[];
}

export interface Voucher {
  id: string;
  date: string;
  type: 'Sale' | 'Purchase' | 'Payment' | 'Receipt' | 'Journal';
  entries: VoucherEntry[];
  narration: string;
}

export interface CompanyData {
  details: CompanyDetails;
  ledgers: Ledger[];
  stockItems: StockItem[];
  vouchers: Voucher[];
}