import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BookingHistoryComponent } from './booking-history.component';
import { BookingService } from '../../services/booking.service';

describe('BookingHistoryComponent', () => {
  let component: BookingHistoryComponent;
  let fixture: ComponentFixture<BookingHistoryComponent>;
  let bookingService: BookingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingHistoryComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingHistoryComponent);
    component = fixture.componentInstance;
    bookingService = TestBed.inject(BookingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bookings on init', () => {
    spyOn(bookingService, 'getAllBookings').and.returnValue(of([{ id: 'a', userEmail: 'u@example.com' }]));
    component.ngOnInit();
    expect(bookingService.getAllBookings).toHaveBeenCalled();
    expect(component.bookings.length).toBe(1);
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