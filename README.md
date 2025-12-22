#  Flight Booking Application – Angular Frontend

This project is the **Angular frontend** for a Flight Booking System built using a **microservices architecture**.  
It communicates with a **Spring Boot backend** through an **API Gateway** and uses **JWT-based authentication**.

This project is developed for **academic purposes** and demonstrates real-world full-stack integration.

---

##  Features

- User Signup and Login
- JWT-based Authentication
- Secure API communication via API Gateway
- Flight Search (From → To)
- Clean and simple UI (professor-friendly)
- Modular Angular architecture

---

##  Tech Stack

### Frontend
- Angular
- TypeScript
- HTML5 & CSS3
- Angular Forms
- Angular HTTP Client

### Backend (separate services)
- Spring Boot
- Spring Cloud Gateway
- Eureka Service Discovery
# FlightApp – Angular Frontend

An Angular frontend for a full‑stack Flight Booking system. It integrates with Spring Boot microservices via an API Gateway, uses JWT for authentication, and implements Role‑Based Access Control (RBAC) for admin features.

---

## Overview
- Single‑page application built with Angular (standalone components + Angular Material for UI elements).
- Talks to the backend through API Gateway on `http://localhost:8080`.
- JWT stored in `localStorage`; an HTTP interceptor attaches tokens to secured requests.
- RBAC: `ADMIN` users can add flights; `USER` can search and book only.

---

## Features Implemented
- Signup with optional Admin Secret (sets role `ADMIN` if correct; otherwise `USER`).
- Login with JWT issuance and storage.
- Change Password page with validation (current/new/confirm; real‑time errors).
- Flight Search (from/to/date) with client/server validation; disables booking for past or full flights.
- Booking flow with passenger details, form validation, and redirect to Booking History.
- Booking History with cancel operation.
- Admin Panel (Add Flights) with comprehensive validations and uppercase transforms.
- Navbar + Profile menu with links to Profile, Bookings, Change Password, Admin Panel (admin only), and Logout.
- HTTP Interceptor to attach `Authorization: Bearer <token>` for secured requests.

---

## Pages & Routes
- `/login` – Login page.
- `/signup` – Signup page (includes Admin Secret field).
- `/flights` | `/search` | `/dashboard` – Flight search and results.
- `/book/:flightId` – Booking form (requires login).
- `/booking-history` | `/bookings` – User bookings with cancel.
- `/profile` – Profile with basic info + bookings shortcut.
- `/change-password` – Change password (requires login).
- `/admin/flights` – Admin add‑flights panel (requires login; link visible to admins only).

---

## Admin Secret & RBAC
- Admin Secret is configured server‑side; entering the correct secret on signup assigns `ADMIN`.
- UI hides admin controls for non‑admins; backend enforces admin rights on add‑flights.
- Admin‑only endpoint is protected by JWT role checks.

---

## Validations (Key Rules)
- Add Flights (Admin):
  - Flight Number: required; converted to UPPERCASE on submit.
  - From/To cities: required; cannot be the same; UPPERCASE on submit.
  - Date: required; must be today or future.
  - Departure Time: required.
  - Arrival Time: optional; if provided must be after departure.
  - Cost: optional; if provided must be greater than 0.
  - Seats: total > 0; available ≥ 0 and ≤ total.
  - Duplicate Flight Number → server returns 409 → friendly error displayed.
- Flight Search: client prevents past dates; server also rejects past dates.
- Booking: all passenger fields required; prevents booking past flights.
- Change Password: min length 8; Confirm must match New.

---

## API Overview (via API Gateway `http://localhost:8080`)
- Auth
  - `POST /auth/signup` – `{ username, password, email, adminSecret? }`
  - `POST /auth/login` – `{ username, password }` → `{ token }`
  - `PUT /auth/change-password` – headers: `X-User-Name`; body: `{ currentPassword, newPassword }`
- Flights
  - `GET /api/flights?from=BLR&to=DEL&date=YYYY-MM-DD`
  - `GET /api/flights/{id}`
  - `PUT /api/flights/{id}/inventory` (ADMIN only)
- Bookings
  - `POST /api/bookings` – `{ flightId, userEmail, seats, passengers[] }`
  - `GET /api/bookings?email=user@example.com`
  - `POST /api/bookings/{id}/cancel`

---

## Run Locally

### Prerequisites
- Node.js (LTS recommended)
- Angular CLI
- Backend stack running (API Gateway on `8080`)

### Commands
```bash
npm install
ng serve
```
Open: `http://localhost:4200`

---

## Notes
- CORS is handled at the API Gateway.
- JWT is parsed client‑side to show the user and role in the UI.
- Profile menu uses Angular Material `mat-menu` for reliable dropdown behavior.

---

## Status
- Signup, Login, JWT interceptor: working
- Flight Search: integrated
- Booking + Booking History + Cancel: integrated
- Admin Add Flights: integrated with validations & duplicate check
- Change Password: integrated

---

## Future Enhancements
- Advanced search (filters, sorting)
- Forgot password flow with email
- Seat selection UI
- Admin flight management extensions

---

## Author
Sravanthi Gurram – Flight Booking Microservices Project
