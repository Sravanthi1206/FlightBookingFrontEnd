import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'http://localhost:18080/api/bookings';
  constructor(private http: HttpClient) {}
  createBooking(data: {
    flightId: string;
    userEmail: string;
    seats: number;
  }) {
    return this.http.post(this.baseUrl, data);
  }
}
