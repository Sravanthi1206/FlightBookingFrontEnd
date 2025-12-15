import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private baseUrl = 'http://localhost:18080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}?from=${from}&to=${to}`
    );
  }
}
