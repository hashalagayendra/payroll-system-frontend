import React, { useState } from "react";
import { X, Loader2, AlertTriangle, Trash2 } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { EmployeeBankDetail } from "../../../../../types/employee";

interface ConfirmDeleteBankDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankDetail: EmployeeBankDetail;
}

export default function ConfirmDeleteBankDetailModal({
  isOpen,
  onClose,
  onSuccess,
  bankDetail,
}: ConfirmDeleteBankDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(`/api/employee-bank-details/${bankDetail.id}`);

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to delete bank details.");
      }
    } catch (err: any) {
      console.error("Failed to delete bank details:", err);
      setError(err.response?.data?.message || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Bank Details
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          
          <p className="text-slate-600 text-sm mb-2">
            Are you sure you want to delete the bank details for{" "}
            <span className="font-semibold text-slate-900">
              {bankDetail.employee?.first_name} {bankDetail.employee?.last_name}
            </span>
            ?
          </p>
          <p className="text-slate-500 text-xs">
            This action cannot be undone. You will need to re-add the details if they are needed again for payroll.
          </p>
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
            onClick={handleDelete}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
