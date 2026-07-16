"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Edit2, Trash2, Building, Loader2, FileText, Filter } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { EmployeeBankDetail, Employee } from "../../../../types/employee";
import AddBankDetailModal from "./components/AddBankDetailModal";
import EditBankDetailModal from "./components/EditBankDetailModal";
import ConfirmDeleteBankDetailModal from "./components/ConfirmDeleteBankDetailModal";

interface BankDetailsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: EmployeeBankDetail[];
    last_page: number;
    total: number;
  };
}

export default function BankDetailsPage() {
  const [bankDetails, setBankDetails] = useState<EmployeeBankDetail[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const perPage = 15;

  // Filter state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bankDetailToEdit, setBankDetailToEdit] = useState<EmployeeBankDetail | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bankDetailToDelete, setBankDetailToDelete] = useState<EmployeeBankDetail | null>(null);

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees?per_page=1000");
      setEmployees(res.data.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchBankDetails = useCallback(async (page = 1, employeeId = "") => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });
      
      if (employeeId) params.append("employee_id", employeeId);
      
      const response = await axiosInstance.get<BankDetailsResponse>(`/api/employee-bank-details?${params.toString()}`);
      
      if (response.data.success) {
        setBankDetails(response.data.data.data);
        setCurrentPage(response.data.data.current_page);
        setTotalPages(response.data.data.last_page);
        setTotalEntries(response.data.data.total);
      } else {
        setError("Failed to fetch bank details.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchBankDetails(currentPage, selectedEmployeeId);
  }, [fetchBankDetails, currentPage, selectedEmployeeId]);

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
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bank Details</h1>
          <p className="text-sm text-slate-500 mt-1">Manage employee bank accounts for payroll processing.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bank Details
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-96">
          <select
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            value={selectedEmployeeId}
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              setCurrentPage(1); // reset to first page on filter
            }}
          >
            <option value="">Search by employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name} ({emp.employee_code})
              </option>
            ))}
          </select>
          <button
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
            onClick={() => {
              setSelectedEmployeeId("");
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
        {loading && bankDetails.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
            <p>Loading bank details...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50">
            <p>{error}</p>
          </div>
        ) : bankDetails.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 border-dashed border-slate-300">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No bank details found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your search filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Bank Name</th>
                    <th className="px-4 py-3">Account Number</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">SWIFT Code</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bankDetails.map((bank) => (
                    <tr key={bank.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        {bank.employee ? (
                          <div>
                            <p className="font-medium text-slate-800">
                              {bank.employee.first_name} {bank.employee.last_name}
                            </p>
                            <p className="text-xs text-slate-500">{bank.employee.employee_code}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Building className="w-4 h-4 text-teal-600 shrink-0" />
                          <span className="font-medium">{bank.bank_name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                        {bank.masked_account_number || bank.account_number || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{bank.branch_name || "N/A"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium tracking-wide">
                          {bank.swift_code || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setBankDetailToEdit(bank);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors" 
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setBankDetailToDelete(bank);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Delete"
                          >
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
                Showing {bankDetails.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to {Math.min(currentPage * perPage, totalEntries)} of{" "}
                {totalEntries} entries
              </span>
              <div className="flex gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Prev
                </button>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddBankDetailModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => fetchBankDetails(currentPage, selectedEmployeeId)} 
      />

      <EditBankDetailModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={() => fetchBankDetails(currentPage, selectedEmployeeId)} 
        bankDetail={bankDetailToEdit}
      />

      {bankDetailToDelete && (
        <ConfirmDeleteBankDetailModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onSuccess={() => fetchBankDetails(currentPage, selectedEmployeeId)} 
          bankDetail={bankDetailToDelete}
        />
      )}
    </div>
  );
}
