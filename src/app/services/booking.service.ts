import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Passenger {
  name: string;
  email: string;
  phoneNumber: string;
  passport: string;
  age: number;
}

export interface BookingRequest {
  flightId: string;
  userEmail: string;
  seats: number;
  passengers?: Passenger[];
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private baseUrl = 'http://localhost:8080/api/bookings';
  constructor(private http: HttpClient) {}
  
  createBooking(data: BookingRequest) {
    return this.http.post(this.baseUrl, data);
  }

  getUserBookings(userEmail: string) {
    // returns an array of bookings for the given user (backend expects 'email' query param)
    return this.http.get<any[]>(`${this.baseUrl}?email=${encodeURIComponent(userEmail)}`);
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
