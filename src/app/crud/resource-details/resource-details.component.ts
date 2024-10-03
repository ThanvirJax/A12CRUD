import { Component, OnInit } from '@angular/core';
import { CRUDService } from "../services/crud.service";
import { ActivatedRoute } from "@angular/router";
import { Resource } from '../../models/resource';  
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './resource-details.component.html',
  styleUrls: ['./resource-details.component.css']
})

export class ResourceDetailsComponent implements OnInit {
  resourceDetails: Resource | undefined; 

  constructor(private crudService: CRUDService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const resourceId = this.activatedRoute.snapshot.params['resourceId'];
    if (resourceId) {
      this.loadResourceDetails(resourceId);
    }
  }

  loadResourceDetails(resourceId: string) {
    this.crudService.loadResourceInfo(resourceId).subscribe(
      (res: Resource) => {
        this.resourceDetails = res;
      },
      (error) => {
        console.error('Failed to load resource details:', error);
      }
    );
  }
}
