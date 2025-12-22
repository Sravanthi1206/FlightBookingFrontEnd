import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { BookingService } from './services/booking.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  it('should create the app (anon)', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => false, logout: () => {}, getToken: () => null } },
        { provide: BookingService, useValue: { getUserBookings: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render toolbar logo', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => false, logout: () => {}, getToken: () => null } },
        { provide: BookingService, useValue: { getUserBookings: () => of([]) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo')?.textContent).toContain('Flight Booking');
  });

  it('should show avatar initials and booking badge when logged in', async () => {
    const mockUser = { username: 'Chandu G', email: 'chandu@example.com' };
    const mockBookings = [{ id: 'b1' }, { id: 'b2' }];

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: { isLoggedIn: () => true, getUserFromToken: () => mockUser, logout: () => {} } },
        { provide: BookingService, useValue: { getUserBookings: (email: string) => of(mockBookings) } }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // avatar shows initials 'CG'
    const avatar = compiled.querySelector('.avatar');
    expect(avatar?.textContent?.trim()).toBe('CG');

    // booking badge shows count 2 (mat-badge content rendered as element content)
    const badge = compiled.querySelector('.mat-badge-content');
    expect(badge?.textContent?.trim()).toBe('2');
  });
});
