import React from 'react';
import { Invoice } from '../../types';
import { formatVND, toVietnameseWords } from '../../utils/formatters';

interface VatInvoicePrintModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export const VatInvoicePrintModal: React.FC<VatInvoicePrintModalProps> = ({
  invoice,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalDiscount = invoice.items.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice * (item.discountPercent || 0)) / 100,
    0
  );
  const taxableAmount = subtotal - totalDiscount;
  const vatAmount = invoice.totalAmount - taxableAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadXml = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<HDon xmlns="http://laphoadon.gdt.gov.vn/2020/01">
  <DLHDon Id="HD_${invoice.invoiceNumber}">
    <TTChung>
      <PBan>2.0.0</PBan>
      <THDon>Hóa đơn giá trị gia tăng</THDon>
      <KHMSHDon>1</KHMSHDon>
      <KHHDon>${invoice.eInvoiceCode}</KHHDon>
      <SHDon>${invoice.invoiceNumber.replace('INV-2025-', '')}</SHDon>
      <NLap>${invoice.issueDate}</NLap>
      <DVTTe>VND</DVTTe>
      <TGia>1.0</TGia>
      <HTTToan>TM/CK</HTTToan>
    </TTChung>
    <NDHDon>
      <NBan>
        <Ten>CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH LEDGERFLOW VIỆT NAM</Ten>
        <MST>0109887766</MST>
        <DChi>Tầng 28, Keangnam Landmark 72, Đường Phạm Hùng, Q. Nam Từ Liêm, TP. Hà Nội</DChi>
        <SDThoai>024.3999.8888</SDThoai>
        <DCTDTu>billing@ledgerflow.vn</DCTDTu>
        <STKNHang>19036788889999</STKNHang>
        <TNHang>Techcombank - CN Hội Sở</TNHang>
      </NBan>
      <NMua>
        <Ten>${invoice.customerName}</Ten>
        <MST>${invoice.customerTaxCode}</MST>
        <DChi>${invoice.customerAddress}</DChi>
        <SDThoai>${invoice.customerPhone || ''}</SDThoai>
        <DCTDTu>${invoice.customerEmail}</DCTDTu>
      </NMua>
      <DSHHDVu>
${invoice.items
  .map(
    (it, idx) => `        <HHDVu>
          <STT>${idx + 1}</STT>
          <THHDVu>${it.name}</THHDVu>
          <DVTinh>${it.unit}</DVTinh>
          <SLuong>${it.quantity}</SLuong>
          <DGia>${it.unitPrice}</DGia>
          <TLCKhau>${it.discountPercent}</TLCKhau>
          <TThue>${it.vatRate}%</TThue>
          <ThTien>${it.quantity * it.unitPrice - (it.quantity * it.unitPrice * it.discountPercent) / 100}</ThTien>
        </HHDVu>`
  )
  .join('\n')}
      </DSHHDVu>
      <TToan>
        <TgTCThue>${taxableAmount}</TgTCThue>
        <TgTThue>${vatAmount}</TgTThue>
        <TgTTTBSo>${invoice.totalAmount}</TgTTTBSo>
        <TgTTTBChu>${toVietnameseWords(invoice.totalAmount)}</TgTTTBChu>
      </TToan>
    </NDHDon>
  </DLHDon>
  <DSCKS>
    <NBan>
      <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignatureValue>MEQCIA18f8d9b1c2e4...LedgerFlowHSMCloudSigLevel3...</SignatureValue>
      </Signature>
    </NBan>
  </DSCKS>
</HDon>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNumber}_HDDT_TT78.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto print:border-none print:shadow-none print:max-w-full">
        {/* Top Control Bar - Hidden in Print */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-400">print</span>
            <div>
              <h3 className="font-semibold text-sm">Bản in Hóa đơn Điện tử Chuyển đổi</h3>
              <p className="text-[11px] text-slate-400">Tuân thủ Nghị định 123/2020/NĐ-CP & Thông tư 78/2021/TT-BTC</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadXml}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Tải file dữ liệu XML theo chuẩn Tổng cục Thuế"
            >
              <span className="material-symbols-outlined text-sm text-amber-400">code</span>
              Tải XML CQT
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              In / Xuất PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* E-Invoice Printable Body */}
        <div className="p-8 sm:p-12 text-slate-900 bg-white font-sans text-xs leading-relaxed print:p-4">
          {/* Header Quốc hiệu & Tiêu ngữ */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-red-700 pb-5 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                LF
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                  CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH LEDGERFLOW VIỆT NAM
                </h2>
                <p className="text-[11px] text-slate-600">Mã số thuế: <strong className="font-mono text-slate-900">0109887766</strong></p>
                <p className="text-[11px] text-slate-600">
                  Địa chỉ: Tầng 28, Keangnam Landmark 72, Đ. Phạm Hùng, Q. Nam Từ Liêm, TP. Hà Nội
                </p>
                <p className="text-[11px] text-slate-600">
                  STK: <strong className="font-mono">19036788889999</strong> tại Techcombank - CN Hội Sở
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
              <div className="text-red-700 font-extrabold text-base uppercase tracking-wider">
                HÓA ĐƠN GIÁ TRỊ GIA TĂNG
              </div>
              <div className="text-[11px] text-slate-500 italic">VAT INVOICE</div>
              <div className="mt-2 space-y-0.5 text-[11px]">
                <div>Mẫu số: <span className="font-mono font-bold">1</span></div>
                <div>Ký hiệu (Serial): <span className="font-mono font-bold text-blue-700">{invoice.eInvoiceCode}</span></div>
                <div>Số (No.): <span className="font-mono font-bold text-red-600 text-sm">#{invoice.invoiceNumber}</span></div>
                <div className="text-[10px] text-slate-500">Ngày lập: {invoice.issueDate}</div>
              </div>
            </div>
          </div>

          {/* Customer / Buyer Information */}
          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-slate-500 font-medium">Đơn vị mua hàng:</span>{' '}
                <strong className="text-slate-900 uppercase font-semibold">{invoice.customerName}</strong>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-500 font-medium">Mã số thuế:</span>{' '}
                <span className="font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-300">
                  {invoice.customerTaxCode}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Địa chỉ:</span>{' '}
              <span className="text-slate-800">{invoice.customerAddress}</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-1 pt-1 text-[11px] text-slate-600">
              <div>Người liên hệ: <strong className="text-slate-800">{invoice.customerContact || 'Kế toán trưởng'}</strong></div>
              <div>Email: <strong className="text-slate-800">{invoice.customerEmail}</strong></div>
              <div>Hình thức thanh toán: <strong className="text-slate-800">Chuyển khoản / TM</strong></div>
              <div>Điều khoản: <strong className="text-blue-700">{invoice.terms}</strong></div>
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 text-[11px]">
                  <th className="py-2.5 px-3 text-center w-10 border-r border-slate-200">STT</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">Tên hàng hóa, dịch vụ</th>
                  <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200">ĐVT</th>
                  <th className="py-2.5 px-3 text-center w-14 border-r border-slate-200">SL</th>
                  <th className="py-2.5 px-3 text-right w-28 border-r border-slate-200">Đơn giá</th>
                  <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200">CK %</th>
                  <th className="py-2.5 px-3 text-center w-16 border-r border-slate-200">VAT</th>
                  <th className="py-2.5 px-4 text-right w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => {
                  const base = item.quantity * item.unitPrice;
                  const discount = (base * (item.discountPercent || 0)) / 100;
                  const lineTotal = base - discount;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 border-r border-slate-200">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4 border-r border-slate-200">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        {item.description && (
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{item.description}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">{item.unit}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-medium border-r border-slate-200">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-800 border-r border-slate-200">
                        {formatVND(item.unitPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-600 border-r border-slate-200">
                        {item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-blue-700 font-semibold border-r border-slate-200">
                        {item.vatRate}%
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatVND(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-[11px] text-slate-500 max-w-sm">
              <p>Ghi chú: {invoice.notes || 'Không có ghi chú bổ sung.'}</p>
              <div className="mt-2 p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-blue-900 text-[10px]">
                Tra cứu hóa đơn điện tử tại: <span className="font-mono underline">https://hoadondientu.gdt.gov.vn</span><br />
                Mã tra cứu CQT: <strong className="font-mono">{invoice.invoiceNumber}-TCT992</strong>
              </div>
            </div>

            <div className="w-full sm:w-80 space-y-1.5 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Cộng tiền hàng (Subtotal):</span>
                <span className="font-mono font-semibold">{formatVND(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Tiền chiết khấu thương mại:</span>
                  <span className="font-mono font-semibold">-{formatVND(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tiền thuế GTGT (VAT Amount):</span>
                <span className="font-mono font-semibold text-blue-700">{formatVND(vatAmount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between text-slate-900 font-bold text-sm">
                <span>Tổng tiền thanh toán:</span>
                <span className="font-mono text-red-700">{formatVND(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mt-3 p-3 rounded-lg bg-slate-100/70 border border-slate-200 text-xs italic">
            <strong>Số tiền viết bằng chữ:</strong>{' '}
            <span className="text-slate-800 font-medium capitalize">{toVietnameseWords(invoice.totalAmount)}</span>
          </div>

          {/* Digital Signature & Certification Box */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="font-bold uppercase text-slate-700">NGƯỜI MUA HÀNG (BUYER)</div>
              <div className="text-[10px] text-slate-400 italic">(Ký, ghi rõ họ tên nếu có)</div>
              <div className="h-20 flex items-center justify-center text-slate-400 italic text-[11px]">
                Xác thực giao dịch điện tử
              </div>
            </div>

            <div>
              <div className="font-bold uppercase text-slate-700">NGƯỜI BÁN HÀNG (SELLER)</div>
              <div className="text-[10px] text-slate-400 italic">(Ký số điện tử Cloud HSM)</div>
              <div className="mt-2 p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 text-left text-[11px] shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
                  <span>ĐÃ KÝ ĐIỆN TỬ HỢP LỆ</span>
                </div>
                <div className="text-slate-700 mt-1 font-semibold">
                  CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH LEDGERFLOW VIỆT NAM
                </div>
                <div className="text-[10px] text-slate-500 space-y-0.5 mt-1 font-mono">
                  <div>Ngày ký: {invoice.issueDate} 08:30:00 (GMT+7)</div>
                  <div>Chứng thư số: VNPT-CA Cloud HSM Level 3 (FIPS 140-2)</div>
                  <div>Trạng thái: Đã chuyển tiếp thành công đến Tổng cục Thuế</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
