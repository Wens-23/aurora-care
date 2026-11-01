import { NextResponse } from 'next/server';
import { insforge } from '../../../../../lib/insforge';
import { getSessionUser } from '../../../../../lib/auth';
import { cancellationEmails } from '../../../../../lib/mailer';

export async function POST(req, { params }) {
  const user = getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const { data: bookings, error } = await insforge.database.from('bookings').select('*').eq('id', params.id);
  if (error || !bookings || bookings.length === 0) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }
  const existing = bookings[0];

  // Only the member who created the booking can cancel it.
  if (existing.patientEmail !== user.email) {
    return NextResponse.json({ error: 'Access denied. You can only cancel your own bookings.' }, { status: 403 });
  }

  // Completed bookings can never be cancelled.
  if (existing.status === 'Completed') {
    return NextResponse.json({ error: 'This booking is already completed and cannot be cancelled.' }, { status: 409 });
  }

  // Prevent repeated cancellation requests.
  if (existing.status === 'Cancelled') {
    return NextResponse.json({ error: 'This booking has already been cancelled.' }, { status: 409 });
  }

  const { data: updatedBookings, error: updateErr } = await insforge.database.from('bookings')
    .update({ 
      status: 'Cancelled',
      cancelledBy: user.email,
      cancelledAt: new Date().toISOString()
    })
    .eq('id', params.id)
    .eq('status', 'Upcoming')
    .select('*');

  if (updateErr || !updatedBookings || updatedBookings.length === 0) {
    return NextResponse.json({ error: 'This booking could not be cancelled — it may have just changed status.' }, { status: 409 });
  }

  const cancelledBooking = updatedBookings[0];

  // Send cancellation emails asynchronously
  (async () => {
    try {
      const providerTable = cancelledBooking.kind === 'Doctor' ? 'doctors' : 'caretakers';
      let provider = null;
      if (cancelledBooking.providerId) {
        const { data: providers } = await insforge.database.from(providerTable).select('*').eq('id', cancelledBooking.providerId);
        if (providers && providers.length > 0) provider = providers[0];
      }
      const { data: patients } = await insforge.database.from('users').select('*').eq('email', user.email);
      const patient = (patients && patients[0]) || user;

      await cancellationEmails({
        booking: cancelledBooking,
        provider,
        patient,
        cancelledBy: user.email,
      });
    } catch (mailErr) {
      console.error('Cancellation email notification failed:', mailErr);
    }
  })();

  return NextResponse.json({ booking: cancelledBooking });
}
