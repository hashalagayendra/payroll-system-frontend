"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Building2, Calendar, FileText, Plus, X, Pencil, Trash2, Filter, AlertTriangle } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

interface Department {
  id: number;
  name: string;
}

interface Designation {
  id: number;
  title: string;
  department?: Department;
}

interface SalaryStructure {
  id: number;
  basic_salary: number | null;
  designation?: Designation;
}

interface EmployeeSalary {
  id: number;
  employee_id: number;
  salary_structure_id: number;
  basic_salary_override: number | null;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string;
  employee?: Employee;
  salary_structure?: SalaryStructure;
}

export default function EmployeeSalariesPage() {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState("");
  const [salaryStructureId, setSalaryStructureId] = useState("");
  const [overrideAmount, setOverrideAmount] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [effectiveTo, setEffectiveTo] = useState("");

  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");

  useEffect(() => {
    fetchSalaries();
  }, [selectedEmployeeFilter]);

  useEffect(() => {
    fetchEmployees();
    fetchSalaryStructures();
  }, []);

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

  const fetchSalaryStructures = async () => {
    try {
      const response = await axiosInstance.get("/api/salary-structures");
      if (response.data.success) {
        setSalaryStructures(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch salary structures", error);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setEditId(null);
    setEmployeeId("");
    setSalaryStructureId("");
    setOverrideAmount("");
    setEffectiveFrom("");
    setEffectiveTo("");
    setIsModalOpen(true);
  };

  const openEditModal = (salary: EmployeeSalary) => {
    setEditMode(true);
    setEditId(salary.id);
    setEmployeeId(salary.employee_id.toString());
    setSalaryStructureId(salary.salary_structure_id.toString());
    setOverrideAmount(salary.basic_salary_override !== null ? salary.basic_salary_override.toString() : "");
    setEffectiveFrom(salary.effective_from ? salary.effective_from.split("T")[0] : "");
    setEffectiveTo(salary.effective_to ? salary.effective_to.split("T")[0] : "");
    setIsModalOpen(true);
  };

  const handleAssignSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        employee_id: parseInt(employeeId),
        salary_structure_id: parseInt(salaryStructureId),
        basic_salary_override: overrideAmount ? parseFloat(overrideAmount) : null,
        effective_from: effectiveFrom || null,
        effective_to: effectiveTo || null,
      };

      let response;
      if (editMode && editId !== null) {
        response = await axiosInstance.put(`/api/employee-salaries/${editId}`, payload);
      } else {
        response = await axiosInstance.post("/api/employee-salaries", payload);
      }

      if (response.data.success || response.status === 201 || response.status === 200) {
        setIsModalOpen(false);
        fetchSalaries();
      }
    } catch (error) {
      console.error("Failed to assign salary", error);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const url = selectedEmployeeFilter 
        ? `/api/employee-salaries?employee_id=${selectedEmployeeFilter}` 
        : `/api/employee-salaries`;
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        setSalaries(response.data.data);
      } else if (Array.isArray(response.data)) {
        setSalaries(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch employee salaries", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    
    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/api/employee-salaries/${deleteId}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setDeleteId(null);
        fetchSalaries();
      }
    } catch (error) {
      console.error("Failed to delete salary", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num);
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

  const filteredSalaries = salaries.filter(s => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${s.employee?.first_name} ${s.employee?.last_name}`.toLowerCase();
    const designation = s.salary_structure?.designation?.title?.toLowerCase() || "";
    
    return fullName.includes(query) || designation.includes(query);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Employee Salaries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage individual employee salary assignments and overrides.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Assign Salary
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees or designations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={selectedEmployeeFilter}
            onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all outline-none appearance-none"
          >
            <option value="">All Employees</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Salary Structure (Designation)</th>
                <th className="px-4 py-3 text-right">Base Salary</th>
                <th className="px-4 py-3 text-right">Override Amount</th>
                <th className="px-4 py-3 text-right">Effective Salary</th>
                <th className="px-4 py-3">Effective From</th>
                <th className="px-4 py-3">Effective To</th>
                <th className="px-4 py-3">Assigned At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Loading employee salaries...
                    </div>
                  </td>
                </tr>
              ) : filteredSalaries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No employee salaries found.
                  </td>
                </tr>
              ) : (
                filteredSalaries.map((salary) => {
                  const baseSalary = salary.salary_structure?.basic_salary;
                  const overrideAmount = salary.basic_salary_override;
                  const effectiveSalary = overrideAmount !== null ? overrideAmount : baseSalary;
                  
                  return (
                    <tr key={salary.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800">
                            {salary.employee?.first_name} {salary.employee?.last_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {salary.salary_structure?.designation?.title || "Unknown"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate-500">
                        {overrideAmount !== null ? (
                          <span className="line-through decoration-slate-300">{formatCurrency(baseSalary)}</span>
                        ) : (
                          formatCurrency(baseSalary)
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-amber-600">
                        {overrideAmount !== null ? formatCurrency(overrideAmount) : "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {formatCurrency(effectiveSalary)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(salary.effective_from)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(salary.effective_to)}
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(salary.created_at)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(salary)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Salary Assignment"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(salary.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Salary Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Salary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editMode ? "Edit Salary Assignment" : "Assign Employee Salary"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAssignSalary} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Employee *
                </label>
                <select
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
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
                  Salary Structure *
                </label>
                <select
                  required
                  value={salaryStructureId}
                  onChange={(e) => setSalaryStructureId(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>Select a structure (designation)</option>
                  {salaryStructures.map((struct) => (
                    <option key={struct.id} value={struct.id}>
                      {struct.designation?.title} (Base: {formatCurrency(struct.basic_salary)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Override Amount (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={overrideAmount}
                    onChange={(e) => setOverrideAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Leave blank to use structure base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Effective From
                  </label>
                  <input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Effective To
                  </label>
                  <input
                    type="date"
                    value={effectiveTo}
                    onChange={(e) => setEffectiveTo(e.target.value)}
                    className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      {editMode ? "Saving..." : "Assigning..."}
                    </>
                  ) : (
                    editMode ? "Save Changes" : "Assign Salary"
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
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Assignment?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete this salary assignment? This action cannot be undone and will permanently remove this record.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {deleting ? (
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
