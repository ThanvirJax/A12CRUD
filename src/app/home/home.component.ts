import { Component } from '@angular/core';
import L from 'leaflet';
import { CRUDService } from '../crud/services/crud.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  alert: any = {}; 
  private map!: L.Map;
  private centroid: L.LatLngExpression = [-20.2484, 57.5522]; // Coordinates for Mauritius

  // Flood-prone areas with additional information (name, street, and high-risk status)
  private floodProneAreas: { coords: L.LatLngExpression, radius: number, name: string, street: string, isHighRisk?: boolean }[] = [
    { coords: [-20.3484, 57.5522], radius: 2000, name: 'Central Flood Area', street: 'Main Avenue' },
    { coords: [-20.4081, 57.7014], radius: 1500, name: 'Mahebourg Flood Area', street: 'Rue du Vieux Moulin' },
    { coords: [-20.3167, 57.5260], radius: 1000, name: 'Curepipe Flood Area', street: 'Rue de la Réserve' },
    { coords: [-20.1669, 57.5033], radius: 2500, name: 'Port Louis High-Risk Zone', street: 'Rue du Gouvernement', isHighRisk: true },
    { coords: [-20.2117, 57.3938], radius: 1500, name: 'Albion Flood Area', street: 'Main Road', isHighRisk: true },
    { coords: [-20.2044, 57.4500], radius: 1000, name: 'Petite-Rivière Flood Area', street: 'Rural Road', isHighRisk: true },
    { coords: [-20.4417, 57.5023], radius: 1200, name: 'Souillac Flood Area', street: 'Batelage Road', isHighRisk: true },
    { coords: [-20.4913, 57.4905], radius: 1200, name: 'Chemin-Grenier Flood Area', street: 'Village Road', isHighRisk: true },
    { coords: [-20.2636, 57.4791], radius: 1000, name: 'Quatre-Bornes Flood Area', street: 'St-Jean Road' }
  ];

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 0
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    //  circles for each flood-prone area   
    this.floodProneAreas.forEach(area => {
      L.circle(area.coords, {
        color: area.isHighRisk ? 'darkred' : 'red', // Dark red for high-risk zone
        fillColor: area.isHighRisk ? 'rgba(139, 0, 0, 0.5)' : 'rgba(255, 0, 0, 0.3)', 
        fillOpacity: 0.4,
        radius: area.radius
      })
      .addTo(this.map)
      .bindPopup(`<b>${area.name}</b><br>Street: ${area.street}${area.isHighRisk ? '<br><i>High-Risk Zone</i>' : ''}`);
    });

    tiles.addTo(this.map);
  }

  constructor(
    private crudService: CRUDService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.getLatestAlert();
  }
  getLatestAlert(): void {
    this.crudService.getAlerts().subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.alert = data[0]; 
        } else {
          console.log('No alerts available');
        }
      },
      (error) => {
        console.error('Error fetching alerts:', error);
      }
    );
  }

  navigateToRequestForm(): void {
    const userRole = this.authService.getRole();
    const centerName = this.authService.getUser()?.center_name;

    if (userRole === 'user') {
      this.router.navigate(['/crud/request-resource']);
    } else if (centerName) {
      this.router.navigate(['/crud/c-request-form']);
    } else {
      Swal.fire('Error', 'Please log in to access this feature.', 'error');
    }
  }
  navigateToDonationForm(): void {
    const userRole = this.authService.getRole();
    const centerName = this.authService.getUser()?.center_name;

    if (userRole === 'user') {
      this.router.navigate(['/crud/donation-form']);
    } else if (centerName) {
      this.router.navigate(['/crud/c-donation-form']);
    } else {
      Swal.fire('Error', 'Please log in to access this feature.', 'error');
    }
  }
  
}
  