"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Calculator,
  FileText,
  CheckCircle2,
  Clock,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface Branch {
  id: number;
  name: string;
}

interface PayrollRun {
  id: number;
  month: number;
  year: number;
  branch_id: number;
  status: string;
  processed_at: string | null;
  employees_count: number;
  total_amount: number;
  branch: Branch;
}

export default function PayrollRunsPage() {
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [yearFilter, setYearFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchPayrollRuns();
  }, [yearFilter, branchFilter, statusFilter]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get("/api/branches");
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch branches", error);
    }
  };

  const fetchPayrollRuns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (yearFilter) params.append("year", yearFilter);
      if (branchFilter) params.append("branch_id", branchFilter);
      if (statusFilter) params.append("status", statusFilter);

      const response = await axiosInstance.get(
        `/api/payroll-runs?${params.toString()}`,
      );
      if (response.data.success) {
        setPayrollRuns(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch payroll runs", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (monthNumber: number) => {
    if (!monthNumber) return "";
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Derived Stats
  const ytdTotal = useMemo(() => {
    return payrollRuns
      .filter((r) => r.year === currentYear)
      .reduce((sum, run) => sum + Number(run.total_amount || 0), 0);
  }, [payrollRuns, currentYear]);

  const avgMonthly = useMemo(() => {
    if (payrollRuns.length === 0) return 0;
    const total = payrollRuns.reduce(
      (sum, run) => sum + Number(run.total_amount || 0),
      0,
    );
    return total / payrollRuns.length;
  }, [payrollRuns]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Payroll Runs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Process and manage monthly employee salary distributions.
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Calculator className="w-4 h-4 mr-2" />
          Process New Payroll
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">
            YTD Payroll Processed (Current Year)
          </p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            $
            {ytdTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">
            Avg Monthly Run (Displayed)
          </p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            $
            {avgMonthly.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500">Total Runs</p>
          <h3 className="text-xl font-bold text-slate-800 mt-1">
            {payrollRuns.length}
          </h3>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-auto flex-1">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto flex-1">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full sm:w-auto flex-1">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="PROCESSED">PROCESSED</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-4 py-3">Pay Period</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Processed Date</th>
                <th className="px-4 py-3 text-center">Employees</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Loading payroll runs...
                  </td>
                </tr>
              ) : payrollRuns.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    No payroll runs found matching the filters.
                  </td>
                </tr>
              ) : (
                payrollRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">
                        {getMonthName(run.month)} {run.year}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {run.branch?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {run.processed_at
                        ? new Date(run.processed_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold min-w-[2rem]">
                        {run.employees_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      $
                      {Number(run.total_amount || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                          run.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : run.status === "PROCESSED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {run.status === "PAID" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {run.status === "PROCESSED" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {run.status === "DRAFT" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {run.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center transition-colors">
                          <FileText className="w-3 h-3 mr-1" />
                          View Slips
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
    </div>
  );
}
