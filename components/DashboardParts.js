'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../app/providers';

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const STATUS_STYLE = {
  Upcoming: 'bg-[#ebf5ee] text-[#1e5e3a]',
  Completed: 'bg-[#faf7ee] text-[#121412] border border-[#e6e1d4]',
  Cancelled: 'bg-[#fdf2f1] text-[#c93b32]',
};

export function Sidebar({ active, user }) {
  const { logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    toast('Logged out', 'ok');
    router.push('/');
  }

  return (
    <div className="bg-white border border-[#e6e1d4] rounded-2xl p-5 h-fit shadow-card">
      <div className="flex gap-3 items-center pb-4 mb-4 border-b border-[#e6e1d4]">
        <span className="w-10 h-10 rounded-full bg-[#1e5e3a] text-white flex items-center justify-center text-[14px] font-bold shadow-sm">
          {initials(user.name)}
        </span>
        <div>
          <div className="font-extrabold text-[15px] text-[#121412] leading-tight">{user.name}</div>
          <div className="text-xs text-[#5f665e] mt-0.5">Verified Patient</div>
        </div>
      </div>

      <nav className="space-y-1 mb-5">
        <Link
          href="/dashboard"
          className={
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[13.5px] transition ' +
            (active === 'dashboard'
              ? 'bg-[#ebf5ee] text-[#1e5e3a]'
              : 'text-[#121412] hover:bg-[#faf7ee]')
          }
        >
          <span>📅</span> My Scheduled Bookings
        </Link>
        <Link
          href="/profile"
          className={
            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[13.5px] transition ' +
            (active === 'profile'
              ? 'bg-[#ebf5ee] text-[#1e5e3a]'
              : 'text-[#121412] hover:bg-[#faf7ee]')
          }
        >
          <span>⚙️</span> Health Records &amp; Vitals
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-bold text-[13.5px] text-[#c93b32] hover:bg-[#fdf2f1] transition"
        >
          <span>🚪</span> Sign Out
        </button>
      </nav>

      {/* Immediate Care Callout Banner in Deep Forest Green */}
      <div className="bg-[#1e5e3a] text-white rounded-xl p-4.5 shadow-sm">
        <h4 className="text-sm font-extrabold mb-1 flex items-center gap-1.5">
          <span>⚡</span> Need immediate triage?
        </h4>
        <p className="text-[12px] text-[#d2ecd9] leading-relaxed mb-3.5">
          Run an instant dermatological check or book a 24/7 on-call nurse for urgent support.
        </p>
        <Link href="/skin-check" className="btn btn-lime btn-sm w-full font-bold">
          Start Skin Assessment &rarr;
        </Link>
      </div>
    </div>
  );
}

export function BookingRow({ b, onCancel, compact }) {
  const rowBorder = b.status === 'Cancelled' ? 'border-l-[#d5d0c4] opacity-75' : b.status === 'Completed' ? 'border-l-[#121412]' : 'border-l-[#1e5e3a]';
  const icon = b.kind === 'Doctor' ? '🩺' : '🧑‍⚕️';
  return (
    <div className={'bg-white border border-[#e6e1d4] border-l-4 rounded-xl px-5 py-4 mb-3 flex justify-between items-center gap-4 flex-wrap shadow-card ' + rowBorder}>
      <div className="flex gap-3.5 items-start">
        <div className="w-10 h-10 rounded-lg bg-[#faf7ee] border border-[#e6e1d4] flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
        <div>
          <div className="font-extrabold text-[15px] text-[#121412] mb-0.5">
            {b.providerName}{' '}
            <span className={'text-[11px] font-bold px-2.5 py-0.5 rounded-full ml-1.5 ' + STATUS_STYLE[b.status]}>
              {b.status}
            </span>
          </div>
          <div className="text-[12.5px] text-[#5f665e]">
            {b.sub}{!compact ? ` · ${b.plan} · ${b.fee}` : ''} · {b.date}, {b.time}
          </div>
          {(b.providerPhone || b.providerEmail) && (
            <div className="flex items-center gap-3 text-xs text-[#5f665e] mt-2 flex-wrap">
              {b.providerPhone && (
                <a href={`tel:${b.providerPhone}`} className="text-[#1e5e3a] font-bold hover:underline flex items-center gap-1">
                  <span>📱</span> {b.providerPhone}
                </a>
              )}
              {b.providerEmail && (
                <a href={`mailto:${b.providerEmail}`} className="text-[#1e5e3a] font-bold hover:underline flex items-center gap-1">
                  <span>✉️</span> {b.providerEmail}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="text-right flex-shrink-0">
          <div className="text-[13px] font-bold text-[#121412] mb-2">{b.date} · {b.time}</div>
          <div className="flex gap-2 justify-end">
            {b.status === 'Upcoming' && (
              <button className="btn btn-danger btn-sm" onClick={onCancel}>
                Cancel Booking
              </button>
            )}
            {b.status === 'Completed' && (
              <button className="btn btn-ghost btn-sm" disabled>
                Completed
              </button>
            )}
            {b.status === 'Cancelled' && (
              <span className="text-xs text-[#828a81] italic">Cancelled by patient</span>
            )}
          </div>
        </div>
      )}

      {compact && b.status === 'Upcoming' && (
        <button className="btn btn-danger btn-sm" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}
