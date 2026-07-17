"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Clock, Plus, Search, Filter, Edit2, Trash2, Calendar, Briefcase, User, BarChart3, CheckCircle2, XCircle } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Timesheet, TimesheetResponse } from "../../../types/timesheet";
import LogTimeModal from "./components/LogTimeModal";

import EditTimeModal from "./components/EditTimeModal";

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "weekly">("list");
  
  // Filter States
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [billableFilter, setBillableFilter] = useState<"All" | "true" | "false">("All");

  // Options for Dropdowns
  const [employees, setEmployees] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Modal State
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);

  // Fetch Filter Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [empRes, projRes] = await Promise.all([
          axiosInstance.get("/api/employees?per_page=100"),
          axiosInstance.get("/api/projects")
        ]);
        if (empRes.data.success) {
          setEmployees(empRes.data.data.data || []);
        }
        if (projRes.data.success) {
          setProjects(projRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load options", err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch Timesheets
  const fetchTimesheets = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (selectedEmployee !== "All") params.append("employee_id", selectedEmployee);
      if (selectedProject !== "All") params.append("project_id", selectedProject);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      if (billableFilter !== "All") params.append("billable", billableFilter);

      const response = await axiosInstance.get<TimesheetResponse>(`/api/timesheets?${params.toString()}`);
      if (response.data.success) {
        setTimesheets(response.data.data);
      } else {
        setError("Failed to fetch timesheets.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [selectedEmployee, selectedProject, dateFrom, dateTo, billableFilter]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  // Derived Metrics
  const metrics = useMemo(() => {
    let total = 0;
    let billable = 0;
    let nonBillable = 0;
    
    timesheets.forEach(ts => {
      const hours = Number(ts.hours_worked) || 0;
      total += hours;
      if (ts.billable) billable += hours;
      else nonBillable += hours;
    });

    return { total, billable, nonBillable };
  }, [timesheets]);

  const clearFilters = () => {
    setSelectedEmployee("All");
    setSelectedProject("All");
    setDateFrom("");
    setDateTo("");
    setBillableFilter("All");
  };

  const handleEditClick = (sheet: Timesheet) => {
    setSelectedTimesheet(sheet);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Timesheets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track employee work hours, tasks, and billable status across projects.
          </p>
        </div>
        <button 
          onClick={() => setIsLogTimeModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Time
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Hours</p>
            <h3 className="text-2xl font-bold text-slate-800">{metrics.total.toFixed(1)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Billable Hours</p>
            <h3 className="text-2xl font-bold text-slate-800">{metrics.billable.toFixed(1)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Non-Billable</p>
            <h3 className="text-2xl font-bold text-slate-800">{metrics.nonBillable.toFixed(1)}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                viewMode === "weekly" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Weekly Summary
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Employee Filter */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer appearance-none min-w-[150px]"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="All">All Employees</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>
            </div>
            
            {/* Project Filter */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer appearance-none min-w-[150px]"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="All">All Projects</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </div>

            {/* Billable Toggle */}
            <select
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
              value={billableFilter}
              onChange={(e) => setBillableFilter(e.target.value as any)}
            >
              <option value="All">All Entries</option>
              <option value="true">Billable Only</option>
              <option value="false">Non-Billable Only</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">From:</span>
            <input 
              type="date" 
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-sm text-slate-500 ml-2">To:</span>
            <input 
              type="date" 
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <button
            onClick={clearFilters}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            title="Clear filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "list" ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading timesheets...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : timesheets.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No timesheets found for the selected filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Task Description</th>
                    <th className="px-4 py-3">Work Date</th>
                    <th className="px-4 py-3 text-right">Hours Worked</th>
                    <th className="px-4 py-3 text-center">Billable</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {timesheets.map((sheet) => (
                    <tr
                      key={sheet.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                            {sheet.employee?.first_name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {sheet.employee ? `${sheet.employee.first_name} ${sheet.employee.last_name}` : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700 font-medium">
                          {sheet.project?.name || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-700 line-clamp-2" title={sheet.task_description}>
                          {sheet.task_description || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {sheet.work_date ? new Date(sheet.work_date).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-slate-700">{sheet.hours_worked}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                            sheet.billable
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {sheet.billable ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(sheet)}
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
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 flex flex-col items-center justify-center min-h-[300px]">
          <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Weekly Summary View</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md text-center">
            The weekly summary grouped by employee (Mon-Sun hours with totals) will be implemented here.
          </p>
        </div>
      )}

      <LogTimeModal
        isOpen={isLogTimeModalOpen}
        onClose={() => setIsLogTimeModalOpen(false)}
        onSuccess={fetchTimesheets}
        employees={employees}
        projects={projects}
      />

      <EditTimeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTimesheet(null);
        }}
        onSuccess={fetchTimesheets}
        employees={employees}
        projects={projects}
        timesheet={selectedTimesheet}
      />
    </div>
  );
}
