'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../../providers';
import Modal from '../../../components/Modal';
import { Sidebar, BookingRow } from '../../../components/DashboardParts';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [bookings, setBookings] = useState([]);
  const [busy, setBusy] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  async function loadBookings() {
    setBusy(true);
    const res = await fetch('/api/bookings');
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings);
    }
    setBusy(false);
  }

  useEffect(() => {
    if (user) loadBookings();
  }, [user]);

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${cancelTarget.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Unable to cancel booking', 'bad');
      } else {
        toast('Booking cancelled successfully', 'ok');
        await loadBookings();
      }
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  }

  if (loading || !user) return null;

  return (
    <div className="bg-[#faf7ee] min-h-[calc(100vh-120px)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 grid md:grid-cols-[280px_1fr] gap-8">
        <Sidebar active="dashboard" user={user} />
        <div>
          <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2 pb-4 border-b border-[#e6e1d4]">
            <div>
              <h1 className="text-[28px] font-extrabold text-[#121412] tracking-tight">
                Scheduled Appointments
              </h1>
              <p className="text-[#5f665e] text-xs mt-0.5">
                Manage upcoming caregiver visits, doctor video calls, and past consultations.
              </p>
            </div>
            <Link href="/doctors" className="btn btn-primary btn-sm">
              + New Appointment
            </Link>
          </div>

          <div className="mt-6">
            {busy ? (
              <p className="text-[#5f665e] text-sm">Loading appointment records…</p>
            ) : bookings.length === 0 ? (
              <div className="bg-white border border-[#e6e1d4] rounded-2xl text-center py-16 px-5 text-[#5f665e] shadow-card">
                <div className="w-14 h-14 rounded-2xl bg-[#faf7ee] border border-[#e6e1d4] text-2xl flex items-center justify-center mx-auto mb-3">
                  🗓️
                </div>
                <div className="font-extrabold text-[#121412] text-base mb-1">No scheduled appointments</div>
                <p className="text-xs text-[#5f665e] mb-4">Book your first doctor consultation or in-home nursing visit.</p>
                <Link href="/doctors" className="btn btn-primary btn-sm">
                  Find Specialists &rarr;
                </Link>
              </div>
            ) : (
              bookings.map((b) => (
                <BookingRow key={b.id} b={b} onCancel={() => setCancelTarget(b)} />
              ))
            )}
          </div>
        </div>

        <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
          {cancelTarget && (
            <>
              <h3 className="text-lg text-[#121412] font-extrabold mb-2">Cancel this booking?</h3>
              <p className="text-sm text-[#5f665e] mb-5 leading-relaxed">
                Are you sure you want to cancel your appointment with <b>{cancelTarget.providerName}</b> scheduled for {cancelTarget.date} at {cancelTarget.time}? This cancellation is recorded immediately.
              </p>
              <div className="flex gap-2.5 justify-end pt-3 border-t border-[#e6e1d4]">
                <button className="btn btn-ghost" onClick={() => setCancelTarget(null)}>
                  Keep Appointment
                </button>
                <button className="btn btn-danger" onClick={confirmCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling…' : 'Yes, Cancel Appointment'}
                </button>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
