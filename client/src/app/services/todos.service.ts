import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment.prod';
import { environment } from '../../environments/environment';
import { AirTagResponse } from '../interfaces/airtag.interface';

@Injectable({
  providedIn: 'root'
})
export class AirTagsService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getAirTags(): Observable<AirTagResponse> {
    return this.http.get<AirTagResponse>(`${this.apiUrl}/airtags`);
  }
}
