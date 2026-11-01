'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useToast } from '../app/providers';

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  async function handleLogout() {
    await logout();
    toast('Logged out', 'ok');
    setOpen(false);
    router.push('/');
  }

  const navLink = (href, label) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={
          'text-[14px] font-semibold transition-all py-1 px-2.5 rounded-md ' +
          (isActive
            ? 'text-[#121412] bg-[#f0ecdf]'
            : 'text-[#5f665e] hover:text-[#121412] hover:bg-[#f5f1e7]')
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Top Notification Bar (as in Ferndesk Image 1) */}
      <div className="bg-[#111311] text-white text-[12px] py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="bg-[#9ee86f] text-[#111311] text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider">
          NEW
        </span>
        <span className="text-[#e2ded5]">
          AI skin triage &amp; verified caregiver matching now live.
        </span>
        <Link href="/doctors" className="underline font-semibold hover:text-[#9ee86f] ml-1">
          Explore network &rarr;
        </Link>
      </div>

      <nav className="bg-[#faf7ee]/95 backdrop-blur-md border-b border-[#e6e1d4] sticky top-0 z-[100]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-[19px] text-[#121412] tracking-tight">
            <span className="w-[32px] h-[32px] rounded-lg bg-[#1e5e3a] text-white flex items-center justify-center text-sm shadow-sm font-black">
              ✚
            </span>
            <span>Aurora Care</span>
          </Link>

          <div className="hidden md:flex gap-2 items-center">
            {navLink('/doctors', 'Consult a Doctor')}
            {navLink('/caretakers', 'Book a Caretaker')}
            {navLink('/skin-check', 'AI Skin Check')}
            {navLink('/provider-register', 'Join as Provider')}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={ref}>
                <button
                  onClick={() => setOpen((o) => !o)}
                  className="flex items-center gap-2 bg-white border border-[#e6e1d4] rounded-full pl-1.5 pr-3 py-1 text-[13px] font-semibold text-[#121412] hover:border-[#1e5e3a] shadow-card transition-all"
                >
                  <span className="w-[28px] h-[28px] rounded-full bg-[#1e5e3a] text-white flex items-center justify-center text-[11.5px] font-bold">
                    {initials(user.name)}
                  </span>
                  <span>{user.name.split(' ')[0]}</span>
                </button>
                {open && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-white border border-[#e6e1d4] rounded-xl shadow-modal w-[230px] p-2.5 z-[200]">
                    <div className="pb-2.5 mb-2 border-b border-[#e6e1d4] px-2 pt-1">
                      <div className="font-bold text-[14px] text-[#121412]">{user.name}</div>
                      <div className="text-[12px] text-[#5f665e] truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-[#121412] hover:bg-[#faf7ee]"
                    >
                      👤 My Profile &amp; Records
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-[#121412] hover:bg-[#faf7ee]"
                    >
                      📅 My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13.5px] font-medium text-[#c93b32] hover:bg-[#fdf2f1]"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-[14px] font-semibold text-[#121412] hover:text-[#1e5e3a] px-3 py-1.5"
                >
                  Sign in
                </Link>
                <Link
                  href="/doctors"
                  className="btn btn-primary btn-sm"
                >
                  Book a visit
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
