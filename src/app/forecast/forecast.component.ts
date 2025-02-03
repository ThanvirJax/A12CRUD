import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../crud/services/weather.service';
import { WeatherForecast } from '../models/weather';

@Component({
  selector: 'app-forecast',
  standalone: true,
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  imports: [CommonModule],
})
export class ForecastComponent implements OnInit {
  weatherData: WeatherForecast | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  latitude: number = -20.348404;
  longitude: number = 57.552152;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeatherForecast();
  }

  getWeatherForecast(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.weatherService.getWeatherForecast(this.latitude, this.longitude).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to fetch weather data. Please try again later.';
        console.error('Error:', error);
        this.isLoading = false;
      },
    });
  }
}
