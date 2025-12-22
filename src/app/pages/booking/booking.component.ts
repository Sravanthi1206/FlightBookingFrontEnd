import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { FlightService } from '../../services/flight.service';
import { CommonModule } from '@angular/common';

interface Passenger {
  name: string;
  email: string;
  phoneNumber: string;
  passport: string;
  age: number;
}

@Component({
  standalone: true,
  selector: 'app-booking',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  flightId!: string;
  flight: any = null;
  isPastFlight = false;
  userEmail = '';
  seats = 1;
  passengers: Passenger[] = [];
  loading = false;
  success = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private flightService: FlightService,
    private router: Router
  ) {
    this.flightId = this.route.snapshot.paramMap.get('flightId')!;
    // fetch flight details
    this.flightService.getFlight(this.flightId).subscribe({
      next: (f) => {
        this.flight = f;
        this.isPastFlight = f && f.departureTime && new Date(f.departureTime).getTime() <= Date.now();
        if (this.isPastFlight) this.error = 'Cannot book past flight';
      },
      error: () => {
        this.error = 'Failed to load flight details';
      }
    });
    
    // Initialize with one passenger
    this.addPassenger();
  }

  addPassenger() {
    if (this.passengers.length < this.seats) {
      this.passengers.push({
        name: '',
        email: '',
        phoneNumber: '',
        passport: '',
        age: 0
      });
    }
  }

  removePassenger(index: number) {
    this.passengers.splice(index, 1);
  }

  onSeatsChange() {
    // Add or remove passengers to match seat count
    if (this.passengers.length < this.seats) {
      for (let i = this.passengers.length; i < this.seats; i++) {
        this.addPassenger();
      }
    } else if (this.passengers.length > this.seats) {
      this.passengers.splice(this.seats);
    }
  }

  submitBooking() {
    if (this.isPastFlight) {
      this.error = 'Cannot book past flight';
      return;
    }

    // Validate all passengers are filled
    for (let i = 0; i < this.passengers.length; i++) {
      const p = this.passengers[i];
      if (!p.name || !p.email || !p.phoneNumber || !p.passport || p.age <= 0) {
        this.error = `Passenger ${i + 1} details are incomplete`;
        return;
      }
    }

    this.loading = true;
    this.error = '';
    this.bookingService.createBooking({
      flightId: this.flightId,
      userEmail: this.userEmail,
      seats: this.seats,
      passengers: this.passengers
    }).subscribe({
      next: () => {
        this.success = 'Booking successful!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/bookings']);
        }, 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Booking failed';
        this.loading = false;
      }
    });
  }
}
