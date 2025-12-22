import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

interface Flight {
  id: string;
  fromPlace: string;
  toPlace: string;
  totalSeats: number;
  availableSeats: number;
  departureTime: string;
  flightDate: string;
}

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-flights.component.html',
  styleUrls: ['./admin-flights.component.css']
})
export class AdminFlightsComponent implements OnInit {
  flights: Flight[] = [];
  showForm = false;
  loading = false;
  success = '';
  error = '';

  // Form fields
  flightId = '';
  fromPlace = '';
  toPlace = '';
  totalSeats = 100;
  availableSeats = 100;
  departureTime = '';
  flightDate = '';
  arrivalTime = '';
  price: number | null = null;

  constructor(
    private flightService: FlightService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      this.error = 'Access denied. Admin only.';
      setTimeout(() => {
        this.router.navigate(['/search']);
      }, 2000);
      return;
    }

    this.loadFlights();
  }

  loadFlights() {
    // Fetch all flights for admin view
    this.flightService.searchFlights('', '', undefined).subscribe({
      next: (data) => {
        this.flights = data;
      },
      error: (err) => {
        this.error = 'Failed to load flights';
        console.error(err);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.flightId = '';
    this.fromPlace = '';
    this.toPlace = '';
    this.totalSeats = 100;
    this.availableSeats = 100;
    this.departureTime = '';
    this.flightDate = '';
    this.arrivalTime = '';
    this.price = null;
  }

  addFlight() {
    // Basic validations per assignment
    if (!this.flightId.trim()) { this.error = 'Flight Number cannot be empty'; return; }
    if (!this.fromPlace.trim()) { this.error = 'From City cannot be empty'; return; }
    if (!this.toPlace.trim()) { this.error = 'To City cannot be empty'; return; }
    if (this.fromPlace.trim().toUpperCase() === this.toPlace.trim().toUpperCase()) { this.error = 'From and To cannot be the same city'; return; }
    if (!this.flightDate) { this.error = 'Date must be selected'; return; }
    if (!this.departureTime) { this.error = 'Departure Time must be selected'; return; }
    if (this.price !== null && this.price <= 0) { this.error = 'Cost must be greater than 0'; return; }
    if (this.totalSeats <= 0) { this.error = 'Seats Available must be greater than 0'; return; }
    if (this.availableSeats < 0) { this.error = 'Available seats cannot be negative'; return; }
    if (this.availableSeats > this.totalSeats) { this.error = 'Available seats cannot exceed total seats'; return; }

    // Transformations on submit
    this.flightId = this.flightId.trim().toUpperCase();
    this.fromPlace = this.fromPlace.trim().toUpperCase();
    this.toPlace = this.toPlace.trim().toUpperCase();

    this.loading = true;
    this.error = '';

    const flight: any = {
      id: this.flightId,
      fromPlace: this.fromPlace,
      toPlace: this.toPlace,
      totalSeats: this.totalSeats,
      availableSeats: this.availableSeats,
      departureTime: this.departureTime,
      flightDate: this.flightDate,
      arrivalTime: this.arrivalTime || null,
      price: this.price
    };

    this.flightService.addFlight(this.flightId, flight).subscribe({
      next: (response) => {
        this.success = `Flight ${this.flightId} added successfully!`;
        this.loading = false;
        this.resetForm();
        this.showForm = false;
        this.loadFlights();
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        if (err?.status === 409) {
          this.error = 'Flight number already exists';
        } else {
          this.error = err?.error?.message || 'Failed to add flight';
        }
        this.loading = false;
      }
    });
  }
}
