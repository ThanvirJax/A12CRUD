import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

interface Contact {
  name: string;
  phone: string;
  email?: string; // optional
  website?: string; // optional
}

@Component({
  selector: 'app-emergency-contacts',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './emergency-contacts.component.html',
  styleUrl: './emergency-contacts.component.css'
})
export class EmergencyContactsComponent {
  emergencyContacts: Contact[] = [
    { name: 'Police', phone: '999' },
    { name: 'Fire Services', phone: '115' },
    { name: 'Ambulance', phone: '114' },
    { 
      name: 'National Disaster Risk Reduction and Management Centre', 
      phone: '8924', 
      email: 'ndrrmc@govmu.org' 
    },
    { 
      name: 'Mauritius Red Cross Society', 
      phone: '+230 454 3348', 
      website: 'https://www.redcross.int/' 
    },
    { 
      name: 'Central Water Authority (CWA) - Emergency Hotline', 
      phone: '170' 
    },
    { 
      name: 'Central Electricity Board (CEB) - Emergency Hotline', 
      phone: '130', 
      website: 'https://ceb.mu/' 
    },
    { 
      name: 'Mauritius Meteorological Services', 
      phone: '+230 686 1031', 
      website: 'http://metservice.intnet.mu' 
    },
  ];
}
