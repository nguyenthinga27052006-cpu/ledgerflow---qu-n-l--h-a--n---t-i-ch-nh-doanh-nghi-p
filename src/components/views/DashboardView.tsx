import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';

interface DashboardViewProps {
  invoices: Invoice[];
  onNavigate: (view: string, invoiceId?: string) => void;
  onQuickRecordPayment: (invoice: Invoice) => void;
  onSendDunningNotice: (invoice: Invoice) => void;
}

const MONTHLY_12M_DATA = [
  { month: 'T03/24', invoiced: 850000000, collected: 780000000, target: 800000000 },
  { month: 'T04/24', invoiced: 920000000, collected: 860000000, target: 850000000 },
  { month: 'T05/24', invoiced: 1050000000, collected: 990000000, target: 950000000 },
  { month: 'T06/24', invoiced: 1180000000, collected: 1100000000, target: 1000000000 },
  { month: 'T07/24', invoiced: 1120000000, collected: 1060000000, target: 1100000000 },
  { month: 'T08/24', invoiced: 1250000000, collected: 1180000000, target: 1150000000 },
  { month: 'T09/24', invoiced: 1340000000, collected: 1240000000, target: 1200000000 },
  { month: 'T10/24', invoiced: 1420000000, collected: 1320000000, target: 1300000000 },
  { month: 'T11/24', invoiced: 1680000000, collected: 1550000000, target: 1400000000 },
  { month: 'T12/24', invoiced: 1820000000, collected: 1690000000, target: 1500000000 },
  { month: 'T01/25', invoiced: 1350000000, collected: 1280000000, target: 1400000000 },
  { month: 'T02/25', invoiced: 1540850000, collected: 1412500000, target: 1450000000 },
];

const MONTHLY_6M_DATA = MONTHLY_12M_DATA.slice(6);

const QUARTERLY_DATA = [
  { month: 'Q1/24', invoiced: 2540000000, collected: 2380000000, target: 2400000000 },
  { month: 'Q2/24', invoiced: 3150000000, collected: 2950000000, target: 3000000000 },
  { month: 'Q3/24', invoiced: 3710000000, collected: 3480000000, target: 3500000000 },
  { month: 'Q4/24', invoiced: 4920000000, collected: 4560000000, target: 4400000000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs z-50">
        <div className="font-bold text-slate-200 border-b border-slate-700/60 pb-1.5 mb-2 flex items-center justify-between gap-4">
          <span>Kỳ tài chính: {label}</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
            Đã chốt sổ
          </span>
        </div>
        <div className="space-y-1.5 font-sans">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 text-[11px]">{entry.name}:</span>
              </div>
              <span className="font-mono font-bold text-white text-[12px]">{formatVND(entry.value)}</span>
            </div>
          ))}
          {payload.length >= 2 && (
            <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Tỷ lệ thu hồi dòng tiền:</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round((payload[1].value / (payload[0].value || 1)) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  invoices,
  onNavigate,
  onQuickRecordPayment,
  onSendDunningNotice
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Tháng này (01/02/2025 - 28/02/2025)');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [monthlyRange, setMonthlyRange] = useState<'12M' | '6M' | 'QUARTER'>('12M');

  const chartData = 
    monthlyRange === '12M' 
      ? MONTHLY_12M_DATA 
      : monthlyRange === '6M' 
      ? MONTHLY_6M_DATA 
      : QUARTERLY_DATA;

  const totalPeriodInvoiced = chartData.reduce((sum, item) => sum + item.invoiced, 0);
  const totalPeriodCollected = chartData.reduce((sum, item) => sum + item.collected, 0);

  const periods = [
    { label: 'Hôm nay', sub: '24/02' },
    { label: 'Tuần này', sub: 'W8' },
    { label: 'Tháng này (01/02/2025 - 28/02/2025)', sub: 'Mặc định' },
    { label: 'Quý 1 (01/01/2025 - 31/03/2025)', sub: 'Q1' }
  ];

  const highPriorityInvoices = invoices.filter(inv => inv.status === 'OVERDUE');

  const recentTransactions = [
    {
      id: 'tx-1',
      code: 'PAY-0045',
      bank: 'VCB',
      customer: 'Apex Digital',
      time: 'Hôm nay, 14:28 • Chuyển khoản',
      amount: 60000000,
      status: 'Đã đối soát'
    },
    {
      id: 'tx-2',
      code: 'PAY-0044',
      bank: 'MB',
      customer: 'Tân Á Corp',
      time: 'Hôm nay, 10:15 • QR Pay',
      amount: 15200000,
      status: 'Đã đối soát'
    },
    {
      id: 'tx-3',
      code: 'PAY-0043',
      bank: 'CASH',
      customer: 'Sao Việt',
      time: 'Hôm qua, 16:40 • Tiền mặt tại quỹ',
      amount: 8500000,
      status: 'Chờ duyệt'
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Executive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Tổng quan Tài chính & Vòng đời Hóa đơn
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
              Chế độ xem: Billing Manager & Senior Accountant
            </span>
          </div>
          <p className="text-sm text-secondary">
            Kiểm soát hiệu suất thu hồi công nợ, phân tích vòng đời thanh toán và đối soát sổ cái kỳ tài chính Tháng 02/2025.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodMenu(!showPeriodMenu)}
              className="inline-flex items-center gap-2 h-9 px-3.5 bg-surface-container-low text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[17px] text-secondary">calendar_today</span>
              <span>{selectedPeriod}</span>
              <span className="material-symbols-outlined text-[17px] text-secondary">expand_more</span>
            </button>

            {showPeriodMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl z-30 py-1.5 animate-in fade-in duration-100">
                <div className="px-3 py-1 text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Chu kỳ báo cáo
                </div>
                {periods.map(p => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setSelectedPeriod(p.label);
                      setShowPeriodMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container-low ${
                      selectedPeriod === p.label ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className="text-[10px] text-secondary tabular-nums font-mono">{p.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('reconciliation')}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-xs font-medium rounded-lg shadow-sm hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">upload_file</span>
            <span>Nhập sao kê (Import)</span>
          </button>

          <button
            onClick={() => onNavigate('create-invoice')}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-primary-container text-on-primary text-xs font-semibold rounded-lg shadow-sm hover:bg-primary transition-all"
          >
            <span className="material-symbols-outlined text-[17px]">add_circle</span>
            <span>+ Lập hóa đơn mới</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Tổng giá trị xuất HĐ</span>
              <span className="text-xs text-on-surface-variant mt-0.5">Total Invoiced (Tháng 2)</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">receipt</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="text-2xl font-bold text-on-surface tabular-nums tracking-tight">
              1.450.800.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>+14.2%
              </span>
              <span className="text-secondary">so với tháng trước</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Thực thu đã ghi nhận</span>
              <span className="text-xs text-on-surface-variant mt-0.5">Cash Collected</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="text-2xl font-bold text-tertiary-container tabular-nums tracking-tight">
              1.120.300.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>+8.5%
              </span>
              <span className="font-semibold text-tertiary">Tỷ lệ thu 77.2%</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full" style={{ width: '77.2%' }}></div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Tổng công nợ tồn đọng</span>
              <span className="text-xs text-on-surface-variant mt-0.5">Outstanding Receivables</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="text-2xl font-bold text-on-surface tabular-nums tracking-tight">
              285.500.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-secondary px-1.5 py-0.5 bg-surface-container rounded tabular-nums">
                19.7%
              </span>
              <span className="text-secondary">trên tổng doanh thu xuất</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '19.7%' }}></div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-error font-semibold">Nợ quá hạn rủi ro</span>
              <span className="text-xs text-on-surface-variant mt-0.5">Overdue Aging Debt</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-error-container flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <div className="text-2xl font-bold text-error tabular-nums tracking-tight">
              45.000.000 <span className="text-sm font-normal text-error/80">₫</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                4 hóa đơn quá hạn
              </span>
              <span className="text-secondary">Cần đôn đốc</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '15.7%' }}></div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend - Recharts AreaChart */}
      <div className="bg-surface-container-lowest p-5 md:p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-on-surface">Xu Hướng Doanh Thu & Dòng Tiền Theo Tháng</h2>
                <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Recharts Financial Engine
                </span>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Biểu đồ đường AreaChart thể hiện tiến trình xuất hóa đơn (Invoiced) đối chiếu với dòng tiền thu hồi thực tế (Cash Collected)
              </p>
            </div>
          </div>

          {/* Time filter */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
            <button
              onClick={() => setMonthlyRange('12M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                monthlyRange === '12M' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-secondary hover:text-on-surface'
              }`}
            >
              12 Tháng (2024-2025)
            </button>
            <button
              onClick={() => setMonthlyRange('6M')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                monthlyRange === '6M' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-secondary hover:text-on-surface'
              }`}
            >
              6 Tháng gần nhất
            </button>
            <button
              onClick={() => setMonthlyRange('QUARTER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                monthlyRange === 'QUARTER' ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-secondary hover:text-on-surface'
              }`}
            >
              Theo Quý (Q1-Q4)
            </button>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-1">
          <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/20">
            <div className="text-[11px] text-secondary font-medium">
              Doanh thu ({monthlyRange === '12M' ? '12 tháng' : monthlyRange === '6M' ? '6 tháng' : '4 quý'})
            </div>
            <div className="text-base md:text-lg font-bold text-on-surface font-mono mt-0.5">{formatVND(totalPeriodInvoiced)}</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              +24.8% YoY
            </div>
          </div>

          <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/20">
            <div className="text-[11px] text-secondary font-medium">Thực thu tiền mặt</div>
            <div className="text-base md:text-lg font-bold text-emerald-700 font-mono mt-0.5">{formatVND(totalPeriodCollected)}</div>
            <div className="text-[10px] text-secondary mt-0.5 font-medium">
              Đạt {Math.round((totalPeriodCollected / (totalPeriodInvoiced || 1)) * 100)}% kế hoạch thu hồi
            </div>
          </div>

          <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/20">
            <div className="text-[11px] text-secondary font-medium">Tháng đỉnh điểm (Peak)</div>
            <div className="text-base md:text-lg font-bold text-primary font-mono mt-0.5">1.82 Tỷ ₫</div>
            <div className="text-[10px] text-secondary mt-0.5">Tháng 12/2024 (Quyết toán)</div>
          </div>

          <div className="p-3 bg-surface-container-low/70 rounded-xl border border-outline-variant/20">
            <div className="text-[11px] text-secondary font-medium">Tỷ lệ thu hồi bình quân</div>
            <div className="text-base md:text-lg font-bold text-blue-700 font-mono mt-0.5">91.4%</div>
            <div className="text-[10px] text-secondary mt-0.5">An toàn tín dụng doanh nghiệp</div>
          </div>
        </div>

        {/* Recharts AreaChart Container */}
        <div className="w-full h-72 md:h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvoiced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0037b0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0037b0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                dy={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                height={36}
                iconType="circle"
                formatter={(value: string) => (
                  <span className="text-xs font-medium text-slate-700 mx-1">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="invoiced"
                name="Doanh thu xuất HĐ"
                stroke="#0037b0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorInvoiced)"
                activeDot={{ r: 6, stroke: '#0037b0', strokeWidth: 2, fill: '#ffffff' }}
              />
              <Area
                type="monotone"
                dataKey="collected"
                name="Thực thu tiền mặt"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCollected)"
                activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Comparison Chart (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">analytics</span>
                <h2 className="text-base font-bold text-on-surface">Xuất Hóa Đơn vs Dòng Tiền Thực Thu Theo Tuần</h2>
              </div>
              <p className="text-xs text-secondary mt-0.5">So sánh nhịp độ phát hành hóa đơn và dòng tiền thanh toán thực tế đổ về tài khoản</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-primary-container inline-block"></span>
                <span>Hóa đơn phát hành</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-tertiary-container inline-block"></span>
                <span>Tiền thực thu</span>
              </div>
            </div>
          </div>

          {/* SVG & Bar Visualization */}
          <div className="relative w-full h-64 flex flex-col justify-end pt-4 pb-2">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 text-[10px] text-secondary font-mono">
              <div className="w-full h-px bg-outline-variant flex justify-between items-center">
                <span>500M</span>
              </div>
              <div className="w-full h-px bg-outline-variant flex justify-between items-center">
                <span>375M</span>
              </div>
              <div className="w-full h-px bg-outline-variant flex justify-between items-center">
                <span>250M</span>
              </div>
              <div className="w-full h-px bg-outline-variant flex justify-between items-center">
                <span>125M</span>
              </div>
              <div className="w-full h-px bg-outline-variant"></div>
            </div>

            {/* 4 Weekly Bar Pairs */}
            <div className="relative z-10 grid grid-cols-4 gap-6 h-48 items-end px-4">
              {/* Week 1 */}
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredWeek(1)}
                onMouseLeave={() => setHoveredWeek(null)}
              >
                <div className="flex items-end gap-2 w-full justify-center h-40">
                  <div className="w-8 md:w-10 bg-primary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '64%' }}>
                    {hoveredWeek === 1 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        320M
                      </span>
                    )}
                  </div>
                  <div className="w-8 md:w-10 bg-tertiary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '52%' }}>
                    {hoveredWeek === 1 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        260M
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-on-surface block">Tuần 1</span>
                  <span className="text-[11px] text-secondary">01 - 07 Feb</span>
                </div>
              </div>

              {/* Week 2 */}
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredWeek(2)}
                onMouseLeave={() => setHoveredWeek(null)}
              >
                <div className="flex items-end gap-2 w-full justify-center h-40">
                  <div className="w-8 md:w-10 bg-primary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '84%' }}>
                    {hoveredWeek === 2 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        420M
                      </span>
                    )}
                  </div>
                  <div className="w-8 md:w-10 bg-tertiary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '68%' }}>
                    {hoveredWeek === 2 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        340M
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-on-surface block">Tuần 2</span>
                  <span className="text-[11px] text-secondary">08 - 14 Feb</span>
                </div>
              </div>

              {/* Week 3 */}
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredWeek(3)}
                onMouseLeave={() => setHoveredWeek(null)}
              >
                <div className="flex items-end gap-2 w-full justify-center h-40">
                  <div className="w-8 md:w-10 bg-primary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '76%' }}>
                    {hoveredWeek === 3 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        380M
                      </span>
                    )}
                  </div>
                  <div className="w-8 md:w-10 bg-tertiary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '60%' }}>
                    {hoveredWeek === 3 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        300M
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-semibold text-on-surface block">Tuần 3</span>
                  <span className="text-[11px] text-secondary">15 - 21 Feb</span>
                </div>
              </div>

              {/* Week 4 */}
              <div
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredWeek(4)}
                onMouseLeave={() => setHoveredWeek(null)}
              >
                <div className="flex items-end gap-2 w-full justify-center h-40">
                  <div className="w-8 md:w-10 bg-primary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '66%' }}>
                    {hoveredWeek === 4 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        330.8M
                      </span>
                    )}
                  </div>
                  <div className="w-8 md:w-10 bg-tertiary-container rounded-t-md relative transition-all group-hover:brightness-110" style={{ height: '44%' }}>
                    {hoveredWeek === 4 && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-inverse-surface text-inverse-on-surface text-[10px] rounded font-mono whitespace-nowrap z-20 shadow">
                        220.3M
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs font-bold text-primary">Tuần 4</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  </div>
                  <span className="text-[11px] text-secondary">22 - 28 Feb</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-container-low px-4 py-2.5 rounded-lg text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
              <span>Độ trễ dòng tiền trung bình (DSO): <strong className="font-semibold text-on-surface">18.4 ngày</strong> (Tối ưu so với mục tiêu &lt; 25 ngày)</span>
            </div>
            <button
              onClick={() => onNavigate('reconciliation')}
              className="text-primary font-semibold hover:underline flex items-center gap-0.5"
            >
              Xem báo cáo đối soát tuần →
            </button>
          </div>
        </div>

        {/* Right Lifecycle Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-on-surface">Vòng Đời Hóa Đơn</h2>
                <p className="text-xs text-secondary">Phân bổ 148 hóa đơn trong kỳ</p>
              </div>
              <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs font-semibold rounded">
                148 HĐ
              </span>
            </div>

            {/* Circular Donut Visual */}
            <div className="flex items-center justify-center py-2 relative">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.8"
                />
                {/* Paid: 52% */}
                <path
                  className="text-tertiary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="52, 100"
                  strokeWidth="3.8"
                />
                {/* Issued: 26% offset 52 */}
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="26, 100"
                  strokeDashoffset="-52"
                  strokeWidth="3.8"
                />
                {/* Partially Paid: 12% offset 78 */}
                <path
                  className="text-[#93c5fd]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="12, 100"
                  strokeDashoffset="-78"
                  strokeWidth="3.8"
                />
                {/* Overdue: 3% offset 97 */}
                <path
                  className="text-error"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="3, 100"
                  strokeDashoffset="-97"
                  strokeWidth="3.8"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold tabular-nums text-on-surface leading-none">52%</span>
                <span className="text-[11px] text-secondary mt-1">Đã tất toán</span>
              </div>
            </div>

            {/* Status list */}
            <div className="flex flex-col gap-1.5 mt-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
                  <span className="font-medium text-on-surface">Đã thanh toán (Paid)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-mono">76 HĐ</span>
                  <span className="font-semibold text-on-surface w-10 text-right">52%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
                  <span className="font-medium text-on-surface">Đã phát hành (Chưa hạn)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-mono">38 HĐ</span>
                  <span className="font-semibold text-on-surface w-10 text-right">26%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-medium text-on-surface">Thanh toán một phần</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-mono">18 HĐ</span>
                  <span className="font-semibold text-on-surface w-10 text-right">12%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                  <span className="font-medium text-on-surface">Dự thảo (Draft)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-mono">12 HĐ</span>
                  <span className="font-semibold text-on-surface w-10 text-right">7%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-error-container/30 hover:bg-error-container/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span className="font-semibold text-error">Quá hạn thanh toán</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-error font-medium font-mono">4 HĐ</span>
                  <span className="font-bold text-error w-10 text-right">3%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('invoices')}
            className="mt-4 w-full py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-center text-xs font-semibold text-on-surface transition-colors flex items-center justify-center gap-1"
          >
            <span>Quản lý danh sách 148 HĐ</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Receivables Aging Buckets Section */}
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-primary">hourglass_bottom</span>
            <div>
              <h2 className="text-base font-bold text-on-surface">Phân Tích Tuổi Nợ Công Nợ Phải Thu (Aging Buckets)</h2>
              <p className="text-xs text-secondary">Phân loại chi tiết 285.500.000 ₫ các khoản thu theo kỳ hạn thực tế</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('receivables-aging')}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Quy chuẩn hạn mức: Chu kỳ Net-30 →
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-surface-container overflow-hidden flex">
          <div className="bg-tertiary-container" style={{ width: '84.2%' }} title="Trong hạn: 84.2%"></div>
          <div className="bg-primary-container" style={{ width: '11.2%' }} title="Quá hạn 1-30 ngày: 11.2%"></div>
          <div className="bg-error" style={{ width: '4.6%' }} title="Quá hạn 31-60 ngày: 4.6%"></div>
        </div>

        {/* 4 Buckets Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Trong hạn (0 - 30 ngày)</span>
              <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] font-semibold font-mono">84.2%</span>
            </div>
            <div className="text-xl font-bold text-on-surface tabular-nums">
              240.500.000 <span className="text-xs font-normal text-secondary">₫</span>
            </div>
            <span className="text-xs text-secondary">Dòng tiền ổn định, 114 đối tác</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Quá hạn 1 - 30 ngày</span>
              <span className="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-fixed text-[11px] font-semibold font-mono">11.2%</span>
            </div>
            <div className="text-xl font-bold text-on-surface tabular-nums">
              32.000.000 <span className="text-xs font-normal text-secondary">₫</span>
            </div>
            <span className="text-xs text-secondary">Đã phát lệnh cảnh báo lần 1</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-error font-semibold">Quá hạn 31 - 60 ngày</span>
              <span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container text-[11px] font-semibold font-mono">4.6%</span>
            </div>
            <div className="text-xl font-bold text-error tabular-nums">
              13.000.000 <span className="text-xs font-normal text-error/80">₫</span>
            </div>
            <span className="text-xs text-error font-medium">Cần tạm ngưng xuất hóa đơn mới</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col gap-1 hover:bg-surface-container transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Quá hạn &gt; 90 ngày</span>
              <span className="px-1.5 py-0.2 rounded bg-surface-container-highest text-on-surface text-[11px] font-semibold font-mono">0%</span>
            </div>
            <div className="text-xl font-bold text-tertiary tabular-nums">
              0 <span className="text-xs font-normal text-secondary">₫</span>
            </div>
            <span className="text-xs text-tertiary font-medium">✓ An toàn, không có nợ khó đòi</span>
          </div>
        </div>
      </div>

      {/* Actionable Tables: Urgent Invoices (7 cols) + Recent Bank Sync (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: Overdue Invoices */}
        <div className="xl:col-span-7 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-error">notification_important</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Hóa Đơn Cần Xử Lý Gấp</h3>
                  <p className="text-xs text-secondary">Hóa đơn phát sinh quá hạn cần kế toán đôn đốc hoặc ghi nhận đối soát ngay</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-xs font-bold">
                {highPriorityInvoices.length} Cần xử lý
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-secondary uppercase tracking-wider h-8 font-semibold">
                    <th className="py-2 px-3 rounded-l-lg">Mã Hóa Đơn</th>
                    <th className="py-2 px-3">Khách Hàng</th>
                    <th className="py-2 px-3 text-right">Số Tiền</th>
                    <th className="py-2 px-3 text-center">Tình Trạng</th>
                    <th className="py-2 px-3 rounded-r-lg text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {highPriorityInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onNavigate('invoice-detail', inv.id)}
                          className="font-mono font-bold text-primary hover:underline text-left"
                        >
                          {inv.invoiceNumber}
                        </button>
                        <span className="block text-[11px] text-secondary">Hạn: {inv.dueDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-on-surface">{inv.customerName}</div>
                        <span className="text-[11px] text-secondary font-mono">MST: {inv.customerTaxCode}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums text-on-surface">
                        {formatVND(inv.remainingAmount)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                          Quá hạn
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSendDunningNotice(inv)}
                            className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[11px] font-medium rounded transition-colors inline-flex items-center gap-1"
                            title="Gửi nhắc nợ"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            <span>Nhắc nợ</span>
                          </button>
                          <button
                            onClick={() => onQuickRecordPayment(inv)}
                            className="px-2 py-1 bg-primary text-on-primary hover:bg-primary-container text-[11px] font-medium rounded transition-colors inline-flex items-center gap-1"
                            title="Ghi nhận thanh toán"
                          >
                            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                            <span>Thu tiền</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs">
            <span className="text-secondary">Hiển thị {highPriorityInvoices.length} hóa đơn rủi ro cao cần ưu tiên hành động</span>
            <button
              onClick={() => onNavigate('invoices')}
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Mở sổ theo dõi nợ quá hạn</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Right: Recent Payment Transactions */}
        <div className="xl:col-span-5 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary">sync_alt</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Giao Dịch Gần Nhất</h3>
                  <p className="text-xs text-secondary">Cập nhật qua API Vietcombank, MB Bank & Tiền mặt</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('payments')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Tất cả
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold text-xs font-mono">
                      {tx.bank}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-on-surface">{tx.code}</span>
                        <span className="text-secondary">• {tx.customer}</span>
                      </div>
                      <span className="text-[11px] text-secondary">{tx.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-tertiary tabular-nums">
                      +{formatVND(tx.amount)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-tertiary font-medium mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">check_circle</span>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
              <span>Tự động đồng bộ ngân hàng (API VietQR 24/7)</span>
            </div>
            <button
              onClick={() => alert('Đang làm mới dữ liệu sao kê ngân hàng... Đồng bộ thành công!')}
              className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
              title="Làm mới sao kê"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Operations Helper Bar */}
      <div className="bg-surface-container p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          </div>
          <div>
            <span className="text-xs font-bold text-on-surface block">Gợi ý tác vụ kế toán cuối kỳ</span>
            <span className="text-xs text-secondary">Có 12 bản ghi hóa đơn nháp (Draft) cần hoàn tất kiểm tra biểu thuế GTGT trước ngày 28/02.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('taxes')}
            className="px-3 py-1.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-high rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Kiểm tra bảng thuế
          </button>
          <button
            onClick={() => onNavigate('reconciliation')}
            className="px-3 py-1.5 bg-primary-container text-on-primary hover:bg-primary rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Đối soát sổ cái ngay
          </button>
        </div>
      </div>
    </div>
  );
};
