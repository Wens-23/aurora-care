ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS "providerPhone" TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS "providerEmail" TEXT;
