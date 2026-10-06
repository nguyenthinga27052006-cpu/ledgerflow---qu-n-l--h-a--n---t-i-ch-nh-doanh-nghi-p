import React, { useState, useEffect } from 'react';
import { UserRoleInfo } from '../../types';
import { ROLE_DEFINITIONS } from '../../data/mockData';

interface SettingsViewProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: (isDark: boolean) => void;
  initialTab?: 'GENERAL' | 'APPEARANCE' | 'TAX_HSM' | 'RBAC' | 'SECURITY';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode = false,
  onToggleDarkMode,
  initialTab = 'GENERAL',
}) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'APPEARANCE' | 'TAX_HSM' | 'RBAC' | 'SECURITY'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Form states
  const [companyName, setCompanyName] = useState('Công ty Cổ phần Công nghệ Tài chính LedgerFlow Việt Nam');
  const [taxCode, setTaxCode] = useState('0109887766');
  const [address, setAddress] = useState('Tầng 28, Tòa tháp Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội');
  const [bankAccount, setBankAccount] = useState('19036788889999');
  const [bankName, setBankName] = useState('Techcombank - Chi nhánh Thăng Long');

  // Tax HSM states
  const [taxProvider, setTaxProvider] = useState('VNPT-CA Cloud HSM Level 3');
  const [serialNumber, setSerialNumber] = useState('5404-98AF-2025-E81D');
  const [certValidUntil, setCertValidUntil] = useState('2028-12-31');
  const [autoSyncTCT, setAutoSyncTCT] = useState(true);

  // Appearance states
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactTable, setCompactTable] = useState(false);

  // Saved notification
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            <span className="material-symbols-outlined text-sm">settings</span>
            Cấu hình Hệ thống & Pháp nhân Doanh nghiệp
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Cài đặt Tài chính, Chữ ký số HSM & Giao diện
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản trị pháp nhân xuất hóa đơn, giao diện sáng/tối (Dark Mode), tích hợp Cổng Tổng cục Thuế và phân quyền
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Quick Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleDarkMode?.(!isDarkMode)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-2xs"
            title="Chuyển đổi Chế độ Sáng / Tối"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500 dark:text-blue-400">
              {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
            <span>{isDarkMode ? 'Giao diện Tối (Bật)' : 'Giao diện Sáng (Bật)'}</span>
          </button>

          {showSavedAlert && (
            <span className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-medium animate-in fade-in flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Đã cập nhật cấu hình
            </span>
          )}

          <button
            type="submit"
            form="settings-form"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('APPEARANCE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'APPEARANCE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">palette</span>
          Giao diện & Chế độ Sáng/Tối
        </button>
        <button
          onClick={() => setActiveTab('GENERAL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'GENERAL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">business</span>
          Thông tin Pháp nhân
        </button>
        <button
          onClick={() => setActiveTab('TAX_HSM')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'TAX_HSM'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">vpn_key</span>
          Cơ quan Thuế & Cloud HSM
        </button>
        <button
          onClick={() => setActiveTab('RBAC')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'RBAC'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">admin_panel_settings</span>
          Phân quyền Vai trò (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'SECURITY'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">security</span>
          Bảo mật & WORM
        </button>
      </div>

      {/* Form Content */}
      <form id="settings-form" onSubmit={handleSave}>
        {/* APPEARANCE TAB */}
        {activeTab === 'APPEARANCE' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">dark_mode</span>
                    Chủ đề Giao diện (Theme Preference)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tùy chỉnh chế độ hiển thị sáng/tối để phù hợp với môi trường làm việc kế toán và phòng họp
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Trạng thái hiện tại:</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isDarkMode 
                      ? 'bg-blue-950/60 text-blue-300 border-blue-800' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isDarkMode ? '🌙 Dark Mode Đang Bật' : '☀️ Light Mode Đang Bật'}
                  </span>
                </div>
              </div>

              {/* Theme Mode Selector Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <div
                  onClick={() => onToggleDarkMode?.(false)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    !isDarkMode
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-4 ring-blue-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">light_mode</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Giao diện Sáng (Light Mode)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Độ tương phản cao, tối ưu ban ngày</div>
                        </div>
                      </div>
                      {!isDarkMode && (
                        <span className="material-symbols-outlined text-blue-600 text-2xl">check_circle</span>
                      )}
                    </div>

                    {/* Miniature UI Mockup */}
                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 bg-slate-200 rounded"></div>
                        <div className="h-3 w-10 bg-emerald-100 rounded"></div>
                      </div>
                      <div className="h-2 w-32 bg-slate-100 rounded"></div>
                      <div className="flex gap-1.5 pt-1">
                        <div className="h-4 w-12 bg-blue-100 rounded"></div>
                        <div className="h-4 w-16 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Độ sáng màn hình:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">100% Tiêu chuẩn</span>
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div
                  onClick={() => onToggleDarkMode?.(true)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isDarkMode
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 ring-4 ring-blue-500/10 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-indigo-900 text-indigo-300 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">dark_mode</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Giao diện Tối (Dark Mode)</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Giảm mỏi mắt, tiết kiệm năng lượng OLED</div>
                        </div>
                      </div>
                      {isDarkMode && (
                        <span className="material-symbols-outlined text-blue-500 text-2xl">check_circle</span>
                      )}
                    </div>

                    {/* Miniature Dark UI Mockup */}
                    <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-20 bg-slate-800 rounded"></div>
                        <div className="h-3 w-10 bg-emerald-950/80 rounded"></div>
                      </div>
                      <div className="h-2 w-32 bg-slate-800 rounded"></div>
                      <div className="flex gap-1.5 pt-1">
                        <div className="h-4 w-12 bg-blue-950 rounded"></div>
                        <div className="h-4 w-16 bg-slate-800 rounded"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Tông nền:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">Slate / Navy Deep Black</span>
                  </div>
                </div>
              </div>

              {/* Direct Switch Row */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Bật / Tắt nhanh Chế độ Giao diện Tối (Dark Theme)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hệ thống tự động lưu lựa chọn này vào bộ nhớ trình duyệt (Local Storage)
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => onToggleDarkMode?.(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Additional Display Preferences */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                  Tùy chỉnh Trực quan Bổ sung
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Tương phản cao biểu đồ</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Làm nổi bật đường kẻ và vùng AreaChart</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Giảm hiệu ứng động</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tăng tốc độ hiển thị cho máy cấu hình văn phòng</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={reduceMotion}
                      onChange={(e) => setReduceMotion(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bảng dữ liệu cô đọng</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Thu gọn padding dòng bảng hóa đơn</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={compactTable}
                      onChange={(e) => setCompactTable(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded mt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GENERAL TAB */}
        {activeTab === 'GENERAL' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Thông tin Đơn vị Bán hàng (Người nộp thuế)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tên Pháp nhân Đăng ký</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Mã số thuế (MST)</label>
                <input
                  type="text"
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Ký hiệu mẫu số Hóa đơn</label>
                <input
                  type="text"
                  defaultValue="1C25TND-01 (Nghị định 123/2020/NĐ-CP)"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Địa chỉ trụ sở chính</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Tài khoản Ngân hàng Thụ hưởng</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Ngân hàng & Chi nhánh</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAX_HSM TAB */}
        {activeTab === 'TAX_HSM' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">lock_clock</span>
                  Cấu hình Chữ ký số HSM Đám mây (Cloud HSM)
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  HSM Sẵn sàng ký trực tuyến
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Nhà cung cấp Chứng thư số HSM</label>
                  <input
                    type="text"
                    value={taxProvider}
                    onChange={(e) => setTaxProvider(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Số Serial Chứng thư (FIPS 140-2)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Thời hạn hiệu lực chứng thư</label>
                  <input
                    type="date"
                    value={certValidUntil}
                    onChange={(e) => setCertValidUntil(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Cơ quan Thuế quản lý</label>
                  <input
                    type="text"
                    defaultValue="Cục Thuế Thành phố Hà Nội"
                    readOnly
                    className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Tự động truyền dữ liệu sang Cổng Tổng cục Thuế</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Mã thông điệp XML 206 theo chuẩn Thông tư 78/2021/TT-BTC</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSyncTCT}
                  onChange={(e) => setAutoSyncTCT(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* RBAC TAB */}
        {activeTab === 'RBAC' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Ma trận Phân quyền Vai trò Doanh nghiệp (RBAC)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kiểm soát quyền truy cập chặt chẽ giữa Kế toán viên, Kế toán trưởng và Ban Giám đốc
              </p>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {ROLE_DEFINITIONS.map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-850 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{r.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {r.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{r.description}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{r.userCount} nhân sự</div>
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">{r.permissionCount}/{r.totalPermissions} Quyền hạn</div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'SECURITY' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              Chính sách Khóa Bất biến Dữ liệu Tài chính (WORM)
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified_user</span>
                  Chế độ WORM (Write Once Read Many) đang KÍCH HOẠT
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90 mt-1">
                  Mọi hóa đơn sau khi đã ký số HSM sẽ chuyển sang trạng thái <strong>BẤT BIẾN</strong>. Không bất kỳ người dùng hay quản trị viên nào có thể xóa hay sửa đổi giá trị hóa đơn. Mọi điều chỉnh buộc phải phát hành Hóa đơn Điều chỉnh / Thay thế theo quy định của pháp luật Thuế.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Xác thực 2 yếu tố (2FA) bắt buộc</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Áp dụng cho mọi lệnh ký số hóa đơn &gt; 50.000.000 ₫</div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      ĐÃ BẬT
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Chu kỳ Lưu trữ Chứng từ điện tử</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tuân thủ Luật Kế toán 10 năm lưu trữ an toàn</div>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                      10 NĂM (2025 - 2035)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
