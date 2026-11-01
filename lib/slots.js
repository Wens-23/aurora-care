// All slots are open by default for every date. A slot only becomes
// unavailable once another patient has an Upcoming booking with the same
// provider at that exact date + time. Cancelling a booking frees the slot
// back up automatically, since availability is computed live from bookings.

function pad(n) {
  return n.toString().padStart(2, '0');
}

function to12h(hour24, minute) {
  const period = hour24 < 12 ? 'AM' : 'PM';
  let h = hour24 % 12;
  if (h === 0) h = 12;
  return `${h}:${pad(minute)} ${period}`;
}

function periodFor(hour24) {
  if (hour24 < 12) return 'Morning';
  if (hour24 < 17) return 'Afternoon';
  return 'Evening';
}

export function generateDaySlots() {
  const slots = [];
  for (let h = 8; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 19 && m === 30) continue; // stop at 7:30 PM
      slots.push({ time: to12h(h, m), period: periodFor(h) });
    }
  }
  return slots;
}

export const ALL_SLOTS = generateDaySlots();
