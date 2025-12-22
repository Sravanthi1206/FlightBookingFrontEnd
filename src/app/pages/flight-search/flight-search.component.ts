import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {
  from = '';
  to = '';
  date: string | null = null; // yyyy-MM-dd
  flights: any[] = [];
  loading = false;
  error: string | null = null;
  minDate: string = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  isLoggedIn = false;
  
  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  
  search() {
    if (!this.from || !this.to) {
      this.error = 'Please enter both From and To';
      return;
    }
    
    // Client-side validation: prevent searching for past dates
    if (this.date) {
      const selectedDate = new Date(this.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        this.error = 'Cannot search for flights on past dates';
        return;
      }
    }
    
    this.loading = true;
    this.error = null;
    this.flightService.searchFlights(this.from, this.to, this.date || undefined).subscribe({
      next: (data) => {
        this.flights = data;
        if (data.length === 0) {
          this.error = 'No flights available for the selected route and date.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err.error?.message || 'Failed to fetch flights. Cannot search for past dates.';
        this.loading = false;
      }
    });
  }
  
  bookFlight(flightId: string) {
    if (!this.isLoggedIn) {
      alert('Please login to book a flight');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/book', flightId]);
  }

  isPast(flight: any): boolean {
    if (!flight || !flight.departureTime) return false;
    return new Date(flight.departureTime).getTime() <= Date.now();
  }
}