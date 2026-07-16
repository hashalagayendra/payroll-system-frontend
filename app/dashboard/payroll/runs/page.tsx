import React from "react";
import { Calculator, FileText, CheckCircle2, Clock } from "lucide-react";

export default function PayrollRunsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Payroll Runs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Process and manage monthly employee salary distributions.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Calculator className="w-4 h-4 mr-2" />
          Process New Payroll
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">YTD Payroll Processed</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">$4,350,000.00</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Avg Monthly Run</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">$440,833.00</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Next Scheduled Run</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">Nov 28, 2026</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Pay Period</th>
                <th className="px-4 py-3">Processed Date</th>
                <th className="px-4 py-3 text-center">Employees</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-800">October 2026</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  2026-10-28
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    97
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">
                  $450,500.00
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    COMPLETED
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center transition-colors">
                      <FileText className="w-3 h-3 mr-1" />
                      View Slips
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-800">September 2026</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  2026-09-28
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    95
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">
                  $442,000.00
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    COMPLETED
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center transition-colors">
                      <FileText className="w-3 h-3 mr-1" />
                      View Slips
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <span className="font-semibold text-slate-800">November 2026</span>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  -
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    100
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-800">
                  $485,000.00
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold tracking-wide bg-amber-100 text-amber-700">
                    <Clock className="w-3 h-3" />
                    DRAFT
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center transition-colors">
                      <FileText className="w-3 h-3 mr-1" />
                      View Slips
                    </button>
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
