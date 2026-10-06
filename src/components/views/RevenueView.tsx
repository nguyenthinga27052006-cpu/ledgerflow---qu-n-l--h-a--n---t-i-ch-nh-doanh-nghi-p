import React, { useState } from 'react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Invoice, Customer } from '../../types';
import { formatVND } from '../../utils/formatters';

interface RevenueViewProps {
  invoices: Invoice[];
  customers: Customer[];
  onNavigate: (view: string, id?: string) => void;
}

const MONTHLY_REVENUE = [
  { month: 'T03/24', revenue: 780000000, recurring: 520000000, target: 750000000 },
  { month: 'T04/24', revenue: 860000000, recurring: 550000000, target: 800000000 },
  { month: 'T05/24', revenue: 990000000, recurring: 600000000, target: 900000000 },
  { month: 'T06/24', revenue: 1100000000, recurring: 670000000, target: 1000000000 },
  { month: 'T07/24', revenue: 1060000000, recurring: 690000000, target: 1050000000 },
  { month: 'T08/24', revenue: 1180000000, recurring: 740000000, target: 1100000000 },
  { month: 'T09/24', revenue: 1240000000, recurring: 810000000, target: 1150000000 },
  { month: 'T10/24', revenue: 1320000000, recurring: 860000000, target: 1250000000 },
  { month: 'T11/24', revenue: 1550000000, recurring: 930000000, target: 1400000000 },
  { month: 'T12/24', revenue: 1690000000, recurring: 980000000, target: 1500000000 },
  { month: 'T01/25', revenue: 1280000000, recurring: 990000000, target: 1300000000 },
  { month: 'T02/25', revenue: 1412500000, recurring: 1040000000, target: 1400000000 },
];

const SEGMENT_DATA = [
  { name: 'Enterprise (Tập đoàn)', value: 850000000, color: '#2563eb' },
  { name: 'FDI (Đa quốc gia)', value: 420000000, color: '#7c3aed' },
  { name: 'SME (Vừa & nhỏ)', value: 142500000, color: '#10b981' },
];

const SERVICE_DATA = [
  { category: 'Hạ tầng Cloud & Server', amount: 680000000, fill: '#3b82f6' },
  { category: 'Bản quyền Phần mềm SaaS', amount: 410000000, fill: '#8b5cf6' },
  { category: 'Kỹ thuật 24/7 & SLA', amount: 212500000, fill: '#06b6d4' },
  { category: 'Tư vấn HSM & Triển khai', amount: 110000000, fill: '#10b981' },
];

export const RevenueView: React.FC<RevenueViewProps> = ({ invoices, customers, onNavigate }) => {
  const [timeRange, setTimeRange] = useState<'12M' | '6M'>('12M');

  const chartData = timeRange === '12M' ? MONTHLY_REVENUE : MONTHLY_REVENUE.slice(6);
  const totalRevenuePeriod = chartData.reduce((sum, d) => sum + d.revenue, 0);
  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1];

  // Top Customers by revenue
  const topCustomers = [
    { name: 'Công ty TNHH Dịch Vụ Số Apex', segment: 'FDI', revenue: 240000000, growth: '+18%' },
    { name: 'Tập đoàn Dược phẩm Vimedimex', segment: 'Enterprise', revenue: 185000000, growth: '+12%' },
    { name: 'Viễn Thông Sao Mai', segment: 'SME', revenue: 145000000, growth: '+8%' },
    { name: 'Cty CP Thương Mại XNK An Phát', segment: 'SME', revenue: 120000000, growth: '+25%' },
    { name: 'Cty CP Sữa Quốc Tế Ba Vì', segment: 'Enterprise', revenue: 95000000, growth: '-4%' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            Báo cáo Doanh thu & Tăng trưởng Tài chính (Revenue Analytics)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Phân tích Cơ cấu Doanh thu, MRR & Hiệu quả Kinh doanh
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi dòng doanh thu thuần, doanh thu định kỳ thuê bao (MRR/ARR) và cơ cấu tỷ trọng khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setTimeRange('12M')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeRange === '12M' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              12 Tháng qua
            </button>
            <button
              onClick={() => setTimeRange('6M')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                timeRange === '6M' ? 'bg-white dark:bg-slate-900 shadow-xs text-blue-600 font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              6 Tháng gần nhất
            </button>
          </div>

          <button
            onClick={() => alert('Đang xuất Báo cáo Doanh thu tổng hợp định dạng Excel / PDF...')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            Xuất Báo cáo
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh thu Tháng này (T02/25)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {formatVND(currentMonth.revenue)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span>+10.3% so với tháng trước</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh thu Định kỳ (MRR)</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">autorenew</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 font-mono">
              {formatVND(currentMonth.recurring)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chiếm 73.6% tổng doanh thu</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh thu Quy năm (ARR)</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">event_repeat</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 font-mono">
              {formatVND(currentMonth.recurring * 12)}
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Dự phóng tăng trưởng bền vững</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">ARPU (Doanh thu TB / Khách)</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">group</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatVND(Math.round(currentMonth.revenue / (customers.length || 1)))}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Bình quân trên 24 khách hàng Active</div>
          </div>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Xu hướng Tăng trưởng Doanh thu & Doanh thu Định kỳ (MRR)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">So sánh thực đạt so với chỉ tiêu kế hoạch (Target)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-slate-600 dark:text-slate-300">Tổng doanh thu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-300">Định kỳ (MRR)</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                formatter={(val: any) => [formatVND(Number(val)), '']}
                contentStyle={{ borderRadius: 12, border: '1px solid #cbd5e1', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" name="Tổng Doanh thu" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="recurring" name="MRR Định kỳ" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Breakdown by Segment & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown by Segment */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Cơ cấu Doanh thu theo Phân khúc Khách hàng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Tỷ trọng đóng góp giữa Enterprise, FDI và SME</p>

            <div className="h-56 mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SEGMENT_DATA}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {SEGMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatVND(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            {SEGMENT_DATA.map((s) => (
              <div key={s.name}>
                <div className="text-[11px] text-slate-500 truncate">{s.name}</div>
                <div className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatVND(s.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown by Service Category */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Doanh thu theo Nhóm Dịch vụ & Sản phẩm
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Xếp hạng dòng sản phẩm mang lại doanh thu cao nhất</p>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SERVICE_DATA} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: any) => formatVND(Number(v))} />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
            <span>Dịch vụ cốt lõi: Hạ tầng Cloud & Server</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">48.2% Doanh thu</span>
          </div>
        </div>
      </div>

      {/* Top 5 Revenue Clients */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Top 5 Khách hàng Đóng góp Doanh thu Lớn nhất
          </h3>
          <button
            onClick={() => onNavigate('customers')}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Xem toàn bộ khách hàng
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {topCustomers.map((c, idx) => (
            <div key={c.name} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center justify-center font-mono text-xs">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {c.segment}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {formatVND(c.revenue)}
                </div>
                <div className={`text-[10px] font-semibold ${c.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {c.growth} tăng trưởng
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
