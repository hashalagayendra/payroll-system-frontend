"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Filter, Edit2, Trash2, Eye, Building, Calendar, DollarSign, Users, X, AlertCircle, Loader2
} from 'lucide-react';
import axiosInstance from '@/lib/axios';
import ProjectDetailsModal from './components/ProjectDetailsModal';

// --- Types ---
type Status = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';
type BillingType = 'HOURLY' | 'FIXED';

interface DBEmployee {
  id: number;
  first_name: string;
  last_name: string;
}

interface ProjectAssignment {
  id: number;
  role: string | null;
  employee: DBEmployee;
}

interface Project {
  id: number;
  name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  status: Status;
  billing_type: BillingType;
  assignments: ProjectAssignment[];
}

// --- Mock Data for Available Employees (for assigning) ---
// Removed hardcoded employees

export default function ProjectsPage() {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All Statuses'>('All Statuses');
  const [billingFilter, setBillingFilter] = useState<BillingType | 'All Types'>('All Types');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Side Panel state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  
  // Delete Confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Employees for assignment dropdown
  const [availableEmployees, setAvailableEmployees] = useState<any[]>([]);

  // Fetch projects and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (statusFilter !== 'All Statuses') params.append('status', statusFilter);
        if (billingFilter !== 'All Types') params.append('billing_type', billingFilter);
        
        const [projectsResponse, employeesResponse] = await Promise.all([
          axiosInstance.get(`/api/projects?${params.toString()}`),
          axiosInstance.get('/api/employees/all')
        ]);

        if (projectsResponse.data.success) {
          setProjects(projectsResponse.data.data);
        }
        if (employeesResponse.data.success) {
          // Since it's not paginated, the array is directly in employeesResponse.data.data
          setAvailableEmployees(employeesResponse.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [statusFilter, billingFilter]);

  // Derived state (Filtering)
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      return searchQuery === "" || 
             p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (p.client_name && p.client_name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  }, [projects, searchQuery]);

  const totalEntries = filteredProjects.length;
  const totalPages = Math.ceil(totalEntries / perPage) || 1;

  // Handlers
  const handleOpenCreateModal = () => {
    setModalMode('CREATE');
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProject(project);
    setIsEditingDetails(true);
    setIsPanelOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      client_name: formData.get('client_name'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date') || null,
      status: formData.get('status'),
      billing_type: formData.get('billing_type'),
    };

    try {
      if (modalMode === 'CREATE' && isModalOpen) {
        const response = await axiosInstance.post('/api/projects', payload);
        if (response.data.success) {
          // Add the new project to state locally or refetch
          setProjects(prev => [...prev, response.data.data]);
          setIsModalOpen(false);
        }
      } else if (isEditingDetails && selectedProject) {
        const response = await axiosInstance.put(`/api/projects/${selectedProject.id}`, payload);
        if (response.data.success) {
          // Update the project in local state
          const updatedProject = response.data.data;
          setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
          setSelectedProject(updatedProject);
          setIsEditingDetails(false);
        }
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project. Please check your inputs.");
    }
  };

  const handleDeleteClick = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      // Typically you'd call axios.delete here, but updating local state for now
      setProjects(projects.filter(p => p.id !== projectToDelete.id));
      setIsDeleteModalOpen(false);
      if (selectedProject?.id === projectToDelete.id) {
        setIsPanelOpen(false);
      }
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsEditingDetails(false);
    setIsPanelOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-h-[calc(100vh-6rem)]">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your client projects, assign teams, and track progress.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by project name or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All Statuses')}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ON_HOLD">ON_HOLD</option>
          </select>
          <select
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none cursor-pointer"
            value={billingFilter}
            onChange={(e) => setBillingFilter(e.target.value as BillingType | 'All Types')}
          >
            <option value="All Types">All Types</option>
            <option value="HOURLY">HOURLY</option>
            <option value="FIXED">FIXED</option>
          </select>
          <button
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All Statuses");
              setBillingFilter("All Types");
            }}
            title="Clear filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid Section */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
          <p className="mt-1 text-slate-500">No projects match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => handleProjectClick(project)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-200 cursor-pointer group relative flex flex-col"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                <div className="pr-2">
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{project.name}</h3>
                  <div className="flex items-center mt-1.5 text-xs text-slate-500 font-medium">
                    <Building className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {project.client_name || 'No Client'}
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    project.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                      : project.status === "ON_HOLD"
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                        : "bg-blue-50 text-blue-700 border border-blue-200/50"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Timeline</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{project.start_date ? new Date(project.start_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'} - {project.end_date ? new Date(project.end_date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'TBD'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-slate-50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Billing</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5 capitalize">{project.billing_type?.toLowerCase() || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Team Initials */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 overflow-hidden mr-3">
                      {(project.assignments || []).slice(0, 3).map((assignment) => (
                        <div
                          key={assignment.id}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 ring-2 ring-white text-[10px] font-bold text-blue-700"
                          title={`${assignment.employee.first_name} ${assignment.employee.last_name}`}
                        >
                          {assignment.employee.first_name.charAt(0)}{assignment.employee.last_name.charAt(0)}
                        </div>
                      ))}
                      {(project.assignments || []).length > 3 && (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-600">
                          +{(project.assignments || []).length - 3}
                        </div>
                      )}
                      {(project.assignments || []).length === 0 && (
                        <div className="h-7 w-7 rounded-full bg-slate-50 ring-2 ring-white flex items-center justify-center border border-dashed border-slate-300">
                          <Users className="h-3 w-3 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {(project.assignments || []).length === 0 ? 'Unassigned' : `${(project.assignments || []).length} Members`}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-lg shadow-sm border border-slate-200 p-1 flex gap-1 translate-x-2 group-hover:translate-x-0 duration-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectClick(project);
                  }}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="View Project"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => handleOpenEditModal(project, e)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit Project"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={(e) => handleDeleteClick(project, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Project Details Modal --- */}
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        isEditingDetails={isEditingDetails}
        setIsEditingDetails={setIsEditingDetails}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteClick}
        availableEmployees={availableEmployees}
        onUpdateProjectLocally={(updatedProject: Project) => {
          setSelectedProject(updatedProject);
          setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        }}
      />

      {/* --- Create / Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {modalMode === 'CREATE' ? 'Add New Project' : 'Edit Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="p-6" onSubmit={handleSaveProject}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                  <input name="name" type="text" defaultValue={editingProject?.name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. Website Redesign" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                  <input name="client_name" type="text" defaultValue={editingProject?.client_name} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input name="start_date" type="date" defaultValue={editingProject?.start_date} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input name="end_date" type="date" defaultValue={editingProject?.end_date} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select name="status" defaultValue={editingProject?.status || 'ACTIVE'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Billing Type</label>
                  <select name="billing_type" defaultValue={editingProject?.billing_type || 'HOURLY'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="HOURLY">HOURLY</option>
                    <option value="FIXED">FIXED</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
                  {modalMode === 'CREATE' ? 'Add Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Project</h3>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{projectToDelete?.name}</span>? 
              This will permanently remove the project and all assignments.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
