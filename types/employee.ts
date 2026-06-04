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
}

export interface EmployeeResponse {
  success: boolean;
  data: Employee[];
}
