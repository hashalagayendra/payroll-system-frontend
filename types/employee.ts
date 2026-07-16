export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
}

export interface Department {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Designation {
  id: number;
  department_id: number;
  title: string;
  level: string;
}

export interface EmployeeBankDetail {
  id: number;
  employee_id: number;
  bank_name: string | null;
  account_number: string | null;
  masked_account_number?: string | null;
  branch_name: string | null;
  swift_code: string | null;
  employee?: Employee;
}

export interface SalaryStructure {
  id: number;
  designation_id: number;
  basic_salary: string | null;
  overtime_rate: string | null;
  allowance_default: string | null;
  created_at: string | null;
}

export interface EmployeeSalary {
  id: number;
  employee_id: number;
  salary_structure_id: number;
  basic_salary_override: string | null;
  effective_from: string | null;
  effective_to: string | null;
  created_at: string | null;
  salary_structure?: SalaryStructure;
}

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  type: string | null;
  file_url: string | null;
  created_at: string | null;
}

export interface Project {
  id: number;
  name: string | null;
  client_name: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  billing_type: string | null;
  created_at: string | null;
}

export interface ProjectAssignment {
  id: number;
  project_id: number;
  employee_id: number;
  role: string | null;
  project?: Project;
}

export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  join_date: string;
  employment_type: string;
  status: string;
  branch_id: number;
  department_id: number;
  designation_id: number;
  reporting_manager_id: number | null;
  created_at: string;
  updated_at: string;
  branch: Branch;
  department: Department;
  designation: Designation;
  reporting_manager: Employee | null;
  
  // Extra detailed fields loaded conditionally
  bank_detail?: EmployeeBankDetail;
  salary?: EmployeeSalary;
  documents?: EmployeeDocument[];
  project_assignments?: ProjectAssignment[];
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: any[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface EmployeeResponse {
  success: boolean;
  data: PaginatedData<Employee>;
}

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
  created_at: string;
  updated_at: string;
  employee?: Employee;
}
