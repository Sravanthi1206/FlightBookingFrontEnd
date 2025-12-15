import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {

  from = '';
  to = '';
  flights: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private flightService: FlightService) {}

  search() {
    if (!this.from || !this.to) {
      this.error = 'Please enter both From and To';
      return;
    }

    this.loading = true;
    this.error = null;

    this.flightService.searchFlights(this.from, this.to).subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch flights';
        this.loading = false;
      }
    });
  }
}
