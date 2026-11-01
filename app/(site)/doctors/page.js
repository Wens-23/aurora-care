'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../../providers';
import BookingFlow from '../../../components/BookingFlow';

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [bookingProvider, setBookingProvider] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  async function load() {
    const res = await fetch('/api/doctors');
    const data = await res.json();
    setDoctors(data.doctors);
  }
  useEffect(() => { load(); }, []);

  const filtered = doctors.filter((d) => (d.name + d.specialty).toLowerCase().includes(query.toLowerCase()));

  function handleBook(d) {
    if (!user) { toast('Please sign in to continue', 'bad'); router.push('/login'); return; }
    setBookingProvider(d);
  }

  return (
    <div className="bg-[#faf7ee] min-h-[calc(100vh-120px)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e6e1d4]">
          <div>
            <div className="text-xs text-[#5f665e] font-semibold mb-2">
              <Link href="/" className="text-[#1e5e3a] hover:underline">Home</Link> › Telehealth › Consult a Specialist
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-extrabold text-[#121412] tracking-tight">
              Board-Certified Medical Staff
            </h1>
            <p className="text-[14.5px] text-[#5f665e] mt-1 max-w-[620px]">
              Direct appointment scheduling with certified medical doctors. Video, voice, and in-person consultations with complete record continuity.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#ebf5ee] border border-[#d2ecd9] text-[#1e5e3a] text-xs font-bold px-3.5 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#1e5e3a]"></span>
            Board-Certified &amp; Verified
          </div>
        </div>

        {/* Search Bar & Header Toolbar */}
        <div className="mt-8 mb-6">
          <div className="flex gap-2 bg-white border border-[#e6e1d4] rounded-xl p-2 mb-6 shadow-card focus-within:border-[#1e5e3a] transition max-w-[700px]">
            <span className="self-center pl-2 text-lg">🔍</span>
            <input
              className="border-none px-2 py-2 text-sm flex-1 outline-none text-[#121412] placeholder-[#828a81]"
              placeholder="Search by physician name, specialty (e.g. Cardiology, Pediatrics)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setQuery(search); }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => setQuery(search)}>
              Search
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="font-extrabold text-[#121412] text-sm tracking-tight">
              Active Medical Directory ({filtered.length})
            </div>
            <Link href="/provider-register" className="btn btn-outline btn-sm">
              + Join as Medical Staff
            </Link>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-white border border-[#e6e1d4] rounded-2xl text-center py-16 text-[#5f665e] shadow-card">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold text-[#121412] text-base mb-1">No specialists match your search</div>
              <p className="text-xs text-[#5f665e]">Try searching for terms like &ldquo;Cardiology&rdquo;, &ldquo;Dermatology&rdquo;, or &ldquo;General&rdquo;.</p>
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-[#e6e1d4] rounded-2xl p-6 border-t-[3px] border-t-[#1e5e3a] shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-3.5 mb-3.5">
                    <div className="w-[50px] h-[50px] rounded-full bg-[#1e5e3a] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                      {initials(d.name)}
                    </div>
                    <div>
                      <span className="inline-block bg-[#ebf5ee] text-[#1e5e3a] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                        {d.specialty}
                      </span>
                      <div className="font-bold text-[#121412] text-[16px] leading-tight">{d.name}</div>
                      <div className="text-xs text-[#e07a4f] font-bold mt-1">★ {d.rating}</div>
                    </div>
                  </div>

                  <p className="text-[13px] text-[#5f665e] mb-3 leading-relaxed min-h-[38px]">{d.desc}</p>
                  <div className="text-xs text-[#5f665e] font-semibold mb-4">
                    🕐 {d.exp} &nbsp;•&nbsp; 📱 {d.phone}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#e6e1d4] pt-4 mt-2">
                  <div>
                    <div className="text-[11px] text-[#5f665e] font-semibold">Consultation fee</div>
                    <div className="text-[#121412] text-[16px] font-bold">${d.fee}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => handleBook(d)}>
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {bookingProvider && (
        <BookingFlow kind="Doctor" provider={bookingProvider} onClose={() => setBookingProvider(null)} />
      )}
    </div>
  );
}
