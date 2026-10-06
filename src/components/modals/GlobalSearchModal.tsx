import React, { useState, useEffect, useRef } from 'react';
import { Invoice, Customer, RecurringPlan } from '../../types';
import { formatVND } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  customers: Customer[];
  recurringPlans: RecurringPlan[];
  onSelectInvoice: (id: string) => void;
  onSelectCustomer: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  invoices,
  customers,
  recurringPlans,
  onSelectInvoice,
  onSelectCustomer,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerTaxCode.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.taxCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const filteredPlans = recurringPlans.filter(
    (p) =>
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400 text-2xl">search</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm mã hóa đơn, tên công ty, MST, hợp đồng... (Esc để thoát)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4">
          {/* Quick Nav Actions */}
          {searchTerm.trim() === '' && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Điều hướng nhanh
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => { onNavigate('invoices'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="material-symbols-outlined text-blue-600 text-lg">receipt_long</span>
                  <span>Danh sách Hóa đơn</span>
                </button>
                <button
                  onClick={() => { onNavigate('aging'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="material-symbols-outlined text-amber-600 text-lg">calendar_month</span>
                  <span>Báo cáo Tuổi nợ (Aging)</span>
                </button>
                <button
                  onClick={() => { onNavigate('recurring'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="material-symbols-outlined text-purple-600 text-lg">autorenew</span>
                  <span>Hợp đồng Định kỳ</span>
                </button>
                <button
                  onClick={() => { onNavigate('customers'); onClose(); }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors text-xs font-medium text-slate-700"
                >
                  <span className="material-symbols-outlined text-emerald-600 text-lg">corporate_fare</span>
                  <span>Sổ cái Khách hàng</span>
                </button>
              </div>
            </div>
          )}

          {/* Invoices */}
          {filteredInvoices.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
                <span>Hóa đơn ({filteredInvoices.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Nhấp để mở chi tiết</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onSelectInvoice(inv.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-base">receipt</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono flex items-center gap-2">
                          #{inv.invoiceNumber}
                          <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded font-sans ${
                            inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            inv.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{inv.customerName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-800">{formatVND(inv.totalAmount)}</div>
                      <div className="text-[10px] text-slate-400">Hạn: {inv.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Khách hàng ({filteredCustomers.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => {
                      onSelectCustomer(cust.id);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{cust.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">MST: {cust.taxCode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-slate-600">Dư nợ: <span className="font-semibold text-slate-900">{formatVND(cust.currentDebt)}</span></div>
                      <div className="text-[10px] text-slate-400">{cust.segment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plans */}
          {filteredPlans.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1">
                Gói định kỳ ({filteredPlans.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredPlans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigate('recurring');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-800">{p.serviceTitle}</div>
                      <div className="text-[11px] text-slate-500">{p.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-purple-700">{formatVND(p.amountPerPeriod)}</div>
                      <div className="text-[10px] text-slate-400">{p.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm.trim() !== '' && filteredInvoices.length === 0 && filteredCustomers.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không tìm thấy kết quả nào phù hợp với &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Dùng phím <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px]">↓</kbd> để chọn</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-mono text-[10px]">↵</kbd> để mở</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">LedgerFlow Enterprise Search</div>
        </div>
      </div>
    </div>
  );
};
