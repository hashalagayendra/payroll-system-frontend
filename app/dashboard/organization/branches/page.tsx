"use client";

import React, { useState, useEffect } from "react";
import { Plus, MapPin, Edit2, Trash2, X, Users, Building2, AlertTriangle, ArrowRight } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Link from "next/link";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  employees_count?: number;
  departments_count?: number;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form state
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete state
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/branches");
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBranchId(null);
    setName("");
    setAddress("");
    setPhone("");
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setName(branch.name);
    setAddress(branch.address || "");
    setPhone(branch.phone || "");
    setIsModalOpen(true);
  };

  const openDeleteModal = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { name, address, phone };
      
      let response;
      if (editingBranchId) {
        response = await axiosInstance.put(`/api/branches/${editingBranchId}`, payload);
      } else {
        response = await axiosInstance.post("/api/branches", payload);
      }

      if (response.data.success) {
        setIsModalOpen(false);
        fetchBranches();
      }
    } catch (error) {
      console.error("Failed to save branch", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async () => {
    if (!branchToDelete) return;
    try {
      setDeleting(true);
      const response = await axiosInstance.delete(`/api/branches/${branchToDelete.id}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setBranchToDelete(null);
        fetchBranches();
      }
    } catch (error) {
      console.error("Failed to delete branch", error);
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
            Branches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage company branches and physical locations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      {/* Grid Layout for Branches */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group relative flex flex-col"
            >
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(branch)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Branch"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => openDeleteModal(branch)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Branch"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1 pr-12">
                {branch.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{branch.address || "No address provided"}</p>
              
              <div className="flex gap-4 mb-4">
                 <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-1 text-slate-400" />
                    <span>{branch.employees_count || 0} Employees</span>
                 </div>
                 <div className="flex items-center text-sm text-slate-600">
                    <Building2 className="w-4 h-4 mr-1 text-slate-400" />
                    <span>{branch.departments_count || 0} Depts</span>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                <span className="text-xs text-slate-500 font-medium truncate pr-2">
                  {branch.phone || "No phone"}
                </span>
                <Link
                  href={`/dashboard/organization/branches/${branch.id}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 group/link"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {/* Add New Branch Card */}
          <button
            onClick={openAddModal}
            className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors min-h-[220px]"
          >
            <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-semibold">Add New Branch</span>
            <span className="text-sm mt-1">Expand your organization</span>
          </button>
        </div>
      )}

      {/* Add/Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingBranchId ? "Edit Branch" : "Add New Branch"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 -mr-2 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBranch} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Branch Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Headquarters (New York)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. New York, USA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 text-slate-900 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. +1 234 567 890"
                />
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
                    editingBranchId ? "Save Changes" : "Add Branch"
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
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Branch?</h2>
              <p className="text-slate-500 mb-6">
                Are you sure you want to delete <strong>{branchToDelete?.name}</strong>? This action cannot be undone and may cascade to delete associated departments and designations.
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
                  onClick={handleDeleteBranch}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Branch"
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
