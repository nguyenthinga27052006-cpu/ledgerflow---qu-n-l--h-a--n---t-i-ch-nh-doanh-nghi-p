import React, { useState } from 'react';
import { PaymentTerm } from '../../types';

interface PaymentTermsViewProps {
  terms: PaymentTerm[];
  onCreateTerm?: (newTerm: PaymentTerm) => void;
}

export const PaymentTermsView: React.FC<PaymentTermsViewProps> = ({
  terms: initialTerms,
  onCreateTerm,
}) => {
  const [terms, setTerms] = useState<PaymentTerm[]>(initialTerms);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [days, setDays] = useState<number>(30);
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(5);
  const [latePenaltyRate, setLatePenaltyRate] = useState<number>(1.5);
  const [earlyDiscountPercent, setEarlyDiscountPercent] = useState<number>(0);
  const [earlyDiscountDays, setEarlyDiscountDays] = useState<number>(0);
  const [description, setDescription] = useState('');

  const handleSetDefault = (id: string) => {
    setTerms((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id,
      }))
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newTerm: PaymentTerm = {
      id: `term-${Date.now()}`,
      code: code.toUpperCase().replace(/\s+/g, '_'),
      name,
      days,
      gracePeriodDays,
      latePenaltyRate,
      earlyDiscountPercent,
      earlyDiscountDays,
      description,
      isDefault: false,
      activeCustomersCount: 0,
    };

    setTerms((prev) => [...prev, newTerm]);
    if (onCreateTerm) onCreateTerm(newTerm);
    setIsModalOpen(false);

    // Reset
    setCode('');
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <span className="material-symbols-outlined text-sm">contract</span>
            Chính sách Thanh toán & Điều khoản Công nợ (Credit Terms)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Quản trị Điều khoản Thanh toán & Lãi phạt Quá hạn
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quy định số ngày cho nợ (NET days), thời gian ân hạn, chiết khấu thanh toán sớm và lãi suất phạt trả chậm
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Thêm Điều khoản Mới
          </button>
        </div>
      </div>

      {/* Bento Grid KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Chính sách Công nợ</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">policy</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{terms.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Khung điều khoản chuẩn hóa</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thời hạn Nợ Bình quân</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">date_range</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono">24.5 Ngày</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Được kiểm soát tự động</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thời gian Ân hạn (Grace)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">timer</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">3 - 7 Ngày</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Không tính phạt chậm trả</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Lãi phạt Trả chậm TB</span>
            <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">gavel</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-red-700 dark:text-red-400 font-mono">1.5% / Tháng</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">18% / năm theo hợp đồng B2B</div>
          </div>
        </div>
      </div>

      {/* Payment Terms Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {terms.map((term) => (
          <div
            key={term.id}
            className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between relative transition-all ${
              term.isDefault
                ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {term.isDefault && (
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300">
                Mặc định hệ thống
              </span>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{term.name}</h3>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">{term.code}</div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                {term.description}
              </p>

              <div className="my-4 py-3 border-y border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Thời hạn thanh toán:</span>
                  <strong className="font-mono text-slate-900 dark:text-slate-100">{term.days} ngày</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Thời gian ân hạn:</span>
                  <span className="font-mono text-emerald-600 font-semibold">{term.gracePeriodDays} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Lãi suất chậm trả:</span>
                  <span className="font-mono text-red-600 font-semibold">{term.latePenaltyRate}% / tháng</span>
                </div>
                {term.earlyDiscountPercent > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Chiết khấu trả sớm:</span>
                    <span className="font-mono text-blue-600 font-semibold">
                      {term.earlyDiscountPercent}% (trong {term.earlyDiscountDays} ngày)
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Số khách hàng áp dụng:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {term.activeCustomersCount || 0} đối tác
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {!term.isDefault ? (
                <button
                  onClick={() => handleSetDefault(term.id)}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                >
                  Đặt làm mặc định
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Đang kích hoạt mặc định</span>
              )}

              <span className="material-symbols-outlined text-slate-300 dark:text-slate-700">lock_open</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">contract</span>
                Tạo Điều khoản Thanh toán Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Mã điều khoản</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NET_45"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tên hiển thị</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NET 45 Ngày (Dự án FDI)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Số ngày nợ (Days)</label>
                  <input
                    type="number"
                    min="0"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Ân hạn (Grace)</label>
                  <input
                    type="number"
                    min="0"
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Lãi phạt (%/tháng)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={latePenaltyRate}
                    onChange={(e) => setLatePenaltyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Chiết khấu trả sớm (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={earlyDiscountPercent}
                    onChange={(e) => setEarlyDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Trong vòng (Số ngày)</label>
                  <input
                    type="number"
                    min="0"
                    value={earlyDiscountDays}
                    onChange={(e) => setEarlyDiscountDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Điều kiện áp dụng trong hợp đồng kinh tế..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs"
                >
                  Lưu Điều khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
