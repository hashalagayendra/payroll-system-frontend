import React, { useState, useEffect } from "react";
import { X, Upload, Loader2, AlertCircle, File } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadDocumentModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [documentType, setDocumentType] = useState("NIC");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
      // Reset form
      setEmployeeId("");
      setDocumentType("NIC");
      setFile(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setError("Please select an employee.");
      return;
    }
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("employee_id", employeeId);
    formData.append("type", documentType);
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/api/employee-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || "Failed to upload document.");
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
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
            Upload Document
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

          <form id="upload-doc-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                Employee <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option value="NIC">NIC</option>
                <option value="Passport">Passport</option>
                <option value="Contract">Contract</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1">
                File <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-slate-50 relative group">
                <div className="space-y-1 text-center">
                  <File className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex text-sm text-slate-800 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-transparent rounded-md font-semibold text-indigo-700 hover:text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              {file && (
                <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
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
            form="upload-doc-form"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
