# Aurora Care — Designed To Connect

A full-stack healthcare marketplace app: patients book doctors and caretakers,
providers get discovered, and an admin portal manages the directory. Built
with Next.js 14 (App Router), a lightweight JSON-file database, JWT sessions,
and Tailwind CSS.

## Features

- **Patient auth** — signup (name, email, phone, password) and login, JWT
  session in an httpOnly cookie, bcrypt-hashed passwords.
- **Doctor directory** (`/doctors`) and **caretaker directory** (`/caretakers`)
  with search/filtering and booking.
- **Live slot availability** — every day is open 8:00 AM–7:30 PM in 30-minute
  slots by default. A slot only closes once another patient has an *Upcoming*
  booking with that exact provider at that exact date/time. Cancelling a
  booking frees the slot back up automatically. The server re-checks
  availability on submit to avoid race conditions between two people booking
  the same slot at once.
- **Booking cancellation** — patients can cancel their own *Upcoming*
  bookings from `/dashboard` or `/profile` with a confirmation dialog.
  Completed bookings can never be cancelled, cancelling twice is blocked, and
  only the booking's owner can cancel it (all enforced server-side, not just
  in the UI).
- **Email notifications** — when a booking is made, the patient is emailed
  the provider's contact info, and (if the provider has an email on file) the
  provider is emailed the patient's contact info. Uses real SMTP if
  configured in `.env`, otherwise logs a "mock" email you can inspect under
  **Admin Dashboard → Notifications**.
- **Provider registration** (`/provider-register`) — a public application
  form (name, email, phone, field of work, specialty, qualifications,
  availability). Submissions land in **Admin Dashboard → Applications**,
  where an admin can approve (enter a fee/rate and it's added straight to the
  live directory) or reject each one.
- **Separate admin portal** (`/admin/login` → `/admin/dashboard`) — its own
  login, completely separate from the patient login. Admins can only add/
  remove doctors and caretakers and review applications (plus view stats,
  all bookings, payments, and the notification log, which are read-only).
- **AI Skin Check** (`/skin-check`) — upload a photo, get a simulated
  assessment with home-care guidance and OTC ingredient suggestions, with an
  automatic "consult a doctor" nudge for higher-severity results. **This is a
  demo simulation, not a real image-classification model** — swap
  `/app/api/skin-check/route.js` for a real model/service before using this
  with real patients.

## Getting started

```bash
npm install
npm run seed     # creates data/db.json with starter doctors & caretakers
npm run dev       # http://localhost:3000
```

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

- `JWT_SECRET` — change this to a long random string before deploying.
- `ADMIN_ID` / `ADMIN_PASSWORD` — admin portal credentials (defaults match
  what you specified: `admin@aurora_care` / `admin@aurora123`).
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` —
  optional. Leave blank to use the mock email logger.

## Data storage

Data lives in `data/db.json`, a plain JSON file managed by `lib/db.js`. This
keeps the project dependency-free and easy to run anywhere, but it's a
single-process, single-file store — fine for a prototype or small internal
tool, not for concurrent production traffic. To move to a real database
later (Postgres, MySQL, MongoDB, etc.), swap out `lib/db.js`'s `readDB` /
`updateDB` functions for real queries; the rest of the app only talks to
those two functions plus the API routes, so the surface area to change is
small.

## Testing

`tests/ui_test.py` is a Playwright script that clicks through the real app in
a headless browser — signup/login, the full booking flow (slot picker →
payment → confirmation), cancellation, caretaker booking, skin-check upload,
provider registration, and the full admin flow (login, all tabs, add/remove
a doctor, logout). It asserts on visible UI state and fails on any uncaught
JS error.

To run it:

```bash
pip install playwright
python3 -m playwright install chromium
npm run seed
npm run build && npm run start -- -p 3100   # or: npm run dev, then edit BASE in the script
python3 tests/ui_test.py
```

## Project structure

```
app/
  (site)/            patient-facing pages (share Navbar + Footer)
  admin/             separate admin shell, login, and dashboard
  api/               all backend routes (auth, doctors, caretakers,
                     bookings, availability, admin, provider-applications,
                     skin-check)
components/          shared UI: Navbar, Footer, Modal, BookingFlow, etc.
lib/                 db.js (storage), auth.js (sessions), mailer.js (email),
                     slots.js (availability)
scripts/seed.js      resets data/db.json with starter doctors/caretakers
```

## Known limitations (by design, for a first pass)

- Single JSON file for storage — see "Data storage" above.
- Payment form is a UI mock; no real payment processor is wired in.
- Skin Check is simulated, not a real ML model.
- No password reset flow yet.
