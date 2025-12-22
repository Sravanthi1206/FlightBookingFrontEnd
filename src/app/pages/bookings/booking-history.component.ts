import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-booking-history',
  imports: [CommonModule],
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  error = '';
  cancelling: Record<string, boolean> = {};
  message = '';

  constructor(private bookingService: BookingService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.error = '';

    if (!this.auth.isLoggedIn()) {
      // if not logged in, redirect to login
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    const user = this.auth.getUserFromToken();
    if (!user || !user.email) {
      this.loading = false;
      this.error = 'No user information available';
      return;
    }

    this.bookingService.getUserBookings(user.email).subscribe({
      next: (data: any[]) => {
        this.bookings = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  cancelBooking(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.cancelling[bookingId] = true;
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.message = 'Booking cancelled successfully';
        this.bookings = this.bookings.filter(b => b.id !== bookingId && b.bookingId !== bookingId);
        this.cancelling[bookingId] = false;
      },
      error: () => {
        this.message = 'Failed to cancel booking';
        this.cancelling[bookingId] = false;
      }
    });
  }
}
