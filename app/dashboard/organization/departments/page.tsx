import React from "react";
import { Plus, Building, Edit2, Trash2 } from "lucide-react";

export default function DepartmentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Departments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage organization departments and their structural details.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Department Name</th>
                <th className="px-4 py-3">Branch Location</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3 text-center">Employees</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">Engineering</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  Headquarters (New York)
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Alice Johnson
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    42
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
                    ACTIVE
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">Human Resources</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  Headquarters (New York)
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Sarah Miller
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    5
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
                    ACTIVE
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <Building className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">Sales & Marketing</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  EMEA Regional (London)
                </td>
                <td className="px-4 py-3 text-slate-700">
                  David Chen
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                    18
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
                    ACTIVE
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
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
