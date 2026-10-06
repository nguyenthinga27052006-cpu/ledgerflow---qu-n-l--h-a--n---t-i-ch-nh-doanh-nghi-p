import React, { useState } from 'react';
import { BankTransaction, Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';

interface ReconciliationViewProps {
  transactions: BankTransaction[];
  invoices: Invoice[];
  onManualMatch?: (transactionId: string, invoiceId: string) => void;
  onNavigateInvoice: (invoiceId: string) => void;
}

export const ReconciliationView: React.FC<ReconciliationViewProps> = ({
  transactions: initialTransactions,
  invoices,
  onManualMatch,
  onNavigateInvoice,
}) => {
  const [transactions, setTransactions] = useState<BankTransaction[]>(initialTransactions);
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MATCHED' | 'UNMATCHED' | 'DISCREPANCY'>('ALL');
  const [isReconciling, setIsReconciling] = useState(false);
  const [matchingTx, setMatchingTx] = useState<BankTransaction | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [reconcileReportOpen, setReconcileReportOpen] = useState(false);

  // Filtered transactions
  const filtered = transactions.filter((t) => {
    if (selectedBank !== 'ALL' && t.bankName !== selectedBank) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  // Metrics
  const matchedCount = transactions.filter((t) => t.status === 'MATCHED').length;
  const unmatchedCount = transactions.filter((t) => t.status === 'UNMATCHED').length;
  const discrepancyCount = transactions.filter((t) => t.status === 'DISCREPANCY').length;
  const totalVolume = transactions
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  // Run AI / Auto Match Engine
  const handleRunAutoReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((tx) => {
          if (tx.status === 'UNMATCHED') {
            // Find invoice that matches amount or description
            const match = invoices.find(
              (inv) =>
                tx.description.toLowerCase().includes(inv.customerName.toLowerCase().slice(0, 10)) ||
                tx.description.includes(inv.invoiceNumber) ||
                Math.abs(inv.remainingAmount - tx.amount) < 1000
            );
            if (match) {
              return {
                ...tx,
                matched: true,
                matchedInvoiceNumber: match.invoiceNumber,
                matchedCustomer: match.customerName,
                status: 'MATCHED',
              };
            }
          }
          return tx;
        })
      );
      setIsReconciling(false);
      alert('Đã hoàn tất tiến trình Đối soát tự động AI & Virtual Account! 1 giao dịch mới đã được khớp thành công vào Sổ cái.');
    }, 1200);
  };

  const handleConfirmManualMatch = () => {
    if (!matchingTx || !selectedInvoiceId) return;
    const inv = invoices.find((i) => i.id === selectedInvoiceId);
    if (!inv) return;

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === matchingTx.id
          ? {
              ...tx,
              matched: true,
              matchedInvoiceNumber: inv.invoiceNumber,
              matchedCustomer: inv.customerName,
              status: 'MATCHED',
            }
          : tx
      )
    );

    if (onManualMatch) {
      onManualMatch(matchingTx.id, inv.id);
    }
    setMatchingTx(null);
    setSelectedInvoiceId('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            Đối soát Ngân hàng & Sổ cái Tự động (Bank Statement Reconciliation)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Khớp Dòng tiền Sao kê với Hóa đơn & Công nợ
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tự động bóc tách nội dung giao dịch ngân hàng, đối soát mã hóa đơn (VA Matching) và giải quyết chênh lệch
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setReconcileReportOpen(true)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">print</span>
            Xuất Biên bản Đối soát
          </button>
          <button
            onClick={handleRunAutoReconcile}
            disabled={isReconciling}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className={`material-symbols-outlined text-base ${isReconciling ? 'animate-spin' : ''}`}>
              {isReconciling ? 'sync' : 'auto_mode'}
            </span>
            {isReconciling ? 'Đang phân tích sao kê...' : 'Chạy Đối soát Tự động AI'}
          </button>
        </div>
      </div>

      {/* Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Dòng tiền Sao kê</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">savings</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatVND(totalVolume)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Ghi nhận qua các tài khoản thụ hưởng</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Đã Khớp 100% (Matched)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">check_circle</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {matchedCount} / {transactions.length}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Đã tự động gạch nợ vào Sổ cái</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Chờ Đối soát (Unmatched)</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">hourglass_top</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">{unmatchedCount}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Cần đối chiếu nội dung hoặc thủ công</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Chênh lệch Số tiền</span>
            <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">rule</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-red-700 dark:text-red-400 font-mono">{discrepancyCount}</div>
            <div className="text-[11px] text-red-600/80 mt-1">Chuyển thiếu / tạm ứng chưa đủ kỳ</div>
          </div>
        </div>
      </div>

      {/* Control Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['ALL', 'MATCHED', 'UNMATCHED', 'DISCREPANCY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'ALL'
                ? 'Tất cả dòng sao kê'
                : tab === 'MATCHED'
                ? 'Đã khớp (Matched)'
                : tab === 'UNMATCHED'
                ? 'Chưa khớp'
                : 'Chênh lệch (Discrepancy)'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="ALL">Tất cả ngân hàng kết nối</option>
            <option value="Vietcombank">Vietcombank (TK 19036788889999)</option>
            <option value="Techcombank">Techcombank (TK 19036788889999)</option>
            <option value="MBBank">MBBank (TK 0888199998888)</option>
          </select>
        </div>
      </div>

      {/* Bank Transactions Feed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Thời gian & Ngân hàng</th>
                <th className="py-3 px-4">Nội dung Chuyển tiền (Narrative)</th>
                <th className="py-3 px-4 text-right">Số tiền phát sinh</th>
                <th className="py-3 px-4">Mã tham chiếu / FT</th>
                <th className="py-3 px-4">Hóa đơn & Khách hàng đối soát</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{tx.date}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{tx.time} • <strong className="text-blue-600 dark:text-blue-400">{tx.bankName}</strong></div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-mono text-slate-800 dark:text-slate-200 line-clamp-2 text-[11px] bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      {tx.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className={`font-mono font-bold text-sm ${tx.type === 'CREDIT' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {tx.type === 'CREDIT' ? '+' : '-'}{formatVND(tx.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400">{tx.type === 'CREDIT' ? 'Báo Có' : 'Báo Nợ'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {tx.reference}
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.matchedInvoiceNumber ? (
                      <div>
                        <button
                          onClick={() => {
                            const inv = invoices.find((i) => i.invoiceNumber === tx.matchedInvoiceNumber);
                            if (inv) onNavigateInvoice(inv.id);
                          }}
                          className="font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>{tx.matchedInvoiceNumber}</span>
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </button>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{tx.matchedCustomer}</div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Chưa xác định hóa đơn</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {tx.status === 'MATCHED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Đã khớp
                      </span>
                    )}
                    {tx.status === 'UNMATCHED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <span className="material-symbols-outlined text-xs">pending</span>
                        Chưa khớp
                      </span>
                    )}
                    {tx.status === 'DISCREPANCY' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        Chênh lệch
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {tx.status !== 'MATCHED' ? (
                      <button
                        onClick={() => {
                          setMatchingTx(tx);
                          setSelectedInvoiceId(invoices.find((i) => i.remainingAmount > 0)?.id || '');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                      >
                        <span className="material-symbols-outlined text-xs">link</span>
                        Khớp thủ công
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Đã chốt sổ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Match Modal */}
      {matchingTx && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setMatchingTx(null)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">link</span>
                Khớp Giao dịch Sao kê với Hóa đơn
              </h3>
              <button onClick={() => setMatchingTx(null)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl text-xs space-y-1">
              <div className="text-slate-500 dark:text-slate-400">Giao dịch ngân hàng:</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                {matchingTx.description}
              </div>
              <div className="flex justify-between pt-1">
                <span>Số tiền: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{formatVND(matchingTx.amount)}</strong></span>
                <span>Ref: <strong className="font-mono">{matchingTx.reference}</strong></span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                Chọn Hóa đơn cần gạch nợ:
              </label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
              >
                {invoices
                  .filter((i) => i.remainingAmount > 0)
                  .map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.customerName} (Còn thiếu: {formatVND(inv.remainingAmount)})
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMatchingTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmManualMatch}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
              >
                Xác nhận Khớp Sổ cái
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Reconciliation Statement Report Modal */}
      {reconcileReportOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs"
          onClick={() => setReconcileReportOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 space-y-6 text-slate-900 print:p-0 print:border-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="font-bold text-sm uppercase">CÔNG TY CP CN TÀI CHÍNH LEDGERFLOW VIỆT NAM</h2>
                <p className="text-xs text-slate-500">Kỳ đối soát: Tháng 02/2025</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs print:hidden"
                >
                  In Báo cáo
                </button>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold uppercase">BIÊN BẢN ĐỐI SOÁT DÒNG TIỀN & CÔNG NỢ PHẢI THU</h3>
              <p className="text-xs text-slate-500 mt-1">Hệ thống Ngân hàng điện tử & Sổ cái Hóa đơn</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b py-1">
                <span>Tổng số tiền phát sinh báo Có:</span>
                <strong className="font-mono">{formatVND(totalVolume)}</strong>
              </div>
              <div className="flex justify-between border-b py-1">
                <span>Số tiền đã đối soát gạch nợ thành công:</span>
                <strong className="font-mono text-emerald-700">
                  {formatVND(
                    transactions.filter((t) => t.status === 'MATCHED' && t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0)
                  )}
                </strong>
              </div>
              <div className="flex justify-between border-b py-1">
                <span>Số tiền đang chờ tra soát:</span>
                <strong className="font-mono text-amber-600">
                  {formatVND(
                    transactions.filter((t) => t.status !== 'MATCHED' && t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0)
                  )}
                </strong>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-around text-center text-xs">
              <div>
                <div className="font-semibold">Kế toán Đối soát</div>
                <div className="h-12 flex items-center justify-center text-slate-400 italic">Đã ký</div>
                <div>Nguyễn Văn Minh</div>
              </div>
              <div>
                <div className="font-semibold">Kế toán trưởng</div>
                <div className="h-12 flex items-center justify-center text-slate-400 italic">Đã duyệt</div>
                <div>Trần Mai Anh</div>
              </div>
            </div>

            <div className="text-right print:hidden">
              <button
                onClick={() => setReconcileReportOpen(false)}
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
