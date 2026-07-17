"use client";

import React, { useState, useEffect } from "react";
import { Plus, Wallet, Edit2, Trash2, Search, X, AlertTriangle, Building2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

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
  designation_id: number;
  basic_salary: number | null;
  overtime_rate: number | null;
  allowance_default: number | null;
  created_at: string;
  designation?: Designation;
}

export default function SalaryStructuresPage() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [editingStructureId, setEditingStructureId] = useState<number | null>(null);
  const [designationId, setDesignationId] = useState<string>("");
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [overtimeRate, setOvertimeRate] = useState<string>("");
  const [allowanceDefault, setAllowanceDefault] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [structureToDelete, setStructureToDelete] = useState<SalaryStructure | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDesignations();
    fetchStructures();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axiosInstance.get("/api/designations");
      if (response.data.success) {
        setDesignations(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch designations", error);
    }
  };

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/salary-structures`);
      if (response.data.success) {
        setStructures(response.data.data);
      } else if (Array.isArray(response.data)) {
        setStructures(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch salary structures", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStructureId(null);
    setDesignationId("");
    setBasicSalary("");
    setOvertimeRate("");
    setAllowanceDefault("");
    setIsModalOpen(true);
  };

  const openEditModal = (structure: SalaryStructure) => {
    setEditingStructureId(structure.id);
    setDesignationId(structure.designation_id.toString());
    setBasicSalary(structure.basic_salary?.toString() || "");
    setOvertimeRate(structure.overtime_rate?.toString() || "");
    setAllowanceDefault(structure.allowance_default?.toString() || "");
    setIsModalOpen(true);
  };

  const openDeleteModal = (structure: SalaryStructure) => {
    setStructureToDelete(structure);
    setIsDeleteModalOpen(true);
  };

  const handleSaveStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { 
        designation_id: parseInt(designationId),
        basic_salary: basicSalary ? parseFloat(basicSalary) : null,
        overtime_rate: overtimeRate ? parseFloat(overtimeRate) : null,
        allowance_default: allowanceDefault ? parseFloat(allowanceDefault) : null,
      };
      
      let response;
      if (editingStructureId) {
        response = await axiosInstance.put(`/api/salary-structures/${editingStructureId}`, payload);
      } else {
        response = await axiosInstance.post("/api/salary-structures", payload);
      }

      if (response.data.success || response.data.id) {
        setIsModalOpen(false);
        fetchStructures();
      }
    } catch (error) {
      console.error("Failed to save salary structure", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStructure = async () => {
    if (!structureToDelete) return;
    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/api/salary-structures/${structureToDelete.id}`);
      if (response.data.success || response.status === 200) {
        setIsDeleteModalOpen(false);
        setStructureToDelete(null);
        fetchStructures();
      }
    } catch (error) {
      console.error("Failed to delete salary structure", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredStructures = structures.filter(s => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return s.designation?.title?.toLowerCase().includes(query) || 
           s.designation?.department?.name?.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Salary Structures
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define base compensation settings and defaults for various designations.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Structure
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
            placeholder="Search designations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Designation Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3 text-right">Basic Salary</th>
                <th className="px-4 py-3 text-right">Overtime Rate</th>
                <th className="px-4 py-3 text-right">Default Allowance</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Loading salary structures...
                    </div>
                  </td>
                </tr>
              ) : filteredStructures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No salary structures found. Try adjusting your search or add a new one.
                  </td>
                </tr>
              ) : (
                filteredStructures.map((structure) => (
                  <tr key={structure.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">
                          {structure.designation?.title || "Unknown Designation"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {structure.designation?.department?.name || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {formatCurrency(structure.basic_salary)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(structure.overtime_rate)}<span className="text-xs text-slate-400">/hr</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatCurrency(structure.allowance_default)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(structure.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(structure)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(structure)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete"
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
        </div>
      </div>

      {/* Add/Edit Structure Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingStructureId ? "Edit Salary Structure" : "Add Salary Structure"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveStructure} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Designation *
                </label>
                <select
                  required
                  value={designationId}
                  onChange={(e) => setDesignationId(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>Select a designation</option>
                  {designations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} {d.department ? `(${d.department.name})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Basic Salary (Monthly)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Overtime Rate (Hourly)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={overtimeRate}
                      onChange={(e) => setOvertimeRate(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Default Allowance
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={allowanceDefault}
                      onChange={(e) => setAllowanceDefault(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
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
                      Saving...
                    </>
                  ) : (
                    editingStructureId ? "Save Changes" : "Save Structure"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Salary Structure?</h2>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete the structure for <strong>{structureToDelete?.designation?.title}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteStructure}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Structure"
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
