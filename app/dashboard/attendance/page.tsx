"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Users,
  BarChart3,
  Download
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Employee, Branch, Department, Attendance } from "@/types/employee";
import BulkMarkAttendanceModal from "./components/BulkMarkAttendanceModal";

interface EmployeeAttendance extends Employee {
  attendances?: Attendance[];
}

interface AttendanceResponse {
  success: boolean;
  date: string;
  data: {
    current_page: number;
    data: EmployeeAttendance[];
    last_page: number;
    total: number;
  };
}

export default function AttendancePage() {
  const [employees, setEmployees] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Date filtering
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");

  // Modal states
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchFilters = async () => {
    try {
      const [branchRes, deptRes] = await Promise.all([
        axiosInstance.get("/api/branches"),
        axiosInstance.get("/api/departments")
      ]);
      if (branchRes.data.success) setBranches(branchRes.data.data);
      if (deptRes.data.success) setDepartments(deptRes.data.data);
    } catch (err) {
      console.error("Failed to load filter data", err);
    }
  };

  const fetchAttendance = async (page: number, date: string, status: string, branch: string, department: string) => {
    try {
      setLoading(true);
      setError(null);
      let url = `/api/attendance?page=${page}&date=${date}`;
      if (status) url += `&status=${status}`;
      if (branch) url += `&branch_id=${branch}`;
      if (department) url += `&department_id=${department}`;

      const res = await axiosInstance.get<AttendanceResponse>(url);
      
      const records = res.data.data.data;
      setEmployees(records);
      setTotalPages(res.data.data.last_page);
    } catch (err: any) {
      console.error("Failed to fetch attendance:", err);
      setError("Could not load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchAttendance(currentPage, selectedDate, statusFilter, branchFilter, departmentFilter);
  }, [currentPage, selectedDate, statusFilter, branchFilter, departmentFilter]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new filter
  };

  const markAttendance = async (employeeId: number, status: string) => {
    try {
      setActionLoadingId(employeeId);
      const payload = {
        employee_id: employeeId,
        date: selectedDate,
        check_in: status === 'PRESENT' || status === 'LATE' || status === 'HALF_DAY' ? '09:00' : null,
        check_out: status === 'PRESENT' || status === 'LATE' || status === 'HALF_DAY' ? '17:00' : null,
        status: status,
      };

      const res = await axiosInstance.post("/api/attendance", payload);
      
      if (res.data.success) {
        // Update local state to show instantly
        setEmployees(prev => prev.map(emp => {
          if (emp.id === employeeId) {
            return {
              ...emp,
              attendances: [res.data.data]
            };
          }
          return emp;
        }));
      }
    } catch (err) {
      console.error("Failed to mark attendance", err);
      alert("Failed to mark attendance. Please try again.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const exportToCsv = async () => {
    try {
      setIsExporting(true);
      const dateObj = new Date(selectedDate);
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();
      
      const res = await axiosInstance.get(`/api/attendance/export?month=${month}&year=${year}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_export_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to export attendance:", err);
      alert("Failed to export attendance. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadge = (attendance: Attendance | undefined) => {
    if (!attendance) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200 border-dashed">
          Not Marked
        </span>
      );
    }
    
    switch (attendance.status) {
      case 'PRESENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Present
          </span>
        );
      case 'ABSENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Absent
          </span>
        );
      case 'LATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Late
          </span>
        );
      case 'HALF_DAY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Half Day
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {attendance.status}
          </span>
        );
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Daily Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Quickly mark and monitor employee attendance for any date.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCsv}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-600" /> : <Download className="w-4 h-4 mr-2 text-slate-600" />}
            Export to CSV
          </button>
          <Link 
            href="/dashboard/attendance/summary"
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2 text-indigo-600" />
            Monthly Summary
          </Link>
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            <Users className="w-4 h-4 mr-2 text-teal-600" />
            Bulk Mark Attendance
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search employee..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900"
            disabled // Placeholder for future search functionality
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="NOT_MARKED">Not Marked</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="HALF_DAY">Half Day</option>
          </select>

          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            value={branchFilter}
            onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div className="relative w-full sm:w-auto">
            <input 
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full pl-3 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-4" />
            <p>Loading employees...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 bg-red-50">
            <p>{error}</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No employees found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-4 py-3">Employee Name</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Quick Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {employees.map((emp) => {
                    const record = emp.attendances?.[0];
                    const isUpdating = actionLoadingId === emp.id;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {emp.first_name[0]}{emp.last_name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {emp.first_name} {emp.last_name}
                              </p>
                              <p className="text-xs text-slate-500">{emp.employee_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(record)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {isUpdating ? (
                              <Loader2 className="w-5 h-5 text-teal-600 animate-spin mr-4" />
                            ) : (
                              <>
                                <button 
                                  onClick={() => markAttendance(emp.id, 'PRESENT')}
                                  title="Mark Present"
                                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border transition-colors ${record?.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-2 ring-emerald-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'}`}
                                >
                                  P
                                </button>
                                <button 
                                  onClick={() => markAttendance(emp.id, 'ABSENT')}
                                  title="Mark Absent"
                                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border transition-colors ${record?.status === 'ABSENT' ? 'bg-red-100 text-red-700 border-red-200 ring-2 ring-red-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
                                >
                                  A
                                </button>
                                <button 
                                  onClick={() => markAttendance(emp.id, 'LATE')}
                                  title="Mark Late"
                                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border transition-colors ${record?.status === 'LATE' ? 'bg-amber-100 text-amber-700 border-amber-200 ring-2 ring-amber-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}`}
                                >
                                  L
                                </button>
                                <button 
                                  onClick={() => markAttendance(emp.id, 'HALF_DAY')}
                                  title="Mark Half Day"
                                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border transition-colors ${record?.status === 'HALF_DAY' ? 'bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-500/20' : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'}`}
                                >
                                  HD
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <BulkMarkAttendanceModal 
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={() => fetchAttendance(currentPage, selectedDate, statusFilter, branchFilter, departmentFilter)}
        selectedDate={selectedDate}
      />
    </div>
  );
}
