import React from "react";
import { Search, Filter, Plus, Edit2, Trash2, Eye } from "lucide-react";

const DUMMY_EMPLOYEES = [
  {
    id: 1,
    code: "EMP-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    department: "Engineering",
    designation: "Senior Developer",
    branch: "New York",
    type: "FULL_TIME",
    status: "ACTIVE",
    joinDate: "2022-01-15",
  },
  {
    id: 2,
    code: "EMP-002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234-567-8901",
    department: "HR",
    designation: "HR Manager",
    branch: "London",
    type: "FULL_TIME",
    status: "ACTIVE",
    joinDate: "2021-11-01",
  },
  {
    id: 3,
    code: "EMP-003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 234-567-8902",
    department: "Marketing",
    designation: "Content Writer",
    branch: "New York",
    type: "CONTRACT",
    status: "ACTIVE",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    code: "EMP-004",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 234-567-8903",
    department: "Sales",
    designation: "Sales Rep",
    branch: "Chicago",
    type: "FULL_TIME",
    status: "RESIGNED",
    joinDate: "2020-05-20",
  },
  {
    id: 5,
    code: "EMP-005",
    name: "David Brown",
    email: "david@example.com",
    phone: "+1 234-567-8904",
    department: "Engineering",
    designation: "DevOps Engineer",
    branch: "London",
    type: "FULL_TIME",
    status: "ACTIVE",
    joinDate: "2022-08-12",
  },
];

export default function AllEmployeesPage() {
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
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer">
            <option>All Branches</option>
            <option>New York</option>
            <option>London</option>
            <option>Chicago</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>HR</option>
            <option>Marketing</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer">
            <option>All Statuses</option>
            <option>ACTIVE</option>
            <option>RESIGNED</option>
            <option>TERMINATED</option>
          </select>
          <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
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
              {DUMMY_EMPLOYEES.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {emp.name}
                        </p>
                        <p className="text-xs text-slate-500">{emp.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{emp.email}</p>
                    <p className="text-xs text-slate-500">{emp.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700 font-medium">
                      {emp.designation}
                    </p>
                    <p className="text-xs text-slate-500">{emp.department}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{emp.branch}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium tracking-wide">
                      {emp.type}
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
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
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
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing 1 to {DUMMY_EMPLOYEES.length} of {DUMMY_EMPLOYEES.length}{" "}
            entries
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
      </div>
    </div>
  );
}
