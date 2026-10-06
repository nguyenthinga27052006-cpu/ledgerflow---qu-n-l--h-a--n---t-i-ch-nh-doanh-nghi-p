import React, { useState } from 'react';
import { Customer, Invoice, InvoiceItem, ProductService } from '../../types';
import { formatVND, toVietnameseWords } from '../../utils/formatters';
import { INITIAL_PRODUCTS } from '../../data/mockData';

interface CreateInvoiceViewProps {
  customers: Customer[];
  onCancel: () => void;
  onCreateInvoice: (newInvoice: Invoice, shouldSignAndIssue: boolean) => void;
}

export const CreateInvoiceView: React.FC<CreateInvoiceViewProps> = ({
  customers,
  onCancel,
  onCreateInvoice,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [invoiceNumber] = useState<string>(`INV-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [eInvoiceCode] = useState<string>('1C25TND-01');
  const [isProductCatalogOpen, setIsProductCatalogOpen] = useState(false);

  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [terms, setTerms] = useState<string>('NET 30');
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [notes, setNotes] = useState<string>('Thanh toán theo hợp đồng kinh tế. Chứng từ đính kèm biên bản bàn giao.');

  // Selected customer object
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Dynamic Line Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      name: 'Bản quyền phần mềm Enterprise Cloud SaaS (User Pack 500)',
      sku: 'SW-ENT-500',
      description: 'Gói dịch vụ hàng năm bao gồm hỗ trợ 24/7 và SLA 99.9%',
      unit: 'Gói/Năm',
      quantity: 1,
      unitPrice: 150000000,
      discountPercent: 5,
      vatRate: 10,
    },
    {
      id: 'item-2',
      name: 'Dịch vụ Tư vấn tích hợp HSM Cloud & Phân hệ Thuế điện tử',
      sku: 'SV-HSM-INT',
      description: 'Đào tạo và bàn giao kỹ thuật đợt 1',
      unit: 'Gói',
      quantity: 1,
      unitPrice: 35000000,
      discountPercent: 0,
      vatRate: 8,
    },
  ]);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: '',
        unit: 'Lần',
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
        vatRate: 10,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Calculations
  const calculatedItems = items.map((item) => {
    const base = item.quantity * item.unitPrice;
    const discount = (base * (item.discountPercent || 0)) / 100;
    const afterDiscount = base - discount;
    const vat = item.vatRate > 0 ? (afterDiscount * item.vatRate) / 100 : 0;
    const total = afterDiscount + vat;
    return {
      ...item,
      base,
      discount,
      afterDiscount,
      vat,
      total,
    };
  });

  const subtotal = calculatedItems.reduce((acc, it) => acc + it.base, 0);
  const totalDiscount = calculatedItems.reduce((acc, it) => acc + it.discount, 0);
  const totalVAT = calculatedItems.reduce((acc, it) => acc + it.vat, 0);
  const totalAmount = subtotal - totalDiscount + totalVAT;

  const handleSubmit = (shouldSignAndIssue: boolean) => {
    if (!currentCustomer) {
      alert('Vui lòng chọn khách hàng');
      return;
    }

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      eInvoiceCode,
      customerName: currentCustomer.name,
      customerCode: currentCustomer.code,
      customerTaxCode: currentCustomer.taxCode,
      customerAddress: currentCustomer.address,
      customerEmail: currentCustomer.email,
      customerPhone: currentCustomer.phone,
      customerContact: currentCustomer.contactPerson,
      customerSegment: currentCustomer.segment,
      issueDate,
      dueDate,
      terms,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      status: shouldSignAndIssue ? 'ISSUED' : 'DRAFT',
      notes,
      items: items.map((it) => ({ ...it })),
      paymentHistory: [],
    };

    onCreateInvoice(newInvoice, shouldSignAndIssue);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={onCancel} className="hover:text-blue-600 transition-colors">Hóa đơn</button>
            <span>/</span>
            <span className="text-slate-800 font-medium">Lập hóa đơn mới</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            Lập Hóa đơn Điện tử Doanh nghiệp
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Ký hiệu: {eInvoiceCode}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">save</span>
            Lưu bản nháp
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">verified</span>
            Ký HSM & Phát hành ngay
          </button>
        </div>
      </div>

      {/* Main Grid: Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer & Header Info (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">corporate_fare</span>
                Thông tin Khách hàng (Đơn vị mua hàng)
              </h2>
              <span className="text-xs text-blue-600 hover:underline cursor-pointer">Tra cứu thông tin Tổng cục Thuế</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Chọn Doanh nghiệp đối tác</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — MST: {c.taxCode} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Mã số thuế (MST)</label>
                <input
                  type="text"
                  readOnly
                  value={currentCustomer?.taxCode || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Người liên hệ / Đại diện</label>
                <input
                  type="text"
                  readOnly
                  value={`${currentCustomer?.contactPerson || ''} (${currentCustomer?.phone || ''})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Địa chỉ trụ sở đăng ký kinh doanh</label>
                <input
                  type="text"
                  readOnly
                  value={currentCustomer?.address || ''}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-lg">list_alt</span>
                Chi tiết Hàng hóa / Dịch vụ
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductCatalogOpen(true)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Chọn từ Bảng giá
                </button>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Thêm dòng trống
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tên hàng hóa / Dịch vụ</th>
                    <th className="py-2.5 px-2 w-20">ĐVT</th>
                    <th className="py-2.5 px-2 w-20 text-right">SL</th>
                    <th className="py-2.5 px-2 w-28 text-right">Đơn giá (₫)</th>
                    <th className="py-2.5 px-2 w-16 text-right">CK (%)</th>
                    <th className="py-2.5 px-2 w-20 text-center">Thuế VAT</th>
                    <th className="py-2.5 px-3 w-32 text-right">Thành tiền (₫)</th>
                    <th className="py-2.5 px-2 w-10 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {calculatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdateItem(item.id, { name: e.target.value })}
                          placeholder="Tên sản phẩm, dịch vụ..."
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          placeholder="Diễn giải thêm (nếu có)..."
                          className="w-full mt-1 px-2 py-1 border border-transparent hover:border-slate-200 rounded text-[11px] text-slate-500 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right font-medium"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, { unitPrice: Math.max(0, Number(e.target.value)) })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right font-medium"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent}
                          onChange={(e) => handleUpdateItem(item.id, { discountPercent: Number(e.target.value) })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-right font-medium"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <select
                          value={item.vatRate}
                          onChange={(e) => handleUpdateItem(item.id, { vatRate: Number(e.target.value) })}
                          className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="10">10%</option>
                          <option value="8">8% (NĐ 72)</option>
                          <option value="5">5%</option>
                          <option value="0">0%</option>
                          <option value="-1">KCT</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">
                        {formatVND(item.total)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Notes textarea */}
            <div className="pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Ghi chú trên hóa đơn</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Invoice Metadata & Totals Summary (Right col) */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">event_note</span>
              Kỳ hạn & Pháp lý Hóa đơn
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Số hóa đơn (Dự kiến)</label>
                <input
                  type="text"
                  readOnly
                  value={invoiceNumber}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Ngày lập hóa đơn</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Điều khoản thanh toán</label>
                <select
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="NET 15">NET 15 (15 ngày từ ngày ký)</option>
                  <option value="NET 30">NET 30 (30 ngày chuẩn B2B)</option>
                  <option value="NET 45">NET 45 (45 ngày hợp đồng)</option>
                  <option value="NET 60">NET 60 (Theo quý)</option>
                  <option value="Thanh toán ngay">Thanh toán ngay khi bàn giao</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Hạn thanh toán (Due Date)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">calculate</span>
              Tổng hợp Thanh toán
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cộng tiền hàng (Subtotal):</span>
                <span className="font-semibold text-slate-800">{formatVND(subtotal)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Chiết khấu thương mại:</span>
                  <span className="font-semibold">-{formatVND(totalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Tiền thuế GTGT (VAT):</span>
                <span className="font-semibold text-slate-800">{formatVND(totalVAT)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Tổng thanh toán:</span>
                <span className="text-lg font-bold text-blue-600">{formatVND(totalAmount)}</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-blue-700 mb-1">
                  Số tiền viết bằng chữ:
                </div>
                <div className="text-xs italic text-blue-900 font-medium">
                  {toVietnameseWords(totalAmount)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                Ký số HSM & Phát hành
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
              >
                Lưu nháp (Chưa ký)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Catalog Picker Modal */}
      {isProductCatalogOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsProductCatalogOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">inventory_2</span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Chọn Hàng hóa / Dịch vụ từ Bảng giá</h3>
                  <p className="text-[11px] text-slate-500">Nhấp chọn để tự động điền đơn giá, ĐVT và thuế VAT</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductCatalogOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-4 overflow-y-auto divide-y divide-slate-100">
              {INITIAL_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setItems((prev) => [
                      ...prev,
                      {
                        id: `item-${Date.now()}`,
                        name: prod.name,
                        sku: prod.sku,
                        description: prod.description,
                        unit: prod.unit,
                        quantity: 1,
                        unitPrice: prod.unitPrice,
                        discountPercent: 0,
                        vatRate: prod.vatRate === -1 ? 0 : prod.vatRate,
                      },
                    ]);
                    setIsProductCatalogOpen(false);
                  }}
                  className="p-3 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {prod.sku}
                      </span>
                      <span className="font-semibold text-xs text-slate-900 truncate">{prod.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{prod.description}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span>ĐVT: {prod.unit}</span>
                      <span>VAT: {prod.vatRate === -1 ? 'KCT' : `${prod.vatRate}%`}</span>
                      <span>Nhóm: {prod.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 text-xs">
                      {formatVND(prod.unitPrice)}
                    </div>
                    <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                      + Chọn mục này
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-right">
              <button
                type="button"
                onClick={() => setIsProductCatalogOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

