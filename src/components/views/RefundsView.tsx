import React, { useState } from 'react';
import { CreditNote, Invoice } from '../../types';
import { formatVND, toVietnameseWords } from '../../utils/formatters';

interface RefundsViewProps {
  creditNotes: CreditNote[];
  invoices: Invoice[];
  onCreateCreditNote: (newNote: CreditNote) => void;
  onNavigateInvoice: (invoiceId: string) => void;
}

export const RefundsView: React.FC<RefundsViewProps> = ({
  creditNotes,
  invoices,
  onCreateCreditNote,
  onNavigateInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'APPROVED' | 'PROCESSED' | 'DRAFT'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNoteForPrint, setSelectedNoteForPrint] = useState<CreditNote | null>(null);

  // Form states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[0]?.id || '');
  const [adjustmentType, setAdjustmentType] = useState<CreditNote['adjustmentType']>('DISCOUNT');
  const [amount, setAmount] = useState<number>(5000000);
  const [vatRate, setVatRate] = useState<number>(10);
  const [reason, setReason] = useState<string>(
    'Chiết khấu thương mại khối lượng dịch vụ đạt mốc cam kết theo phụ lục hợp đồng'
  );

  const filtered = creditNotes.filter((cn) => {
    if (activeTab !== 'ALL' && cn.status !== activeTab) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        cn.creditNoteNumber.toLowerCase().includes(q) ||
        cn.originalInvoiceNumber.toLowerCase().includes(q) ||
        cn.customerName.toLowerCase().includes(q) ||
        cn.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReduction = creditNotes
    .filter((cn) => cn.status !== 'DRAFT')
    .reduce((sum, cn) => sum + cn.totalAmount, 0);

  const totalVatReduction = creditNotes
    .filter((cn) => cn.status !== 'DRAFT')
    .reduce((sum, cn) => sum + cn.vatAmount, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inv = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];
    if (!inv) return;

    const calculatedVat = Math.round((amount * vatRate) / 100);
    const total = amount + calculatedVat;

    const newNote: CreditNote = {
      id: `cn-${Date.now()}`,
      creditNoteNumber: `ADJ-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      originalInvoiceId: inv.id,
      originalInvoiceNumber: inv.invoiceNumber,
      customerName: inv.customerName,
      customerTaxCode: inv.customerTaxCode,
      issueDate: new Date().toISOString().slice(0, 10),
      reason,
      adjustmentType,
      amount,
      vatRate,
      vatAmount: calculatedVat,
      totalAmount: total,
      status: 'APPROVED',
      approvedBy: 'Trần Mai Anh (Billing Manager)',
      notes: `Lập theo thỏa thuận điều chỉnh hóa đơn gốc ${inv.invoiceNumber}`,
    };

    onCreateCreditNote(newNote);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
            <span className="material-symbols-outlined text-sm">assignment_return</span>
            Biên bản Điều chỉnh & Hóa đơn Giảm trừ (Credit Notes & Refunds)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Quản lý Hoàn tiền, Chiết khấu & Giảm trừ Công nợ
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quy trình điều chỉnh hóa đơn theo Nghị định 123/2020/NĐ-CP & Thông tư 78/2021/TT-BTC không xóa sửa trực tiếp
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">note_add</span>
            Lập Biên bản Điều chỉnh / Credit Note
          </button>
        </div>
      </div>

      {/* Bento KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Giá trị Điều chỉnh Giảm</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">price_change</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 font-mono">
              {formatVND(totalReduction)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Đã khấu trừ vào sổ nợ khách hàng</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thuế GTGT Giảm trừ</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">percent</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono">
              {formatVND(totalVatReduction)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Kê khai giảm tại Tờ khai 01/GTGT</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Số Biên bản Đã Duyệt</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">verified</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {creditNotes.length} Chứng từ
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Ký số HSM & xác thực CQT</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tuân thủ Pháp lý</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">gavel</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">100%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Mẫu 04/SS-HĐĐT Tổng cục Thuế</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['ALL', 'APPROVED', 'PROCESSED', 'DRAFT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                activeTab === tab
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL'
                ? 'Tất cả biên bản'
                : tab === 'APPROVED'
                ? 'Đã duyệt (Approved)'
                : tab === 'PROCESSED'
                ? 'Đã xử lý khấu trừ'
                : 'Bản nháp'}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo mã điều chỉnh, HĐ, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-600 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Credit Notes Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Số Biên bản / Credit Note</th>
                <th className="py-3 px-4">Hóa đơn Gốc liên quan</th>
                <th className="py-3 px-4">Khách hàng / Doanh nghiệp</th>
                <th className="py-3 px-4">Lý do điều chỉnh (Theo NĐ123)</th>
                <th className="py-3 px-4 text-right">Giá trị giảm trừ</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((cn) => (
                <tr key={cn.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-rose-700 dark:text-rose-400">{cn.creditNoteNumber}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Ngày lập: {cn.issueDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onNavigateInvoice(cn.originalInvoiceId)}
                      className="font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>{cn.originalInvoiceNumber}</span>
                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                    </button>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cn.adjustmentType === 'DISCOUNT'
                        ? 'Chiết khấu thương mại'
                        : cn.adjustmentType === 'SERVICE_RETURN'
                        ? 'Hủy dịch vụ hoàn tiền'
                        : 'Điều chỉnh giảm'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{cn.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{cn.customerTaxCode}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="text-slate-700 dark:text-slate-300 line-clamp-2 text-[11px]">{cn.reason}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-mono font-bold text-rose-700 dark:text-rose-400 text-sm">
                      -{formatVND(cn.totalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      VAT {cn.vatRate}%: -{formatVND(cn.vatAmount)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      {cn.status === 'PROCESSED' ? 'Đã quyết toán' : 'Đã ký duyệt'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedNoteForPrint(cn)}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-xs">print</span>
                      In Biên bản
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Credit Note Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">note_add</span>
                Lập Biên bản Thỏa thuận Điều chỉnh Hóa đơn (NĐ 123)
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Chọn Hóa đơn gốc cần điều chỉnh:
                </label>
                <select
                  value={selectedInvoiceId}
                  onChange={(e) => setSelectedInvoiceId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                >
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.customerName} ({formatVND(inv.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Loại điều chỉnh:
                  </label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="DISCOUNT">Chiết khấu thương mại</option>
                    <option value="DECREASE_AMOUNT">Điều chỉnh giảm tiền hàng</option>
                    <option value="SERVICE_RETURN">Hủy dịch vụ / Hoàn tiền</option>
                    <option value="INFO_CORRECTION">Điều chỉnh sai sót thông tin</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                    Thuế suất VAT (%):
                  </label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                  >
                    <option value="10">10% (Tiêu chuẩn)</option>
                    <option value="8">8% (Nghị định 44/72)</option>
                    <option value="5">5%</option>
                    <option value="0">0%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Số tiền giảm trừ trước thuế (VND):
                </label>
                <input
                  type="number"
                  min="100000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 outline-none"
                  required
                />
                <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                  <span>Tiền thuế VAT: {formatVND((amount * vatRate) / 100)}</span>
                  <span>Tổng giảm thanh toán: <strong className="text-rose-600">{formatVND(amount + (amount * vatRate) / 100)}</strong></span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                  Lý do lập biên bản thỏa thuận điều chỉnh:
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Ký số HSM & Phát hành Điều chỉnh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Adjustment Agreement Modal */}
      {selectedNoteForPrint && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs"
          onClick={() => setSelectedNoteForPrint(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-slate-900 print:p-0 print:border-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="font-bold text-xs uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
                <p className="text-[11px] text-slate-500 italic">Độc lập - Tự do - Hạnh phúc</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-rose-600 text-white rounded text-xs print:hidden"
                >
                  In Biên bản
                </button>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-sm font-bold uppercase">
                BIÊN BẢN THỎA THUẬN ĐIỀU CHỈNH HÓA ĐƠN ĐIỆN TỬ
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                (Theo quy định tại Nghị định 123/2020/NĐ-CP của Chính phủ)
              </p>
              <div className="text-xs font-mono font-bold text-rose-700 mt-1">
                Số: {selectedNoteForPrint.creditNoteNumber}
              </div>
            </div>

            <div className="space-y-2 text-xs leading-relaxed">
              <p>Hôm nay, ngày {selectedNoteForPrint.issueDate}, hai bên chúng tôi gồm có:</p>
              <div className="p-2.5 bg-slate-50 rounded border">
                <strong>BÊN BÁN (Bên A):</strong> CÔNG TY CP CN TÀI CHÍNH LEDGERFLOW VIỆT NAM - MST: 0109887766
              </div>
              <div className="p-2.5 bg-slate-50 rounded border">
                <strong>BÊN MUA (Bên B):</strong> {selectedNoteForPrint.customerName} - MST: {selectedNoteForPrint.customerTaxCode}
              </div>
              <p>Hai bên thống nhất lập biên bản thỏa thuận điều chỉnh hóa đơn điện tử như sau:</p>
              <div className="space-y-1 pl-4 border-l-2 border-rose-400">
                <div>- Hóa đơn gốc: <strong>{selectedNoteForPrint.originalInvoiceNumber}</strong></div>
                <div>- Lý do: {selectedNoteForPrint.reason}</div>
                <div>- Số tiền điều chỉnh giảm: <strong className="text-rose-700">{formatVND(selectedNoteForPrint.amount)}</strong></div>
                <div>- Thuế GTGT giảm ({selectedNoteForPrint.vatRate}%): <strong className="text-rose-700">{formatVND(selectedNoteForPrint.vatAmount)}</strong></div>
                <div>- Tổng cộng giảm trừ: <strong className="text-rose-700">{formatVND(selectedNoteForPrint.totalAmount)}</strong></div>
                <div className="italic">Bằng chữ: {toVietnameseWords(selectedNoteForPrint.totalAmount)}</div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-around text-center text-xs">
              <div>
                <div className="font-bold">ĐẠI DIỆN BÊN MUA</div>
                <div className="h-14 flex items-center justify-center text-slate-400 italic">Đã ký xác nhận</div>
              </div>
              <div>
                <div className="font-bold">ĐẠI DIỆN BÊN BÁN</div>
                <div className="h-14 flex items-center justify-center text-slate-400 italic">
                  Ký số Cloud HSM
                </div>
                <div className="font-semibold text-slate-700 text-[11px]">{selectedNoteForPrint.approvedBy}</div>
              </div>
            </div>

            <div className="text-right print:hidden">
              <button
                onClick={() => setSelectedNoteForPrint(null)}
                className="px-4 py-1.5 bg-slate-200 rounded text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
