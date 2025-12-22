import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BookingHistoryComponent } from './booking-history.component';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('BookingHistoryComponent', () => {
  let component: BookingHistoryComponent;
  let fixture: ComponentFixture<BookingHistoryComponent>;
  let bookingService: BookingService;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUserFromToken']);

    await TestBed.configureTestingModule({
      imports: [BookingHistoryComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingHistoryComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user bookings on init when logged in', () => {
    const mockBookings = [{ id: 'a', userEmail: 'u@example.com' }];
    spyOn(bookingService, 'getUserBookings').and.returnValue(of(mockBookings));
    authService.isLoggedIn.and.returnValue(true);
    authService.getUserFromToken.and.returnValue({ username: 'u', email: 'u@example.com' } as any);

    component.ngOnInit();

    expect(authService.isLoggedIn).toHaveBeenCalled();
    expect(bookingService.getUserBookings).toHaveBeenCalledWith('u@example.com');
    expect(component.bookings.length).toBe(1);
  });

  it('should redirect to login when not logged in', () => {
    spyOn(router, 'navigate');
    authService.isLoggedIn.and.returnValue(false);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call cancelBooking and remove booking', () => {
    const id = 'abc-123';
    component.bookings = [{ id } as any];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(bookingService, 'cancelBooking').and.returnValue(of({}));

    component.cancelBooking(id);
    expect(bookingService.cancelBooking).toHaveBeenCalledWith(id);
    expect(component.bookings.find(b => b.id === id)).toBeUndefined();
  });
});