import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FlightSearchComponent } from './pages/flight-search/flight-search.component';
import { BookingComponent } from './pages/booking/booking.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'flights', component: FlightSearchComponent },
  {path: 'book/:flightId', component: BookingComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
