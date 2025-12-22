import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

/* Angular Material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from './services/auth.service';
import { BookingService } from './services/booking.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  userInitials = '';
  bookingsCount = 0;
  notifications: Array<{ id: string; text: string }> = [];

  constructor(public auth: AuthService, private router: Router, private bookingService: BookingService) {
    // refresh auth info on navigation to pick up login/logout changes
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.refreshAuthInfo());
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit(): void {
    this.refreshAuthInfo();
  }

  refreshAuthInfo() {
    if (!this.isLoggedIn) {
      this.bookingsCount = 0;
      this.notifications = [];
      this.userInitials = '';
      return;
    }

    const user = this.auth.getUserFromToken();
    if (user) {
      this.userInitials = this.getInitials(user.username || user.email || '');
      // fetch booking count
      if (user.email) {
        this.bookingService.getUserBookings(user.email).subscribe({
          next: (b: any[]) => this.bookingsCount = b?.length || 0,
          error: () => this.bookingsCount = 0
        });
      }
    }

    // placeholder notifications
    this.notifications = [{ id: '1', text: 'Welcome back!' }];
  }

  getInitials(name: string) {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts.length === 1 ? parts[0].charAt(0).toUpperCase() : (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase();
  }

  goToBookings() { this.router.navigate(['/booking-history']); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
