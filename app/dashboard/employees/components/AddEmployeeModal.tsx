import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
}: AddEmployeeModalProps) {
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    join_date: "",
    employment_type: "FULL_TIME",
    status: "ACTIVE",
    branch_id: "",
    department_id: "",
    designation_id: "",
    reporting_manager_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const [branchesRes, departmentsRes, designationsRes, employeesRes] = await Promise.all([
        axiosInstance.get("/api/branches"),
        axiosInstance.get("/api/departments"),
        axiosInstance.get("/api/designations"),
        axiosInstance.get("/api/employees?per_page=1000"),
      ]);
      setBranches(branchesRes.data.data || []);
      setDepartments(departmentsRes.data.data || []);
      setDesignations(designationsRes.data.data || []);
      setEmployees(employeesRes.data.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        branch_id: formData.branch_id || null,
        department_id: formData.department_id || null,
        designation_id: formData.designation_id || null,
        reporting_manager_id: formData.reporting_manager_id || null,
      };
      await axiosInstance.post("/api/employees", payload);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to create employee";
      if (err.response?.data?.errors) {
         setError(Object.values(err.response.data.errors).flat().join(", "));
      } else {
         setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="add-employee-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">First Name *</label>
                    <input required type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Last Name *</label>
                    <input required type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                 </div>
                 <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-slate-900 mb-1">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" rows={2} />
                 </div>
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Employee Code *</label>
                    <input required type="text" name="employee_code" value={formData.employee_code} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Join Date</label>
                    <input type="date" name="join_date" value={formData.join_date} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Employment Type</label>
                    <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERN">Intern</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="ACTIVE">Active</option>
                        <option value="ON_LEAVE">On Leave</option>
                        <option value="RESIGNED">Resigned</option>
                        <option value="TERMINATED">Terminated</option>
                    </select>
                 </div>
              </div>
            </div>

            {/* Organization Structure */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Organization Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Branch</label>
                    <select name="branch_id" value={formData.branch_id} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">Select Branch</option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Department</label>
                    <select name="department_id" value={formData.department_id} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Designation</label>
                    <select name="designation_id" value={formData.designation_id} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">Select Designation</option>
                        {designations.map((d) => (
                          <option key={d.id} value={d.id}>{d.title}</option>
                        ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">Reporting Manager</label>
                    <select name="reporting_manager_id" value={formData.reporting_manager_id} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option value="">Select Manager</option>
                        {employees.map((e) => (
                          <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
                        ))}
                    </select>
                 </div>
              </div>
            </div>
            
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-employee-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
