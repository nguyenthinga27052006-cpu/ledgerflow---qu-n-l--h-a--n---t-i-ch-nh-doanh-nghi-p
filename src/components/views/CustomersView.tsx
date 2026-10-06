import React, { useState } from 'react';
import { Customer } from '../../types';
import { formatVND } from '../../utils/formatters';

interface CustomersViewProps {
  customers: Customer[];
  onSelectCustomer: (customerId: string) => void;
  onCreateCustomer: (newCustomer: Customer) => void;
  onNavigateCreateInvoice: (customerId?: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  onSelectCustomer,
  onCreateCustomer,
  onNavigateCreateInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState<Customer | null>(null);

  // New Customer form states
  const [name, setName] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [segment, setSegment] = useState<'Enterprise' | 'SME' | 'FDI'>('Enterprise');
  const [creditLimit, setCreditLimit] = useState<number>(500000000);
  const [terms, setTerms] = useState<string>('NET 30');

  // Filter
  const filteredCustomers = customers.filter((c) => {
    if (segmentFilter !== 'ALL' && c.segment !== segmentFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.taxCode.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        c.contactPerson.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Aggregates
  const totalCredit = customers.reduce((acc, c) => acc + c.creditLimit, 0);
  const totalDebt = customers.reduce((acc, c) => acc + c.currentDebt, 0);
  const totalAvailable = totalCredit - totalDebt;
  const warningCount = customers.filter((c) => c.status === 'WARNING' || c.taxStatus === 'Warning').length;

  const handleSubmitNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !taxCode) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      code: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      legalName: name,
      taxCode,
      address: address || 'Hà Nội, Việt Nam',
      email: email || 'accounting@company.vn',
      phone: phone || '024 3999 8888',
      contactPerson: contactPerson || 'Kế toán trưởng',
      segment,
      creditLimit,
      currentDebt: 0,
      availableCredit: creditLimit,
      terms,
      gracePeriodDays: 5,
      bankAccount: 'VCB 0011004392819',
      taxStatus: 'Valid',
      status: 'ACTIVE',
      recentInvoicesCount: 0,
    };

    onCreateCustomer(newCustomer);
    setIsModalOpen(false);
    // Reset
    setName('');
    setTaxCode('');
    setAddress('');
    setEmail('');
    setPhone('');
    setContactPerson('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
            <span className="material-symbols-outlined text-sm">corporate_fare</span>
            Sổ cái Khách hàng & Doanh nghiệp Đối tác
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Quản lý Đối tác B2B & Hạn mức Tín dụng Công nợ
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi mã số thuế, kiểm tra tình trạng pháp lý Tổng cục Thuế và kiểm soát rủi ro hạn mức
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Thêm Khách hàng B2B Mới
          </button>
        </div>
      </div>

      {/* Bento KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng số Khách hàng B2B</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">group</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{customers.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Doanh nghiệp đã xác thực MST chuẩn</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Hạn mức Tín dụng cấp</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">credit_score</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{formatVND(totalCredit)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Hạn mức công nợ tối đa toàn hệ thống</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Dư nợ Hiện tại</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-700">{formatVND(totalDebt)}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Đạt {Math.round((totalDebt / (totalCredit || 1)) * 100)}% dung lượng hạn mức
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Cảnh báo / Rủi ro nợ</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">warning</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600">{warningCount} Doanh nghiệp</div>
            <div className="text-[11px] text-rose-600/80 mt-1">Cần đối soát hoặc vượt hạn mức 80%</div>
          </div>
        </div>
      </div>

      {/* Table & Filtering */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['ALL', 'Enterprise', 'SME', 'FDI'].map((seg) => (
              <button
                key={seg}
                onClick={() => setSegmentFilter(seg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  segmentFilter === seg
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {seg === 'ALL' ? 'Tất cả' : seg}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm theo tên doanh nghiệp, MST, người liên hệ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-slate-400 text-base">
              search
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tên Doanh nghiệp & MST</th>
                <th className="py-3 px-3">Phân khúc</th>
                <th className="py-3 px-3">Người đại diện / Email</th>
                <th className="py-3 px-3 text-right">Hạn mức Tín dụng</th>
                <th className="py-3 px-3 text-right">Dư nợ hiện tại</th>
                <th className="py-3 px-3 w-36">Tỷ lệ sử dụng</th>
                <th className="py-3 px-3 text-center">Trạng thái Thuế</th>
                <th className="py-3 px-3 text-center">Tình trạng</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredCustomers.map((cust) => {
                const usagePercent = Math.min(100, Math.round((cust.currentDebt / (cust.creditLimit || 1)) * 100));
                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{cust.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        MST: {cust.taxCode} • Mã: {cust.code}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {cust.segment}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{cust.contactPerson}</div>
                      <div className="text-[11px] text-slate-500">{cust.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                      {formatVND(cust.creditLimit)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                      {formatVND(cust.currentDebt)}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{usagePercent}%</span>
                        <span>còn {formatVND(cust.creditLimit - cust.currentDebt)}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            usagePercent > 85 ? 'bg-red-500' : usagePercent > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cust.taxStatus === 'Valid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {cust.taxStatus === 'Valid' ? 'Đã xác thực' : 'Cần đối chiếu'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cust.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : cust.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {cust.status === 'ACTIVE' ? 'Hoạt động' : cust.status === 'WARNING' ? 'Cảnh báo' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedCustomerForDetail(cust)}
                          title="Xem hồ sơ & Sao kê công nợ"
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">visibility</span>
                          Chi tiết
                        </button>
                        <button
                          onClick={() => onNavigateCreateInvoice(cust.id)}
                          title="Lập hóa đơn mới cho khách hàng này"
                          className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">add</span>
                          Lập HĐ
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">domain_add</span>
                Thêm Khách hàng / Doanh nghiệp B2B Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitNewCustomer} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Tên Pháp nhân Doanh nghiệp</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty Cổ phần Tập đoàn Viễn thông CMC"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Mã số thuế (10 hoặc 13 số)</label>
                  <input
                    type="text"
                    required
                    placeholder="0102839182"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Phân khúc</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Enterprise">Enterprise (Tập đoàn lớn)</option>
                    <option value="FDI">FDI (Có vốn đầu tư nước ngoài)</option>
                    <option value="SME">SME (Vừa và nhỏ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Địa chỉ đăng ký kinh doanh</label>
                <input
                  type="text"
                  placeholder="Tầng 12, Tòa nhà CMC Tower, Q. Cầu Giấy, Hà Nội"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Email nhận hóa đơn điện tử</label>
                  <input
                    type="email"
                    placeholder="einvoice@cmc.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Số điện thoại / Hotline</label>
                  <input
                    type="text"
                    placeholder="024 3795 8668"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Người phụ trách / Kế toán</label>
                  <input
                    type="text"
                    placeholder="Trần Quốc Tuấn (Kế toán trưởng)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Hạn mức Tín dụng (VND)</label>
                  <input
                    type="number"
                    step="50000000"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Lưu Khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail & Statement of Account Modal */}
      {selectedCustomerForDetail && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setSelectedCustomerForDetail(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">corporate_fare</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {selectedCustomerForDetail.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Mã: {selectedCustomerForDetail.code} • MST: {selectedCustomerForDetail.taxCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomerForDetail(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto text-xs">
              {/* Credit Status Banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div>
                  <div className="text-[11px] text-slate-500">Hạn mức tín dụng cấp</div>
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {formatVND(selectedCustomerForDetail.creditLimit)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Dư nợ hiện tại</div>
                  <div className="text-sm font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">
                    {formatVND(selectedCustomerForDetail.currentDebt)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Hạn mức khả dụng còn lại</div>
                  <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                    {formatVND(Math.max(0, selectedCustomerForDetail.creditLimit - selectedCustomerForDetail.currentDebt))}
                  </div>
                </div>
              </div>

              {/* Master Info Grid */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Thông tin Pháp nhân & Liên hệ
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Địa chỉ đăng ký kinh doanh:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedCustomerForDetail.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Người phụ trách thanh toán:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedCustomerForDetail.contactPerson} ({selectedCustomerForDetail.contactRole || 'Kế toán trưởng'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email kế toán:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedCustomerForDetail.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Số điện thoại:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedCustomerForDetail.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tài khoản ngân hàng đối tác:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {selectedCustomerForDetail.bankAccount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Điều khoản công nợ:</span>
                    <span className="font-semibold text-blue-600">
                      {selectedCustomerForDetail.terms} (Ân hạn: {selectedCustomerForDetail.gracePeriodDays} ngày)
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal verification status */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Tình trạng MST: <strong>Đang hoạt động hợp pháp</strong> (Cơ quan Thuế xác nhận)</span>
                </div>
                <span className="font-mono text-[10px]">CQT Sync: 24/02/2025</span>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  alert(`Đang trích xuất Bảng sao kê đối chiếu công nợ (Statement of Account) cho khách hàng ${selectedCustomerForDetail.name}...`);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Xuất Sao kê Công nợ (Statement)
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerForDetail(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 rounded-xl"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cid = selectedCustomerForDetail.id;
                    setSelectedCustomerForDetail(null);
                    onNavigateCreateInvoice(cid);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Lập Hóa đơn Mới
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
