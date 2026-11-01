'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../../providers';
import BookingFlow from '../../../components/BookingFlow';

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const CARE_TYPES = ['Nursing', 'Physiotherapy', 'Massage Therapy', 'Elderly Care'];
const QUICK_TAGS = ['Post-Surgery', 'Companionship', 'Dementia Care'];

export default function CaretakersPage() {
  const [caretakers, setCaretakers] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [bookingProvider, setBookingProvider] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  async function load() {
    const res = await fetch('/api/caretakers');
    const data = await res.json();
    setCaretakers(data.caretakers);
  }
  useEffect(() => { load(); }, []);

  let filtered = caretakers;
  if (query) filtered = filtered.filter((c) => (c.name + c.role + c.tags.join(' ')).toLowerCase().includes(query.toLowerCase()));
  if (typeFilter) filtered = filtered.filter((c) => c.careType === typeFilter);

  function handleBook(c) {
    if (!user) { toast('Please sign in to continue', 'bad'); router.push('/login'); return; }
    setBookingProvider(c);
  }

  return (
    <div className="bg-[#faf7ee] min-h-[calc(100vh-120px)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#e6e1d4]">
          <div>
            <div className="text-xs text-[#5f665e] font-semibold mb-2">
              <Link href="/" className="text-[#1e5e3a] hover:underline">Home</Link> › Directory › Caretakers
            </div>
            <h1 className="text-[32px] sm:text-[38px] font-extrabold text-[#121412] tracking-tight">
              Verified Caregiver Network
            </h1>
            <p className="text-[14.5px] text-[#5f665e] mt-1 max-w-[620px]">
              Browse background-checked nurses, physical therapists, and certified care specialists. Transparent rates and verified credentials.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#ebf5ee] border border-[#d2ecd9] text-[#1e5e3a] text-xs font-bold px-3.5 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-[#1e5e3a]"></span>
            All providers 100% background-checked
          </div>
        </div>

        {/* Search & Main Layout */}
        <div className="grid md:grid-cols-[260px_1fr] gap-8 mt-8">
          {/* Left Sidebar Filter */}
          <div className="bg-white border border-[#e6e1d4] rounded-2xl p-5 h-fit shadow-card">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e6e1d4]">
              <h4 className="text-sm font-extrabold text-[#121412] uppercase tracking-wider">Filters</h4>
              <button
                className="text-xs text-[#1e5e3a] hover:underline font-bold"
                onClick={() => { setTypeFilter(null); setQuery(''); setSearch(''); }}
              >
                Reset All
              </button>
            </div>

            <div className="mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#5f665e] mb-3">Care Discipline</div>
              <div className="space-y-1.5">
                {CARE_TYPES.map((t) => (
                  <label
                    key={t}
                    className={'flex items-center gap-2.5 text-[13.5px] py-1.5 px-2 rounded-lg cursor-pointer transition ' + (typeFilter === t ? 'bg-[#ebf5ee] text-[#1e5e3a] font-bold' : 'text-[#121412] hover:bg-[#faf7ee]')}
                  >
                    <input
                      type="radio"
                      name="careType"
                      className="accent-[#1e5e3a]"
                      checked={typeFilter === t}
                      onChange={() => setTypeFilter(t)}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#5f665e] mb-2.5">Specific Needs</div>
              <div className="flex gap-1.5 flex-wrap">
                {QUICK_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="bg-[#faf7ee] hover:bg-[#ebf5ee] text-[#121412] hover:text-[#1e5e3a] border border-[#e6e1d4] text-[11px] font-bold px-2.5 py-1 rounded-full transition"
                    onClick={() => { setSearch(t); setQuery(t); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div>
            {/* Search Input Bar */}
            <div className="flex gap-2 bg-white border border-[#e6e1d4] rounded-xl p-2 mb-6 shadow-card focus-within:border-[#1e5e3a] transition">
              <span className="self-center pl-2 text-lg">🔍</span>
              <input
                className="border-none px-2 py-2 text-sm flex-1 outline-none text-[#121412] placeholder-[#828a81]"
                placeholder="Search caregiver by name, specialty, or condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') setQuery(search); }}
              />
              <button className="btn btn-primary btn-sm" onClick={() => setQuery(search)}>
                Search
              </button>
            </div>

            <div className="flex justify-between items-center mb-5">
              <div className="font-extrabold text-[#121412] text-sm tracking-tight">
                Showing {filtered.length} verified caregiver{filtered.length === 1 ? '' : 's'}
              </div>
              <Link href="/provider-register" className="btn btn-outline btn-sm">
                + Register as Caretaker
              </Link>
            </div>

            {/* Caretaker Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.length === 0 ? (
                <div className="col-span-full bg-white border border-[#e6e1d4] rounded-2xl text-center py-16 text-[#5f665e] shadow-card">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="font-bold text-[#121412] text-base mb-1">No caregivers match your criteria</div>
                  <p className="text-xs text-[#5f665e]">Try clearing your search query or selecting a different discipline.</p>
                </div>
              ) : (
                filtered.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-[#e6e1d4] rounded-2xl p-5 border-t-[3px] border-t-[#1e5e3a] shadow-card hover:shadow-cardHover transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex gap-3 mb-3">
                        <div className="w-[48px] h-[48px] rounded-full bg-[#1e5e3a] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="font-bold text-[#121412] text-[15px] leading-tight">{c.name}</div>
                          <div className="text-xs text-[#5f665e] mt-0.5">{c.role}</div>
                          <div className="text-xs text-[#e07a4f] font-bold mt-0.5">★ {c.rating}</div>
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-wrap mb-3">
                        {c.tags.map((t) => (
                          <span key={t} className="bg-[#faf7ee] text-[#121412] border border-[#e6e1d4] text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>

                      <p className="text-[13px] text-[#5f665e] mb-3 leading-relaxed">{c.desc}</p>
                      <div className="text-xs text-[#5f665e] font-semibold mb-4">
                        🕐 {c.exp} &nbsp;•&nbsp; 📱 {c.phone}
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-[#e6e1d4] pt-3.5 mt-2">
                      <div>
                        <div className="text-[11px] text-[#5f665e] font-semibold">Starting at</div>
                        <div className="text-[#121412] text-[15px] font-bold">{c.rate}</div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleBook(c)}>
                        Book Now
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {bookingProvider && (
        <BookingFlow kind="Caretaker" provider={bookingProvider} onClose={() => setBookingProvider(null)} />
      )}
    </div>
  );
}
