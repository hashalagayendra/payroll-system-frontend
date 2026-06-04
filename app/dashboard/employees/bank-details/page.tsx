import React from "react";
import { Search, Plus, Edit2, Trash2, Building } from "lucide-react";

const DUMMY_BANK_DETAILS = [
  { id: 1, employeeName: "John Doe", bankName: "Chase Bank", accountNumber: "XXXX-XXXX-1234", branch: "Downtown NY", accountType: "Savings" },
  { id: 2, employeeName: "Jane Smith", bankName: "Bank of America", accountNumber: "XXXX-XXXX-5678", branch: "London Central", accountType: "Checking" },
  { id: 3, employeeName: "Mike Johnson", bankName: "Wells Fargo", accountNumber: "XXXX-XXXX-9012", branch: "NY Suburbs", accountType: "Savings" },
  { id: 4, employeeName: "Sarah Williams", bankName: "Citibank", accountNumber: "XXXX-XXXX-3456", branch: "Chicago Loop", accountType: "Checking" },
];

export default function BankDetailsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bank Details</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee bank accounts for payroll processing.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Bank Details
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name or account number..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Bank Name</th>
                <th className="px-4 py-3">Account Number</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Account Type</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {DUMMY_BANK_DETAILS.map((bank) => (
                <tr key={bank.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3 font-medium text-slate-800">{bank.employeeName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building className="w-4 h-4 text-teal-600" />
                      {bank.bankName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-xs">{bank.accountNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{bank.branch}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium tracking-wide">
                      {bank.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
