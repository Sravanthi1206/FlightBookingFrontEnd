import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private baseUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(from: string, to: string, date?: string): Observable<any[]> {
    const dateParam = date ? `&date=${encodeURIComponent(date)}` : '';
    return this.http.get<any[]>(
      `${this.baseUrl}?from=${from}&to=${to}${dateParam}`
    );
  }

  getFlight(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addFlight(flightId: string, flight: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${flightId}/inventory`, flight);
  }
}
