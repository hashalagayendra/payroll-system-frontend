import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, Save } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface MarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultDate?: string;
}

export default function MarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  defaultDate,
}: MarkAttendanceModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("PRESENT");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      setEmployeeId("");
      setDate(defaultDate || new Date().toISOString().split("T")[0]);
      setCheckIn("09:00");
      setCheckOut("17:00");
      setStatus("PRESENT");
      setError(null);
    }
  }, [isOpen, defaultDate]);

  const fetchEmployees = async () => {
    try {
      setFetchLoading(true);
      // Fetching up to 1000 employees for the dropdown
      const res = await axiosInstance.get("/api/employees?per_page=1000");
      setEmployees(res.data.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !date || !status) {
      setError("Employee, Date, and Status are required.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      employee_id: employeeId,
      date: date,
      check_in: checkIn || null,
      check_out: checkOut || null,
      status: status,
    };

    try {
      const response = await axiosInstance.post("/api/attendance", payload);

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to mark attendance.");
      }
    } catch (err: any) {
      console.error("Failed to mark attendance:", err);
      if (err.response?.data?.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(" ");
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-950">
            Mark Attendance
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form id="mark-attendance-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={fetchLoading}
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.first_name} {emp.last_name} ({emp.employee_code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Check-In Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Check-Out Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="HALF_DAY">Half Day</option>
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Note: Marking attendance for an employee who already has a record on this date will overwrite their existing record.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="mark-attendance-form"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
