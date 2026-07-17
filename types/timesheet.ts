export interface Timesheet {
  id: number;
  employee_id: number;
  project_id: number;
  task_description: string;
  work_date: string;
  hours_worked: number;
  billable: boolean;
  employee?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface TimesheetResponse {
  success: boolean;
  data: Timesheet[];
}
