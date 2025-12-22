import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FlightSearchComponent } from './flight-search.component';

describe('FlightSearchComponent', () => {
  let component: FlightSearchComponent;
  let fixture: ComponentFixture<FlightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightSearchComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isPast should return true for past flights', () => {
    const past = { departureTime: new Date(Date.now() - 3600 * 1000).toISOString() };
    expect(component.isPast(past)).toBeTrue();
  });

  it('isPast should return false for future flights', () => {
    const future = { departureTime: new Date(Date.now() + 3600 * 1000).toISOString() };
    expect(component.isPast(future)).toBeFalse();
  });
});
