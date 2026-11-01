import { NextResponse } from 'next/server';
import { insforge } from '../../../lib/insforge';
import { ALL_SLOTS } from '../../../lib/slots';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get('providerId');
  const date = searchParams.get('date');

  if (!providerId || !date) {
    return NextResponse.json({ error: 'providerId and date are required.' }, { status: 400 });
  }

  const { data: bookings, error } = await insforge.database.from('bookings')
    .select('time')
    .eq('providerId', providerId)
    .eq('date', date)
    .eq('status', 'Upcoming');
    
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const bookedTimes = new Set((bookings || []).map((b) => b.time));

  const slots = ALL_SLOTS.map((s) => ({
    time: s.time,
    period: s.period,
    status: bookedTimes.has(s.time) ? 'booked' : 'available',
  }));

  return NextResponse.json({ slots });
}
