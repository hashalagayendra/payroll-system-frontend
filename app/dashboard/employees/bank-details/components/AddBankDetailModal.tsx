import React, { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, Save } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface AddBankDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBankDetailModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBankDetailModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchName, setBranchName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      // Reset form
      setEmployeeId("");
      setBankName("");
      setAccountNumber("");
      setBranchName("");
      setSwiftCode("");
      setError(null);
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      setFetchLoading(true);
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
    if (!employeeId || !bankName || !accountNumber || !branchName || !swiftCode) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      employee_id: employeeId,
      bank_name: bankName,
      account_number: accountNumber,
      branch_name: branchName,
      swift_code: swiftCode,
    };

    try {
      const response = await axiosInstance.post("/api/employee-bank-details", payload);

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to add bank details.");
      }
    } catch (err: any) {
      console.error("Failed to add bank details:", err);
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
            Add Bank Details
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

          <form id="add-bank-detail-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Bank of America"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Branch Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="e.g. Downtown NY"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                SWIFT Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 uppercase"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="e.g. BOFAUS3N"
              />
            </div>
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
            form="add-bank-detail-form"
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
                Save Details
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
