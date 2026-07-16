"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Upload, Eye, Trash2, FileText, Download, Loader2, Filter } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { EmployeeDocument } from "../../../../types/employee";
import UploadDocumentModal from "./components/UploadDocumentModal";

interface DocumentResponse {
  success: boolean;
  data: {
    current_page: number;
    data: EmployeeDocument[];
    last_page: number;
    total: number;
  };
  message: string;
}

export default function EmployeeDocumentsPage() {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const perPage = 15;

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Document Types");

  const fetchDocuments = useCallback(async (page = 1, search = "", type = "All Document Types") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (search) params.append("search", search);
      if (type && type !== "All Document Types") params.append("type", type);
      
      const response = await axiosInstance.get<DocumentResponse>(`/api/employee-documents?${params.toString()}`);
      
      if (response.data.success) {
        setDocuments(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setTotalPages(response.data.data.last_page);
        setTotalEntries(response.data.data.total);
      } else {
        setError("Failed to fetch documents.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when page or filters change
  // Note: Using a debounce pattern for the search would be better, but we can trigger it on 'Enter' or just a simple timeout.
  // For simplicity and immediate feedback, we will trigger fetch on changes, but to avoid spam, we'll use a small timeout.
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments(currentPage, searchQuery, selectedType);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDocuments, currentPage, searchQuery, selectedType]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Employee Documents</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and securely store all employee-related files.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
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
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="w-full md:w-auto px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1); // reset to first page on filter
            }}
          >
            <option>All Document Types</option>
            <option>NIC</option>
            <option>Passport</option>
            <option>Contract</option>
            <option>Other</option>
          </select>
          <button
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("All Document Types");
              setCurrentPage(1);
            }}
            title="Clear filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading && documents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
            <p>Loading documents...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50">
            <p>{error}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No documents found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
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
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-indigo-50 text-indigo-600 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            {doc.file_url ? (
                              <a 
                                href={doc.file_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="font-semibold text-slate-800 hover:text-indigo-600 hover:underline block"
                              >
                                {doc.type || "Document"}
                              </a>
                            ) : (
                              <span className="font-semibold text-slate-800 block">{doc.type || "Document"}</span>
                            )}
                            {doc.file_url && (
                              <a 
                                href={doc.file_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="text-xs text-blue-600 hover:underline truncate max-w-[150px] inline-block"
                              >
                                {doc.file_url.split('/').pop()}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {/* TypeScript expects employee relation since we eagerly load it */}
                        {/* @ts-ignore */}
                        {doc.employee ? (
                          <div>
                            {/* @ts-ignore */}
                            <p className="font-medium text-slate-700">{doc.employee.first_name} {doc.employee.last_name}</p>
                            {/* @ts-ignore */}
                            <p className="text-xs text-slate-500">{doc.employee.employee_code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(doc.created_at || "").toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          {doc.file_url && (
                            <a href={doc.file_url} download target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Download">
                              <Download className="w-4 h-4" />
                            </a>
                          )}
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
            {/* Pagination Controls */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {documents.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to {Math.min(currentPage * perPage, totalEntries)} of{" "}
                {totalEntries} entries
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  Prev
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <UploadDocumentModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => fetchDocuments(currentPage, searchQuery, selectedType)}
      />
    </div>
  );
}
