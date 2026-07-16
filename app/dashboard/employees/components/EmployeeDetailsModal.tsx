import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Briefcase,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building,
  Clock,
  CreditCard,
  Banknote,
  FileText,
  Download,
  FolderKanban,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Employee } from "../../../../types/employee";
import axiosInstance from "@/lib/axios";

interface EmployeeDetailsModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetailsModal({
  employee: initialEmployee,
  isOpen,
  onClose,
}: EmployeeDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialEmployee) {
      setLoading(true);
      setActiveTab("overview"); // Reset tab
      axiosInstance
        .get(`/api/employees/${initialEmployee.id}`)
        .then((res) => setEmployee(res.data.data))
        .catch((err) => console.error("Failed to load employee details", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, initialEmployee]);

  if (!isOpen) return null;

  return (
    // Overlay container
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col max-h-[calc(100dvh-64px)] relative">
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
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {loading || !employee ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p>Loading employee details...</p>
            </div>
          ) : (
            <>
              {/* Profile Header Block */}
              <div className="flex flex-col sm:flex-row items-start gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
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
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold tracking-wide border ${
                        employee.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : employee.status === "RESIGNED"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      Code:{" "}
                      <strong className="text-slate-800">
                        {employee.employee_code}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Joined:{" "}
                      <strong className="text-slate-800">
                        {employee.join_date}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-6 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "financials", label: "Financials" },
                  { id: "documents", label: "Documents" },
                  { id: "projects", label: "Projects" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="animate-in fade-in duration-300">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                      <section>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" /> Personal &
                          Contact
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <p className="text-slate-500 text-xs mb-1">
                                Date of Birth
                              </p>
                              <p className="font-medium text-slate-800 text-sm">
                                {employee.dob || "N/A"}
                              </p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg">
                              <p className="text-slate-500 text-xs mb-1">Gender</p>
                              <p className="font-medium text-slate-800 text-sm">
                                {employee.gender || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Email</p>
                            <div className="flex items-center gap-2 font-medium text-slate-800 text-sm">
                              <Mail className="w-4 h-4 text-slate-400" />{" "}
                              {employee.email}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">Phone</p>
                            <div className="flex items-center gap-2 font-medium text-slate-800 text-sm">
                              <Phone className="w-4 h-4 text-slate-400" />{" "}
                              {employee.phone || "N/A"}
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">
                              Address
                            </p>
                            <div className="flex items-start gap-2 font-medium text-slate-800 text-sm">
                              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                              <span>{employee.address || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" /> System
                          Records
                        </h4>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <p className="text-slate-500 text-xs">Database ID</p>
                            <p className="font-mono text-slate-700 text-sm font-medium bg-white px-2 py-0.5 rounded border border-slate-200">
                              #{employee.id}
                            </p>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <p className="text-slate-500 text-xs">Created</p>
                            <p className="font-medium text-slate-800 text-sm text-right">
                              {new Date(employee.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-slate-500 text-xs">Updated</p>
                            <p className="font-medium text-slate-800 text-sm text-right">
                              {new Date(employee.updated_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-8">
                      <section>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400" />{" "}
                          Organization
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                              Department
                            </p>
                            <p className="font-semibold text-blue-700 text-base">
                              {employee.department?.name || "N/A"}
                            </p>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs mb-1 font-semibold uppercase tracking-wider">
                              Branch Office
                            </p>
                            <p className="font-semibold text-slate-800 text-base">
                              {employee.branch?.name || "N/A"}
                            </p>
                            {employee.branch?.address && (
                              <div className="text-sm text-slate-600 mt-2 space-y-1.5">
                                <p className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />{" "}
                                  <span>{employee.branch.address}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />{" "}
                          Employment
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
                              <p className="text-slate-500 text-xs mb-1">Level</p>
                              <p className="font-medium text-slate-800 text-sm inline-block px-2 py-0.5 bg-white border border-slate-200 rounded">
                                {employee.designation?.level || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-2 font-semibold">
                              Reporting Manager
                            </p>
                            {employee.reporting_manager ? (
                              <div className="flex items-center gap-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shadow-sm">
                                  {employee.reporting_manager.first_name.charAt(
                                    0
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">
                                    {employee.reporting_manager.first_name}{" "}
                                    {employee.reporting_manager.last_name}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                    <Mail className="w-3 h-3" />{" "}
                                    {employee.reporting_manager.email}
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
                    </div>
                  </div>
                )}

                {activeTab === "financials" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-400" /> Bank
                        Details
                      </h4>
                      {employee.bank_detail ? (
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4 shadow-sm">
                          <div>
                            <p className="text-slate-500 text-xs mb-1">
                              Bank Name
                            </p>
                            <p className="font-bold text-slate-800">
                              {employee.bank_detail.bank_name || "N/A"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-slate-500 text-xs mb-1">
                                Account Number
                              </p>
                              <p className="font-medium text-slate-800 font-mono">
                                {employee.bank_detail.account_number || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs mb-1">
                                SWIFT Code
                              </p>
                              <p className="font-medium text-slate-800 font-mono">
                                {employee.bank_detail.swift_code || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-1">
                              Branch Name
                            </p>
                            <p className="font-medium text-slate-800">
                              {employee.bank_detail.branch_name || "N/A"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                          <p className="text-sm text-slate-500">
                            No bank details available for this employee.
                          </p>
                        </div>
                      )}
                    </section>

                    <section>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-slate-400" /> Salary
                        Structure
                      </h4>
                      {employee.salary?.salary_structure ? (
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4 shadow-sm">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <p className="text-slate-500 text-xs">
                              Base Salary (from Designation)
                            </p>
                            <p className="font-bold text-slate-800 text-base">
                              ${employee.salary.salary_structure.basic_salary}
                            </p>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <p className="text-slate-500 text-xs">
                              Basic Salary Override
                            </p>
                            <p className="font-bold text-emerald-600 text-base">
                              {employee.salary.basic_salary_override
                                ? `$${employee.salary.basic_salary_override}`
                                : "None"}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <p className="text-slate-500 text-xs mb-1">
                                Overtime Rate
                              </p>
                              <p className="font-medium text-slate-800">
                                ${employee.salary.salary_structure.overtime_rate}/hr
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500 text-xs mb-1">
                                Default Allowance
                              </p>
                              <p className="font-medium text-slate-800">
                                ${employee.salary.salary_structure.allowance_default}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                          <p className="text-sm text-slate-500">
                            No active salary structure found.
                          </p>
                        </div>
                      )}
                    </section>
                  </div>
                )}

                {activeTab === "documents" && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" /> Uploaded
                      Documents
                    </h4>
                    {employee.documents && employee.documents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {employee.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 text-sm">
                                  {doc.type || "Document"}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  Uploaded on{" "}
                                  {new Date(doc.created_at || "").toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={doc.file_url || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">
                          No documents uploaded yet
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "projects" && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-slate-400" /> Assigned
                      Projects
                    </h4>
                    {employee.project_assignments &&
                    employee.project_assignments.length > 0 ? (
                      <div className="space-y-4">
                        {employee.project_assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-bold text-slate-800 text-base">
                                  {assignment.project?.name || "Unknown Project"}
                                </h5>
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    assignment.project?.status === "ACTIVE"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : assignment.project?.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {assignment.project?.status || "N/A"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 flex items-center gap-2">
                                <Building className="w-3.5 h-3.5" />
                                Client: {assignment.project?.client_name || "Internal"}
                              </p>
                            </div>
                            <div className="flex items-center sm:text-right gap-4 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
                              <div>
                                <p className="text-xs text-slate-400 mb-0.5">Role</p>
                                <p className="font-medium text-slate-800 text-sm">
                                  {assignment.role || "Member"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400 mb-0.5">
                                  Timeline
                                </p>
                                <p className="font-medium text-slate-800 text-sm">
                                  {assignment.project?.start_date} -{" "}
                                  {assignment.project?.end_date || "Present"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FolderKanban className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-medium">
                          Not assigned to any projects currently.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 z-10 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
