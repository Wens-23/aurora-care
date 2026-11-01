import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const DEFAULT_DATA = {
  users: [],
  doctors: [],
  caretakers: [],
  bookings: [],
  providerApplications: [],
  notifications: [],
  bookingSeq: 1000,
};

function ensureFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

export function readDB() {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function writeDB(data) {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Simple helper for atomic-ish read-modify-write (fine for single-process dev use)
export function updateDB(mutator) {
  const data = readDB();
  const result = mutator(data);
  writeDB(data);
  return result;
}

export function nextId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
