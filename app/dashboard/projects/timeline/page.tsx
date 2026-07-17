"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Briefcase,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Timesheet {
  id: number;
  employee_id: number;
  project_id: number;
  task_description: string;
  work_date: string;
  hours_worked: string;
  billable: boolean;
  employee: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface Project {
  id: number;
  name: string;
}

export default function ProjectTimelinePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/api/projects");
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch timesheets when a project is selected
  useEffect(() => {
    if (!selectedProjectId) {
      setTimesheets([]);
      return;
    }

    const fetchTimesheets = async () => {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(
          `/api/timesheets?project_id=${selectedProjectId}`,
        );
        if (res.data.success) {
          setTimesheets(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch timesheets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimesheets();
  }, [selectedProjectId]);

  const totalHours = timesheets.reduce(
    (acc, curr) => acc + parseFloat(curr.hours_worked),
    0,
  );

  const billableHours = timesheets
    .filter((ts) => ts.billable)
    .reduce((acc, curr) => acc + parseFloat(curr.hours_worked), 0);

  const uniqueEmployees = new Set(timesheets.map((ts) => ts.employee_id)).size;
  const totalEntries = timesheets.length;

  const selectedProject = projects.find(
    (p) => p.id.toString() === selectedProjectId,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-500" />
            Project Timeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a project to view its timesheet entries and logged hours.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <Briefcase className="w-5 h-5 text-slate-400 ml-2" />
          <select
            className="w-full sm:w-64 py-2 px-2 bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={isProjectsLoading}
          >
            <option value="">-- Select a Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedProjectId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">
                Total Hours
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {totalHours.toFixed(1)}
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">
                Billable Hours
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {billableHours.toFixed(1)}
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">
                Team Members
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {uniqueEmployees}
              </h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold mb-1">
                Total Entries
              </p>
              <h4 className="text-2xl font-black text-slate-800">
                {totalEntries}
              </h4>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {!selectedProjectId ? (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Select a project
            </h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">
              Please select a project from the dropdown above to view its
              timeline and timesheet entries.
            </p>
          </div>
        ) : isLoading ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading timeline...</p>
          </div>
        ) : timesheets.length === 0 ? (
          <div className="p-16 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No timesheets found
            </h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">
              There are no hours logged for{" "}
              <strong>{selectedProject?.name}</strong> yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Task Description</th>
                  <th className="px-6 py-4">Hours</th>
                  <th className="px-6 py-4">Billable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timesheets.map((ts) => (
                  <tr
                    key={ts.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-700 font-semibold">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        {new Date(ts.work_date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs ring-2 ring-white">
                          {ts.employee?.first_name.charAt(0)}
                          {ts.employee?.last_name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">
                          {ts.employee?.first_name} {ts.employee?.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-slate-600 max-w-md">
                        <FileText className="w-4 h-4 mr-2 mt-0.5 text-slate-400 shrink-0 group-hover:text-blue-400 transition-colors" />
                        <span className="leading-relaxed">
                          {ts.task_description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {ts.hours_worked}{" "}
                        <span className="text-slate-500 text-xs ml-1 font-semibold">
                          hrs
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ts.billable ? (
                        <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/50">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />{" "}
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-slate-600 font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                          <XCircle className="w-4 h-4 mr-1.5 text-slate-400" />{" "}
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
