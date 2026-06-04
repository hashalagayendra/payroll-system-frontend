"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, Plus, Edit2, Trash2, Eye } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Employee, EmployeeResponse } from "../../../types/employee";
import EmployeeDetailsModal from "./components/EmployeeDetailsModal";

export default function AllEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response =
          await axiosInstance.get<EmployeeResponse>("/api/employees");
        if (response.data.success) {
          setEmployees(response.data.data);
        } else {
          setError("Failed to fetch employees.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "An error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Compute unique filter options dynamically from data
  const branches = useMemo(() => {
    const uniqueBranches = new Set(employees.map(emp => emp.branch?.name).filter(Boolean));
    return ["All Branches", ...Array.from(uniqueBranches)];
  }, [employees]);

  const departments = useMemo(() => {
    const uniqueDepartments = new Set(employees.map(emp => emp.department?.name).filter(Boolean));
    return ["All Departments", ...Array.from(uniqueDepartments)];
  }, [employees]);

  const statuses = useMemo(() => {
    const uniqueStatuses = new Set(employees.map(emp => emp.status).filter(Boolean));
    return ["All Statuses", ...Array.from(uniqueStatuses)];
  }, [employees]);

  // Apply filters
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search logic (name or code)
      const matchesSearch =
        searchQuery === "" ||
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase());

      // Dropdown logic
      const matchesBranch = selectedBranch === "All Branches" || emp.branch?.name === selectedBranch;
      const matchesDepartment = selectedDepartment === "All Departments" || emp.department?.name === selectedDepartment;
      const matchesStatus = selectedStatus === "All Statuses" || emp.status === selectedStatus;

      return matchesSearch && matchesBranch && matchesDepartment && matchesStatus;
    });
  }, [employees, searchQuery, selectedBranch, selectedDepartment, selectedStatus]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            All Employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your workforce, view details, and update statuses.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {branches.map(branch => (
              <option key={branch as string} value={branch as string}>{branch as string}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept as string} value={dept as string}>{dept as string}</option>
            ))}
          </select>
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status as string} value={status as string}>{status as string}</option>
            ))}
          </select>
          <button 
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            onClick={() => {
              setSearchQuery("");
              setSelectedBranch("All Branches");
              setSelectedDepartment("All Departments");
              setSelectedStatus("All Statuses");
            }}
            title="Clear filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading employees...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No employees found matching your filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Role & Dept</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                            {emp.first_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {emp.first_name} {emp.last_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {emp.employee_code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700">{emp.email}</p>
                        <p className="text-xs text-slate-500">{emp.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700 font-medium">
                          {emp.designation?.title || "N/A"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {emp.department?.name || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {emp.branch?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium tracking-wide">
                          {emp.employment_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : emp.status === "RESIGNED"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Edit"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            onClick={(e) => e.stopPropagation()}
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
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing 1 to {filteredEmployees.length} of {filteredEmployees.length} entries
              </span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">
                  Prev
                </button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
