import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { FlightSearchComponent } from './pages/flight-search/flight-search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BookingHistoryComponent } from './pages/bookings/booking-history.component';
import { AdminFlightsComponent } from './pages/admin-flights/admin-flights.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: FlightSearchComponent },
  { path: 'search', component: FlightSearchComponent },
  { path: 'flights', component: FlightSearchComponent },
  { path: 'book/:flightId', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingHistoryComponent, canActivate: [AuthGuard] },
  { path: 'booking-history', component: BookingHistoryComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'change-password', loadComponent: () => import('./pages/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent), canActivate: [AuthGuard] },
  { path: 'admin/flights', component: AdminFlightsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

