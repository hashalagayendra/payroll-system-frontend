"use client";

import React, { useState } from "react";
import { Search, Plus, X, Pencil, Trash2, Filter, AlertTriangle, Gift, TrendingDown } from "lucide-react";

import axiosInstance from "@/lib/axios";

// Types
type TabType = "bonuses" | "deductions";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

interface Bonus {
  id: number;
  employee_id: number;
  title: string;
  amount: number;
  month: number;
  year: number;
  reason: string;
  created_at: string;
  employee?: Employee;
}

interface Deduction {
  id: number;
  employee_id: number;
  title: string;
  amount: number;
  month: number;
  year: number;
  employee?: Employee;
}

export default function BonusesDeductionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("bonuses");

  // Filters
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [reason, setReason] = useState(""); // Only for bonuses

  // Dummy Data for Deductions UI Preview
  const mockDeductions: Deduction[] = [
    {
      id: 1,
      employee_id: 2,
      title: "Unpaid Leave",
      amount: 5000,
      month: 7,
      year: 2026,
      employee: { id: 2, first_name: "John", last_name: "Doe" },
    },
  ];

  // Actual Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  React.useEffect(() => {
    if (activeTab === "bonuses") {
      fetchBonuses();
    }
  }, [activeTab, employeeFilter, monthFilter, yearFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get("/api/employees/all");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const fetchBonuses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (employeeFilter) params.append("employee_id", employeeFilter);
      if (monthFilter) params.append("month", monthFilter);
      if (yearFilter) params.append("year", yearFilter);

      const url = `/api/bonuses?${params.toString()}`;
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setBonuses(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBonuses(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch bonuses", error);
    } finally {
      setLoading(false);
    }
  };



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const openAddModal = () => {
    setEmployeeId("");
    setTitle("");
    setAmount("");
    setMonth("");
    setYear("");
    setReason("");
    setEditId(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (bonus: Bonus) => {
    setEmployeeId(bonus.employee_id.toString());
    setTitle(bonus.title);
    setAmount(bonus.amount.toString());
    setMonth(bonus.month.toString());
    setYear(bonus.year.toString());
    setReason(bonus.reason || "");
    setEditId(bonus.id);
    setIsEditModalOpen(true);
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab !== "bonuses") return;

    try {
      setSubmitting(true);
      const payload = {
        employee_id: parseInt(employeeId),
        title,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
        reason: reason || null,
      };

      let response;
      if (isEditModalOpen && editId !== null) {
        response = await axiosInstance.put(`/api/bonuses/${editId}`, payload);
      } else {
        response = await axiosInstance.post("/api/bonuses", payload);
      }

      if (response.data.success || response.status === 201 || response.status === 200) {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        fetchBonuses();
      }
    } catch (error) {
      console.error("Failed to save bonus", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBonus = async () => {
    if (deleteId === null) return;
    
    try {
      setSubmitting(true);
      const response = await axiosInstance.delete(`/api/bonuses/${deleteId}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        if (activeTab === "bonuses") {
          fetchBonuses();
        }
      }
    } catch (error) {
      console.error("Failed to delete record", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderBonusesTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
          <th className="px-4 py-3">Employee Name</th>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3 text-right">Amount</th>
          <th className="px-4 py-3">Month/Year</th>
          <th className="px-4 py-3">Reason</th>
          <th className="px-4 py-3">Created At</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm">
        {loading ? (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                Loading bonuses...
              </div>
            </td>
          </tr>
        ) : bonuses.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
              No bonuses found.
            </td>
          </tr>
        ) : (
          bonuses.map((bonus) => (
            <tr key={bonus.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-800">
                {bonus.employee?.first_name} {bonus.employee?.last_name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-500" />
                  {bonus.title}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-medium text-emerald-600">
                +{formatCurrency(bonus.amount)}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {bonus.month}/{bonus.year}
              </td>
              <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={bonus.reason}>
                {bonus.reason}
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                {formatDate(bonus.created_at)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(bonus)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete(bonus.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  const renderDeductionsTable = () => (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
          <th className="px-4 py-3">Employee Name</th>
          <th className="px-4 py-3">Title</th>
          <th className="px-4 py-3 text-right">Amount</th>
          <th className="px-4 py-3">Month/Year</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm">
        {mockDeductions.map((deduction) => (
          <tr key={deduction.id} className="hover:bg-slate-50 transition-colors">
            <td className="px-4 py-3 font-semibold text-slate-800">
              {deduction.employee?.first_name} {deduction.employee?.last_name}
            </td>
            <td className="px-4 py-3 text-slate-600">
              <div className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-red-500" />
                {deduction.title}
              </div>
            </td>
            <td className="px-4 py-3 text-right font-medium text-red-600">
              -{formatCurrency(deduction.amount)}
            </td>
            <td className="px-4 py-3 text-slate-500">
              {deduction.month}/{deduction.year}
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Bonuses & Deductions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage additional pay and payroll deductions for employees.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {activeTab === "bonuses" ? "Bonus" : "Deduction"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("bonuses")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "bonuses"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Bonuses
        </button>
        <button
          onClick={() => setActiveTab("deductions")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "deductions"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Deductions
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none appearance-none"
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
          >
            <option value="">Year</option>
            {[2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === "bonuses" ? renderBonusesTable() : renderDeductionsTable()}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditModalOpen ? "Edit" : "Add"} {activeTab === "bonuses" ? "Bonus" : "Deduction"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4" onSubmit={handleSaveBonus}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Employee *
                </label>
                <select
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="" disabled>Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={activeTab === "bonuses" ? "e.g. Performance Bonus" : "e.g. Unpaid Leave"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Month *
                  </label>
                  <select
                    required
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Year *
                  </label>
                  <select
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="" disabled>Select</option>
                    {[2026, 2027].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeTab === "bonuses" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Reason (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for bonus..."
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    isEditModalOpen ? "Save Changes" : `Add ${activeTab === "bonuses" ? "Bonus" : "Deduction"}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete {activeTab === "bonuses" ? "Bonus" : "Deduction"}?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete this record? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBonus}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
