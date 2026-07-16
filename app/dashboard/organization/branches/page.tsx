import React from "react";
import { Plus, MapPin, Edit2, Trash2 } from "lucide-react";

export default function BranchesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Branches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company branches and physical locations.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      {/* Grid Layout for Branches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Branch 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 pr-12">Headquarters (New York)</h3>
          <p className="text-sm text-slate-500 mb-4">New York, USA</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
              ACTIVE
            </span>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Details
            </button>
          </div>
        </div>

        {/* Branch 2 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 pr-12">EMEA Regional (London)</h3>
          <p className="text-sm text-slate-500 mb-4">London, UK</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
              ACTIVE
            </span>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Details
            </button>
          </div>
        </div>

        {/* Branch 3 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1 pr-12">APAC Hub (Singapore)</h3>
          <p className="text-sm text-slate-500 mb-4">Singapore</p>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-emerald-100 text-emerald-700">
              ACTIVE
            </span>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Details
            </button>
          </div>
        </div>

        {/* Add New Branch Card */}
        <button className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors min-h-[220px]">
          <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-semibold">Add New Branch</span>
          <span className="text-sm mt-1">Expand your organization</span>
        </button>
      </div>
    </div>
  );
}
