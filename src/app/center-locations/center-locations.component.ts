import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import L from 'leaflet';

@Component({
  selector: 'app-center-locations',
  standalone: true,
  templateUrl: './center-locations.component.html',
  styleUrls: ['./center-locations.component.css'],
  imports: [NgFor]
})
export class CenterLocationsComponent implements OnInit {

  private map!: L.Map;
  private centroid: L.LatLngExpression = [-20.2484, 57.5522]; // Coordinates for Mauritius

  // Coordinates for social welfare centers in Mauritius
  public socialCenters: { name: string, city: string, street: string, coords: L.LatLngExpression }[] = [
    { name: 'Vacoas Social Welfare Center', city: 'Vacoas', street: 'Avenue des Savanes', coords: [-20.2986, 57.4789] },
    { name: 'Curepipe Social Welfare Center', city: 'Curepipe', street: 'Rue de la Réserve', coords: [-20.3167, 57.5260] },
    { name: 'Port Louis Social Welfare Center', city: 'Port Louis', street: 'Rue du Gouvernement', coords: [-20.1669, 57.5033] },
    { name: 'Mahebourg Social Welfare Center', city: 'Mahebourg', street: 'Rue du Vieux Moulin', coords: [-20.4081, 57.7014] },
    { name: 'Flacq Social Welfare Center', city: 'Flacq', street: 'Rue des Acacias', coords: [-20.1895, 57.7146] },
    { name: 'Rose Hill Social Welfare Center', city: 'Rose Hill', street: 'Avenue de l\'Indépendance', coords: [-20.2344, 57.4667] },
    { name: 'Beau Bassin Social Welfare Center', city: 'Beau Bassin', street: 'Avenue du 2 Février', coords: [-20.2191, 57.4663] },
    { name: 'Quatre Bornes Social Welfare Center', city: 'Quatre Bornes', street: 'Avenue des Lauriers', coords: [-20.2635, 57.4791] },
    { name: 'Goodlands Social Welfare Center', city: 'Goodlands', street: 'Avenue des Écoles', coords: [-20.0352, 57.6437] },
    { name: 'Triolet Social Welfare Center', city: 'Triolet', street: 'Avenue de l\'École', coords: [-20.0588, 57.5451] },
    { name: 'Moka Social Welfare Center', city: 'Moka', street: 'Rue de l\'Église', coords: [-20.2273, 57.5501] },
    { name: 'Riviere du Rempart Social Welfare Center', city: 'Riviere du Rempart', street: 'Avenue des Manguiers', coords: [-20.1039, 57.6842] },
    { name: 'Pamplemousses Social Welfare Center', city: 'Pamplemousses', street: 'Rue des Hibiscus', coords: [-20.1048, 57.5704] },
    { name: 'Grand Baie Social Welfare Center', city: 'Grand Baie', street: 'Coastal Road', coords: [-20.0146, 57.5809] },
    { name: 'Flic en Flac Social Welfare Center', city: 'Flic en Flac', street: 'Avenue du Débarcadère', coords: [-20.2749, 57.3733] },
    { name: 'Bel Air Social Welfare Center', city: 'Bel Air', street: 'Rue du 12 Janvier', coords: [-20.2578, 57.7383] },
    { name: 'Phoenix Social Welfare Center', city: 'Phoenix', street: 'Avenue Sir Ramah', coords: [-20.2757, 57.4922] },
    { name: 'Chemin Grenier Social Welfare Center', city: 'Chemin Grenier', street: 'Rue des Plaines', coords: [-20.4824, 57.4741] },
    { name: 'Ebène Social Welfare Center', city: 'Ebène', street: 'Avenue des Cèdres', coords: [-20.2411, 57.4875] },
    { name: 'Terre Rouge Social Welfare Center', city: 'Terre Rouge', street: 'Avenue des Baies', coords: [-20.1294, 57.5171] },
    { name: 'Montagne Blanche Social Welfare Center', city: 'Montagne Blanche', street: 'Avenue de l\'École', coords: [-20.2844, 57.6286] },
    { name: 'Plaine Magnien Social Welfare Center', city: 'Plaine Magnien', street: 'Avenue des Palmiers', coords: [-20.4267, 57.6833] },
    { name: 'Bambous Social Welfare Center', city: 'Bambous', street: 'Avenue des Fleurs', coords: [-20.2636, 57.4069] },
    { name: 'Le Morne Social Welfare Center', city: 'Le Morne', street: 'Avenue du Morne', coords: [-20.4584, 57.3195] },
    { name: 'Souillac Social Welfare Center', city: 'Souillac', street: 'Avenue des Goyaviers', coords: [-20.5189, 57.5195] },
    { name: 'Poste de Flacq Social Welfare Center', city: 'Poste de Flacq', street: 'Avenue de l\'Eglise', coords: [-20.1547, 57.7324] },
    { name: 'Petite Rivière Social Welfare Center', city: 'Petite Rivière', street: 'Avenue des Alizés', coords: [-20.2197, 57.4532] },
    { name: 'Tamarin Social Welfare Center', city: 'Tamarin', street: 'Avenue des Pêcheurs', coords: [-20.3254, 57.3692] },
    { name: 'Calebasses Social Welfare Center', city: 'Calebasses', street: 'Avenue de la Paix', coords: [-20.1192, 57.5652] },
    { name: 'Grand Gaube Social Welfare Center', city: 'Grand Gaube', street: 'Avenue des Bananes', coords: [-20.0066, 57.6632] },
    { name: 'L\'Escalier Social Welfare Center', city: 'L\'Escalier', street: 'Avenue de l\'Église', coords: [-20.4569, 57.6077] },
    { name: 'Surinam Social Welfare Center', city: 'Surinam', street: 'Avenue des Vents', coords: [-20.5082, 57.5257] },
    { name: 'Piton Social Welfare Center', city: 'Piton', street: 'Avenue de la Montagne', coords: [-20.0903, 57.6183] },
    { name: 'Pailles Social Welfare Center', city: 'Pailles', street: 'Avenue des Fleurs', coords: [-20.1963, 57.4826] }
  ];

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 5
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // Add markers for each social welfare center
    this.socialCenters.forEach(center => {
      L.marker(center.coords)
        .bindPopup(center.name)
        .addTo(this.map);
    });

    tiles.addTo(this.map);
  }

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }
}
