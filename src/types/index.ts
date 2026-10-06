export type InvoiceStatus = 'DRAFT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceItem {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  vatRate: number; // 0, 5, 8, 10, or -1 for KCT
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  eInvoiceCode: string;
  customerName: string;
  customerCode: string;
  customerTaxCode: string;
  customerAddress: string;
  customerEmail: string;
  customerPhone?: string;
  customerContact?: string;
  customerSegment?: 'Enterprise' | 'SME' | 'FDI';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  terms: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  notes?: string;
  items: InvoiceItem[];
  paymentHistory?: {
    id: string;
    date: string;
    code: string;
    method: string;
    reference: string;
    amount: number;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    recordedBy: string;
  }[];
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  legalName?: string;
  taxCode: string;
  address: string;
  email: string;
  phone: string;
  contactPerson: string;
  contactRole?: string;
  segment: 'Enterprise' | 'SME' | 'FDI';
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  terms: string;
  gracePeriodDays: number;
  bankAccount: string;
  taxStatus: 'Valid' | 'Warning' | 'Pending';
  status: 'ACTIVE' | 'WARNING' | 'LOCKED';
  recentInvoicesCount?: number;
}

export interface RecurringPlan {
  id: string;
  code: string;
  customerName: string;
  taxCode: string;
  contact: string;
  serviceTitle: string;
  contractRef: string;
  frequency: 'Hàng tháng' | 'Hàng quý' | 'Hàng năm';
  terms: string;
  amountPerPeriod: number;
  nextRunDate: string;
  completedCycles: number;
  totalCycles?: number;
  status: 'ACTIVE' | 'PAUSED' | 'FAILED' | 'COMPLETED';
  autoSign: boolean;
  errorMessage?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  blockNumber: string;
  actorName: string;
  actorRole: string;
  actorIp: string;
  module: string;
  targetRef: string;
  actionCode: string;
  actionTitle: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  summary: string;
  verified: boolean;
  hash: string;
}

export type UserRole = 
  | 'ROLE_SYS_ADMIN' 
  | 'ROLE_BILLING_MANAGER' 
  | 'ROLE_ACCOUNTANT' 
  | 'ROLE_BILLING_STAFF' 
  | 'ROLE_AUDITOR' 
  | 'ROLE_CUSTOMER_PORTAL';

export interface UserRoleInfo {
  id: UserRole;
  title: string;
  code: string;
  badge: string;
  description: string;
  userCount: number;
  permissionCount: number;
  totalPermissions: number;
}

export interface ProductService {
  id: string;
  sku: string;
  name: string;
  category: 'Cloud Infrastructure' | 'Software License' | 'Technical Service' | 'Consulting';
  unit: string;
  unitPrice: number;
  vatRate: number; // 0, 5, 8, 10, or -1
  description: string;
  status: 'ACTIVE' | 'DISCONTINUED';
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerTaxCode: string;
  amount: number;
  paymentDate: string;
  method: string;
  reference: string;
  bankName: string;
  bankAccount?: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  recordedBy: string;
  notes?: string;
}

export interface BankTransaction {
  id: string;
  date: string;
  time: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reference: string;
  bankName: string;
  bankAccount: string;
  matched: boolean;
  matchedInvoiceNumber?: string;
  matchedCustomer?: string;
  status: 'MATCHED' | 'UNMATCHED' | 'DISCREPANCY';
}

export interface CreditNote {
  id: string;
  creditNoteNumber: string;
  originalInvoiceId: string;
  originalInvoiceNumber: string;
  customerName: string;
  customerTaxCode: string;
  issueDate: string;
  reason: string;
  adjustmentType: 'DECREASE_AMOUNT' | 'DISCOUNT' | 'SERVICE_RETURN' | 'INFO_CORRECTION';
  amount: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'APPROVED' | 'PROCESSED';
  approvedBy?: string;
  notes?: string;
}

export interface PaymentTerm {
  id: string;
  code: string;
  name: string;
  days: number;
  gracePeriodDays: number;
  latePenaltyRate: number; // %/month
  earlyDiscountPercent: number; // %
  earlyDiscountDays: number;
  description: string;
  isDefault: boolean;
  activeCustomersCount?: number;
}

export interface VatReportItem {
  taxRate: string;
  netRevenue: number;
  vatAmount: number;
  invoiceCount: number;
}

