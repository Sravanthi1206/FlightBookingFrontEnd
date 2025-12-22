import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserInfo } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: UserInfo | null;
  bookings: any[] = [];
  loadingBookings = false;
  bookingError = '';
  cancelling: Record<string, boolean> = {};
  message = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService
  ) {
    this.user = this.authService.getUserFromToken();
  }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    if (!this.user?.email) return;
    this.loadingBookings = true;
    this.bookingError = '';
    this.bookingService.getUserBookings(this.user.email).subscribe({
      next: (data: any[]) => {
        this.bookings = data || [];
        this.loadingBookings = false;
      },
      error: () => {
        this.bookingError = 'Failed to load bookings';
        this.loadingBookings = false;
      }
    });
  }

  cancelBooking(bookingId: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    this.cancelling[bookingId] = true;
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.message = 'Booking cancelled successfully';
        // remove the cancelled booking from list
        this.bookings = this.bookings.filter(b => b.id !== bookingId && b.bookingId !== bookingId);
        this.cancelling[bookingId] = false;
      },
      error: () => {
        this.message = 'Failed to cancel booking';
        this.cancelling[bookingId] = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
