"use client";

import React, { useState, useEffect } from "react";
import { Plus, Award, Edit2, Trash2, Filter, X, AlertTriangle, Eye, Users, Building2, MapPin } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Branch {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  branch?: Branch;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Designation {
  id: number;
  title: string;
  level: string;
  department_id: number;
  department?: Department;
  employees_count?: number;
  employees?: Employee[];
}

export default function DesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Form state
  const [editingDesigId, setEditingDesigId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [level, setLevel] = useState<string>("Junior");
  const [submitting, setSubmitting] = useState(false);

  // Delete & View state
  const [desigToDelete, setDesigToDelete] = useState<Designation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [desigToView, setDesigToView] = useState<Designation | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDesignations();
  }, [departmentFilter, levelFilter]);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/api/departments");
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (departmentFilter) params.append("department_id", departmentFilter);
      if (levelFilter) params.append("level", levelFilter);

      const response = await axiosInstance.get(`/api/designations?${params.toString()}`);
      if (response.data.success) {
        setDesignations(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch designations", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDesigId(null);
    setTitle("");
    setDepartmentId(departmentFilter || "");
    setLevel(levelFilter || "Junior");
    setIsModalOpen(true);
  };

  const openEditModal = (desig: Designation) => {
    setEditingDesigId(desig.id);
    setTitle(desig.title);
    setDepartmentId(desig.department_id.toString());
    setLevel(desig.level || "Junior");
    setIsModalOpen(true);
  };

  const openDeleteModal = (desig: Designation) => {
    setDesigToDelete(desig);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = async (desigId: number) => {
    try {
      setIsViewModalOpen(true);
      setViewLoading(true);
      const response = await axiosInstance.get(`/api/designations/${desigId}`);
      if (response.data.success) {
        setDesigToView(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch designation details", error);
      setIsViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleSaveDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { 
        title,
        level,
        department_id: parseInt(departmentId) 
      };
      
      let response;
      if (editingDesigId) {
        response = await axiosInstance.put(`/api/designations/${editingDesigId}`, payload);
      } else {
        response = await axiosInstance.post("/api/designations", payload);
      }

      if (response.data.success) {
        setIsModalOpen(false);
        fetchDesignations();
      }
    } catch (error) {
      console.error("Failed to save designation", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDesignation = async () => {
    if (!desigToDelete) return;
    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/api/designations/${desigToDelete.id}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setDesigToDelete(null);
        fetchDesignations();
      }
    } catch (error) {
      console.error("Failed to delete designation", error);
    } finally {
      setDeleting(false);
    }
  };

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
        <button 
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Designation
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center text-slate-500 mr-2">
          <Filter className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        
        <div className="w-full sm:w-auto min-w-[200px]">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name} {dept.branch ? `(${dept.branch.name})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto min-w-[150px]">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
          >
            <option value="">All Levels</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Job Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Seniority Level</th>
                <th className="px-4 py-3 text-center">Employees</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Loading designations...
                    </div>
                  </td>
                </tr>
              ) : designations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No designations found. Try adjusting the filters.
                  </td>
                </tr>
              ) : (
                designations.map((desig) => (
                  <tr key={desig.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800">{desig.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {desig.department?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {desig.department?.branch?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                        desig.level === 'Senior' ? 'bg-amber-100 text-amber-700' :
                        desig.level === 'Mid' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {desig.level || "Unspecified"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                        {desig.employees_count || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openViewModal(desig.id)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(desig)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(desig)}
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

      {/* Add/Edit Designation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingDesigId ? "Edit Designation" : "Add New Designation"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveDesignation} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Department *
                </label>
                <select
                  required
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} {dept.branch ? `(${dept.branch.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Seniority Level *
                </label>
                <select
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                >
                  <option value="" disabled>Select a level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                </select>
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
                    editingDesigId ? "Save Changes" : "Add Designation"
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
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Designation?</h2>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{desigToDelete?.title}</strong>? This action cannot be undone.
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
                  onClick={handleDeleteDesignation}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Designation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-xl font-bold text-slate-800 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Designation Details
              </h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {viewLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : desigToView ? (
                <div className="space-y-8">
                  {/* Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Title & Level</div>
                      <div className="text-lg font-bold text-slate-800">{desigToView.title}</div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${
                          desigToView.level === 'Senior' ? 'bg-amber-100 text-amber-700' :
                          desigToView.level === 'Mid' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {desigToView.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Organization</div>
                      <div className="flex items-center text-sm font-medium text-slate-800 mb-1">
                        <Building2 className="w-4 h-4 mr-1.5 text-slate-400" />
                        {desigToView.department?.name || "N/A"}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                        {desigToView.department?.branch?.name || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Employees List */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center mb-4 pb-2 border-b border-slate-100">
                      <Users className="w-4 h-4 mr-2 text-blue-600" />
                      Employees with this Designation ({desigToView.employees?.length || 0})
                    </h3>
                    
                    {desigToView.employees && desigToView.employees.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {desigToView.employees.map((emp) => (
                          <div key={emp.id} className="flex items-center p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-200 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                              {emp.first_name[0]}{emp.last_name[0]}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-slate-800 truncate">
                                {emp.first_name} {emp.last_name}
                              </div>
                              <div className="text-xs text-slate-500 truncate">
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        No employees currently hold this designation.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  Failed to load designation details.
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
