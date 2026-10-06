import React, { useState } from 'react';
import { Invoice } from '../../types';
import { formatVND, toVietnameseWords } from '../../utils/formatters';
import { VatInvoicePrintModal } from '../modals/VatInvoicePrintModal';

interface InvoiceDetailViewProps {
  invoice: Invoice;
  onNavigate: (view: string) => void;
  onOpenRecordPayment: (invoice: Invoice) => void;
}

export const InvoiceDetailView: React.FC<InvoiceDetailViewProps> = ({
  invoice,
  onNavigate,
  onOpenRecordPayment
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [quickPayAmount, setQuickPayAmount] = useState('60,000,000');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = 1100000; // 1% loyalty contract discount
  const taxableBase = subtotal - discountAmount;
  const vatAmount = invoice.totalAmount - taxableBase;

  return (
    <div className="flex flex-col w-full gap-5">
      {/* Immutability & Status Alert Banner */}
      <div className="relative overflow-hidden rounded-lg bg-surface-container-high p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start md:items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-on-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-bold uppercase tracking-wider">
                  Trạng thái bất biến (Immutable State)
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                <span className="text-xs text-secondary font-mono">Ledger Seal #LS-8849-VN</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Hóa đơn này đã được phát hành chính thức vào ngày <strong className="text-on-surface">12/02/2025</strong> và bị khóa chỉnh sửa trực tiếp theo quy định tài chính. Mọi điều chỉnh phải qua quy trình <span className="text-primary font-medium underline underline-offset-2 cursor-pointer">Điều chỉnh (Adjustment)</span> hoặc <span className="text-primary font-medium underline underline-offset-2 cursor-pointer">Hoàn tiền (Refund)</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              SHA256: 8f3c...4a91
            </span>
          </div>
        </div>
      </div>

      {/* Main Invoice Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-secondary">
            <button
              onClick={() => onNavigate('invoices')}
              className="hover:text-primary transition-colors flex items-center gap-0.5"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_back</span>
              <span>Hóa đơn</span>
            </button>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-mono font-semibold">{invoice.invoiceNumber}</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container text-secondary text-[11px] font-mono">
              e-VAT v2.4
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Hóa đơn {invoice.invoiceNumber}
            </h1>

            {/* Semantic Status Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-xs font-bold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>PARTIALLY PAID</span>
              <span className="opacity-60 text-[11px] font-normal">| Thanh toán một phần</span>
            </div>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[15px] text-outline">fingerprint</span>
              <span>Khóa sửa đổi</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-secondary text-xs mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">person_outline</span>
              Tạo bởi: <strong className="text-on-surface font-medium">Trần Thu Thảo</strong> (Billing Staff)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              10:15 10/02/2025
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-tertiary-container font-medium">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Ký số Cơ quan Thuế đã xác thực
            </span>
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center flex-wrap gap-2 self-start lg:self-center">
          <button
            onClick={() => onOpenRecordPayment(invoice)}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-primary-container text-on-primary rounded-lg text-xs font-semibold hover:bg-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_card</span>
            <span>Ghi nhận thanh toán</span>
          </button>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-surface-container-lowest text-on-surface rounded-lg text-xs font-medium hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">outgoing_mail</span>
            <span>Gửi Email Hóa đơn</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-surface-container-lowest text-on-surface rounded-lg text-xs font-medium hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant/40"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">print</span>
            <span>Xem & In Hóa đơn GTGT</span>
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="inline-flex items-center justify-center w-9 h-9 bg-surface-container-lowest text-on-surface rounded-lg hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant/40"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary">more_vert</span>
            </button>

            {showMoreActions && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider border-b border-surface-container">
                  Thao tác tài chính
                </div>
                <button
                  onClick={() => {
                    setShowMoreActions(false);
                    onNavigate('refunds');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">edit_note</span>
                  <span>Yêu cầu điều chỉnh (Credit Note)</span>
                </button>
                <button
                  onClick={() => {
                    alert(`Đã gửi thông báo nhắc nợ đợt 2 cho ${invoice.customerName}!`);
                    setShowMoreActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">notification_important</span>
                  <span>Gửi nhắc nợ (Reminder)</span>
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`<Invoice ID="${invoice.invoiceNumber}" TaxCode="${invoice.customerTaxCode}"/>`);
                    alert('Đã sao chép định danh XML hóa đơn vào bộ nhớ đệm!');
                    setShowMoreActions(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-on-surface hover:bg-surface-container-low text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">content_copy</span>
                  <span>Sao chép định danh XML</span>
                </button>
                <div className="h-px bg-surface-container my-1"></div>
                <div className="px-3 py-2 text-outline text-[11px] flex items-center justify-between cursor-not-allowed opacity-60">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>Hủy hóa đơn</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total KPI */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-secondary font-semibold tracking-wider">Tổng giá trị hóa đơn</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-[18px]">receipt</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-on-surface tabular-nums tracking-tight">
              120.000.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="text-xs text-secondary mt-1">
              Gồm 10% VAT đã khấu trừ ưu đãi
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-[11px] font-mono text-secondary">
            <span>Tiền ròng: 108.900.000 ₫</span>
            <span>Thuế: 11.100.000 ₫</span>
          </div>
        </div>

        {/* Paid KPI */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-secondary font-semibold tracking-wider">Đã thanh toán (Paid)</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold">
              50.0%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-tertiary-container tabular-nums tracking-tight">
              60.000.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs text-secondary">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span>
              1 lần thanh toán thành công
            </span>
            <span className="font-mono text-[11px]">12/02/2025</span>
          </div>
        </div>

        {/* Balance Due KPI */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-secondary font-semibold tracking-wider">Còn phải thu (Balance)</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-xs font-semibold">
              <span className="material-symbols-outlined text-[13px]">timer</span>
              Còn 8 ngày
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-primary tabular-nums tracking-tight">
              60.000.000 <span className="text-sm font-normal text-secondary">₫</span>
            </div>
            <div className="text-xs text-secondary mt-1">
              Hạn cuối: <strong className="text-on-surface font-semibold">27/02/2025</strong>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Trạng thái hạn nợ</span>
            <span className="font-semibold text-tertiary-container">Trong hạn an toàn</span>
          </div>
        </div>

        {/* Payment Terms KPI */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase text-secondary font-semibold tracking-wider">Điều khoản & Hình thức</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-surface-container text-secondary">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-on-surface tracking-tight flex items-center gap-1.5">
              <span>Net 15</span>
              <span className="text-xs font-normal text-secondary">| Kế toán doanh nghiệp</span>
            </div>
            <div className="text-xs text-secondary mt-1 flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[15px] text-primary">account_balance_wallet</span>
              <span>Chuyển khoản VCB (Vietcombank)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs text-secondary font-mono">
            <span>TK: 0011004588999</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('0011004588999');
                alert('Đã sao chép số tài khoản Vietcombank!');
              }}
              className="text-primary font-medium hover:underline font-sans"
            >
              Sao chép
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: 70% Left / 30% Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Customer & Issuer Billing Profiles Card */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">corporate_fare</span>
                <h2 className="text-base font-bold text-on-surface">Thông tin các bên liên quan</h2>
              </div>
              <span className="text-xs text-secondary uppercase font-semibold tracking-wider">Đối soát pháp lý e-Invoice</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seller / Issuer */}
              <div className="rounded-lg bg-surface-container-low p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase text-secondary tracking-wider">Đơn vị phát hành (Seller)</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary text-[11px] font-bold">Tự doanh</span>
                  </div>
                  <div className="text-sm font-bold text-on-surface mb-1">
                    LedgerFlow Financial Cloud Corp
                  </div>
                  <div className="space-y-1.5 text-xs text-on-surface-variant mt-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">pin</span>
                      <span>Mã số thuế: <strong className="font-mono text-on-surface font-semibold">0109988776</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">location_on</span>
                      <span>Tầng 18 Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, Hà Nội</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">support_agent</span>
                      <span>billing-support@ledgerflow.io | +84 (024) 3998 1234</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container text-xs text-secondary flex items-center justify-between">
                  <span>Đại diện: TS. Trần Quang Vinh</span>
                  <span className="text-tertiary-container font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Chứng thư số hợp lệ
                  </span>
                </div>
              </div>

              {/* Buyer / Customer */}
              <div className="rounded-lg bg-surface-container-low p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase text-secondary tracking-wider">Bên mua hàng (Buyer / Customer)</span>
                    <span className="font-mono text-primary font-bold text-xs">{invoice.customerCode}</span>
                  </div>
                  <div className="text-sm font-bold text-on-surface mb-1">
                    {invoice.customerName}
                  </div>
                  <div className="space-y-1.5 text-xs text-on-surface-variant mt-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">pin</span>
                      <span>Mã số thuế: <strong className="font-mono text-on-surface font-semibold">{invoice.customerTaxCode}</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">location_on</span>
                      <span>{invoice.customerAddress}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline shrink-0 mt-0.5">contact_mail</span>
                      <span>{invoice.customerContact} • <a className="text-primary hover:underline" href={`mailto:${invoice.customerEmail}`}>{invoice.customerEmail}</a></span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-surface-container text-xs text-secondary flex items-center justify-between">
                  <span>Hạn mức tín dụng: 300.000.000 ₫</span>
                  <span className="text-secondary font-medium">Tier: Enterprise Platinum</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">list_alt</span>
                <h2 className="text-base font-bold text-on-surface">Chi tiết danh mục dịch vụ phát hành</h2>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-secondary">
                <span>Tiền tệ: <strong className="text-on-surface">VND (₫)</strong></span>
                <span>•</span>
                <span>{invoice.items.length} mục</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-secondary font-semibold uppercase tracking-wider h-8">
                    <th className="py-2 px-3 w-12 text-center rounded-l">STT</th>
                    <th className="py-2 px-3">Sản phẩm / Dịch vụ</th>
                    <th className="py-2 px-3 text-center">Đơn vị</th>
                    <th className="py-2 px-3 text-right">Số lượng</th>
                    <th className="py-2 px-3 text-right">Đơn giá</th>
                    <th className="py-2 px-3 text-right">Thuế GTGT</th>
                    <th className="py-2 px-3 text-right rounded-r">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 text-center font-mono text-secondary font-semibold">
                        0{idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-on-surface text-sm">{item.name}</div>
                        {item.description && (
                          <div className="text-secondary text-xs mt-0.5 leading-relaxed">{item.description}</div>
                        )}
                        {item.sku && (
                          <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-secondary">
                            <span className="px-1.5 py-0.2 rounded bg-surface-container">SKU: {item.sku}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-on-surface-variant">{item.unit}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-on-surface text-sm">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-on-surface">
                        {formatVND(item.unitPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-secondary">
                        <div>{item.vatRate}%</div>
                        <div className="text-[10px] text-outline font-normal">
                          {formatVND(item.quantity * item.unitPrice * (item.vatRate / 100))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-on-surface text-sm">
                        {formatVND(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Words */}
            <div className="mt-5 pt-4 border-t border-surface-container flex flex-col md:flex-row justify-between gap-5">
              <div className="flex-1 flex flex-col justify-between">
                <div className="rounded-lg bg-surface-container-low p-4">
                  <span className="text-[11px] uppercase text-secondary font-bold tracking-wider">Số tiền bằng chữ</span>
                  <p className="text-sm font-semibold text-primary mt-1 italic">
                    {toVietnameseWords(invoice.totalAmount)}
                  </p>
                  <div className="text-xs text-secondary mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Đã bao gồm thuế giá trị gia tăng & chiết khấu hợp đồng số #CTR-APX-2024-99.</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-secondary text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary-container">verified_user</span>
                    <span>Chữ ký số: CÔNG TY TNHH LEDGERFLOW FINANCIAL</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>MST: 0109988776</span>
                  </div>
                </div>
              </div>

              {/* Amount math box */}
              <div className="w-full md:w-80 flex flex-col gap-2 bg-surface-container-low/60 p-4 rounded-lg text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Cộng tiền hàng (Subtotal):</span>
                  <span className="font-mono font-semibold text-on-surface">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Chiết khấu (1% Thân thiết):</span>
                  <span className="font-mono font-semibold text-error">-{formatVND(discountAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Tiền chịu thuế (Taxable):</span>
                  <span className="font-mono font-medium text-on-surface">{formatVND(taxableBase)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Thuế GTGT (VAT 10% sau CK):</span>
                  <span className="font-mono font-semibold text-on-surface">+{formatVND(vatAmount)}</span>
                </div>
                <div className="h-px bg-surface-container my-1"></div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-on-surface text-sm">Tổng thanh toán:</span>
                  <span className="text-lg font-bold text-primary font-mono">{formatVND(invoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-tertiary-container pt-1">
                  <span>Đã thanh toán (Paid):</span>
                  <span className="font-mono font-semibold">-{formatVND(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-surface-container">
                  <span className="font-bold text-on-surface">Còn nợ phải trả:</span>
                  <span className="text-base font-bold text-primary font-mono">{formatVND(invoice.remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Sub-table */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                <h3 className="text-base font-bold text-on-surface">Lịch sử thanh toán đã ghi nhận (Payment Allocations)</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-semibold">
                {invoice.paymentHistory?.length || 1} GD Hợp lệ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-secondary font-semibold uppercase tracking-wider h-8">
                    <th className="py-2 px-3 rounded-l">Ngày GD</th>
                    <th className="py-2 px-3">Mã GD</th>
                    <th className="py-2 px-3">Phương thức</th>
                    <th className="py-2 px-3">Mã tham chiếu (Ref)</th>
                    <th className="py-2 px-3 text-right">Số tiền</th>
                    <th className="py-2 px-3 text-center">Trạng thái</th>
                    <th className="py-2 px-3 rounded-r">Người ghi nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {invoice.paymentHistory && invoice.paymentHistory.length > 0 ? (
                    invoice.paymentHistory.map(pay => (
                      <tr key={pay.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-3 font-mono text-on-surface font-medium">{pay.date}</td>
                        <td className="py-3 px-3 font-mono font-bold text-primary">{pay.code}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-secondary">account_balance</span>
                            <span>{pay.method}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-secondary">{pay.reference}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-tertiary-container">
                          {formatVND(pay.amount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                            {pay.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center text-[10px] font-bold">
                              LH
                            </div>
                            <span className="text-on-surface">{pay.recordedBy}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-secondary">
                        Chưa có lịch sử thanh toán nào cho hóa đơn này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between text-xs text-secondary gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                <span>Mọi khoản ghi nhận được bảo mật bởi Ledger Reconciliation Engine v4.</span>
              </div>
              {invoice.remainingAmount > 0 && (
                <button
                  onClick={() => onOpenRecordPayment(invoice)}
                  className="font-semibold text-primary hover:underline"
                >
                  + Thêm phiếu thu cho khoản còn lại ({formatVND(invoice.remainingAmount)})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Quick Payment Widget */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm border border-primary/20">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                <h3 className="text-base font-bold text-on-surface">Thu tiền nhanh</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-xs font-mono">
                Dư nợ: 50%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-primary-fixed/30 text-on-surface flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">verified</span>
                <div>
                  <span className="font-semibold text-on-surface">Tối đa được ghi nhận:</span>
                  <div className="text-xl font-bold text-primary mt-0.5 tabular-nums">
                    {formatVND(invoice.remainingAmount)}
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Hệ thống từ chối ghi nhận vượt quá hạn mức nợ còn lại.
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase font-bold text-secondary">
                  Số tiền thanh toán đợt này
                </label>
                <div className="relative">
                  <input
                    value={quickPayAmount}
                    onChange={e => setQuickPayAmount(e.target.value)}
                    className="w-full h-10 px-3 pr-10 text-on-surface font-mono font-semibold bg-surface-container-low rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest outline-none transition-all text-sm"
                    type="text"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-semibold text-secondary">
                    VND
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase font-bold text-secondary">
                  Tài khoản đích
                </label>
                <select className="w-full h-10 px-3 text-on-surface bg-surface-container-low rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all text-xs">
                  <option>Vietcombank - 0011004588999 (VND)</option>
                  <option>Techcombank - 1903388277201 (VND)</option>
                  <option>Tiền mặt tại quỹ kế toán</option>
                </select>
              </div>

              <button
                onClick={() => onOpenRecordPayment(invoice)}
                className="w-full h-10 bg-primary-container text-on-primary rounded-lg text-xs font-semibold hover:bg-primary transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">price_check</span>
                <span>Mở Form Ghi nhận đủ {formatVND(invoice.remainingAmount)}</span>
              </button>
            </div>
          </div>

          {/* Communication & Email History */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">mark_email_read</span>
                <h3 className="text-base font-bold text-on-surface">Nhật ký trao đổi & Email</h3>
              </div>
              <span className="text-xs text-secondary font-semibold">1 Lần gửi</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface">Hóa đơn điện tử phát hành chính thức</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[12px]">done_all</span>
                    Delivered
                  </span>
                </div>
                <div className="text-secondary">
                  Gửi tới: <strong className="text-on-surface font-medium">{invoice.customerEmail}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-secondary font-mono pt-1 border-t border-surface-container">
                  <span>Thời gian: 12/02/2025 09:05:14</span>
                  <button
                    onClick={() => alert(`Chi tiết email gửi tới ${invoice.customerEmail}:\n- Tệp đính kèm: INV-2025-00103.pdf\n- Mã tra cứu CQT: 1C25TND-02`)}
                    className="text-primary hover:underline font-sans"
                  >
                    Xem nội dung
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-dashed border-outline-variant/60 text-center">
                <p className="text-secondary">Chưa có thông báo nhắc nợ tự động nào được kích hoạt.</p>
                <button
                  onClick={() => alert(`Đã gửi bản sao hóa đơn qua email tới ${invoice.customerEmail}`)}
                  className="mt-2 text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span> Gửi bản sao qua email
                </button>
              </div>
            </div>
          </div>

          {/* Audit & Activity Timeline */}
          <div className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                <h3 className="text-base font-bold text-on-surface">Audit Trail (Nhật ký kiểm toán)</h3>
              </div>
              <button
                onClick={() => alert('Đang kết xuất tệp nhật ký kiểm toán bất biến JSON-LD...')}
                className="material-symbols-outlined text-secondary text-[18px] hover:text-on-surface"
                title="Tải toàn bộ nhật ký"
              >
                file_download
              </button>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container text-xs">
              {/* Event 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-tertiary-container ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Ghi nhận thanh toán 60.000.000 ₫</span>
                  <span className="font-mono text-secondary text-[10px] mt-0.5">12/02/2025 15:30:22</span>
                  <p className="text-on-surface-variant mt-1">
                    Kế toán viên <strong className="text-on-surface">Lê Hoàng</strong> đã ghi nhận thành công đợt thanh toán #PAY-2025-0045 qua Vietcombank.
                  </p>
                  <div className="mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-surface-container font-mono text-[10px] text-secondary">Hash: c28e...90b2</span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-primary-container ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Phát hành & Khóa bất biến</span>
                  <span className="font-mono text-secondary text-[10px] mt-0.5">12/02/2025 09:00:00</span>
                  <p className="text-on-surface-variant mt-1">
                    Chuyển trạng thái <span className="font-mono text-secondary">DRAFT → ISSUED</span>. Phê duyệt điện tử bởi Billing Manager <strong className="text-on-surface">Trần Thu Thảo</strong>.
                  </p>
                  <div className="mt-1">
                    <span className="px-1.5 py-0.2 rounded bg-surface-container text-tertiary-container font-mono text-[10px] font-semibold">Seal Verified</span>
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-secondary ring-4 ring-surface-container-lowest"></div>
                <div className="flex flex-col">
                  <span className="font-semibold text-on-surface">Tạo dự thảo hóa đơn (Draft Created)</span>
                  <span className="font-mono text-secondary text-[10px] mt-0.5">10/02/2025 16:45:10</span>
                  <p className="text-on-surface-variant mt-1">
                    Khởi tạo dữ liệu từ Hợp đồng hạ tầng doanh nghiệp #CTR-APX-2024-99 bởi <strong className="text-on-surface">Trần Thu Thảo</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-surface-container flex items-center justify-between text-xs text-secondary">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                Bất biến trên Blockchain Ledger
              </span>
              <button
                onClick={() => onNavigate('audit-log')}
                className="font-mono text-primary cursor-pointer hover:underline"
              >
                Chi tiết →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official VAT E-Invoice Printable Modal (TT 78 & NĐ 123) */}
      <VatInvoicePrintModal
        invoice={invoice}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Email Invoice Modal */}
      {isEmailModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsEmailModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">outgoing_mail</span>
                Gửi Hóa đơn Điện tử & Biên lai tới Khách hàng
              </h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Người nhận (To):</label>
                <input
                  type="text"
                  readOnly
                  value={`${invoice.customerName} <${invoice.customerEmail}>`}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Tiêu đề (Subject):</label>
                <input
                  type="text"
                  readOnly
                  value={`[LedgerFlow] Thông báo phát hành Hóa đơn điện tử #${invoice.invoiceNumber} (Mã tra cứu: ${invoice.eInvoiceCode})`}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Nội dung thư:</label>
                <div className="p-3 bg-slate-50 rounded-xl border text-[11px] text-slate-700 space-y-1.5 leading-relaxed">
                  <p>Kính gửi Quý khách hàng <strong>{invoice.customerName}</strong>,</p>
                  <p>
                    Công ty Cổ phần Công nghệ Tài chính LedgerFlow Việt Nam xin trân trọng gửi tới Quý khách Hóa đơn điện tử số <strong>{invoice.invoiceNumber}</strong> kỳ phát hành ngày {invoice.issueDate}.
                  </p>
                  <p>
                    Tổng số tiền thanh toán: <strong className="text-red-700">{formatVND(invoice.totalAmount)}</strong>. Hạn thanh toán: <strong>{invoice.dueDate}</strong> ({invoice.terms}).
                  </p>
                  <p>Quý khách vui lòng tra cứu và tải hóa đơn gốc theo đường dẫn đính kèm.</p>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-blue-600">attach_file</span>
                <span>Đính kèm: <strong>{invoice.invoiceNumber}.pdf</strong> và <strong>{invoice.invoiceNumber}_TT78.xml</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEmailModalOpen(false);
                  alert(`Đã gửi email hóa đơn thành công tới ${invoice.customerEmail}!`);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Gửi Email Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

