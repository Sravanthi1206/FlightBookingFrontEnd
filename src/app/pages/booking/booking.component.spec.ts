import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BookingComponent } from './booking.component';
import { BookingService } from '../../services/booking.service';
import { FlightService } from '../../services/flight.service';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(async () => {
    const bookingSpy = jasmine.createSpyObj('BookingService', ['createBooking']);
    const flightSpy = jasmine.createSpyObj('FlightService', ['getFlight']);
    // default flight is future
    flightSpy.getFlight.and.returnValue({ subscribe: (o: any) => o.next({ id: '1', departureTime: new Date(Date.now() + 3600 * 1000).toISOString() }) });

    await TestBed.configureTestingModule({
      imports: [BookingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        { provide: BookingService, useValue: bookingSpy },
        { provide: FlightService, useValue: flightSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not allow booking past flights', () => {
    // override to a past flight
    component.flight = { id: '1', departureTime: new Date(Date.now() - 3600 * 1000).toISOString() };
    component.isPastFlight = true;

    const bookingService = TestBed.inject(BookingService) as jasmine.SpyObj<any>;
    component.submitBooking();
    expect(bookingService.createBooking).not.toHaveBeenCalled();
    expect(component.error).toBe('Cannot book past flight');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
