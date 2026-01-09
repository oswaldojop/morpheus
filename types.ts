

export interface Company {
  id: string;
  name: string;
  cnpj: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  contactPerson?: string;
  phone?: string;
}

export enum TransactionType {
  REVENUE = 'revenue',
  EXPENSE = 'expense',
}

export interface Transaction {
  id:string;
  companyId: string;
  date: string; // Treated as Vencimento (Due Date)
  issueDate?: string; // Data de Emissão
  installments?: { // Parcelas
      current: number;
      total: number;
  };
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  notes?: string;
  partnerName?: string; // Nome do Sócio para Aportes
}

export interface CostItem {
  id: string;
  description: string;
  cost: number;
}

export interface Product {
  id: string;
  companyId: string;
  name: string;
  sellingPrice: number;
  costItems: CostItem[];
}

export interface MonthlyReportData {
  totalRevenue: number;
  totalExpenses: number;

  netProfit: number;
  expensesByCategory: { [category: string]: number };
}

export enum BoletoStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export interface Boleto {
  id: string;
  companyId: string;
  supplierId: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  amount: number;
  status: BoletoStatus;
  notes?: string;
  barcode?: string;
  paymentReceipt?: {
    fileName: string;
    mimeType: string;
    data: string; // base64 encoded
  };
}

export interface Settings {
    reminderDays: number;
}

export interface BackupData {
  companies: Company[];
  suppliers: Supplier[];
  transactions: Transaction[];
  boletos: Boleto[];
  settings?: Settings;
}

export type View = 'dashboard' | 'companies' | 'transactions' | 'reports' | 'suppliers' | 'payable' | 'receivable' | 'boletos';

export interface ReminderItem {
  id: string;
  sourceId: string;
  type: 'boleto' | 'transaction';
  description: string;
  dueDate: string;
  amount: number;
  view: View;
  status?: 'pending' | 'paid' | 'overdue';
}