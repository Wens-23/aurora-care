'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import { useAuth, useToast } from '../app/providers';

const PERIOD_FILTERS = ['All times', 'Morning', 'Afternoon', 'Evening'];

export default function BookingFlow({ kind, provider, onClose }) {
  const [step, setStep] = useState('details'); // details -> payment -> confirmed
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('All times');
  const [time, setTime] = useState(null);
  const [plan, setPlan] = useState(kind === 'Doctor' ? 'Video call' : 'Hourly');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const priceLabel = kind === 'Doctor' ? `$${provider.fee}` : provider.rate;

  async function loadAvailability(d) {
    setLoadingSlots(true);
    setTime(null);
    try {
      const res = await fetch(`/api/availability?providerId=${provider.id}&date=${d}`);
      const data = await res.json();
      setSlots(data.slots || []);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => { loadAvailability(date); }, [date]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleSlots = periodFilter === 'All times' ? slots : slots.filter((s) => s.period === periodFilter);

  async function confirmBooking() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          providerId: provider.id,
          providerName: provider.name,
          sub: kind === 'Doctor' ? provider.specialty : provider.role,
          date,
          time,
          plan,
          notes,
          fee: priceLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Could not create booking', 'bad');
        if (res.status === 409) loadAvailability(date);
        return;
      }
      setConfirmedBooking(data.booking || { id: 'BK', date, time, plan, fee: priceLabel });
      setStep('confirmed');
      toast('Booking confirmed successfully!', 'ok');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <Modal open onClose={onClose} wide>
      {step === 'details' && (
        <>
          <div className="pb-3 mb-4 border-b border-[#e6e1d4]">
            <h3 className="text-xl text-[#121412] font-extrabold">Reserve with {provider.name}</h3>
            <p className="text-xs text-[#5f665e] mt-0.5">
              {kind === 'Doctor' ? provider.specialty : provider.role} · <b className="text-[#1e5e3a]">{priceLabel}</b>
            </p>
          </div>

          <div className="field mb-4">
            <label>Select Date</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {kind === 'Doctor' && (
            <div className="field mb-4">
              <label>Consultation Format</label>
              <div className="flex gap-2">
                {['Video call', 'Voice call', 'Chat'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={
                      'btn btn-sm ' +
                      (plan === p
                        ? 'btn-primary'
                        : 'bg-[#faf7ee] text-[#121412] border-[#e6e1d4] hover:border-[#1e5e3a]')
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="field mb-4">
            <label>Available Time Slot</label>
            <div className="flex gap-1.5 flex-wrap mb-3">
              {PERIOD_FILTERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriodFilter(p)}
                  className={
                    'text-xs px-2.5 py-1 rounded-md font-bold transition ' +
                    (periodFilter === p
                      ? 'bg-[#1e5e3a] text-white'
                      : 'bg-[#faf7ee] text-[#5f665e] border border-[#e6e1d4] hover:text-[#121412]')
                  }
                >
                  {p}
                </button>
              ))}
            </div>

            {loadingSlots ? (
              <p className="text-xs text-[#5f665e]">Loading live availability…</p>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto pr-1">
                {visibleSlots.map((s) => {
                  const isBooked = s.status === 'booked';
                  const isSelected = time === s.time;
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setTime(s.time)}
                      className={
                        'text-xs font-bold rounded-lg border px-2 py-2 text-center transition ' +
                        (isBooked
                          ? 'bg-[#faf7ee] text-[#a4a9a2] line-through cursor-not-allowed border-[#e6e1d4]'
                          : isSelected
                          ? 'bg-[#1e5e3a] text-white border-[#1e5e3a]'
                          : 'bg-white text-[#121412] border-[#e6e1d4] hover:border-[#1e5e3a]')
                      }
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex gap-4 text-[11px] text-[#5f665e] mt-3">
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-white border border-[#e6e1d4] mr-1" />Available</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#faf7ee] mr-1" />Booked</span>
              <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1e5e3a] mr-1" />Selected</span>
            </div>
          </div>

          <div className="field mb-4">
            <label>Clinical Notes or Patient Requirements (Optional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. mobility assistance needed, medication schedule, past stroke..."
            />
          </div>

          <div className="flex gap-2.5 justify-end pt-3 border-t border-[#e6e1d4]">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={!time} onClick={() => setStep('payment')}>
              Continue to Confirmation &rarr;
            </button>
          </div>
        </>
      )}

      {step === 'payment' && (
        <>
          <div className="pb-3 mb-4 border-b border-[#e6e1d4]">
            <h3 className="text-xl text-[#121412] font-extrabold">Payment &amp; Confirmation</h3>
            <p className="text-xs text-[#5f665e] mt-0.5">
              {provider.name} · {date} at {time} · <b className="text-[#1e5e3a]">{priceLabel}</b>
            </p>
          </div>

          <div className="field mb-3.5">
            <label>Cardholder Name</label>
            <input defaultValue={user.name} />
          </div>
          <div className="field mb-3.5">
            <label>Card Number</label>
            <input placeholder="4242 •••• •••• 4242" maxLength={19} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="field"><label>Expiry</label><input placeholder="MM/YY" maxLength={5} /></div>
            <div className="field"><label>CVC / Security Code</label><input placeholder="123" maxLength={4} /></div>
          </div>

          <div className="p-3 bg-[#faf7ee] border border-[#e6e1d4] rounded-lg text-[12px] text-[#5f665e] mb-4">
            💳 <b>Demo Environment:</b> Simulated payment gateway. No real charge will occur.
          </div>

          <div className="flex gap-2.5 justify-end pt-3 border-t border-[#e6e1d4]">
            <button className="btn btn-ghost" onClick={() => setStep('details')}>Back</button>
            <button className="btn btn-primary" onClick={confirmBooking} disabled={submitting}>
              {submitting ? 'Confirming…' : 'Pay & Confirm Appointment →'}
            </button>
          </div>
        </>
      )}

      {step === 'confirmed' && (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-[#ebf5ee] border border-[#d2ecd9] text-[#1e5e3a] flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm font-bold">
            ✓
          </div>
          <h3 className="text-xl text-[#121412] font-extrabold mb-1">Appointment Confirmed!</h3>
          <p className="text-xs text-[#5f665e] mb-5">
            Your booking is secured. Direct provider contact details are provided below:
          </p>

          <div className="bg-[#faf7ee] border border-[#e6e1d4] rounded-2xl p-5 text-left mb-6 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#e6e1d4]">
              <div>
                <div className="font-extrabold text-base text-[#121412]">{provider.name}</div>
                <div className="text-xs text-[#5f665e]">{kind === 'Doctor' ? provider.specialty : provider.role}</div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ebf5ee] text-[#1e5e3a]">
                Verified
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[#5f665e] block mb-0.5">📅 Appointment Schedule</span>
                <span className="font-bold text-[#121412] text-sm">{date} · {time}</span>
              </div>
              <div>
                <span className="text-[#5f665e] block mb-0.5">💬 Consultation Format</span>
                <span className="font-bold text-[#121412] text-sm">{plan}</span>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#e6e1d4] rounded-xl space-y-2 mt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#121412]">
                Direct Provider Contact
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#5f665e]">📱 Phone:</span>
                {provider.phone ? (
                  <a href={`tel:${provider.phone}`} className="font-bold text-[#1e5e3a] hover:underline">
                    {provider.phone}
                  </a>
                ) : (
                  <span className="text-[#5f665e]">Provided upon request</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#5f665e]">✉️ Email:</span>
                {provider.email ? (
                  <a href={`mailto:${provider.email}`} className="font-bold text-[#1e5e3a] hover:underline">
                    {provider.email}
                  </a>
                ) : (
                  <span className="text-[#5f665e]">Provided upon request</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-[#e6e1d4]">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                router.push('/dashboard');
              }}
            >
              View in My Bookings &rarr;
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
