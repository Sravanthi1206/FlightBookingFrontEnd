import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  flightId!: string;
  userEmail = '';
  seats = 1;
  loading = false;
  success = '';
  error = '';
  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.flightId = this.route.snapshot.paramMap.get('flightId')!;
  }
  submitBooking() {
    this.loading = true;
    this.error = '';
    this.bookingService.createBooking({
      flightId: this.flightId,
      userEmail: this.userEmail,
      seats: this.seats
    }).subscribe({
      next: () => {
        this.success = 'Booking successful!';
        this.loading = false;
      },
      error: () => {
        this.error = 'Booking failed';
        this.loading = false;
      }
    });
  }
}
