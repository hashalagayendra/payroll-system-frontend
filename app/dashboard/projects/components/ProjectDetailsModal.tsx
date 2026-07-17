import React, { useState } from 'react';
import { X, Building, DollarSign, Users } from 'lucide-react';
import axiosInstance from '@/lib/axios';

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
  isEditingDetails,
  setIsEditingDetails,
  onSaveProject,
  onDeleteProject,
  onUpdateProjectLocally,
  availableEmployees
}: any) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [assignRole, setAssignRole] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen || !project) return null;

  const handleAssignMember = async () => {
    if (!selectedEmployeeId) return;
    try {
      setIsAssigning(true);
      const response = await axiosInstance.post('/api/project-assignments', {
        project_id: project.id,
        employee_id: selectedEmployeeId,
        role: assignRole
      });

      if (response.data.success) {
        // Optimistically update the project
        const newAssignment = response.data.data;
        const updatedProject = {
          ...project,
          assignments: [...(project.assignments || []), newAssignment]
        };
        onUpdateProjectLocally(updatedProject);
        setSelectedEmployeeId('');
        setAssignRole('');
      }
    } catch (error: any) {
      console.error("Failed to assign member:", error);
      alert(error.response?.data?.message || "Failed to assign team member.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveMember = async (assignmentId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/project-assignments/${assignmentId}`);
      if (response.data.success) {
        const updatedProject = {
          ...project,
          assignments: (project.assignments || []).filter((a: any) => a.id !== assignmentId)
        };
        onUpdateProjectLocally(updatedProject);
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove team member.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditingDetails ? 'Edit Project Details' : 'Project Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isEditingDetails ? (
            <form id="edit-project-form" className="p-6 space-y-6" onSubmit={onSaveProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                  <input name="name" type="text" defaultValue={project.name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input name="client_name" type="text" defaultValue={project.client_name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input name="start_date" type="date" defaultValue={project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : ''} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input name="end_date" type="date" defaultValue={project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" defaultValue={project.status || 'ACTIVE'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Type</label>
                  <select name="billing_type" defaultValue={project.billing_type || 'HOURLY'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="HOURLY">HOURLY</option>
                    <option value="FIXED">FIXED</option>
                  </select>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-8">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-slate-800">{project.name}</h3>
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                      project.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : project.status === "ON_HOLD"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center text-slate-600 font-medium">
                  <Building className="h-4 w-4 mr-2 text-slate-400" />
                  {project.client_name || 'No Client'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Duration</p>
                  <p className="text-sm font-medium text-slate-800">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'} <br/>
                    <span className="text-slate-400">to</span> <br/>
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Billing Type</p>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 text-slate-400 mr-1" />
                    <p className="text-sm font-bold text-slate-800 capitalize">{project.billing_type?.toLowerCase() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    Team Members ({(project.assignments || []).length})
                  </h4>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 border-dashed">
                  <h5 className="text-xs font-semibold text-slate-700 mb-3">Assign New Member</h5>
                  <div className="flex gap-2">
                    <select 
                      className="block w-full rounded-lg border border-slate-200 py-2 pl-3 pr-8 text-slate-700 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm"
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                    >
                      <option value="">Select Employee...</option>
                      {availableEmployees.map((emp: any) => (
                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.designation?.name || emp.role || 'Employee'})</option>
                      ))}
                    </select>
                    <button 
                      onClick={handleAssignMember}
                      disabled={isAssigning || !selectedEmployeeId}
                      className="flex-shrink-0 bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isAssigning ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                  <div className="mt-2">
                    <input 
                      type="text" 
                      placeholder="Specify role (optional)" 
                      className="block w-full rounded-lg border border-slate-200 py-2 px-3 text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm" 
                      value={assignRole}
                      onChange={(e) => setAssignRole(e.target.value)}
                    />
                  </div>
                </div>

                <ul className="divide-y divide-slate-100">
                  {(project.assignments || []).map((assignment: any) => (
                    <li key={assignment.id} className="py-3 flex justify-between items-center group">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-bold shadow-sm ring-2 ring-white">
                          {assignment.employee.first_name.charAt(0)}{assignment.employee.last_name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-slate-800">{assignment.employee.first_name} {assignment.employee.last_name}</p>
                          <p className="text-xs text-slate-500">{assignment.role || 'Member'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveMember(assignment.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
                        title="Remove member"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                  {(project.assignments || []).length === 0 && (
                    <li className="py-4 text-center text-sm text-slate-500 italic bg-slate-50 rounded-lg">
                      No team members assigned yet.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          {isEditingDetails ? (
            <>
              <button 
                onClick={() => setIsEditingDetails(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="edit-project-form"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditingDetails(true)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
              >
                Edit Project
              </button>
              <button 
                onClick={(e) => onDeleteProject(project, e)}
                className="flex-1 bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
