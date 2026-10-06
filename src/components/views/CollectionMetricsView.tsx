import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Invoice, Customer } from '../../types';
import { formatVND } from '../../utils/formatters';

interface CollectionMetricsViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onNavigate: (view: string) => void;
}

const DSO_TREND = [
  { month: 'T03/24', dso: 42, target: 40, cei: 88.5 },
  { month: 'T04/24', dso: 39, target: 40, cei: 90.2 },
  { month: 'T05/24', dso: 38, target: 40, cei: 91.0 },
  { month: 'T06/24', dso: 36, target: 40, cei: 92.5 },
  { month: 'T07/24', dso: 37, target: 40, cei: 91.8 },
  { month: 'T08/24', dso: 35, target: 40, cei: 93.4 },
  { month: 'T09/24', dso: 34, target: 40, cei: 93.9 },
  { month: 'T10/24', dso: 33, target: 40, cei: 94.5 },
  { month: 'T11/24', dso: 35, target: 40, cei: 93.8 },
  { month: 'T12/24', dso: 36, target: 40, cei: 93.1 },
  { month: 'T01/25', dso: 33, target: 40, cei: 94.0 },
  { month: 'T02/25', dso: 32.4, target: 40, cei: 94.2 },
];

const AGING_COHORT = [
  { period: 'Đúng hạn (Current)', rate: 91.6, amount: 1295000000, color: '#10b981' },
  { period: 'Quá hạn 1 - 30 ngày', rate: 5.2, amount: 73500000, color: '#3b82f6' },
  { period: 'Quá hạn 31 - 60 ngày', rate: 2.1, amount: 29700000, color: '#f59e0b' },
  { period: 'Quá hạn > 60 ngày (Rủi ro)', rate: 1.1, amount: 15500000, color: '#ef4444' },
];

export const CollectionMetricsView: React.FC<CollectionMetricsViewProps> = ({
  invoices,
  customers,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <span className="material-symbols-outlined text-sm">pie_chart</span>
            Chỉ số Thu hồi Công nợ & Vòng quay Vốn (Collection Metrics & DSO)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Hiệu quả Thu nợ (CEI), Số ngày Thu hồi Tiền (DSO) & Dự phòng Rủi ro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Đo lường năng lực thanh khoản tài chính, tốc độ giải phóng nợ đọng và trích lập dự phòng theo Thông tư 48/2019/TT-BTC
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('receivables-aging')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">hourglass_empty</span>
            Xem Chi tiết Tuổi nợ (Aging Matrix)
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Days Sales Outstanding (DSO)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">timelapse</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">32.4 Ngày</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_downward</span>
              <span>Giảm 1.6 ngày • Đạt mốc xuất sắc (&lt; 40 ngày)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Collection Effectiveness (CEI)</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">percent</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono">94.2%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tỷ lệ thu hồi nợ đến hạn trong kỳ</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tỷ lệ Nợ Quá hạn (Overdue)</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">warning</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400 font-mono">8.4%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Dưới ngưỡng trần kiểm soát 10%</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Dự phòng Nợ khó đòi (TT48)</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">shield</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 font-mono">
              {formatVND(13500000)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Trích lập an toàn tài chính</div>
          </div>
        </div>
      </div>

      {/* DSO Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Xu hướng Vòng quay Tiền DSO qua 12 Tháng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Mục tiêu trần DSO: &le; 40 ngày (Đường tham chiếu đỏ)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-slate-600 dark:text-slate-300">DSO thực tế (Ngày)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300">CEI Hiệu quả thu (%)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DSO_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="left" domain={[20, 50]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis yAxisId="right" orientation="right" domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 12 }} />
              <Area yAxisId="left" type="monotone" dataKey="dso" name="DSO (Ngày)" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDso)" />
              <Area yAxisId="right" type="monotone" dataKey="cei" name="Hiệu quả CEI (%)" stroke="#10b981" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort & Bad Debt Reserve Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Funnel */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Phân bổ Nợ theo Kỳ hạn Thu nợ (Collection Funnel)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tỷ trọng thu hồi đúng hạn và các nhóm trễ hạn</p>
          </div>

          <div className="space-y-3 pt-2">
            {AGING_COHORT.map((item) => (
              <div key={item.period} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{item.rate}%</span>
                    <span className="text-slate-400 font-mono">({formatVND(item.amount)})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>91.6% công nợ được đối soát và thu hồi đúng hạn cam kết NET 15/30!</span>
          </div>
        </div>

        {/* Bad Debt Reserve Policy under TT48 */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Khung Dự phòng Phải thu Khó đòi (Thông tư 48/2019/TT-BTC)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Định mức trích lập chi phí tài chính bắt buộc theo tuổi nợ</p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <th className="py-2.5 px-3">Thời gian quá hạn</th>
                  <th className="py-2.5 px-3 text-center">Tỷ lệ trích lập</th>
                  <th className="py-2.5 px-3 text-right">Số dư nợ</th>
                  <th className="py-2.5 px-3 text-right">Dự phòng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Từ 06 tháng đến dưới 01 năm</td>
                  <td className="py-2.5 px-3 text-center font-bold text-amber-600">30%</td>
                  <td className="py-2.5 px-3 text-right font-mono">45.000.000 ₫</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-purple-700">13.500.000 ₫</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Từ 01 năm đến dưới 02 năm</td>
                  <td className="py-2.5 px-3 text-center font-bold text-orange-600">50%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Từ 02 năm đến dưới 03 năm</td>
                  <td className="py-2.5 px-3 text-center font-bold text-red-600">70%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Từ 03 năm trở lên</td>
                  <td className="py-2.5 px-3 text-center font-bold text-red-700">100%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">0 ₫</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            * Các khoản nợ xấu phát sinh được quản lý chặt chẽ qua hồ sơ pháp lý, công văn đòi nợ đối soát có xác nhận của hai bên theo quy định kế toán.
          </div>
        </div>
      </div>
    </div>
  );
};
