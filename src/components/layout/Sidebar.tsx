import React from 'react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  invoiceCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, invoiceCount = 24 }) => {
  const navSections = [
    {
      title: 'Tổng quan / Main',
      items: [
        { id: 'dashboard', label: 'Tổng quan Dashboard', icon: 'grid_view' }
      ]
    },
    {
      title: 'Nghiệp vụ Hóa đơn / Billing',
      items: [
        { id: 'invoices', label: 'Quản lý Hóa đơn', icon: 'receipt_long', badge: invoiceCount },
        { id: 'create-invoice', label: 'Lập Hóa đơn Mới', icon: 'add_circle' },
        { id: 'payments', label: 'Thu tiền & Phiếu thu', icon: 'payments' },
        { id: 'reconciliation', label: 'Đối soát Ngân hàng', icon: 'account_balance' },
        { id: 'refunds', label: 'Hoàn tiền & Điều chỉnh', icon: 'assignment_return' }
      ]
    },
    {
      title: 'Dữ liệu Gốc / Master Data',
      items: [
        { id: 'customers', label: 'Khách hàng & Hạn mức', icon: 'group' },
        { id: 'products-services', label: 'Bảng giá & Sản phẩm', icon: 'inventory_2' },
        { id: 'taxes', label: 'Thuế suất & Kê khai', icon: 'percent' },
        { id: 'payment-terms', label: 'Điều khoản Thanh toán', icon: 'contract' }
      ]
    },
    {
      title: 'Báo cáo & Phân tích / Analytics',
      items: [
        { id: 'revenue', label: 'Doanh thu & MRR', icon: 'trending_up' },
        { id: 'receivables-aging', label: 'Tuổi nợ & Phải thu', icon: 'hourglass_empty' },
        { id: 'collection-metrics', label: 'Chỉ số Thu nợ (DSO)', icon: 'pie_chart' }
      ]
    },
    {
      title: 'Tự động hóa & Cài đặt',
      items: [
        { id: 'recurring-plans', label: 'Hóa đơn Định kỳ', icon: 'autorenew' },
        { id: 'audit-log', label: 'Nhật ký Kiểm toán WORM', icon: 'history' },
        { id: 'role-permissions', label: 'Phân quyền Vai trò', icon: 'manage_accounts' },
        { id: 'account-settings', label: 'Cài đặt Pháp nhân & HSM', icon: 'settings' }
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest border-r border-outline-variant/40 z-50 flex flex-col justify-between overflow-y-auto select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="h-14 px-4 flex items-center gap-2.5 border-b border-outline-variant/40 bg-surface-container-lowest sticky top-0 z-10 cursor-pointer hover:bg-surface-container-low transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0037b0] flex items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden">
            <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
              <rect x="10" y="10" width="20" height="4" rx="1" fill="white" />
              <rect x="10" y="18" width="14" height="4" rx="1" fill="#93c5fd" />
              <rect x="10" y="26" width="20" height="4" rx="1" fill="white" />
              <path d="M21 24L26 30L34 18" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[17px] text-on-surface leading-none tracking-tight">LedgerFlow</span>
            <span className="text-[11px] text-secondary leading-tight mt-0.5 font-medium">Enterprise v1.0</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="py-2 flex flex-col">
          {navSections.map((sec, secIdx) => (
            <div key={sec.title} className="px-3 pb-2">
              <div className="text-[11px] uppercase text-secondary font-semibold px-2 py-1 tracking-wider">
                {sec.title}
              </div>
              <nav className="flex flex-col gap-0.5 mt-0.5">
                {sec.items.map(item => {
                  const isActive = currentView === item.id || 
                    (item.id === 'invoices' && currentView === 'invoice-detail');
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-sm transition-all text-left ${
                        isActive
                          ? 'bg-primary-container text-on-primary font-medium shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`material-symbols-outlined text-[19px] shrink-0 ${isActive ? 'text-on-primary' : 'text-secondary'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.2 text-[11px] font-semibold rounded-full tabular-nums ${
                            isActive
                              ? 'bg-white/20 text-on-primary'
                              : 'bg-secondary-container text-on-secondary-fixed'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Nodes Status Footer */}
      <div className="p-3 border-t border-outline-variant/40 bg-surface-container-low shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-tertiary-container animate-pulse"></div>
            <span className="text-[12px] text-on-surface-variant font-medium">All Nodes Operational</span>
          </div>
          <span className="text-[11px] text-secondary font-semibold tabular-nums">99.98%</span>
        </div>
      </div>
    </aside>
  );
};
