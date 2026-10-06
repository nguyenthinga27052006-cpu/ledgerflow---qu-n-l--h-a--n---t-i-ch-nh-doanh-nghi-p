import React, { useState } from 'react';
import { RecurringPlan } from '../../types';
import { formatVND } from '../../utils/formatters';

interface RecurringPlansViewProps {
  plans: RecurringPlan[];
  onTriggerRun: (planId: string) => void;
  onToggleStatus: (planId: string) => void;
  onCreatePlan: (newPlan: RecurringPlan) => void;
}

export const RecurringPlansView: React.FC<RecurringPlansViewProps> = ({
  plans,
  onTriggerRun,
  onToggleStatus,
  onCreatePlan,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'FAILED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states for new recurring plan
  const [customerName, setCustomerName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [contact, setContact] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [contractRef, setContractRef] = useState('');
  const [frequency, setFrequency] = useState<'Hàng tháng' | 'Hàng quý' | 'Hàng năm'>('Hàng tháng');
  const [amount, setAmount] = useState<number>(25000000);
  const [autoSign, setAutoSign] = useState<boolean>(true);

  // Filter plans
  const filteredPlans = plans.filter((p) => {
    if (activeTab !== 'ALL' && p.status !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.customerName.toLowerCase().includes(term) ||
        p.serviceTitle.toLowerCase().includes(term) ||
        p.contractRef.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Calculate MRR / ARR
  const activePlans = plans.filter((p) => p.status === 'ACTIVE');
  const mrr = activePlans.reduce((acc, p) => {
    if (p.frequency === 'Hàng tháng') return acc + p.amountPerPeriod;
    if (p.frequency === 'Hàng quý') return acc + p.amountPerPeriod / 3;
    if (p.frequency === 'Hàng năm') return acc + p.amountPerPeriod / 12;
    return acc;
  }, 0);
  const arr = mrr * 12;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !serviceTitle) return;

    const newPlan: RecurringPlan = {
      id: `plan-${Date.now()}`,
      code: `REC-2025-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      taxCode: taxCode || '0101234567',
      contact: contact || 'Đại diện hợp đồng',
      serviceTitle,
      contractRef: contractRef || `HĐ-${Date.now().toString().slice(-4)}`,
      frequency,
      terms: 'NET 30',
      amountPerPeriod: amount,
      nextRunDate: '2025-11-01',
      completedCycles: 0,
      totalCycles: 12,
      status: 'ACTIVE',
      autoSign,
    };

    onCreatePlan(newPlan);
    setIsCreateModalOpen(false);
    // Reset
    setCustomerName('');
    setServiceTitle('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <span className="material-symbols-outlined text-sm">autorenew</span>
            Thuê bao & Hóa đơn Định kỳ
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Quản lý Lịch xuất Hóa đơn Tự động (Recurring Engine)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tự động hóa phát sinh hóa đơn theo hợp đồng SLA định kỳ và tự động ký số Cloud HSM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Thiết lập Lịch Định kỳ mới
          </button>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">MRR (Doanh thu tháng)</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">calendar_view_month</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatVND(mrr)}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-1 font-medium">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +8.4% so với tháng trước
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">ARR (Quy mô năm)</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">stacked_line_chart</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatVND(arr)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Từ {activePlans.length} gói thuê bao đang active</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gói đang hoạt động</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">check_circle</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">{activePlans.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {plans.filter((p) => p.status === 'PAUSED').length} gói đang tạm dừng
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tự động Ký số HSM</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">lock_clock</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700">100%</div>
            <div className="text-[11px] text-slate-500 mt-1">Chứng thư số HSM VNPT Cloud CA</div>
          </div>
        </div>
      </div>

      {/* Table & Controls Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filters and search */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'ACTIVE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Đang chạy ({activePlans.length})
            </button>
            <button
              onClick={() => setActiveTab('PAUSED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'PAUSED'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tạm dừng ({plans.filter((p) => p.status === 'PAUSED').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm khách hàng, dịch vụ, số hợp đồng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-base">
              search
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Gói dịch vụ & Hợp đồng</th>
                <th className="py-3 px-3">Khách hàng</th>
                <th className="py-3 px-3">Chu kỳ</th>
                <th className="py-3 px-3 text-right">Giá trị / Kỳ</th>
                <th className="py-3 px-3">Kỳ tiếp theo</th>
                <th className="py-3 px-3 text-center">Tiến độ</th>
                <th className="py-3 px-3 text-center">Auto-Sign HSM</th>
                <th className="py-3 px-3 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{plan.serviceTitle}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {plan.contractRef} • {plan.code}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-800">{plan.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">MST: {plan.taxCode}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {plan.frequency}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    {formatVND(plan.amountPerPeriod)}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-700">
                    {plan.nextRunDate}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {plan.completedCycles}/{plan.totalCycles || '∞'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {plan.autoSign ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Bật
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Tắt</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      plan.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : plan.status === 'PAUSED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.status === 'ACTIVE' ? 'Đang chạy' : plan.status === 'PAUSED' ? 'Tạm dừng' : 'Lỗi'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onTriggerRun(plan.id)}
                        title="Kích hoạt phát sinh hóa đơn ngay bây giờ"
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">play_arrow</span>
                        Chạy ngay
                      </button>
                      <button
                        onClick={() => onToggleStatus(plan.id)}
                        title={plan.status === 'ACTIVE' ? 'Tạm dừng lịch' : 'Tiếp tục lịch'}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">
                          {plan.status === 'ACTIVE' ? 'pause' : 'play_circle'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">autorenew</span>
                Thiết lập Lịch xuất Hóa đơn Định kỳ
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Tên Doanh nghiệp Khách hàng</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cty TNHH Dịch vụ Công nghệ FPT"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Mã số thuế</label>
                  <input
                    type="text"
                    placeholder="VD: 0101244588"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Số hợp đồng căn cứ</label>
                  <input
                    type="text"
                    placeholder="VD: HĐ-2025/CLOUD-08"
                    value={contractRef}
                    onChange={(e) => setContractRef(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Tên Gói dịch vụ định kỳ</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Gói duy trì hạ tầng ERP Dedicated Server (Hàng tháng)"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Chu kỳ phát hành</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Hàng tháng">Hàng tháng (Monthly)</option>
                    <option value="Hàng quý">Hàng quý (Quarterly)</option>
                    <option value="Hàng năm">Hàng năm (Yearly)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Giá trị mỗi kỳ (₫)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-900">Tự động Ký số HSM Cloud khi đến kỳ</div>
                  <div className="text-[11px] text-indigo-700">Tự động đồng bộ sang Tổng cục Thuế và email khách hàng</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSign}
                  onChange={(e) => setAutoSign(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Kích hoạt Lịch định kỳ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
