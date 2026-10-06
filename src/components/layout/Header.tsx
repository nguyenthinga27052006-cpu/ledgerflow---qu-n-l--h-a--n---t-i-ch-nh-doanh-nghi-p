import React, { useState } from 'react';
import { UserRole } from '../../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenLogin: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: (isDark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onRoleChange,
  onOpenSearch,
  onOpenLogin,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    switch (currentView) {
      case 'dashboard':
        return { section: 'Operations', title: 'Ledger Consolidation' };
      case 'invoices':
        return { section: 'Billing Operations', title: 'Quản lý Hóa đơn' };
      case 'invoice-detail':
        return { section: 'Hóa đơn', title: 'INV-2025-00103' };
      case 'create-invoice':
        return { section: 'Billing Operations', title: 'Tạo Hóa đơn mới' };
      case 'payments':
        return { section: 'Billing Operations', title: 'Sổ cái Thu tiền & Phiếu thu' };
      case 'reconciliation':
        return { section: 'Billing Operations', title: 'Đối soát Ngân hàng' };
      case 'refunds':
        return { section: 'Billing Operations', title: 'Hoàn tiền & Điều chỉnh (Credit Notes)' };
      case 'customers':
        return { section: 'Master Data', title: 'Khách hàng & Đối tác' };
      case 'products-services':
        return { section: 'Master Data', title: 'Bảng giá & Sản phẩm Dịch vụ' };
      case 'taxes':
        return { section: 'Master Data', title: 'Thuế suất & Kê khai Thuế GTGT' };
      case 'payment-terms':
        return { section: 'Master Data', title: 'Chính sách & Điều khoản Thanh toán' };
      case 'recurring-plans':
        return { section: 'Automation & Settings', title: 'Recurring Plans (Hóa đơn định kỳ)' };
      case 'receivables-aging':
        return { section: 'Analytics & Reports', title: 'Báo cáo Tuổi nợ (Aging Matrix)' };
      case 'revenue':
        return { section: 'Analytics & Reports', title: 'Báo cáo Doanh thu & Tăng trưởng' };
      case 'collection-metrics':
        return { section: 'Analytics & Reports', title: 'Chỉ số Thu hồi nợ (DSO & CEI)' };
      case 'role-permissions':
        return { section: 'Automation & Settings', title: 'Vai trò & Phân quyền Hệ thống' };
      case 'audit-log':
        return { section: 'Automation & Settings', title: 'Nhật ký Kiểm toán & Dấu vết Chứng từ' };
      case 'account-settings':
        return { section: 'Hệ thống', title: 'Cài đặt Tài khoản & Pháp nhân' };
      default:
        return { section: 'Operations', title: 'Ledger Consolidation' };
    }
  };

  const breadcrumb = getBreadcrumb();

  const roleMap: Record<UserRole, string> = {
    ROLE_SYS_ADMIN: 'Super Admin',
    ROLE_BILLING_MANAGER: 'Billing Manager',
    ROLE_ACCOUNTANT: 'Accountant',
    ROLE_BILLING_STAFF: 'Billing Staff',
    ROLE_AUDITOR: 'Auditor',
    ROLE_CUSTOMER_PORTAL: 'Customer Portal'
  };

  const notifications = [
    { id: 1, title: 'Cảnh báo quá hạn 5 ngày', desc: 'INV-2025-00104 - Cty Ba Vì (45M ₫)', time: '10 phút trước', unread: true },
    { id: 2, title: 'Đối soát VCB thành công', desc: 'PAY-2025-0045 đã ghi nhận 60M ₫', time: '1 giờ trước', unread: true },
    { id: 3, title: 'Hóa đơn định kỳ sắp sinh', desc: 'Batch 01/03/2025: 8 HĐ (86.2M ₫)', time: '2 giờ trước', unread: true }
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/40 z-40 px-6 flex items-center justify-between gap-4">
      {/* Left: Breadcrumbs & Quick Search */}
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-secondary shrink-0">
          <span className="hover:text-on-surface cursor-pointer transition-colors" onClick={() => onNavigate('dashboard')}>
            {breadcrumb.section}
          </span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{breadcrumb.title}</span>
        </div>

        <div className="relative max-w-xs w-full hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full h-8 pl-8 pr-10 text-xs rounded-lg border border-outline-variant/60 bg-surface-container-low text-secondary text-left hover:bg-surface-container-lowest focus:outline-none transition-all flex items-center"
          >
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[17px] text-outline">
              search
            </span>
            <span className="truncate">Search records, invoices, accounts...</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] text-secondary bg-surface-container-lowest border border-outline-variant rounded font-mono">
                ⌘K
              </kbd>
            </div>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant/60 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors text-xs text-on-surface font-medium"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">badge</span>
            <span>{roleMap[activeRole]}</span>
            <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1.5 w-56 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-surface-container">
                Chọn vai trò mô phỏng (RBAC)
              </div>
              {(Object.keys(roleMap) as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface-container-low transition-colors ${
                    activeRole === role ? 'text-primary font-semibold bg-surface-container-low' : 'text-on-surface'
                  }`}
                >
                  <span>{roleMap[role]}</span>
                  {activeRole === role && (
                    <span className="material-symbols-outlined text-[15px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Invoice Primary Button */}
        <button
          onClick={() => onNavigate('create-invoice')}
          className="inline-flex items-center gap-1.5 h-8 px-3 bg-primary-container text-on-primary rounded-lg text-xs font-semibold hover:bg-primary transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Create Invoice</span>
        </button>

        <div className="h-4 w-px bg-outline-variant/60"></div>

        {/* Quick Dark Mode Toggle */}
        <button
          onClick={() => onToggleDarkMode?.(!isDarkMode)}
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors flex items-center justify-center"
          title={isDarkMode ? 'Chuyển sang Chế độ Sáng' : 'Chuyển sang Chế độ Tối'}
        >
          <span className="material-symbols-outlined text-[20px] text-amber-500 dark:text-blue-400">
            {isDarkMode ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 h-3.5 min-w-[14px] px-0.5 flex items-center justify-center rounded-full bg-error text-on-error text-[10px] font-bold leading-none">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 pb-2 border-b border-surface-container flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">Thông báo tài chính (3 mới)</span>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">Đánh dấu đã đọc</span>
              </div>
              <div className="divide-y divide-surface-container max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-on-surface">{n.title}</span>
                      <span className="text-[10px] text-secondary">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          onClick={() => onNavigate('account-settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-85 transition-opacity"
          title="Xem cài đặt tài khoản"
        >
          <div className="flex flex-col text-right hidden lg:flex">
            <span className="text-xs font-semibold text-on-surface leading-tight">Nguyễn Văn Minh</span>
            <span className="text-[11px] text-secondary leading-none mt-0.5">Senior Accountant</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 font-semibold text-xs shadow-sm">
            NM
          </div>
        </div>

        {/* Logout / Switch User */}
        <button
          onClick={onOpenLogin}
          className="p-1 text-secondary hover:text-error hover:bg-surface-container rounded-lg transition-colors"
          title="Đổi tài khoản / Đăng xuất"
        >
          <span className="material-symbols-outlined text-[19px]">logout</span>
        </button>
      </div>
    </header>
  );
};
