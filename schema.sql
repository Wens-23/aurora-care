CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    name TEXT,
    specialty TEXT,
    exp TEXT,
    phone TEXT,
    email TEXT,
    "desc" TEXT,
    fee NUMERIC,
    rating NUMERIC,
    image TEXT
);

CREATE TABLE IF NOT EXISTS caretakers (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    "careType" TEXT,
    tags JSONB,
    exp TEXT,
    phone TEXT,
    email TEXT,
    "desc" TEXT,
    rate TEXT,
    rating NUMERIC,
    image TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    "patientId" TEXT REFERENCES users(id) ON DELETE CASCADE,
    "providerId" TEXT,
    type TEXT,
    date TEXT,
    time TEXT,
    status TEXT,
    "patientName" TEXT,
    "patientEmail" TEXT,
    "patientPhone" TEXT
);

CREATE TABLE IF NOT EXISTS "providerApplications" (
    id TEXT PRIMARY KEY,
    type TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    field TEXT,
    specialty TEXT,
    qualifications TEXT,
    availability TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    date TEXT,
    "to" TEXT,
    subject TEXT,
    body TEXT
);
