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

  getUserBookings(userEmail: string) {
    // returns an array of bookings for the given user
    return this.http.get<any[]>(`${this.baseUrl}?userEmail=${encodeURIComponent(userEmail)}`);
  }

  getAllBookings() {
    // returns all bookings (admin view)
    return this.http.get<any[]>(this.baseUrl);
  }

  cancelBooking(bookingId: string) {
    // cancels a booking by id using POST /{id}/cancel
    // backend expects POST to /api/bookings/{id}/cancel with an empty JSON body
    return this.http.post(`${this.baseUrl}/${bookingId}/cancel`, {});
  }
}
