import React from "react";
import { Search, Upload, Eye, Trash2, FileText, Download } from "lucide-react";

const DUMMY_DOCUMENTS = [
  { id: 1, employeeName: "John Doe", documentType: "Offer Letter", fileUrl: "#", uploadedAt: "2022-01-10" },
  { id: 2, employeeName: "Jane Smith", documentType: "ID Proof", fileUrl: "#", uploadedAt: "2021-10-25" },
  { id: 3, employeeName: "Mike Johnson", documentType: "Contract Agreement", fileUrl: "#", uploadedAt: "2023-03-05" },
  { id: 4, employeeName: "Sarah Williams", documentType: "Tax Form", fileUrl: "#", uploadedAt: "2020-06-01" },
  { id: 5, employeeName: "David Brown", documentType: "Offer Letter", fileUrl: "#", uploadedAt: "2022-08-10" },
];

export default function EmployeeDocumentsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and securely store all employee-related files.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <select className="w-full md:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer">
          <option>All Document Types</option>
          <option>Offer Letter</option>
          <option>ID Proof</option>
          <option>Contract Agreement</option>
          <option>Tax Form</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {DUMMY_DOCUMENTS.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-indigo-50 text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-800">{doc.documentType}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{doc.employeeName}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Download">
                        <Download className="w-4 h-4" />
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
