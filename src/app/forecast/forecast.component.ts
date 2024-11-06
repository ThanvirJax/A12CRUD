import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forecast',
  standalone: true,
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
  imports: [NgIf]
})
export class ForecastComponent implements OnInit {

  weatherdata: any;

  constructor() { }

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    // Static data for Mauritius. Replace this with actual API data if needed.
    let data = JSON.parse(`{
      "coord": {"lon": 57.5522, "lat": -20.3484},
      "weather": [{"id": 800, "main": "Clear", "description": "clear sky", "icon": "01d"}],
      "main": {"temp": 298.15, "feels_like": 301.15, "temp_min": 297.15, "temp_max": 299.15, "pressure": 1015, "humidity": 70},
      "visibility": 10000,
      "wind": {"speed": 5.1, "deg": 90},
      "clouds": {"all": 0},
      "dt": 1668936738,
      "sys": {"type": 1, "id": 2061, "country": "MU", "sunrise": 1668914300, "sunset": 1668959115},
      "timezone": 14400,
      "id": 934154,
      "name": "Mauritius",
      "cod": 200
    }`);
    this.setWeather(data);
  }

  setWeather(data: any) {
    this.weatherdata = data;
    const sunsetTime = new Date(this.weatherdata.sys.sunset * 1000);
    this.weatherdata.sunsetTime = sunsetTime.toLocaleTimeString();
    const currentdate = new Date();
    this.weatherdata.isDay = (currentdate.getTime() < sunsetTime.getTime());

    // Convert temperatures to Celsius
    this.weatherdata.temp_celcius = (this.weatherdata.main.temp - 273.15).toFixed(0);
    this.weatherdata.temp_min = (this.weatherdata.main.temp_min - 273.15).toFixed(0);
    this.weatherdata.temp_max = (this.weatherdata.main.temp_max - 273.15).toFixed(0);
    this.weatherdata.feels_like = (this.weatherdata.main.feels_like - 273.15).toFixed(0);
  }
}
