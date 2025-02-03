export interface Donation {
  resources: any;
  donation_id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  center_name: string;
  donation_quantity: number;
  resource_name: string;
  donation_date: any;
  resource_description: string;
  resource_quantity: number;  
  resource_type: string;
  resource_expiry_date: string | Date; 

}
