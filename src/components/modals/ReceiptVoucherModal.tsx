import React from 'react';
import { PaymentRecord } from '../../types';
import { formatVND, toVietnameseWords } from '../../utils/formatters';

interface ReceiptVoucherModalProps {
  payment: PaymentRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptVoucherModal: React.FC<ReceiptVoucherModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:max-w-full">
        {/* Top bar - Hidden on print */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400">receipt</span>
            <span className="font-semibold text-sm">Phiếu Thu Tiền Mặt / Ngân Hàng (Mẫu 01-TT)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              In Phiếu Thu
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Printable Voucher Body */}
        <div className="p-8 sm:p-10 text-slate-900 bg-white font-sans text-xs leading-relaxed print:p-4">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="font-bold text-xs uppercase text-slate-800">
                CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH LEDGERFLOW VIỆT NAM
              </div>
              <div className="text-[11px] text-slate-500">MST: 0109887766</div>
              <div className="text-[11px] text-slate-500">Địa chỉ: Keangnam Landmark 72, Nam Từ Liêm, Hà Nội</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[11px] text-slate-800">Mẫu số 01 - TT</div>
              <div className="text-[10px] text-slate-500 italic">
                (Ban hành theo Thông tư số 200/2014/TT-BTC
                <br />
                ngày 22/12/2014 của Bộ Tài chính)
              </div>
            </div>
          </div>

          <div className="text-center my-6">
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">PHIẾU THU</h1>
            <div className="text-[11px] text-slate-600 mt-1">
              Ngày ghi nhận: <span className="font-medium">{payment.paymentDate}</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              Số: <strong className="text-slate-800">{payment.paymentNumber}</strong> - Nợ TK 1121 / Có TK 131
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0">Họ và tên người nộp tiền:</span>
              <strong className="text-slate-900 flex-1">{payment.customerName}</strong>
            </div>
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0">Mã số thuế khách hàng:</span>
              <span className="font-mono font-semibold text-slate-800 flex-1">{payment.customerTaxCode}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0">Lý do nộp:</span>
              <span className="text-slate-800 flex-1">
                Thanh toán tiền hàng/dịch vụ cho Hóa đơn điện tử <strong className="text-blue-700">#{payment.invoiceNumber}</strong>.{' '}
                {payment.notes}
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0">Hình thức thanh toán:</span>
              <span className="text-slate-800 flex-1 font-medium">{payment.method} ({payment.bankName})</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0">Mã tham chiếu / Chuẩn chi:</span>
              <span className="font-mono text-slate-800 flex-1">{payment.reference}</span>
            </div>
            <div className="flex items-baseline pt-2">
              <span className="w-44 text-slate-600 shrink-0 font-bold">Số tiền:</span>
              <strong className="text-emerald-700 font-bold text-sm font-mono flex-1">
                {formatVND(payment.amount)}
              </strong>
            </div>
            <div className="flex items-baseline">
              <span className="w-44 text-slate-600 shrink-0 italic">Bằng chữ:</span>
              <span className="italic font-medium text-slate-800 flex-1 capitalize">
                {toVietnameseWords(payment.amount)}
              </span>
            </div>
            <div className="flex items-baseline pt-1 text-[11px] text-slate-500">
              <span className="w-44 shrink-0">Kèm theo:</span>
              <span>01 Chứng từ điện tử / Sao kê đối soát hệ thống ngân hàng</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs mt-10 pt-6 border-t border-slate-200">
            <div>
              <div className="font-bold text-slate-800">Giám đốc</div>
              <div className="text-[10px] text-slate-400 italic">(Ký, họ tên)</div>
              <div className="h-16 flex items-center justify-center text-slate-400 italic text-[10px]">
                Đã duyệt điện tử
              </div>
              <div className="font-semibold text-slate-700 text-[11px]">Lê Hoàng Nam</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">Kế toán trưởng</div>
              <div className="text-[10px] text-slate-400 italic">(Ký, họ tên)</div>
              <div className="h-16 flex items-center justify-center text-slate-400 italic text-[10px]">
                Đã kiểm soát
              </div>
              <div className="font-semibold text-slate-700 text-[11px]">Trần Mai Anh</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">Người lập phiếu</div>
              <div className="text-[10px] text-slate-400 italic">(Ký, họ tên)</div>
              <div className="h-16 flex items-center justify-center text-slate-400 italic text-[10px]">
                Đã lập
              </div>
              <div className="font-semibold text-slate-700 text-[11px]">{payment.recordedBy}</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">Thủ quỹ / Bank</div>
              <div className="text-[10px] text-slate-400 italic">(Ký, họ tên)</div>
              <div className="h-16 flex items-center justify-center text-slate-400 italic text-[10px]">
                Đã ghi sổ
              </div>
              <div className="font-semibold text-slate-700 text-[11px]">Nguyễn Thị Hương</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
