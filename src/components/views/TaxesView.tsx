import React, { useState } from 'react';
import { Invoice } from '../../types';
import { formatVND } from '../../utils/formatters';

interface TaxesViewProps {
  invoices: Invoice[];
}

export const TaxesView: React.FC<TaxesViewProps> = ({ invoices }) => {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'INVOICES_OUT' | 'HSM_STATUS'>('SUMMARY');
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1_2025' | 'Q4_2024'>('Q1_2025');

  // Compute Tax Brackets
  const validInvoices = invoices.filter((i) => i.status !== 'CANCELLED');

  const taxBuckets = {
    vat10: { net: 0, vat: 0, count: 0 },
    vat8: { net: 0, vat: 0, count: 0 },
    vat5: { net: 0, vat: 0, count: 0 },
    vat0: { net: 0, vat: 0, count: 0 },
    kct: { net: 0, vat: 0, count: 0 },
  };

  validInvoices.forEach((inv) => {
    inv.items.forEach((item) => {
      const base = item.quantity * item.unitPrice - (item.quantity * item.unitPrice * (item.discountPercent || 0)) / 100;
      if (item.vatRate === 10) {
        taxBuckets.vat10.net += base;
        taxBuckets.vat10.vat += (base * 10) / 100;
        taxBuckets.vat10.count++;
      } else if (item.vatRate === 8) {
        taxBuckets.vat8.net += base;
        taxBuckets.vat8.vat += (base * 8) / 100;
        taxBuckets.vat8.count++;
      } else if (item.vatRate === 5) {
        taxBuckets.vat5.net += base;
        taxBuckets.vat5.vat += (base * 5) / 100;
        taxBuckets.vat5.count++;
      } else if (item.vatRate === 0) {
        taxBuckets.vat0.net += base;
        taxBuckets.vat0.count++;
      } else {
        taxBuckets.kct.net += base;
        taxBuckets.kct.count++;
      }
    });
  });

  const totalNet =
    taxBuckets.vat10.net +
    taxBuckets.vat8.net +
    taxBuckets.vat5.net +
    taxBuckets.vat0.net +
    taxBuckets.kct.net;

  const totalVat =
    taxBuckets.vat10.vat + taxBuckets.vat8.vat + taxBuckets.vat5.vat;

  const handleExportHtkk = () => {
    alert('Đang trích xuất Bảng kê bán ra Mẫu 01-1/GTGT định dạng XML tương thích phần mềm HTKK (Tổng cục Thuế)...');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <span className="material-symbols-outlined text-sm">percent</span>
            Thuế suất & Kê khai Thuế GTGT (VAT Compliance & Reporting)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Quản trị Thuế suất & Bảng kê Bán ra Mẫu 01-1/GTGT
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tổng hợp doanh thu tính thuế theo từng mức 10%, 8%, 5%, 0% và xuất dữ liệu tương thích phần mềm HTKK
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Q1_2025">Kỳ tính thuế: Quý 1 / 2025</option>
            <option value="Q4_2024">Kỳ tính thuế: Quý 4 / 2024</option>
          </select>
          <button
            onClick={handleExportHtkk}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Xuất XML nộp Thuế (HTKK)
          </button>
        </div>
      </div>

      {/* Bento Tax Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Doanh thu Chưa thuế</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">attach_money</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatVND(totalNet)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chỉ tiêu [29] - Tờ khai 01/GTGT</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thuế GTGT Đầu ra Phát sinh</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">account_balance</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 font-mono">
              {formatVND(totalVat)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chỉ tiêu [34] - Thuế GTGT bán ra</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Doanh thu Thuế suất 8%</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">discount</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {formatVND(taxBuckets.vat8.net)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Giảm 2% thuế GTGT theo NĐ 72</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Trạng thái Cổng TCT</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">cloud_done</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">ĐÃ ĐỒNG BỘ</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Đường truyền TCT trực tiếp 24/7</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('SUMMARY')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'SUMMARY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">pie_chart</span>
          Phân tích Doanh thu theo Thuế suất
        </button>
        <button
          onClick={() => setActiveTab('INVOICES_OUT')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'INVOICES_OUT'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">table_view</span>
          Bảng kê Bán ra (Mẫu 01-1/GTGT)
        </button>
        <button
          onClick={() => setActiveTab('HSM_STATUS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'HSM_STATUS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">vpn_key</span>
          Chứng thư Cloud HSM & CQT
        </button>
      </div>

      {/* Content based on Active Tab */}
      {activeTab === 'SUMMARY' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Chi tiết Doanh thu và Thuế GTGT theo Mức thuế suất (Kỳ {selectedQuarter})
            </h3>
            <span className="text-xs text-slate-500">Mẫu Tờ khai 01/GTGT</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Nhóm Thuế suất</th>
                  <th className="py-3 px-4">Căn cứ Pháp lý</th>
                  <th className="py-3 px-4 text-center">Số dòng hàng</th>
                  <th className="py-3 px-4 text-right">Doanh thu chịu thuế</th>
                  <th className="py-3 px-4 text-right">Tiền thuế GTGT</th>
                  <th className="py-3 px-4 text-right">Tỷ trọng Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Hàng hóa, dịch vụ thuế suất 10%</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">Luật Thuế GTGT tiêu chuẩn</td>
                  <td className="py-3.5 px-4 text-center font-mono">{taxBuckets.vat10.count}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatVND(taxBuckets.vat10.net)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-700 dark:text-indigo-400">
                    {formatVND(taxBuckets.vat10.vat)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    {totalNet > 0 ? Math.round((taxBuckets.vat10.net / totalNet) * 100) : 0}%
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Hàng hóa, dịch vụ giảm thuế 8%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">Nghị quyết 110 & Nghị định 72/2024</td>
                  <td className="py-3.5 px-4 text-center font-mono">{taxBuckets.vat8.count}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatVND(taxBuckets.vat8.net)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatVND(taxBuckets.vat8.vat)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    {totalNet > 0 ? Math.round((taxBuckets.vat8.net / totalNet) * 100) : 0}%
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Hàng hóa, dịch vụ thuế suất 5%</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">Thiết bị y tế, khoa học kỹ thuật</td>
                  <td className="py-3.5 px-4 text-center font-mono">{taxBuckets.vat5.count}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatVND(taxBuckets.vat5.net)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-700 dark:text-blue-400">
                    {formatVND(taxBuckets.vat5.vat)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    {totalNet > 0 ? Math.round((taxBuckets.vat5.net / totalNet) * 100) : 0}%
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Không chịu thuế (KCT) & 0%</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">Phần mềm xuất khẩu & dịch vụ CNTT</td>
                  <td className="py-3.5 px-4 text-center font-mono">{taxBuckets.kct.count + taxBuckets.vat0.count}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatVND(taxBuckets.kct.net + taxBuckets.vat0.net)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">0 ₫</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    {totalNet > 0 ? Math.round(((taxBuckets.kct.net + taxBuckets.vat0.net) / totalNet) * 100) : 0}%
                  </td>
                </tr>

                <tr className="bg-slate-100/70 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100">
                  <td className="py-3 px-4" colSpan={3}>
                    TỔNG CỘNG DOANH THU & TIỀN THUẾ GTGT BÁN RA
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-blue-400 text-sm">
                    {formatVND(totalNet)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-700 dark:text-indigo-400 text-sm">
                    {formatVND(totalVat)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'INVOICES_OUT' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Bảng kê Hóa đơn Hàng hóa Dịch vụ Bán ra (Mẫu 01-1/GTGT)
            </h3>
            <span className="text-xs text-slate-500 font-mono">Đã lập {validInvoices.length} Hóa đơn</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Số HĐ</th>
                  <th className="py-3 px-4">Ký hiệu</th>
                  <th className="py-3 px-4">Ngày lập</th>
                  <th className="py-3 px-4">Tên Khách hàng</th>
                  <th className="py-3 px-4">Mã số thuế</th>
                  <th className="py-3 px-4 text-right">Doanh thu chưa thuế</th>
                  <th className="py-3 px-4 text-right">Thuế GTGT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {validInvoices.map((inv) => {
                  const sub = inv.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
                  const vat = inv.totalAmount - sub;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 dark:text-blue-400">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{inv.eInvoiceCode}</td>
                      <td className="py-3 px-4 text-slate-600">{inv.issueDate}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {inv.customerName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {inv.customerTaxCode}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{formatVND(sub)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-indigo-700 dark:text-indigo-400">
                        {formatVND(vat > 0 ? vat : 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'HSM_STATUS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Trạng thái Chứng thư số & Kết nối Cục Thuế
              </h3>
              <p className="text-xs text-slate-500">Quản trị chứng thư số ký số Cloud HSM không dùng USB Token</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Sẵn sàng Ký số
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Thông tin Chứng thư số HSM:</div>
              <div>Đơn vị cấp CA: <strong>VNPT-CA Cloud HSM Server Level 3</strong></div>
              <div>Số Serial: <code className="font-mono bg-white px-2 py-0.5 rounded border">5404-98AF-2025-E81D</code></div>
              <div>Thời hạn hiệu lực: <strong>01/01/2025 đến 31/12/2028</strong> (Còn 1.054 ngày)</div>
              <div>Thuật toán mã hóa: <strong>RSA 2048-bit / SHA-256 with RSA</strong></div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200">Kênh truyền Cục Thuế (TCT):</div>
              <div>Endpoint: <code className="font-mono bg-white px-2 py-0.5 rounded border">https://tct-api.gdt.gov.vn/v2/invoice</code></div>
              <div>Mã thông điệp kết nối: <strong>TCT-NODE-HN-04 (Trực tiếp)</strong></div>
              <div>Độ trễ trung bình: <strong>140ms</strong></div>
              <div>Chuẩn dữ liệu: <strong>XML QCVN / Nghị định 123/2020/NĐ-CP</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
