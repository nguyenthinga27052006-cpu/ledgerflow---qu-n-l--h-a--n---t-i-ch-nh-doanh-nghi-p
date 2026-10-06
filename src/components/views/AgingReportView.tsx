import React, { useState } from 'react';
import { Customer, Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';

interface AgingReportViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onNavigate: (view: string, invoiceId?: string) => void;
}

export const AgingReportView: React.FC<AgingReportViewProps> = ({
  invoices,
  customers,
  onNavigate,
}) => {
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [filterSegment, setFilterSegment] = useState<string>('all');

  // Calculate Aging Metrics
  const unpaidInvoices = invoices.filter((inv) => inv.remainingAmount > 0 && inv.status !== 'CANCELLED');
  const totalReceivable = unpaidInvoices.reduce((acc, inv) => acc + inv.remainingAmount, 0);

  // Group by aging buckets
  const now = new Date();
  const bucketCurrent: Invoice[] = [];
  const bucket1_30: Invoice[] = [];
  const bucket31_60: Invoice[] = [];
  const bucket61_90: Invoice[] = [];
  const bucketOver90: Invoice[] = [];

  unpaidInvoices.forEach((inv) => {
    const due = new Date(inv.dueDate);
    const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 0) {
      bucketCurrent.push(inv);
    } else if (diffDays <= 30) {
      bucket1_30.push(inv);
    } else if (diffDays <= 60) {
      bucket31_60.push(inv);
    } else if (diffDays <= 90) {
      bucket61_90.push(inv);
    } else {
      bucketOver90.push(inv);
    }
  });

  const sumCurrent = bucketCurrent.reduce((acc, i) => acc + i.remainingAmount, 0);
  const sum1_30 = bucket1_30.reduce((acc, i) => acc + i.remainingAmount, 0);
  const sum31_60 = bucket31_60.reduce((acc, i) => acc + i.remainingAmount, 0);
  const sum61_90 = bucket61_90.reduce((acc, i) => acc + i.remainingAmount, 0);
  const sumOver90 = bucketOver90.reduce((acc, i) => acc + i.remainingAmount, 0);

  const overdueRiskSum = sum31_60 + sum61_90 + sumOver90;

  // Filter customers with debt
  const customerAgingData = customers
    .map((c) => {
      const custInvoices = unpaidInvoices.filter((i) => i.customerTaxCode === c.taxCode || i.customerName.includes(c.name));
      const current = custInvoices
        .filter((i) => Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24)) <= 0)
        .reduce((a, b) => a + b.remainingAmount, 0);
      const b30 = custInvoices
        .filter((i) => {
          const d = Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24));
          return d > 0 && d <= 30;
        })
        .reduce((a, b) => a + b.remainingAmount, 0);
      const b60 = custInvoices
        .filter((i) => {
          const d = Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24));
          return d > 30 && d <= 60;
        })
        .reduce((a, b) => a + b.remainingAmount, 0);
      const b90Plus = custInvoices
        .filter((i) => Math.floor((now.getTime() - new Date(i.dueDate).getTime()) / (1000 * 3600 * 24)) > 60)
        .reduce((a, b) => a + b.remainingAmount, 0);

      const totalDebt = current + b30 + b60 + b90Plus || c.currentDebt;
      const riskLevel = b90Plus > 0 ? 'CRITICAL' : b60 > 0 ? 'WARNING' : 'LOW';

      return {
        customer: c,
        totalDebt,
        current,
        b30,
        b60,
        b90Plus,
        riskLevel,
      };
    })
    .filter((row) => row.totalDebt > 0)
    .filter((row) => {
      if (filterSegment === 'all') return true;
      return row.customer.segment === filterSegment;
    });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <span className="material-symbols-outlined text-sm">analytics</span>
            Báo cáo Tuổi nợ & Dự báo Dòng tiền
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Accounts Receivable Aging Analysis (A/R)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi kỳ hạn công nợ khách hàng B2B, phân loại rủi ro tín dụng và chỉ số DSO
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Xuất báo cáo tuổi nợ định dạng Excel chuẩn kế toán')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <span className="material-symbols-outlined text-base text-emerald-600">table_view</span>
            Xuất Excel (Biểu mẫu B05-DN)
          </button>
          <button
            onClick={() => alert('Gửi email cảnh báo công nợ tự động tới toàn bộ khách hàng quá hạn')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <span className="material-symbols-outlined text-base">forward_to_inbox</span>
            Nhắc nợ hàng loạt (Dunning)
          </button>
        </div>
      </div>

      {/* KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng công nợ phải thu</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatVND(totalReceivable)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Đang lưu hành trên toàn bộ danh bạ B2B</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Chỉ số DSO (Kỳ thu tiền)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">timelapse</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">38.4</span>
              <span className="text-xs font-medium text-slate-500">ngày</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                -3.2 ngày
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mục tiêu quý: &lt; 40 ngày (Tốt)</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Trong hạn (Current &lt;30)</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">verified</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700">{formatVND(sumCurrent)}</div>
            <div className="text-[11px] text-indigo-600/80 mt-1">
              Chiếm {Math.round((sumCurrent / (totalReceivable || 1)) * 100)}% tổng giá trị phải thu
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Quá hạn rủi ro cao (&gt;30d)</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">warning</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600">{formatVND(overdueRiskSum)}</div>
            <div className="text-[11px] text-rose-600/80 mt-1">Cần kích hoạt cảnh báo trích lập dự phòng</div>
          </div>
        </div>
      </div>

      {/* Aging Distribution Visual Buckets */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-lg">stacked_bar_chart</span>
            Phân bổ Tuổi nợ theo nhóm ngày (Aging Buckets)
          </h2>
          <span className="text-xs text-slate-500">Tổng cộng: {unpaidInvoices.length} hóa đơn đang nợ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Current */}
          <div 
            onClick={() => setSelectedBucket(selectedBucket === 'current' ? 'all' : 'current')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedBucket === 'current' 
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20' 
                : 'bg-slate-50/50 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="text-xs font-bold text-emerald-800">Trong hạn (0-30 ngày)</div>
            <div className="text-base font-bold text-slate-900 mt-2">{formatVND(sumCurrent)}</div>
            <div className="text-[11px] text-slate-500 mt-1">{bucketCurrent.length} hóa đơn</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${Math.round((sumCurrent / (totalReceivable || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* 1-30 */}
          <div 
            onClick={() => setSelectedBucket(selectedBucket === '1_30' ? 'all' : '1_30')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedBucket === '1_30' 
                ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-500/20' 
                : 'bg-slate-50/50 border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="text-xs font-bold text-amber-800">Quá hạn 1 - 30 ngày</div>
            <div className="text-base font-bold text-slate-900 mt-2">{formatVND(sum1_30)}</div>
            <div className="text-[11px] text-slate-500 mt-1">{bucket1_30.length} hóa đơn</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${Math.round((sum1_30 / (totalReceivable || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* 31-60 */}
          <div 
            onClick={() => setSelectedBucket(selectedBucket === '31_60' ? 'all' : '31_60')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedBucket === '31_60' 
                ? 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-500/20' 
                : 'bg-slate-50/50 border-slate-200 hover:border-orange-300'
            }`}
          >
            <div className="text-xs font-bold text-orange-800">Quá hạn 31 - 60 ngày</div>
            <div className="text-base font-bold text-slate-900 mt-2">{formatVND(sum31_60)}</div>
            <div className="text-[11px] text-slate-500 mt-1">{bucket31_60.length} hóa đơn</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full" 
                style={{ width: `${Math.round((sum31_60 / (totalReceivable || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* 61-90 */}
          <div 
            onClick={() => setSelectedBucket(selectedBucket === '61_90' ? 'all' : '61_90')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedBucket === '61_90' 
                ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20' 
                : 'bg-slate-50/50 border-slate-200 hover:border-rose-300'
            }`}
          >
            <div className="text-xs font-bold text-rose-800">Quá hạn 61 - 90 ngày</div>
            <div className="text-base font-bold text-slate-900 mt-2">{formatVND(sum61_90)}</div>
            <div className="text-[11px] text-slate-500 mt-1">{bucket61_90.length} hóa đơn</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-rose-500 h-full rounded-full" 
                style={{ width: `${Math.round((sum61_90 / (totalReceivable || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* >90 */}
          <div 
            onClick={() => setSelectedBucket(selectedBucket === 'over90' ? 'all' : 'over90')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedBucket === 'over90' 
                ? 'bg-red-100/70 border-red-400 ring-2 ring-red-500/20' 
                : 'bg-slate-50/50 border-slate-200 hover:border-red-400'
            }`}
          >
            <div className="text-xs font-bold text-red-900">&gt; 90 ngày (Nợ khó đòi)</div>
            <div className="text-base font-bold text-red-700 mt-2">{formatVND(sumOver90)}</div>
            <div className="text-[11px] text-slate-500 mt-1">{bucketOver90.length} hóa đơn</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-red-700 h-full rounded-full" 
                style={{ width: `${Math.round((sumOver90 / (totalReceivable || 1)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Forecast (4 Weeks Ahead) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-lg">trending_up</span>
            Dự báo Dòng tiền Thu hồi trong 4 tuần tới (Rolling 4-Week Cash Flow)
          </h2>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Dự kiến thu hồi: 1.150.000.000 ₫ (84%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Tuần 1 (07/10 - 13/10)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">320.000.000 ₫</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">4 hóa đơn đáo hạn</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Tuần 2 (14/10 - 20/10)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">450.000.000 ₫</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">6 hóa đơn đáo hạn</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Tuần 3 (21/10 - 27/10)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">210.000.000 ₫</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">3 hóa đơn đáo hạn</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Tuần 4 (28/10 - 03/11)</div>
            <div className="text-lg font-bold text-slate-900 mt-1">170.000.000 ₫</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">2 hóa đơn đáo hạn</div>
          </div>
        </div>
      </div>

      {/* Customer Aging Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Chi tiết Tuổi nợ theo Từng Khách hàng</h3>
            <p className="text-xs text-slate-500 mt-0.5">Xếp hạng mức rủi ro và hạn mức tín dụng công nợ</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Phân khúc:</label>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
            >
              <option value="all">Tất cả phân khúc</option>
              <option value="Enterprise">Doanh nghiệp Lớn (Enterprise)</option>
              <option value="FDI">FDI Nước ngoài</option>
              <option value="SME">Doanh nghiệp SME</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Khách hàng / Doanh nghiệp</th>
                <th className="py-3 px-3">Phân khúc</th>
                <th className="py-3 px-3 text-right">Tổng Dư nợ</th>
                <th className="py-3 px-3 text-right">Trong hạn</th>
                <th className="py-3 px-3 text-right">1 - 30 ngày</th>
                <th className="py-3 px-3 text-right">31 - 60 ngày</th>
                <th className="py-3 px-3 text-right">&gt; 60 ngày</th>
                <th className="py-3 px-3 text-center">Cấp Rủi ro</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {customerAgingData.map((row) => (
                <tr key={row.customer.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{row.customer.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">MST: {row.customer.taxCode} • {row.customer.code}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {row.customer.segment}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    {formatVND(row.totalDebt)}
                  </td>
                  <td className="py-3.5 px-3 text-right text-emerald-700 font-medium">
                    {row.current > 0 ? formatVND(row.current) : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-right text-amber-700 font-medium">
                    {row.b30 > 0 ? formatVND(row.b30) : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-right text-orange-700 font-medium">
                    {row.b60 > 0 ? formatVND(row.b60) : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-right text-red-700 font-bold">
                    {row.b90Plus > 0 ? formatVND(row.b90Plus) : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      row.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      row.riskLevel === 'WARNING' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.riskLevel === 'CRITICAL' ? 'Cao / Cảnh báo' : row.riskLevel === 'WARNING' ? 'Trung bình' : 'An toàn'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => alert(`Gửi thư nhắc nợ đối soát tới ${row.customer.name} qua email ${row.customer.email}`)}
                        title="Gửi email nhắc nợ"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">outgoing_mail</span>
                      </button>
                      <button
                        onClick={() => onNavigate('invoices')}
                        title="Xem danh sách hóa đơn"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">receipt_long</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
