import React from "react";
import { Plus, Award, Edit2, Trash2 } from "lucide-react";

export default function DesignationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Designations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage job titles, roles, and hierarchy levels.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Designation
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Seniority Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              
              <tr className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">Software Engineer</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">Engineering</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-blue-100 text-blue-700">
                    Mid-level
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
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">Senior Software Engineer</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">Engineering</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-amber-100 text-amber-700">
                    Senior
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
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-slate-800">HR Generalist</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">Human Resources</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide bg-blue-100 text-blue-700">
                    Mid-level
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
