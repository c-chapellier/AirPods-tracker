import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment.prod';
import { environment } from '../../environments/environment';
import { Location } from '../interfaces/location.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }
}
