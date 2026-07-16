import React, { useState } from "react";
import { X, Loader2, AlertCircle, Users } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface BulkMarkAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate: string;
}

export default function BulkMarkAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
}: BulkMarkAttendanceModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("PRESENT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/attendance/bulk", {
        date: selectedDate,
        status: status,
      });

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to bulk mark attendance.");
      }
    } catch (err: any) {
      console.error("Failed to bulk mark attendance:", err);
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Bulk Mark Attendance
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Select Status to Mark
            </label>
            <select
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

          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            You are about to mark all active, unmarked employees as <span className="font-semibold text-emerald-600">{status}</span> for{" "}
            <span className="font-semibold text-slate-900">
              {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>.
          </p>
          <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Employees who already have an attendance record for this date will be skipped and their existing status will be preserved.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Users className="w-4 h-4 mr-2" />
            )}
            {loading ? "Processing..." : `Confirm & Mark All ${status}`}
          </button>
        </div>
      </div>
    </div>
  );
}
