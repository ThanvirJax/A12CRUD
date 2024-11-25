import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-precautions',
  standalone: true,
  templateUrl: './precautions.component.html',
  styleUrls: ['./precautions.component.css'],
  imports: [FormsModule, NgFor]
})
export class PrecautionsComponent {
  searchQuery: string = '';
  precautions = [
    {
      title: 'Before the Disaster',
      color: '#010f5f',
      items: [
        'Prepare an emergency kit with essentials.',
        'Develop a family communication plan.',
        'Identify safe spots and evacuation routes.',
        'Secure important documents in a safe place.',
        'Stay informed with local alerts.',
        'Keep your vehicle fueled for emergency evacuations.',
      ],
    },
    {
      title: 'During the Disaster',
      color: '#3b4b92',
      items: [
        'Follow evacuation orders from authorities.',
        'Move to higher ground or designated shelters.',
        'Stay indoors, away from windows and glass.',
        'Listen to emergency broadcasts for updates.',
        'Check on family members and neighbors if safe.',
        'Avoid driving or walking through floodwaters.',
      ],
    },
    {
      title: 'After the Disaster',
      color: '#454852',
      items: [
        'Check for injuries and provide first aid if needed.',
        'Stay away from downed power lines and floodwater.',
        'Inspect your home for structural damage carefully.',
        'Contact family to let them know you\'re safe.',
        'Follow local alerts about safe water and food.',
        'Take photos of damage for insurance claims.',
      ],
    },
  ];

  get filteredPrecautions() {
    if (!this.searchQuery) return this.precautions;
    const query = this.searchQuery.toLowerCase();
    return this.precautions.map(precaution => ({
      ...precaution,
      items: precaution.items.filter(item => item.toLowerCase().includes(query)),
    })).filter(precaution => precaution.items.length > 0);
  }
}
