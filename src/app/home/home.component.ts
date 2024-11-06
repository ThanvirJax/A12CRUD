import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
}
