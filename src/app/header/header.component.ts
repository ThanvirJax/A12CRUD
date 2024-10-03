import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDService } from '../crud/services/crud.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink, HttpClientModule, FormsModule, ReactiveFormsModule], 
  providers: [CRUDService], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}

