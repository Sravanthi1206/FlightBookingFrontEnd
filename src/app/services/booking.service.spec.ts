import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /{id}/cancel when cancelBooking is called', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const id = '123e4567-e89b-12d3-a456-426614174000';
    service.cancelBooking(id).subscribe();

    const expectedUrl = `http://localhost:18080/api/bookings/${id}/cancel`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});

    httpMock.verify();
  });

  it('should call GET /api/bookings for getAllBookings', () => {
    const httpMock = TestBed.inject(HttpTestingController);
    service.getAllBookings().subscribe();

    const expectedUrl = `http://localhost:18080/api/bookings`;
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush([]);

    httpMock.verify();
  });
});
