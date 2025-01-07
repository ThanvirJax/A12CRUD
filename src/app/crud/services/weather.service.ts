import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '6b83f5758fc22c752927398dfc65c775';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getWeatherForecast(lat: number, lon: number): Observable<WeatherForecast> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get<WeatherForecast>(url);
  }
}
