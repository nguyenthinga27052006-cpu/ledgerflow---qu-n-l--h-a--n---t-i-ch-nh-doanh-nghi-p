import React, { useState } from 'react';
import { Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';

interface PaymentModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentData: {
    amount: number;
    method: string;
    reference: string;
    date: string;
    notes: string;
  }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [amount, setAmount] = useState<number>(invoice.remainingAmount);
  const [method, setMethod] = useState<string>('Chuyển khoản (VietQR / VCB)');
  const [reference, setReference] = useState<string>(`FT${Date.now().toString().slice(-8)}`);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState<string>('Thanh toán đợt đối soát theo hợp đồng');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > invoice.remainingAmount + 1000) {
      alert('Số tiền thanh toán không hợp lệ');
      return;
    }
    onConfirm({
      amount,
      method,
      reference,
      date,
      notes,
    });
  };

  const setFullAmount = () => setAmount(invoice.remainingAmount);
  const setHalfAmount = () => setAmount(Math.round(invoice.remainingAmount / 2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Ghi nhận Thanh toán</h3>
              <p className="text-xs text-slate-500 font-mono">Hóa đơn #{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Info summary */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Khách hàng</div>
              <div className="text-sm font-semibold text-slate-800 line-clamp-1">{invoice.customerName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Còn phải thu</div>
              <div className="text-sm font-bold text-emerald-700">{formatVND(invoice.remainingAmount)}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} id="payment-form" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Số tiền thanh toán (VND)</label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={setHalfAmount}
                    className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    50% ({formatVND(Math.round(invoice.remainingAmount / 2))})
                  </button>
                  <button
                    type="button"
                    onClick={setFullAmount}
                    className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition-colors"
                  >
                    Toàn bộ
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  max={invoice.remainingAmount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right pr-10"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-medium text-slate-400">₫</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Phương thức</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Chuyển khoản (VietQR / VCB)">Chuyển khoản (VietQR / VCB)</option>
                  <option value="Chuyển khoản (BIDV ERP Direct)">BIDV ERP Direct API</option>
                  <option value="VNPAY-QR Doanh nghiệp">VNPAY-QR Doanh nghiệp</option>
                  <option value="Tiền mặt (Phiếu thu quỹ)">Tiền mặt (Phiếu thu quỹ)</option>
                  <option value="Thẻ tín dụng Corporate">Thẻ Corporate Visa/Master</option>
                  <option value="Bù trừ công nợ">Bù trừ công nợ hợp đồng</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Ngày giao dịch</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Mã chuẩn chi / Tham chiếu ngân hàng</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="VD: FT240502919293 hoặc Mã sao kê"
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Ghi chú đối soát</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nội dung diễn giải chi tiết..."
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            form="payment-form"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Xác nhận Ghi nhận
          </button>
        </div>
      </div>
    </div>
  );
};
