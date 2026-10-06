import React, { useState } from 'react';
import { ProductService } from '../../types';
import { formatVND } from '../../utils/formatters';

interface ProductsServicesViewProps {
  products: ProductService[];
  onCreateProduct: (newProduct: ProductService) => void;
  onNavigateCreateInvoice: (product?: ProductService) => void;
}

export const ProductsServicesView: React.FC<ProductsServicesViewProps> = ({
  products: initialProducts,
  onCreateProduct,
  onNavigateCreateInvoice,
}) => {
  const [products, setProducts] = useState<ProductService[]>(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [sku, setSku] = useState(`SKU-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductService['category']>('Cloud Infrastructure');
  const [unit, setUnit] = useState('Tháng');
  const [unitPrice, setUnitPrice] = useState<number>(10000000);
  const [vatRate, setVatRate] = useState<number>(10);
  const [description, setDescription] = useState('');

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'ALL' && p.category !== categoryFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku) return;

    const newProd: ProductService = {
      id: `prod-${Date.now()}`,
      sku,
      name,
      category,
      unit,
      unitPrice,
      vatRate,
      description,
      status: 'ACTIVE',
    };

    setProducts((prev) => [newProd, ...prev]);
    onCreateProduct(newProd);
    setIsModalOpen(false);

    // Reset
    setName('');
    setDescription('');
    setSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này khỏi bảng giá?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            Bảng giá Dịch vụ & Danh mục Sản phẩm (Master Catalog)
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Quản trị Sản phẩm, Gói Dịch vụ & Thuế suất Mặc định
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Thiết lập bảng giá tiêu chuẩn, đơn vị tính và định mức thuế VAT để tự động hóa khi xuất hóa đơn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">add_box</span>
            Thêm Sản phẩm / Dịch vụ Mới
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Dịch vụ Niêm yết</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">inventory</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{products.length}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Đang kinh doanh chủ động</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Hạ tầng Cloud & Server</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">dns</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 font-mono">
              {products.filter((p) => p.category === 'Cloud Infrastructure').length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Dedicated, Leased line, Colocation</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Bản quyền SaaS & HSM</span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">cloud_sync</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 font-mono">
              {products.filter((p) => p.category === 'Software License').length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Gói bản quyền theo người dùng</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Thuế suất Phổ biến</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">percent</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">10% & 8%</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Áp dụng Nghị định 44/2023/NĐ-CP</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(['ALL', 'Cloud Infrastructure', 'Software License', 'Technical Service', 'Consulting'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat === 'ALL'
                  ? 'Tất cả danh mục'
                  : cat === 'Cloud Infrastructure'
                  ? 'Hạ tầng Cloud'
                  : cat === 'Software License'
                  ? 'Bản quyền SaaS'
                  : cat === 'Technical Service'
                  ? 'Kỹ thuật & SLA'
                  : 'Tư vấn Triển khai'}
              </button>
            )
          )}
        </div>

        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo SKU, tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Mã SKU</th>
                <th className="py-3 px-4">Tên Hàng hóa / Dịch vụ</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4 text-center">ĐVT</th>
                <th className="py-3 px-4 text-right">Đơn giá niêm yết</th>
                <th className="py-3 px-4 text-center">Thuế VAT</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                      {prod.sku}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{prod.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {prod.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                    {prod.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {formatVND(prod.unitPrice)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                      {prod.vatRate === -1 ? 'KCT' : `${prod.vatRate}%`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onNavigateCreateInvoice(prod)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors flex items-center gap-1"
                        title="Tạo hóa đơn với dịch vụ này"
                      >
                        <span className="material-symbols-outlined text-xs">add</span>
                        Lập HĐ
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Xóa dịch vụ"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">add_box</span>
                Thêm Mặt hàng / Dịch vụ Mới vào Bảng giá
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Mã SKU</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Phân loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="Cloud Infrastructure">Hạ tầng Cloud & Server</option>
                    <option value="Software License">Bản quyền Phần mềm SaaS</option>
                    <option value="Technical Service">Dịch vụ Kỹ thuật & SLA</option>
                    <option value="Consulting">Tư vấn & Tích hợp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Tên Hàng hóa / Dịch vụ
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bản quyền Hệ thống Ký số HSM Enterprise v3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">ĐVT</label>
                  <input
                    type="text"
                    required
                    placeholder="Tháng, Gói, Lần"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Đơn giá (VND)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Thuế VAT (%)</label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="10">10% (Tiêu chuẩn)</option>
                    <option value="8">8% (Giảm thuế)</option>
                    <option value="5">5%</option>
                    <option value="0">0%</option>
                    <option value="-1">Không chịu thuế</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Mô tả chi tiết</label>
                <textarea
                  rows={2}
                  placeholder="Thông số kỹ thuật, phạm vi cam kết SLA..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Lưu vào Bảng giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
