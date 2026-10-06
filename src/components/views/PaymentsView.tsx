import React, { useState } from 'react';
import { PaymentRecord, Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';
import { ReceiptVoucherModal } from '../modals/ReceiptVoucherModal';

interface PaymentsViewProps {
  payments: PaymentRecord[];
  invoices: Invoice[];
  onOpenRecordPayment: (invoice?: Invoice) => void;
  onNavigateInvoice: (invoiceId: string) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  invoices,
  onOpenRecordPayment,
  onNavigateInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SUCCESS' | 'PENDING' | 'FAILED'>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentForVoucher, setSelectedPaymentForVoucher] = useState<PaymentRecord | null>(null);
  const [qrModalPayment, setQrModalPayment] = useState<PaymentRecord | null>(null);

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    if (activeTab !== 'ALL' && p.status !== activeTab) return false;
    if (methodFilter !== 'ALL' && !p.method.toLowerCase().includes(methodFilter.toLowerCase())) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.paymentNumber.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.reference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Aggregates
  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const qrCollected = payments
    .filter((p) => p.status === 'SUCCESS' && (p.method.includes('VietQR') || p.method.includes('QR')))
    .reduce((sum, p) => sum + p.amount, 0);

  const successCount = payments.filter((p) => p.status === 'SUCCESS').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="material-symbols-outlined text-sm">payments</span>
            Phân hệ Quản lý Thu tiền & Phiếu thu Kế toán
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Sổ cái Thu tiền & Lịch sử Giao dịch Thanh toán
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi dòng tiền thu, gạch nợ tự động qua VietQR/API ngân hàng và in phiếu thu Mẫu 01-TT
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenRecordPayment(invoices.find((i) => i.remainingAmount > 0))}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add_card</span>
            Ghi nhận Thanh toán Mới
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Thực thu Lũy kế</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {formatVND(totalCollected)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {successCount} giao dịch đã đối soát ngân hàng
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thu qua VietQR / Chuyển khoản</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">qr_code_2</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono">
              {formatVND(qrCollected)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Khớp tức thời qua Napas 247 Direct
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tỷ lệ Giao dịch Thành công</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">task_alt</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">99.8%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
              0 trường hợp tra soát khiếu nại nợ
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thời gian Gạch nợ TB</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">speed</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">3.2 Giây</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Tự động cập nhật số dư công nợ
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['ALL', 'SUCCESS', 'PENDING', 'FAILED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL'
                ? 'Tất cả phiếu thu'
                : tab === 'SUCCESS'
                ? 'Thành công (Đã đối soát)'
                : tab === 'PENDING'
                ? 'Đang xử lý'
                : 'Thất bại'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="ALL">Tất cả phương thức</option>
            <option value="VietQR">VietQR / Chuyển khoản</option>
            <option value="BIDV">BIDV Direct API</option>
            <option value="Thẻ">Thẻ Corporate</option>
            <option value="Tiền mặt">Tiền mặt quỹ</option>
          </select>

          <div className="relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
            <input
              type="text"
              placeholder="Tìm theo mã phiếu, HĐ, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Mã Phiếu thu</th>
                <th className="py-3 px-4">Hóa đơn & Ngày</th>
                <th className="py-3 px-4">Khách hàng / Doanh nghiệp</th>
                <th className="py-3 px-4 text-right">Số tiền thu</th>
                <th className="py-3 px-4">Phương thức & Ngân hàng</th>
                <th className="py-3 px-4">Mã chuẩn chi / Trace ID</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayments.map((p) => {
                const matchedInv = invoices.find((i) => i.id === p.invoiceId || i.invoiceNumber === p.invoiceNumber);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-blue-700 dark:text-blue-400">{p.paymentNumber}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">TK 1121 / 131</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => matchedInv && onNavigateInvoice(matchedInv.id)}
                        className="font-mono font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left flex items-center gap-1"
                      >
                        <span>{p.invoiceNumber}</span>
                        <span className="material-symbols-outlined text-[13px] text-slate-400">open_in_new</span>
                      </button>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.paymentDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.customerName}</div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{p.customerTaxCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                        {formatVND(p.amount)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{p.method}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.bankName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {p.reference}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Thành công
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedPaymentForVoucher(p)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                          title="In Phiếu thu Mẫu 01-TT chuẩn Thông tư 200"
                        >
                          <span className="material-symbols-outlined text-xs">print</span>
                          Phiếu thu
                        </button>
                        <button
                          onClick={() => setQrModalPayment(p)}
                          className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Xem mã VietQR giao dịch"
                        >
                          <span className="material-symbols-outlined text-base">qr_code</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Voucher Modal */}
      {selectedPaymentForVoucher && (
        <ReceiptVoucherModal
          payment={selectedPaymentForVoucher}
          isOpen={!!selectedPaymentForVoucher}
          onClose={() => setSelectedPaymentForVoucher(null)}
        />
      )}

      {/* VietQR Quick Scan Modal */}
      {qrModalPayment && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setQrModalPayment(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-center p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-blue-600">qr_code_2</span>
                Mã VietQR Chuyển Khoản Nhanh 24/7
              </div>
              <button onClick={() => setQrModalPayment(null)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=247|VCB|19036788889999|${qrModalPayment.amount}|${qrModalPayment.invoiceNumber}`}
                alt="VietQR Napas 247"
                className="w-48 h-48 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                Ngân hàng TMCP Kỹ Thương (Techcombank)
              </div>
              <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">19036788889999</div>
              <div className="text-[11px] text-slate-500">CÔNG TY CP CN TÀI CHÍNH LEDGERFLOW VN</div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div>Số tiền: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-sm">{formatVND(qrModalPayment.amount)}</strong></div>
              <div>Nội dung: <strong className="font-mono text-blue-700 dark:text-blue-400">{qrModalPayment.invoiceNumber} TT</strong></div>
            </div>

            <button
              onClick={() => setQrModalPayment(null)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
