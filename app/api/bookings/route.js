import { NextResponse } from 'next/server';
import { insforge } from '../../../lib/insforge';
import { getSessionUser, getSessionAdmin } from '../../../lib/auth';
import { bookingEmails } from '../../../lib/mailer';

export async function GET(req) {
  const user = getSessionUser(req);
  const admin = getSessionAdmin(req);

  if (admin) {
    const { data: bookings, error } = await insforge.database.from('bookings').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ bookings: bookings || [] });
  }
  if (!user) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }
  
  const { data: bookings, error } = await insforge.database.from('bookings').select('*').eq('patientEmail', user.email);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: bookings || [] });
}

export async function POST(req) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const body = await req.json();
  const { kind, providerId, providerName, sub, date, time, plan, fee, notes, consultationType } = body;
  if (!kind || !providerId || !providerName || !date || !time) {
    return NextResponse.json({ error: 'Missing required booking details.' }, { status: 400 });
  }

  const tableName = kind === 'Doctor' ? 'doctors' : 'caretakers';
  const { data: providers, error: providerErr } = await insforge.database.from(tableName).select('*').eq('id', providerId);
  if (providerErr || !providers || providers.length === 0) {
    return NextResponse.json({ error: 'Provider not found.' }, { status: 404 });
  }
  const provider = providers[0];

  const { data: users, error: userErr } = await insforge.database.from('users').select('*').eq('id', user.id);
  const patientRecord = (users && users[0]) || user;

  // Re-check for clashes
  const { data: clashes, error: clashErr } = await insforge.database.from('bookings')
    .select('id')
    .eq('providerId', providerId)
    .eq('date', date)
    .eq('time', time)
    .eq('status', 'Upcoming');
    
  if (clashErr) return NextResponse.json({ error: clashErr.message }, { status: 500 });
  if (clashes && clashes.length > 0) {
    return NextResponse.json({ error: 'That time slot was just booked by someone else. Please pick another.' }, { status: 409 });
  }

  const booking = {
    id: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    kind,
    providerId,
    providerName,
    sub: sub || '',
    patientEmail: user.email,
    patientName: patientRecord.name || user.name || '',
    patientPhone: patientRecord.phone || user.phone || '',
    providerPhone: provider.phone || '',
    providerEmail: provider.email || '',
    date,
    time,
    plan: plan || '',
    consultationType: consultationType || '',
    notes: notes || '',
    fee: fee || '',
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
  };

  const { error } = await insforge.database.from('bookings').insert([booking]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email notifications
  bookingEmails({ booking, provider, patient: patientRecord }).catch((err) => {
    console.error('Booking email notification failed:', err);
  });

  return NextResponse.json({ booking, provider }, { status: 201 });
}
