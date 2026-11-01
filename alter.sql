ALTER TABLE bookings RENAME COLUMN type TO kind;
ALTER TABLE bookings ADD COLUMN "providerName" TEXT;
ALTER TABLE bookings ADD COLUMN sub TEXT;
ALTER TABLE bookings ADD COLUMN plan TEXT;
ALTER TABLE bookings ADD COLUMN "consultationType" TEXT;
ALTER TABLE bookings ADD COLUMN notes TEXT;
ALTER TABLE bookings ADD COLUMN fee TEXT;
ALTER TABLE bookings ADD COLUMN "createdAt" TEXT;
