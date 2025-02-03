export interface Task {
  task_id: number;
  task_name: string; 
  task_description: string; 
  assigned_admin_id: number; 
  task_status: 'Pending' | 'In Progress' | 'Completed'; 
  task_deadline: string | null;
  task_completion_date: string | null; 
  task_created: string; 
  task_modified: string;
  accepted_by?: number; 
  volunteer_status?: 'Pending' | 'Accepted' | 'Completed' | 'Rejected'; 
}
