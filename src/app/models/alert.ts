export interface Alert {
  alert_id: number;
  alert_message: string;
  alert_description: string;
  alert_type: 'info' | 'warning' | 'success' | 'error';
  alert_created: string;
  alert_modified: string;
}
