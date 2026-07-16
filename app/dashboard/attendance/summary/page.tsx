"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  AlertOctagon,
  Filter
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Branch, Department, Designation } from "@/types/employee";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface EmployeeStats {
  employee_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  total_marked: number;
}

interface DailyTrend {
  date: string;
  day: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
}

interface MonthlySummaryResponse {
  success: boolean;
  month: number;
  year: number;
  global_stats: {
    present: number;
    absent: number;
    late: number;
    half_day: number;
  };
  daily_trend: DailyTrend[];
  employee_stats: EmployeeStats[];
}

const COLORS = {
  present: "#10b981", // emerald-500
  absent: "#ef4444",  // red-500
  late: "#f59e0b",    // amber-500
  half_day: "#3b82f6" // blue-500
};

export default function MonthlySummaryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format YYYY-MM for the month input
  const [monthYear, setMonthYear] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  // Filter states
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [designationFilter, setDesignationFilter] = useState<string>("");
  
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);

  const [summaryData, setSummaryData] = useState<MonthlySummaryResponse | null>(null);

  const fetchFilters = async () => {
    try {
      const [branchRes, deptRes, desigRes] = await Promise.all([
        axiosInstance.get("/api/branches"),
        axiosInstance.get("/api/departments"),
        axiosInstance.get("/api/designations")
      ]);
      if (branchRes.data.success) setBranches(branchRes.data.data);
      if (deptRes.data.success) setDepartments(deptRes.data.data);
      if (desigRes.data.success) setDesignations(desigRes.data.data);
    } catch (err) {
      console.error("Failed to load filter data", err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchSummary = async (selectedMonthYear: string, branch: string, dept: string, desig: string) => {
    if (!selectedMonthYear) return;
    try {
      setLoading(true);
      setError(null);
      const [year, month] = selectedMonthYear.split('-');
      
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);

      if (isNaN(m) || isNaN(y)) {
        setLoading(false);
        return;
      }

      let url = `/api/attendance/monthly-summary?month=${m}&year=${y}`;
      if (branch) url += `&branch_id=${branch}`;
      if (dept) url += `&department_id=${dept}`;
      if (desig) url += `&designation_id=${desig}`;

      const res = await axiosInstance.get<MonthlySummaryResponse>(url);
      
      if (res.data.success) {
        setSummaryData(res.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch monthly summary:", err);
      setError("Could not load summary data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (monthYear) {
      fetchSummary(monthYear, branchFilter, departmentFilter, designationFilter);
    }
  }, [monthYear, branchFilter, departmentFilter, designationFilter]);

  // Data for the BarChart
  const barData = summaryData ? [
    { name: "Present", value: summaryData.global_stats.present, fill: COLORS.present },
    { name: "Absent", value: summaryData.global_stats.absent, fill: COLORS.absent },
    { name: "Late", value: summaryData.global_stats.late, fill: COLORS.late },
    { name: "Half Day", value: summaryData.global_stats.half_day, fill: COLORS.half_day }
  ] : [];

  const formatMonthDisplay = (yyyyMm: string) => {
    if (!yyyyMm) return "";
    const [y, m] = yyyyMm.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  };

  // Extract top offenders for insights
  const topAbsentees = summaryData ? [...summaryData.employee_stats]
    .sort((a, b) => b.absent - a.absent)
    .filter(e => e.absent > 0)
    .slice(0, 3) : [];

  const topLatecomers = summaryData ? [...summaryData.employee_stats]
    .sort((a, b) => b.late - a.late)
    .filter(e => e.late > 0)
    .slice(0, 3) : [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link 
              href="/dashboard/attendance"
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Advanced Monthly Analytics</h1>
          </div>
          <p className="text-sm text-slate-500">Deep dive into workforce attendance trends and performance insights.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <Calendar className="w-5 h-5 text-slate-400 ml-2" />
          <input 
            type="month"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="px-3 py-1.5 bg-transparent text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-lg"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-24 text-center text-slate-500 flex flex-col items-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
          <p>Analyzing extensive monthly data...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl border border-red-200">
          <p>{error}</p>
        </div>
      ) : summaryData && (
        <>
          {/* Global Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Present</p>
                <h3 className="text-3xl font-bold text-slate-900">{summaryData.global_stats.present}</h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Absent</p>
                <h3 className="text-3xl font-bold text-slate-900">{summaryData.global_stats.absent}</h3>
              </div>
              <div className="p-3 bg-red-50 rounded-lg text-red-600">
                <XCircle className="w-8 h-8" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Late</p>
                <h3 className="text-3xl font-bold text-slate-900">{summaryData.global_stats.late}</h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                <Clock className="w-8 h-8" />
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Half Days</p>
                <h3 className="text-3xl font-bold text-slate-900">{summaryData.global_stats.half_day}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Daily Trend Line Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Daily Attendance Trend
              </h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summaryData.daily_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(value) => `Day ${value}`}
                    />
                    <Line type="monotone" dataKey="present" name="Present" stroke={COLORS.present} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="absent" name="Absent" stroke={COLORS.absent} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>


            {/* HR Insights Section */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-indigo-500" />
                  HR Insights & Alerts
                </h2>
                <p className="text-xs text-slate-500 mt-1">Key metrics requiring attention</p>
              </div>
              <div className="p-5 space-y-6 flex-1">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Most Absences
                  </h3>
                  {topAbsentees.length > 0 ? (
                    <ul className="space-y-3">
                      {topAbsentees.map(emp => (
                        <li key={emp.employee_id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-slate-500">{emp.employee_code}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full">{emp.absent} days</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No absences recorded this month.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Most Late Arrivals
                  </h3>
                  {topLatecomers.length > 0 ? (
                    <ul className="space-y-3">
                      {topLatecomers.map(emp => (
                        <li key={emp.employee_id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{emp.first_name} {emp.last_name}</p>
                            <p className="text-xs text-slate-500">{emp.employee_code}</p>
                          </div>
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full">{emp.late} times</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No late arrivals recorded this month.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Employee Data Table */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Employee Breakdown</h2>
                    <p className="text-xs text-slate-500 mt-1">Aggregated totals for {formatMonthDisplay(monthYear)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter className="w-4 h-4" /> Filters
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                  >
                    <option value="">All Branches</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>

                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  
                  <select
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    value={designationFilter}
                    onChange={(e) => setDesignationFilter(e.target.value)}
                  >
                    <option value="">All Designations</option>
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto flex-1 max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 shadow-sm">
                    <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-4 py-4 text-center">Present</th>
                      <th className="px-4 py-4 text-center">Absent</th>
                      <th className="px-4 py-4 text-center">Late</th>
                      <th className="px-4 py-4 text-center">Half Day</th>
                      <th className="px-4 py-4 text-center text-slate-800 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {summaryData.employee_stats.map((stat) => (
                      <tr key={stat.employee_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-medium text-slate-900">
                            {stat.first_name} {stat.last_name}
                          </p>
                          <p className="text-xs text-slate-500">{stat.employee_code}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.present > 0 ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-300'}`}>
                            {stat.present}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.absent > 0 ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-300'}`}>
                            {stat.absent}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.late > 0 ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-300'}`}>
                            {stat.late}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${stat.half_day > 0 ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-300'}`}>
                            {stat.half_day}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-slate-800">
                          {stat.total_marked}
                        </td>
                      </tr>
                    ))}
                    {summaryData.employee_stats.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                          <p>No attendance data recorded for this month.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
