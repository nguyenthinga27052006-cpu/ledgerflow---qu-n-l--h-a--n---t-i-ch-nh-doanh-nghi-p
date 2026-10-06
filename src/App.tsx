import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { InvoicesView } from './components/views/InvoicesView';
import { InvoiceDetailView } from './components/views/InvoiceDetailView';
import { CreateInvoiceView } from './components/views/CreateInvoiceView';
import { PaymentsView } from './components/views/PaymentsView';
import { ReconciliationView } from './components/views/ReconciliationView';
import { RefundsView } from './components/views/RefundsView';
import { ProductsServicesView } from './components/views/ProductsServicesView';
import { TaxesView } from './components/views/TaxesView';
import { PaymentTermsView } from './components/views/PaymentTermsView';
import { RevenueView } from './components/views/RevenueView';
import { AgingReportView } from './components/views/AgingReportView';
import { CollectionMetricsView } from './components/views/CollectionMetricsView';
import { RecurringPlansView } from './components/views/RecurringPlansView';
import { CustomersView } from './components/views/CustomersView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { PaymentModal } from './components/modals/PaymentModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

import {
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_RECURRING_PLANS,
  INITIAL_AUDIT_LOGS,
  INITIAL_PRODUCTS,
  INITIAL_PAYMENTS,
  INITIAL_BANK_TRANSACTIONS,
  INITIAL_CREDIT_NOTES,
  INITIAL_PAYMENT_TERMS,
  ROLE_DEFINITIONS,
} from './data/mockData';
import {
  Invoice,
  Customer,
  RecurringPlan,
  AuditEvent,
  UserRole,
  ProductService,
  PaymentRecord,
  BankTransaction,
  CreditNote,
  PaymentTerm,
} from './types';
import { formatVND } from './utils/formatters';

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [recurringPlans, setRecurringPlans] = useState<RecurringPlan[]>(INITIAL_RECURRING_PLANS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [products, setProducts] = useState<ProductService[]>(INITIAL_PRODUCTS);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(INITIAL_BANK_TRANSACTIONS);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(INITIAL_CREDIT_NOTES);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>(INITIAL_PAYMENT_TERMS);

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('inv-103');
  const [activeRole, setActiveRole] = useState<UserRole>('ROLE_ACCOUNTANT');

  // Dark Mode State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ledgerflow_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ledgerflow_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ledgerflow_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    showToast(dark ? 'Đã kích hoạt Chế độ Tối (Dark Mode)' : 'Đã kích hoạt Chế độ Sáng (Light Mode)');
  };

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Global toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, invoiceId?: string) => {
    if (invoiceId) {
      setSelectedInvoiceId(invoiceId);
      setCurrentView('invoice-detail');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Payment Recording
  const handleOpenPayment = (invoice: Invoice) => {
    setPayingInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const handleOpenPaymentFromInvoice = (invoice?: Invoice) => {
    const target = invoice || invoices.find((i) => i.remainingAmount > 0) || invoices[0];
    setPayingInvoice(target);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = (paymentData: {
    amount: number;
    method: string;
    reference: string;
    date: string;
    notes: string;
  }) => {
    if (!payingInvoice) return;

    const newPaidAmount = payingInvoice.paidAmount + paymentData.amount;
    const newRemaining = Math.max(0, payingInvoice.totalAmount - newPaidAmount);
    const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const newPaymentRecord = {
      id: `pay-${Date.now()}`,
      date: paymentData.date,
      code: `REC-${Date.now().toString().slice(-4)}`,
      method: paymentData.method,
      reference: paymentData.reference,
      amount: paymentData.amount,
      status: 'SUCCESS' as const,
      recordedBy: 'Nguyễn Văn Minh (Kế toán)',
    };

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === payingInvoice.id) {
          return {
            ...inv,
            paidAmount: newPaidAmount,
            remainingAmount: newRemaining,
            status: newStatus,
            paymentHistory: [newPaymentRecord, ...(inv.paymentHistory || [])],
          };
        }
        return inv;
      })
    );

    // Also update global paymentRecords ledger
    const fullPayRecord: PaymentRecord = {
      id: `pay-rec-${Date.now()}`,
      paymentNumber: `REC-${Date.now().toString().slice(-4)}`,
      invoiceId: payingInvoice.id,
      invoiceNumber: payingInvoice.invoiceNumber,
      customerName: payingInvoice.customerName,
      customerTaxCode: payingInvoice.customerTaxCode,
      amount: paymentData.amount,
      paymentDate: paymentData.date,
      method: paymentData.method,
      reference: paymentData.reference,
      bankName: 'Techcombank - CN Hội Sở',
      status: 'SUCCESS',
      recordedBy: 'Nguyễn Văn Minh (Kế toán)',
      notes: paymentData.notes,
    };
    setPaymentRecords((prev) => [fullPayRecord, ...prev]);

    // Update customer currentDebt
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.taxCode === payingInvoice.customerTaxCode) {
          return {
            ...c,
            currentDebt: Math.max(0, c.currentDebt - paymentData.amount),
          };
        }
        return c;
      })
    );

    // Audit log entry
    const newAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      blockNumber: `#BLK-${Math.floor(88500 + Math.random() * 500)}`,
      actorName: 'Nguyễn Văn Minh',
      actorRole: 'Kế toán viên',
      actorIp: '192.168.1.108',
      module: 'Payments',
      targetRef: payingInvoice.invoiceNumber,
      actionCode: 'PAYMENT_RECORDED',
      actionTitle: `Ghi nhận thanh toán ${formatVND(paymentData.amount)}`,
      severity: 'INFO',
      summary: `Đã đối soát thanh toán ${formatVND(paymentData.amount)} qua ${paymentData.method} (Ref: ${paymentData.reference}) cho hóa đơn ${payingInvoice.invoiceNumber}.`,
      verified: true,
      hash: `8a7b9c${Math.random().toString(16).slice(2, 10)}b8e91d09`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    setIsPaymentModalOpen(false);
    setPayingInvoice(null);
    showToast(`Đã ghi nhận thanh toán ${formatVND(paymentData.amount)} thành công!`);
  };

  // Create Invoice
  const handleCreateInvoice = (newInv: Invoice, shouldSignAndIssue: boolean) => {
    setInvoices((prev) => [newInv, ...prev]);

    // Update customer debt if issued
    if (shouldSignAndIssue) {
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.taxCode === newInv.customerTaxCode) {
            return {
              ...c,
              currentDebt: c.currentDebt + newInv.totalAmount,
            };
          }
          return c;
        })
      );
    }

    const auditEvent: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      blockNumber: `#BLK-${Math.floor(88500 + Math.random() * 500)}`,
      actorName: 'Nguyễn Văn Minh',
      actorRole: 'Kế toán viên',
      actorIp: '192.168.1.108',
      module: 'Invoicing',
      targetRef: newInv.invoiceNumber,
      actionCode: shouldSignAndIssue ? 'INVOICE_ISSUED_HSM' : 'INVOICE_DRAFT_CREATED',
      actionTitle: shouldSignAndIssue ? `Ký số HSM & Phát hành hóa đơn` : `Tạo hóa đơn nháp mới`,
      severity: 'INFO',
      summary: `Lập hóa đơn ${newInv.invoiceNumber} cho khách hàng ${newInv.customerName} giá trị ${formatVND(newInv.totalAmount)}.`,
      verified: true,
      hash: `3b9d02${Math.random().toString(16).slice(2, 10)}88fe1a`,
    };
    setAuditLogs((prev) => [auditEvent, ...prev]);

    setSelectedInvoiceId(newInv.id);
    setCurrentView('invoice-detail');
    showToast(
      shouldSignAndIssue
        ? `Đã ký số Cloud HSM & phát hành hóa đơn #${newInv.invoiceNumber}!`
        : `Đã lưu bản nháp hóa đơn #${newInv.invoiceNumber}!`
    );
  };

  // Create Customer
  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Đã thêm khách hàng ${newCustomer.name} vào danh bạ.`);
  };

  // Create Product / Service
  const handleCreateProduct = (newProd: ProductService) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Đã thêm dịch vụ "${newProd.name}" vào bảng giá.`);
  };

  // Create Credit Note
  const handleCreateCreditNote = (newNote: CreditNote) => {
    setCreditNotes((prev) => [newNote, ...prev]);
    // update customer debt
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.taxCode === newNote.customerTaxCode) {
          return {
            ...c,
            currentDebt: Math.max(0, c.currentDebt - newNote.totalAmount),
          };
        }
        return c;
      })
    );
    // audit log
    const creditAudit: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      blockNumber: `#BLK-${Math.floor(88500 + Math.random() * 500)}`,
      actorName: 'Trần Mai Anh',
      actorRole: 'Billing Manager',
      actorIp: '192.168.1.108',
      module: 'Credit Notes',
      targetRef: newNote.creditNoteNumber,
      actionCode: 'CREDIT_NOTE_ISSUED',
      actionTitle: `Ký số Biên bản điều chỉnh ${newNote.creditNoteNumber}`,
      severity: 'WARNING',
      summary: `Điều chỉnh giảm ${formatVND(newNote.totalAmount)} cho hóa đơn ${newNote.originalInvoiceNumber} (${newNote.reason}).`,
      verified: true,
      hash: `7b4f${Math.random().toString(16).slice(2, 10)}9a12`,
    };
    setAuditLogs((prev) => [creditAudit, ...prev]);
    showToast(`Đã ký số và phát hành Biên bản điều chỉnh #${newNote.creditNoteNumber}!`);
  };

  // Create Payment Term
  const handleCreatePaymentTerm = (newTerm: PaymentTerm) => {
    setPaymentTerms((prev) => [...prev, newTerm]);
    showToast(`Đã thêm điều khoản thanh toán mới: ${newTerm.name}`);
  };

  // Manual Bank Statement Match
  const handleManualBankMatch = (transactionId: string, invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    showToast(`Đã khớp dòng sao kê ngân hàng với hóa đơn #${inv.invoiceNumber}`);
  };

  // Create Recurring Plan
  const handleCreatePlan = (newPlan: RecurringPlan) => {
    setRecurringPlans((prev) => [newPlan, ...prev]);
    showToast(`Đã kích hoạt lịch phát hành hóa đơn định kỳ cho ${newPlan.customerName}.`);
  };

  // Trigger Recurring Run
  const handleTriggerPlanRun = (planId: string) => {
    const plan = recurringPlans.find((p) => p.id === planId);
    if (!plan) return;

    // Generate new invoice
    const newInvoiceNumber = `INV-2025-${Math.floor(2000 + Math.random() * 8000)}`;
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: newInvoiceNumber,
      eInvoiceCode: '1C25TND-01',
      customerName: plan.customerName,
      customerCode: 'CUST-REC',
      customerTaxCode: plan.taxCode,
      customerAddress: 'Khu Công nghệ cao, Hà Nội',
      customerEmail: 'billing@enterprise.vn',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      terms: 'NET 30',
      totalAmount: plan.amountPerPeriod,
      paidAmount: 0,
      remainingAmount: plan.amountPerPeriod,
      status: plan.autoSign ? 'ISSUED' : 'DRAFT',
      notes: `Phát sinh tự động theo hợp đồng định kỳ ${plan.contractRef}.`,
      items: [
        {
          id: `item-${Date.now()}`,
          name: plan.serviceTitle,
          unit: 'Kỳ',
          quantity: 1,
          unitPrice: Math.round(plan.amountPerPeriod / 1.1),
          discountPercent: 0,
          vatRate: 10,
        },
      ],
      paymentHistory: [],
    };

    setInvoices((prev) => [newInv, ...prev]);

    // Increment completed cycles
    setRecurringPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, completedCycles: p.completedCycles + 1 } : p))
    );

    showToast(`Đã chạy chu kỳ! Phát sinh hóa đơn mới #${newInvoiceNumber}`);
  };

  // Toggle Recurring Plan Status
  const handleTogglePlanStatus = (planId: string) => {
    setRecurringPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          const nextStatus = p.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Send Dunning Reminder
  const handleSendReminder = (invoice: Invoice) => {
    showToast(`Đã gửi email nhắc nợ & sao kê đối soát tới ${invoice.customerEmail}!`);
    const reminderLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      blockNumber: `#BLK-${Math.floor(88500 + Math.random() * 500)}`,
      actorName: 'Hệ thống Tự động',
      actorRole: 'Dunning Bot',
      actorIp: '127.0.0.1',
      module: 'Dunning',
      targetRef: invoice.invoiceNumber,
      actionCode: 'REMINDER_SENT',
      actionTitle: `Gửi nhắc nợ đối soát tự động`,
      severity: 'INFO',
      summary: `Đã gửi văn bản nhắc nợ hóa đơn ${invoice.invoiceNumber} (Dư nợ: ${formatVND(invoice.remainingAmount)}) tới ${invoice.customerEmail}.`,
      verified: true,
      hash: `cc018d${Math.random().toString(16).slice(2, 10)}fa`,
    };
    setAuditLogs((prev) => [reminderLog, ...prev]);
  };

  // Active invoice for Detail View
  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-60 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-medium">
            <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        invoiceCount={invoices.length}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        {/* Top Header */}
        <Header
          currentView={currentView}
          onNavigate={handleNavigate}
          activeRole={activeRole}
          onRoleChange={setActiveRole}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* View Router */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              invoices={invoices}
              onNavigate={handleNavigate}
              onQuickRecordPayment={handleOpenPayment}
              onSendDunningNotice={handleSendReminder}
            />
          )}

          {currentView === 'invoices' && (
            <InvoicesView
              invoices={invoices}
              onNavigate={handleNavigate}
              onOpenRecordPayment={handleOpenPayment}
              onOpenCreateInvoice={() => handleNavigate('create-invoice')}
              onSendReminder={handleSendReminder}
            />
          )}

          {currentView === 'invoice-detail' && (
            <InvoiceDetailView
              invoice={selectedInvoice}
              onNavigate={handleNavigate}
              onOpenRecordPayment={handleOpenPayment}
            />
          )}

          {currentView === 'create-invoice' && (
            <CreateInvoiceView
              customers={customers}
              onCancel={() => handleNavigate('invoices')}
              onCreateInvoice={handleCreateInvoice}
            />
          )}

          {currentView === 'payments' && (
            <PaymentsView
              payments={paymentRecords}
              invoices={invoices}
              onOpenRecordPayment={handleOpenPaymentFromInvoice}
              onNavigateInvoice={(invId) => handleNavigate('invoice-detail', invId)}
            />
          )}

          {currentView === 'reconciliation' && (
            <ReconciliationView
              transactions={bankTransactions}
              invoices={invoices}
              onManualMatch={handleManualBankMatch}
              onNavigateInvoice={(invId) => handleNavigate('invoice-detail', invId)}
            />
          )}

          {currentView === 'refunds' && (
            <RefundsView
              creditNotes={creditNotes}
              invoices={invoices}
              onCreateCreditNote={handleCreateCreditNote}
              onNavigateInvoice={(invId) => handleNavigate('invoice-detail', invId)}
            />
          )}

          {currentView === 'customers' && (
            <CustomersView
              customers={customers}
              onSelectCustomer={(id) => {
                showToast(`Đã lọc danh sách theo khách hàng.`);
                handleNavigate('invoices');
              }}
              onCreateCustomer={handleCreateCustomer}
              onNavigateCreateInvoice={(customerId) => {
                handleNavigate('create-invoice');
              }}
            />
          )}

          {currentView === 'products-services' && (
            <ProductsServicesView
              products={products}
              onCreateProduct={handleCreateProduct}
              onNavigateCreateInvoice={() => handleNavigate('create-invoice')}
            />
          )}

          {currentView === 'taxes' && <TaxesView invoices={invoices} />}

          {currentView === 'payment-terms' && (
            <PaymentTermsView
              terms={paymentTerms}
              onCreateTerm={handleCreatePaymentTerm}
            />
          )}

          {currentView === 'revenue' && (
            <RevenueView
              invoices={invoices}
              customers={customers}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'receivables-aging' && (
            <AgingReportView
              invoices={invoices}
              customers={customers}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'collection-metrics' && (
            <CollectionMetricsView
              invoices={invoices}
              customers={customers}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'recurring-plans' && (
            <RecurringPlansView
              plans={recurringPlans}
              onTriggerRun={handleTriggerPlanRun}
              onToggleStatus={handleTogglePlanStatus}
              onCreatePlan={handleCreatePlan}
            />
          )}

          {currentView === 'audit-log' && <AuditLogsView logs={auditLogs} />}

          {currentView === 'role-permissions' && (
            <SettingsView
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              initialTab="RBAC"
            />
          )}

          {currentView === 'account-settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              onToggleDarkMode={handleToggleDarkMode}
              initialTab="GENERAL"
            />
          )}
        </main>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <PaymentModal
          invoice={payingInvoice}
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPayingInvoice(null);
          }}
          onConfirm={handleConfirmPayment}
        />
      )}

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        invoices={invoices}
        customers={customers}
        recurringPlans={recurringPlans}
        onSelectInvoice={(id) => handleNavigate('invoice-detail', id)}
        onSelectCustomer={() => handleNavigate('customers')}
        onNavigate={handleNavigate}
      />

      {/* Role Switcher / Login Modal */}
      {isLoginModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">manage_accounts</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Chuyển đổi Vai trò Đăng nhập</h3>
                  <p className="text-[11px] text-slate-500">Môi trường phân quyền LedgerFlow RBAC</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-4 space-y-2">
              {ROLE_DEFINITIONS.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id);
                    setIsLoginModalOpen(false);
                    showToast(`Đã chuyển sang vai trò: ${role.title}`);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    activeRole === role.id
                      ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                      : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{role.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {role.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{role.description}</p>
                  </div>
                  {activeRole === role.id && (
                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                Phiên làm việc bảo mật mã hóa SSL 256-bit
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
