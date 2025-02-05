import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirTagResponse } from '../interfaces/airtag.interface';

@Injectable({
  providedIn: 'root'
})
export class AirTagsService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAirTags(): Observable<AirTagResponse> {
    return this.http.get<AirTagResponse>(`${this.apiUrl}/airtags`);
  }
}
