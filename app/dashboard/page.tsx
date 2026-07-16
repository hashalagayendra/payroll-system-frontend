import React from "react";
import { Users, Building2, Briefcase, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome back, Admin!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening in your organization today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Employees</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">124</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            <span>4 new this month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500">Active Branches</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">3</h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>Across 3 regions</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500">Departments</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">5</h3>
            </div>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500">
            <span>All operating smoothly</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-500">Payroll (Oct 2026)</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                $450,500.00
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-amber-600 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+2.4% from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Placeholder for Chart (No Recharts to keep it pure static) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Headcount Growth</h3>
            <p className="text-sm text-slate-500">Total number of active employees over the year.</p>
          </div>
          <div className="flex-1 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex items-center justify-center min-h-[300px]">
            <span className="text-slate-400 font-medium">Chart Area Placeholder</span>
          </div>
        </div>

        {/* Recent Joinees Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Joinees</h3>
              <p className="text-sm text-slate-500">Latest additions to the team.</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            
            <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                JD
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">John Doe</p>
                <p className="text-xs text-slate-500 truncate">Senior Software Engineer</p>
              </div>
              <div className="text-xs font-medium text-slate-400">
                Oct 10
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                JS
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">Jane Smith</p>
                <p className="text-xs text-slate-500 truncate">HR Generalist</p>
              </div>
              <div className="text-xs font-medium text-slate-400">
                Sep 28
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                MJ
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">Michael Johnson</p>
                <p className="text-xs text-slate-500 truncate">Account Executive</p>
              </div>
              <div className="text-xs font-medium text-slate-400">
                Sep 15
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                EW
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-800 truncate">Emily Wong</p>
                <p className="text-xs text-slate-500 truncate">Financial Analyst</p>
              </div>
              <div className="text-xs font-medium text-slate-400">
                Aug 05
              </div>
            </div>

          </div>
          <button className="mt-4 w-full py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            View All Employees
          </button>
        </div>

      </div>
    </div>
  );
}
