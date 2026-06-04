import React from "react";
import { X, User, Briefcase, MapPin, Calendar, Phone, Mail, Building, Clock } from "lucide-react";
import { Employee } from "../../../../types/employee";

interface EmployeeDetailsModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetailsModal({ employee, isOpen, onClose }: EmployeeDetailsModalProps) {
  if (!isOpen) return null;

  return (
    // Overlay container
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex flex-col max-h-[calc(100dvh-64px)] relative">
        
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Employee Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1">
          
          {/* Profile Header Block */}
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl shrink-0 uppercase shadow-sm">
              {employee.first_name?.charAt(0)}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-base font-medium text-blue-600 mt-1">
                    {employee.designation?.title || "N/A"}
                  </p>
                </div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold tracking-wide border ${
                  employee.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  employee.status === "RESIGNED" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {employee.status}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  Code: <strong className="text-slate-800">{employee.employee_code}</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Joined: <strong className="text-slate-800">{employee.join_date}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              {/* Personal & Contact */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" /> Personal & Contact
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs mb-1">Date of Birth</p>
                      <p className="font-medium text-slate-800 text-sm">{employee.dob}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs mb-1">Gender</p>
                      <p className="font-medium text-slate-800 text-sm">{employee.gender}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Email Address</p>
                    <div className="flex items-center gap-2 font-medium text-slate-800 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" /> {employee.email}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Phone Number</p>
                    <div className="flex items-center gap-2 font-medium text-slate-800 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" /> {employee.phone}
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Residential Address</p>
                    <div className="flex items-start gap-2 font-medium text-slate-800 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" /> 
                      <span>{employee.address}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Organization Details */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" /> Organization
                </h4>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider">Department</p>
                    <p className="font-semibold text-blue-700 text-base">{employee.department?.name || "N/A"}</p>
                    {employee.department?.description && (
                      <p className="text-sm text-slate-600 mt-2 bg-white p-2 rounded border border-slate-100">{employee.department.description}</p>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider">Branch Office</p>
                    <p className="font-semibold text-slate-800 text-base">{employee.branch?.name || "N/A"}</p>
                    {employee.branch?.address && (
                      <div className="text-sm text-slate-600 mt-2 space-y-1.5">
                        <p className="flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" /> <span>{employee.branch.address}</span></p>
                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {employee.branch.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Employment Status */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" /> Employment
                </h4>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs mb-1">Type</p>
                      <p className="font-medium text-slate-800 text-sm inline-block px-2 py-0.5 bg-white border border-slate-200 rounded">
                        {employee.employment_type}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs mb-1">Designation Level</p>
                      <p className="font-medium text-slate-800 text-sm inline-block px-2 py-0.5 bg-white border border-slate-200 rounded">
                        {employee.designation?.level || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Reporting Manager block */}
                  <div>
                    <p className="text-slate-500 text-xs mb-2 font-semibold">Reporting Manager</p>
                    {employee.reporting_manager ? (
                      <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm">
                          {employee.reporting_manager.first_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {employee.reporting_manager.first_name} {employee.reporting_manager.last_name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {employee.reporting_manager.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                        No reporting manager assigned
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* System Info */}
              <section>
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" /> System Records
                </h4>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <p className="text-slate-500 text-xs">Database ID</p>
                    <p className="font-mono text-slate-700 text-sm font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                      #{employee.id}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <p className="text-slate-500 text-xs">Record Created</p>
                    <p className="font-medium text-slate-800 text-sm text-right">
                      {new Date(employee.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 text-xs">Last Updated</p>
                    <p className="font-medium text-slate-800 text-sm text-right">
                      {new Date(employee.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </section>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => alert("Edit functionality coming soon")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Edit Employee
          </button>
        </div>
        
      </div>
    </div>
  );
}
