import { NextResponse } from 'next/server';
import { insforge } from '../../../../lib/insforge';
import { getSessionAdmin } from '../../../../lib/auth';

export async function GET(req) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  // Fetch all counts concurrently
  const [
    { count: usersCount },
    { count: doctorsCount },
    { count: caretakersCount },
    { count: bookingsCount, data: allBookings },
    { count: pendingCount }
  ] = await Promise.all([
    insforge.database.from('users').select('*', { count: 'exact', head: true }),
    insforge.database.from('doctors').select('*', { count: 'exact', head: true }),
    insforge.database.from('caretakers').select('*', { count: 'exact', head: true }),
    insforge.database.from('bookings').select('*', { count: 'exact' }),
    insforge.database.from('providerApplications').select('*', { count: 'exact', head: true }).eq('status', 'Pending Review')
  ]);

  const bookings = allBookings || [];

  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === 'Cancelled') return sum;
    const n = parseFloat((b.fee || '0').toString().replace(/[^0-9.]/g, '')) || 0;
    return sum + n;
  }, 0);

  // For recent bookings, just sort them by created_at (if we have it, else sort by ID or just use top 8)
  const recentBookings = [...bookings].reverse().slice(0, 8);

  return NextResponse.json({
    totalUsers: usersCount || 0,
    totalDoctors: doctorsCount || 0,
    totalCaretakers: caretakersCount || 0,
    totalBookings: bookingsCount || 0,
    totalRevenue,
    pendingApplications: pendingCount || 0,
    recentBookings,
  });
}
