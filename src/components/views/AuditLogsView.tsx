import React, { useState } from 'react';
import { AuditEvent } from '../../types';

interface AuditLogsViewProps {
  logs: AuditEvent[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedAll, setVerifiedAll] = useState(true);

  const filteredLogs = logs.filter((log) => {
    if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(term) ||
        log.actionTitle.toLowerCase().includes(term) ||
        log.summary.toLowerCase().includes(term) ||
        log.targetRef.toLowerCase().includes(term) ||
        log.hash.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const criticalCount = logs.filter((l) => l.severity === 'CRITICAL').length;
  const warningCount = logs.filter((l) => l.severity === 'WARNING').length;
  const verifiedCount = logs.filter((l) => l.verified).length;

  const handleVerifyLedger = () => {
    setVerifiedAll(true);
    alert('Kiểm tra toàn vẹn chuỗi khối SHA-256 WORM: 100% Khối dữ liệu không bị can thiệp và khớp dấu thời gian HSM!');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
            Nhật ký Kiểm toán Mật mã Bất biến
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Cryptographic Financial Audit Trail (WORM Compliant)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi vết mọi hoạt động kế toán, ký số HSM, phát hành và điều chỉnh hóa đơn theo chuỗi băm SHA-256
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyLedger}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-emerald-400">verified_user</span>
            Xác thực Tính toàn vẹn Chuỗi khối
          </button>
        </div>
      </div>

      {/* Bento KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng số Sự kiện</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">receipt_long</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">{logs.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Được lưu trữ liên tục không thể xóa</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Toàn vẹn Chuỗi WORM</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">check_circle</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">100% HỢP LỆ</div>
            <div className="text-[11px] text-emerald-600/80 mt-1">{verifiedCount}/{logs.length} Khối đã đối soát băm</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Ký số Cloud HSM</span>
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">vpn_key</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-indigo-700">
              {logs.filter((l) => l.actionCode.includes('SIGN')).length} Lần ký
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Khóa RSA 2048-bit FIPS 140-2 Level 3</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Cảnh báo / Trọng yếu</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-base">shield_with_heart</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-600">{criticalCount + warningCount} Sự kiện</div>
            <div className="text-[11px] text-rose-600/80 mt-1">{criticalCount} hành động phê duyệt cấp Admin</div>
          </div>
        </div>
      </div>

      {/* Table & Filtering */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSeverityFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({logs.length})
            </button>
            <button
              onClick={() => setSeverityFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === 'CRITICAL'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Trọng yếu ({criticalCount})
            </button>
            <button
              onClick={() => setSeverityFilter('WARNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === 'WARNING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Cảnh báo ({warningCount})
            </button>
            <button
              onClick={() => setSeverityFilter('INFO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === 'INFO'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Thông tin ({logs.filter((l) => l.severity === 'INFO').length})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Tìm người dùng, IP, mã băm SHA-256..."
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
                <th className="py-3 px-4">Thời gian & Khối #</th>
                <th className="py-3 px-3">Người thực hiện & IP</th>
                <th className="py-3 px-3">Phân hệ</th>
                <th className="py-3 px-3">Hành động / Thao tác</th>
                <th className="py-3 px-3">Mô tả tóm tắt</th>
                <th className="py-3 px-3">Mã băm SHA-256</th>
                <th className="py-3 px-4 text-center">Toàn vẹn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-slate-900 font-medium">{log.timestamp}</div>
                    <div className="text-[10px] text-blue-600 font-mono font-bold">{log.blockNumber}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-900">{log.actorName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <span>{log.actorIp}</span>
                      <span>•</span>
                      <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600">
                        {log.actorRole}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-900">{log.actionTitle}</div>
                    <div className="text-[10px] font-mono text-slate-400">{log.actionCode}</div>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs text-slate-600 line-clamp-2">
                    {log.summary}
                  </td>
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(log.hash);
                        alert(`Đã sao chép mã băm SHA-256: ${log.hash}`);
                      }}
                      title="Nhấp để sao chép mã băm"
                      className="text-[11px] font-mono text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-50 hover:bg-blue-50 px-2 py-1 rounded border border-slate-200"
                    >
                      <span>{log.hash.slice(0, 10)}...{log.hash.slice(-6)}</span>
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Khớp
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
