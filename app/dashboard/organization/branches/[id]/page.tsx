"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Building2, Users, Briefcase } from "lucide-react";
import axiosInstance from "@/lib/axios";

export default function BranchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const branchId = params.id;
  
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"departments" | "employees">("departments");

  useEffect(() => {
    const fetchBranchDetail = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/api/branches/${branchId}`);
        if (response.data.success) {
          setBranch(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch branch details", error);
      } finally {
        setLoading(false);
      }
    };
    if (branchId) {
      fetchBranchDetail();
    }
  }, [branchId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="text-center py-20 text-slate-500">
        Branch not found.
        <button onClick={() => router.back()} className="block mx-auto mt-4 text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Navigation & Header */}
      <div>
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Branches
        </button>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-2">
                {branch.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                  {branch.address || "No address provided"}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1.5 text-slate-400" />
                  {branch.phone || "No phone provided"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-700">{branch.departments?.length || 0}</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Depts</span>
              </div>
              <div className="bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 flex flex-col items-center">
                <span className="text-2xl font-bold text-emerald-700">{branch.employees?.length || 0}</span>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Employees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("departments")}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === "departments"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-4 h-4 inline-block mr-2" />
            Departments
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
              activeTab === "employees"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4 inline-block mr-2" />
            Employees
          </button>
        </div>

        <div className="p-6">
          {activeTab === "departments" && (
            <div className="space-y-4">
              {branch.departments && branch.departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {branch.departments.map((dept: any) => (
                    <div key={dept.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <h3 className="font-semibold text-slate-800 mb-1">{dept.name}</h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                        {dept.description || "No description"}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 font-medium">
                        <Briefcase className="w-3.5 h-3.5 mr-1" />
                        {dept.designations?.length || 0} Designations
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No departments found for this branch.</p>
              )}
            </div>
          )}

          {activeTab === "employees" && (
            <div className="space-y-4">
              {branch.employees && branch.employees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branch.employees.map((emp: any) => (
                    <div key={emp.id} className="flex items-center p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-4 shrink-0">
                        {emp.first_name?.[0] || ""}{emp.last_name?.[0] || ""}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{emp.first_name} {emp.last_name}</h3>
                        <p className="text-sm text-slate-500">{emp.email || "No email"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-8">No employees found in this branch.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
