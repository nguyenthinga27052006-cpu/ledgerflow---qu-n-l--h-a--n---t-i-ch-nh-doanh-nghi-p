import React, { useState, useMemo } from 'react';
import { Invoice, InvoiceStatus } from '../../types';
import { formatVND } from '../../utils/formatters';

interface InvoicesViewProps {
  invoices: Invoice[];
  onNavigate: (view: string, invoiceId?: string) => void;
  onOpenRecordPayment: (invoice: Invoice) => void;
  onOpenCreateInvoice: () => void;
  onSendReminder: (invoice: Invoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onNavigate,
  onOpenRecordPayment,
  onOpenCreateInvoice,
  onSendReminder
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('ALL');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>(['inv-104', 'inv-103']);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFilterPresets, setShowFilterPresets] = useState(false);

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: 148,
      draft: 12,
      issued: 38,
      partially: 18,
      paid: 76,
      overdue: 4,
      cancelled: 2
    };
  }, []);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Tab filter
      if (selectedStatusTab === 'DRAFT' && inv.status !== 'DRAFT') return false;
      if (selectedStatusTab === 'ISSUED' && inv.status !== 'ISSUED') return false;
      if (selectedStatusTab === 'PARTIALLY_PAID' && inv.status !== 'PARTIALLY_PAID') return false;
      if (selectedStatusTab === 'PAID' && inv.status !== 'PAID') return false;
      if (selectedStatusTab === 'OVERDUE' && inv.status !== 'OVERDUE') return false;
      if (selectedStatusTab === 'CANCELLED' && inv.status !== 'CANCELLED') return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNumber = inv.invoiceNumber.toLowerCase().includes(q);
        const matchCustomer = inv.customerName.toLowerCase().includes(q);
        const matchTax = inv.customerTaxCode.toLowerCase().includes(q);
        const matchEinv = inv.eInvoiceCode.toLowerCase().includes(q);
        if (!matchNumber && !matchCustomer && !matchTax && !matchEinv) return false;
      }

      // Customer filter
      if (selectedCustomer !== 'ALL' && inv.customerCode !== selectedCustomer) {
        return false;
      }

      return true;
    });
  }, [invoices, selectedStatusTab, searchQuery, selectedCustomer]);

  // Bulk values
  const selectedTotal = useMemo(() => {
    return invoices
      .filter(inv => selectedInvoices.includes(inv.id))
      .reduce((sum, inv) => sum + inv.remainingAmount, 0);
  }, [invoices, selectedInvoices]);

  const toggleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter(i => i !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Page Header & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Quản lý Hóa đơn / Invoices
            </h1>
            <span className="bg-surface-container-high text-on-surface-variant font-mono text-xs px-2 py-0.5 rounded-full">
              v2.4 Fiscal-sync
            </span>
          </div>
          <p className="text-sm text-secondary">
            Theo dõi toàn bộ vòng đời hóa đơn từ Dự thảo, Phát hành đến Thanh toán và Đối soát công nợ tức thời.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Filter presets menu */}
          <div className="relative">
            <button
              onClick={() => setShowFilterPresets(!showFilterPresets)}
              className="flex items-center gap-1.5 h-9 px-3.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg shadow-sm transition-all text-xs font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">tune</span>
              <span>Bộ lọc lưu sẵn</span>
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </button>

            {showFilterPresets && (
              <div className="absolute right-0 mt-1 w-52 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-lg z-30 py-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedStatusTab('OVERDUE');
                    setShowFilterPresets(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-container-low text-error font-medium"
                >
                  ⚠ Hóa đơn rủi ro quá hạn (&gt;5 ngày)
                </button>
                <button
                  onClick={() => {
                    setSelectedStatusTab('PARTIALLY_PAID');
                    setShowFilterPresets(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-container-low text-on-surface"
                >
                  ⏳ Các khoản trả một phần chờ đợt 2
                </button>
                <button
                  onClick={() => {
                    setSelectedStatusTab('DRAFT');
                    setShowFilterPresets(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-surface-container-low text-on-surface"
                >
                  📝 Bản thảo chưa ký HSM
                </button>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 h-9 px-3.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg shadow-sm transition-all text-xs font-medium"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">download</span>
              <span>Xuất dữ liệu</span>
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant/40 rounded-lg shadow-xl z-30 py-1 text-xs">
                <button
                  onClick={() => {
                    alert('Đang kết xuất báo cáo Excel (.xlsx)... Tải xuống hoàn tất!');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">table_chart</span>
                  <span>Xuất file Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => {
                    alert('Đang kết xuất Báo cáo kiểm toán CSV... Tải xuống hoàn tất!');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">description</span>
                  <span>Báo cáo kiểm toán (CSV)</span>
                </button>
                <button
                  onClick={() => {
                    alert('Đang nén các hóa đơn điện tử thành gói ZIP... Tải xuống hoàn tất!');
                    setShowExportMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low"
                >
                  <span className="material-symbols-outlined text-[16px] text-error">picture_as_pdf</span>
                  <span>Tải hàng loạt PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Create invoice CTA */}
          <button
            onClick={onOpenCreateInvoice}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm transition-all text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Tạo hóa đơn mới</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">receipt_long</span>
              </span>
              <span className="text-xs text-secondary uppercase font-semibold tracking-wider">Tổng giá trị phát hành</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono">148 hóa đơn</span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-on-surface tabular-nums tracking-tight">1.450.800.000</span>
              <span className="text-sm text-secondary font-medium">₫</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-secondary">
              <span className="text-tertiary-container font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +14.2%
              </span>
              <span>so với tháng trước</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
            <div className="h-full bg-primary rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">price_check</span>
              </span>
              <span className="text-xs text-secondary uppercase font-semibold tracking-wider">Đã thu hồi (Collected)</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold">77.2%</span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-tertiary-container tabular-nums tracking-tight">1.120.300.000</span>
              <span className="text-sm text-secondary font-medium">₫</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-secondary">
              <span className="text-tertiary-container font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> 120 GD
              </span>
              <span>đã đối soát ngân hàng</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
            <div className="h-full bg-tertiary-container rounded-full" style={{ width: '77.2%' }}></div>
          </div>
        </div>

        {/* Card 3: Outstanding */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">pending_actions</span>
              </span>
              <span className="text-xs text-secondary uppercase font-semibold tracking-wider">Còn phải thu</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed font-mono">24 hóa đơn</span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-on-surface tabular-nums tracking-tight">285.500.000</span>
              <span className="text-sm text-secondary font-medium">₫</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-secondary">
              <span>Dự thu 7 ngày tới:</span>
              <span className="font-semibold text-primary">195.000.000 ₫</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
            <div className="h-full bg-primary-container rounded-full" style={{ width: '19.6%' }}></div>
          </div>
        </div>

        {/* Card 4: Overdue Risk */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-error-container text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">warning</span>
              </span>
              <span className="text-xs text-error uppercase font-semibold tracking-wider">Quá hạn thanh toán</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-error-container text-error font-semibold animate-pulse">4 hóa đơn rủi ro</span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-error tabular-nums tracking-tight">45.000.000</span>
              <span className="text-sm text-error font-medium">₫</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-secondary">
              <span className="text-error font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">error</span> Cần kích hoạt
              </span>
              <span>quy trình thu hồi & nhắc nợ</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden mt-3">
            <div className="h-full bg-error rounded-full" style={{ width: '3.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Advanced Search, Filter Tabs & Parameters */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col gap-3">
        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => setSelectedStatusTab('ALL')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'ALL'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span>Tất cả</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
              selectedStatusTab === 'ALL' ? 'bg-white/20 text-on-primary' : 'bg-surface-container-high text-secondary'
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('DRAFT')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'DRAFT'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Dự thảo (Draft)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary text-[11px] font-mono">
              {counts.draft}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('ISSUED')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'ISSUED'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Đã phát hành (Issued)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary text-[11px] font-mono font-bold">
              {counts.issued}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('PARTIALLY_PAID')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'PARTIALLY_PAID'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#93c5fd]"></span>
            <span>Thanh toán một phần</span>
            <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary-fixed text-[11px] font-mono font-bold">
              {counts.partially}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('PAID')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'PAID'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
            <span>Đã thanh toán (Paid)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-mono font-bold">
              {counts.paid}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'OVERDUE'
                ? 'bg-error text-on-error font-bold shadow-sm'
                : 'bg-surface-container-low text-error hover:bg-error-container/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-error"></span>
            <span>Quá hạn (Overdue)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-error-container text-error text-[11px] font-mono font-bold">
              {counts.overdue}
            </span>
          </button>

          <button
            onClick={() => setSelectedStatusTab('CANCELLED')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
              selectedStatusTab === 'CANCELLED'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            <span>Đã hủy (Cancelled)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-secondary text-[11px] font-mono">
              {counts.cancelled}
            </span>
          </button>
        </div>

        {/* Parameter Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-2 items-center">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-outline">
              search
            </span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 text-xs bg-surface-container-low text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest transition-colors border border-transparent focus:border-outline-variant"
              placeholder="Tìm theo mã INV-, tên khách hàng, MST..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Customer Dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedCustomer}
              onChange={e => setSelectedCustomer(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">Tất cả khách hàng</option>
              <option value="CUST-0024">VNPT IT Solution</option>
              <option value="CUST-089">Apex Digital</option>
              <option value="CUST-0104">Cty Sữa Ba Vì</option>
              <option value="CUST-0044">Tập đoàn Tân Á</option>
              <option value="CUST-0012">Vận tải Sao Việt</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-secondary pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date range filter */}
          <div className="md:col-span-2 relative">
            <select className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none cursor-pointer appearance-none">
              <option>Tháng này (02/2025)</option>
              <option>Tháng trước (01/2025)</option>
              <option>Quý 1/2025</option>
              <option>Tất cả thời gian</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-secondary pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Amount range */}
          <div className="md:col-span-2 relative">
            <select className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none cursor-pointer appearance-none">
              <option>Khoảng tiền: Tất cả</option>
              <option>&lt; 20.000.000 ₫</option>
              <option>20.000.000 - 50.000.000 ₫</option>
              <option>&gt; 50.000.000 ₫</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-secondary pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Staff & Reset */}
          <div className="md:col-span-2 flex items-center gap-1.5">
            <div className="relative flex-1">
              <select className="w-full h-9 px-3 bg-surface-container-low rounded-lg text-xs text-on-surface focus:outline-none cursor-pointer appearance-none truncate">
                <option>Phụ trách: Tất cả</option>
                <option>Nguyễn Văn Minh</option>
                <option>Trần Thu Thảo</option>
                <option>Lê Hoàng</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] text-secondary pointer-events-none">
                expand_more
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCustomer('ALL');
                setSelectedStatusTab('ALL');
              }}
              className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-surface-container-low hover:bg-error-container text-secondary hover:text-error transition-colors"
              title="Đặt lại bộ lọc"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Floating Strip */}
      {selectedInvoices.length > 0 && (
        <div className="bg-inverse-surface text-inverse-on-surface rounded-xl px-5 py-2.5 shadow-lg flex items-center justify-between transition-all animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
              />
              <span className="text-xs font-semibold">Đã chọn {selectedInvoices.length} hóa đơn</span>
            </div>
            <div className="h-4 w-px bg-outline/40"></div>
            <span className="text-xs font-mono text-[#dae2fd]">
              Tổng giá trị: {formatVND(selectedTotal)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Đã gửi email hàng loạt cho ${selectedInvoices.length} khách hàng!`)}
              className="h-8 px-3 rounded-lg bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">forward_to_inbox</span>
              <span>Gửi email hàng loạt</span>
            </button>
            <button
              onClick={() => alert(`Đã nén ${selectedInvoices.length} hóa đơn thành file ZIP!`)}
              className="h-8 px-3 rounded-lg bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Xuất hóa đơn đã chọn (ZIP)</span>
            </button>
            <button
              onClick={() => alert(`Đã kích hoạt khớp sổ thu nợ (Batch Pay) cho ${selectedInvoices.length} hóa đơn!`)}
              className="h-8 px-3 rounded-lg bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">credit_score</span>
              <span>Khớp sổ thu nợ (Batch Pay)</span>
            </button>
            <button
              onClick={() => setSelectedInvoices([])}
              className="p-1 text-outline hover:text-inverse-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="h-10 bg-surface-container-low text-secondary uppercase tracking-wider font-semibold select-none">
                <th className="w-12 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                  />
                </th>
                <th className="px-4 font-semibold">Mã Hóa Đơn</th>
                <th className="px-4 font-semibold min-w-[220px]">Khách Hàng & MST</th>
                <th className="px-4 font-semibold min-w-[170px]">Ngày Lập / Hạn TT</th>
                <th className="px-4 font-semibold text-right">Tổng Tiền</th>
                <th className="px-4 font-semibold text-right">Đã Thanh Toán</th>
                <th className="px-4 font-semibold text-right">Còn Lại</th>
                <th className="px-4 font-semibold text-center">Trạng Thái</th>
                <th className="px-4 font-semibold text-right w-28">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y-0 text-on-surface">
              {filteredInvoices.map(inv => {
                const isSelected = selectedInvoices.includes(inv.id);
                const isCancelled = inv.status === 'CANCELLED';
                const isOverdue = inv.status === 'OVERDUE';

                return (
                  <tr
                    key={inv.id}
                    className={`h-12 transition-colors cursor-pointer ${
                      isOverdue
                        ? 'bg-error-container/10 hover:bg-error-container/20'
                        : isCancelled
                        ? 'bg-surface-container-low/50 hover:bg-surface-container-low opacity-75'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low'
                    }`}
                  >
                    <td className="px-4 text-center" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(inv.id)}
                        className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                      />
                    </td>

                    {/* Mã HĐ */}
                    <td className="px-4" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <div className="flex items-center gap-2">
                        {isOverdue && (
                          <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                        )}
                        {inv.status === 'PARTIALLY_PAID' && (
                          <span className="material-symbols-outlined text-secondary text-[18px]">hourglass_top</span>
                        )}
                        {inv.status === 'PAID' && (
                          <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        )}
                        {inv.status === 'ISSUED' && (
                          <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                        )}
                        {inv.status === 'DRAFT' && (
                          <span className="material-symbols-outlined text-outline text-[18px]">edit_note</span>
                        )}
                        {isCancelled && (
                          <span className="material-symbols-outlined text-outline text-[18px]">cancel</span>
                        )}
                        <div className="flex flex-col">
                          <span className={`font-mono font-bold hover:underline ${
                            isCancelled ? 'line-through text-secondary' : 'text-primary'
                          }`}>
                            {inv.invoiceNumber}
                          </span>
                          <span className="font-mono text-[11px] text-secondary">
                            E-INV: {inv.eInvoiceCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Khách hàng & MST */}
                    <td className="px-4" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <div className="flex flex-col">
                        <span className={`font-semibold ${isCancelled ? 'line-through text-secondary' : 'text-on-surface'}`}>
                          {inv.customerName}
                        </span>
                        <span className="text-[11px] text-secondary font-mono">
                          MST: {inv.customerTaxCode} {inv.notes ? `• ${inv.notes.slice(0, 30)}...` : ''}
                        </span>
                      </div>
                    </td>

                    {/* Ngày Lập / Hạn TT */}
                    <td className="px-4" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <div className="flex flex-col">
                        <span className="font-mono text-on-surface font-medium">{inv.issueDate}</span>
                        {isOverdue && (
                          <div className="flex items-center gap-1 text-error font-semibold font-mono text-[11px]">
                            <span>Hạn: {inv.dueDate}</span>
                            <span className="text-[10px] bg-error text-on-error px-1 rounded-sm leading-tight">Trễ 5 ngày</span>
                          </div>
                        )}
                        {inv.status === 'PAID' && (
                          <span className="font-mono text-[11px] text-tertiary-container">
                            Đã thu: {inv.paidDate || inv.dueDate}
                          </span>
                        )}
                        {inv.status === 'PARTIALLY_PAID' && (
                          <span className="font-mono text-[11px] text-secondary">
                            Hạn: {inv.dueDate} (Còn 6 ngày)
                          </span>
                        )}
                        {inv.status === 'ISSUED' && (
                          <span className="font-mono text-[11px] text-secondary">
                            Hạn: {inv.dueDate} (Còn 10 ngày)
                          </span>
                        )}
                        {inv.status === 'DRAFT' && (
                          <span className="font-mono text-[11px] text-outline">
                            Chưa ký phát hành
                          </span>
                        )}
                        {isCancelled && (
                          <span className="font-mono text-[11px] text-error">
                            Hủy ngày: {inv.paidDate || '06/02/2025'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Tổng Tiền */}
                    <td className="px-4 text-right font-mono font-bold text-on-surface" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <span className={isCancelled ? 'line-through text-secondary' : ''}>
                        {formatVND(inv.totalAmount)}
                      </span>
                    </td>

                    {/* Đã Thanh Toán */}
                    <td className="px-4 text-right font-mono font-semibold" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <span className={inv.paidAmount > 0 ? 'text-tertiary-container' : 'text-secondary'}>
                        {formatVND(inv.paidAmount)}
                      </span>
                    </td>

                    {/* Còn Lại */}
                    <td className="px-4 text-right font-mono font-bold" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      <span className={
                        isOverdue ? 'text-error' : inv.remainingAmount > 0 ? 'text-on-surface' : 'text-secondary'
                      }>
                        {formatVND(inv.remainingAmount)}
                      </span>
                    </td>

                    {/* Trạng Thái Badge */}
                    <td className="px-4 text-center" onClick={() => onNavigate('invoice-detail', inv.id)}>
                      {isOverdue && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container text-error text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          <span>QUÁ HẠN</span>
                        </span>
                      )}
                      {inv.status === 'PARTIALLY_PAID' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container text-on-secondary-fixed text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          <span>TRẢ 1 PHẦN</span>
                        </span>
                      )}
                      {inv.status === 'PAID' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                          <span>ĐÃ THANH TOÁN</span>
                        </span>
                      )}
                      {inv.status === 'ISSUED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-fixed text-primary text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          <span>ĐÃ PHÁT HÀNH</span>
                        </span>
                      )}
                      {inv.status === 'DRAFT' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-secondary text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          <span>DỰ THẢO</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-outline text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                          <span>ĐÃ HỦY</span>
                        </span>
                      )}
                    </td>

                    {/* Thao Tác Quick Icons */}
                    <td className="px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {inv.remainingAmount > 0 && (
                          <button
                            onClick={() => onOpenRecordPayment(inv)}
                            className="p-1.5 rounded hover:bg-surface-container-high text-primary transition-colors"
                            title="Ghi nhận thanh toán"
                          >
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                          </button>
                        )}
                        {isOverdue && (
                          <button
                            onClick={() => onSendReminder(inv)}
                            className="p-1.5 rounded hover:bg-surface-container-high text-error transition-colors"
                            title="Gửi nhắc nợ khẩn cấp"
                          >
                            <span className="material-symbols-outlined text-[18px]">notification_important</span>
                          </button>
                        )}
                        {inv.status === 'DRAFT' && (
                          <button
                            onClick={() => onNavigate('create-invoice')}
                            className="p-1.5 rounded hover:bg-surface-container-high text-primary transition-colors"
                            title="Chỉnh sửa bản thảo"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        )}
                        <button
                          onClick={() => onNavigate('invoice-detail', inv.id)}
                          className="p-1.5 rounded hover:bg-surface-container-high text-secondary transition-colors"
                          title="Xem chi tiết"
                        >
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="px-4 py-3 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-3 text-secondary text-xs">
          <div className="flex items-center gap-4">
            <span>Hiển thị <strong className="text-on-surface">1 - {filteredInvoices.length}</strong> trong số <strong className="text-on-surface">148</strong> hóa đơn</span>
            <div className="flex items-center gap-2">
              <span>Số dòng / trang:</span>
              <select className="h-8 px-2 bg-surface-container-low rounded-lg text-on-surface font-mono focus:outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 font-semibold">
            <button className="h-8 w-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-outline disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-[18px]">first_page</span>
            </button>
            <button className="h-8 w-8 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-outline disabled:opacity-40" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="h-8 w-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">1</button>
            <button className="h-8 w-8 rounded-lg hover:bg-surface-container-high text-on-surface flex items-center justify-center">2</button>
            <button className="h-8 w-8 rounded-lg hover:bg-surface-container-high text-on-surface flex items-center justify-center">3</button>
            <span className="px-1 text-outline">...</span>
            <button className="h-8 w-8 rounded-lg hover:bg-surface-container-high text-on-surface flex items-center justify-center">15</button>
            <button className="h-8 w-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
            <button className="h-8 w-8 rounded-lg bg-surface-container-low hover:bg-surface-container-high flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fiscal Footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-secondary font-mono text-[11px] px-1 py-1 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
          <span>Đồng bộ Cơ quan Thuế (TCT VN-EINV): Thời gian thực lúc 14:32:09</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Chứng thư số HSM Token: Hợp lệ (Hết hạn 12/2026)</span>
          <button
            onClick={() => onNavigate('audit-log')}
            className="text-primary hover:underline"
          >
            Nhật ký truyền nhận XML →
          </button>
        </div>
      </div>
    </div>
  );
};
