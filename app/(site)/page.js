'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Can in-home nurses administer prescription medications?',
      a: 'Yes. All nurses in our directory are licensed RNs or LPNs certified to manage IV medications, wound care, post-surgical dressing changes, and daily vital tracking under physician guidance.',
    },
    {
      q: 'What does "verified caregiver" actually mean?',
      a: 'Every caregiver undergoes rigorous multi-tier vetting: state license validation, criminal background checks, identity authentication, and clinical reference verification before ever being listed.',
    },
    {
      q: 'How fast can a doctor video consultation begin?',
      a: 'Specialists offer slots within hours. You can choose immediate on-call availability or reserve your preferred date and time directly from their live calendar.',
    },
    {
      q: 'How does the AI Skin Care Check work?',
      a: 'Our smart visual assistant analyzes your uploaded close-up photo against clinical dermatological patterns to gauge confidence, recommend immediate home remedies, and advise if emergency care is warranted.',
    },
    {
      q: 'Will my medical history and bookings be preserved?',
      a: 'Yes. Your personal health profile securely retains past vitals, current medications, emergency contacts, and complete appointment history for effortless continuity of care.',
    },
    {
      q: 'What if I need to reschedule or cancel a booking?',
      a: 'You can cancel or adjust any upcoming appointment with one click right inside your Patient Dashboard. Direct phone and email contact for your provider is also provided upon confirmation.',
    },
  ];

  return (
    <>
      {/* ================= HERO SECTION (FERNDESK STYLE - SCREENSHOT 1) ================= */}
      <section className="bg-[#faf7ee] pt-16 pb-8 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center relative z-10">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#ebf5ee] border border-[#d2ecd9] text-[#1e5e3a] text-[13px] font-bold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1e5e3a]"></span>
            The next-generation clinical care network
          </div>

          {/* Main Editorial Hero Headline */}
          <h1 className="text-[44px] sm:text-[58px] lg:text-[68px] leading-[1.05] font-extrabold text-[#121412] tracking-tight max-w-[920px] mx-auto mb-6">
            The health network that <br />
            <span className="text-[#121412]">never leaves you waiting.</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-[17px] sm:text-[19px] text-[#5f665e] max-w-[680px] mx-auto mb-9 leading-relaxed font-normal">
            Aurora Care unifies certified in-home nurses, physiotherapists, and board-certified doctors —
            paired with instant AI symptom triage, verified booking, and empathetic care.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center justify-center gap-3.5 flex-wrap mb-14">
            <Link
              href="/doctors"
              className="btn btn-primary px-6 py-3.5 text-[15px] font-bold rounded-lg shadow-sm"
            >
              Book a consultation &rarr;
            </Link>
            <Link
              href="/provider-register"
              className="btn btn-outline px-6 py-3.5 text-[15px] font-bold rounded-lg"
            >
              🤝 Join as a provider
            </Link>
          </div>

          {/* Hero UI Mockup Card (Like Ferndesk Hero Dashboard Screenshot) */}
          <div className="max-w-[1000px] mx-auto bg-white border border-[#e6e1d4] rounded-2xl shadow-lg2 p-4 sm:p-6 text-left relative z-10">
            {/* Top Bar of the Mockup */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e6e1d4] flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                <span className="text-xs font-mono text-[#828a81] ml-2">portal.auroracare.com</span>
              </div>
              <div className="flex gap-2">
                <span className="text-xs font-bold bg-[#ebf5ee] text-[#1e5e3a] px-2.5 py-1 rounded-md">
                  ✓ Verified Staff Live
                </span>
                <Link
                  href="/skin-check"
                  className="text-xs font-bold bg-[#faf7ee] text-[#121412] border border-[#e6e1d4] px-2.5 py-1 rounded-md hover:bg-[#f3efe4]"
                >
                  Run Skin AI &rarr;
                </Link>
              </div>
            </div>

            {/* Content of the Mockup Card */}
            <div className="grid md:grid-cols-[1.6fr_1fr] gap-6 items-start">
              {/* Left Column: Live Search & Active Services */}
              <div>
                <div className="bg-[#faf7ee] border border-[#e6e1d4] rounded-xl p-3.5 flex items-center gap-3 mb-5">
                  <span className="text-lg">🔍</span>
                  <input
                    type="text"
                    readOnly
                    value="Dr. Priya Menon, Cardiology & In-Home Nursing..."
                    className="bg-transparent border-none text-[13.5px] font-medium text-[#121412] outline-none w-full cursor-default"
                  />
                  <span className="text-xs font-bold text-[#1e5e3a] bg-[#ebf5ee] px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="border border-[#e6e1d4] rounded-xl p-4 bg-white hover:border-[#1e5e3a] transition">
                    <div className="text-2xl mb-2">🧑‍⚕️</div>
                    <div className="font-bold text-[14px] text-[#121412]">In-Home Nursing</div>
                    <div className="text-xs text-[#5f665e] mt-1">Verified RNs arriving next day for wound, IV, and post-op care.</div>
                    <div className="text-xs font-bold text-[#1e5e3a] mt-2.5">From $45/hr &rarr;</div>
                  </div>
                  <div className="border border-[#e6e1d4] rounded-xl p-4 bg-white hover:border-[#1e5e3a] transition">
                    <div className="text-2xl mb-2">🩺</div>
                    <div className="font-bold text-[14px] text-[#121412]">Specialist Telehealth</div>
                    <div className="text-xs text-[#5f665e] mt-1">Instant video consults with cardiologists, GPs &amp; pediatricians.</div>
                    <div className="text-xs font-bold text-[#1e5e3a] mt-2.5">Slots open today &rarr;</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Trending Providers / Live Status */}
              <div className="bg-[#faf7ee] border border-[#e6e1d4] rounded-xl p-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5f665e] mb-3">
                  Live Caretaker Availability
                </div>
                <div className="space-y-3">
                  <div className="bg-white border border-[#e6e1d4] rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1e5e3a] text-white flex items-center justify-center font-bold text-xs">
                        SJ
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#121412]">Sarah Jenkins, RN</div>
                        <div className="text-[11px] text-[#5f665e]">Available 9:00 AM Tomorrow</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold bg-[#ebf5ee] text-[#1e5e3a] px-2 py-0.5 rounded">
                      Available
                    </span>
                  </div>

                  <div className="bg-white border border-[#e6e1d4] rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#121412] text-white flex items-center justify-center font-bold text-xs">
                        PM
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#121412]">Dr. Priya M., MD</div>
                        <div className="text-[11px] text-[#5f665e]">Cardiology · Video Call</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold bg-[#ebf5ee] text-[#1e5e3a] px-2 py-0.5 rounded">
                      Live Now
                    </span>
                  </div>

                  <div className="bg-white border border-[#e6e1d4] rounded-lg p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#9ee86f] text-[#111311] flex items-center justify-center font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <div className="font-bold text-xs text-[#121412]">DermAI Diagnostic</div>
                        <div className="text-[11px] text-[#5f665e]">Instant skin photo check</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold bg-[#f0fbe8] text-[#174b2e] px-2 py-0.5 rounded">
                      &lt; 30s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= THREE-ROW CHECKERBOARD RIBBON (FROM FERNDESK IMAGE 1 & 4) ================= */}
        <div className="mt-14 w-full">
          <div className="h-3 ribbon-checker-orange w-full"></div>
          <div className="h-3 ribbon-checker-lime w-full"></div>
          <div className="h-3 ribbon-checker-forest w-full"></div>
        </div>

        {/* Dark Monochrome Trust Bar */}
        <div className="bg-[#111311] text-white py-6">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-xs uppercase font-mono tracking-widest text-[#8b918a]">
              Trusted by 10,000+ patients &amp; premier care networks
            </span>
            <div className="flex items-center gap-8 text-[#9da39c] font-bold text-sm tracking-wide opacity-80 flex-wrap justify-center">
              <span>✚ METRICOOL CARE</span>
              <span>✦ ZEFFY HEALTH</span>
              <span>❋ ANDRI CLINICAL</span>
              <span>■ PIXEL CARE</span>
              <span>❖ APEX THERAPY</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DARK EDITORIAL CONTRAST SECTION (FERNDESK STYLE - SCREENSHOT 2) ================= */}
      <section className="bg-[#111311] text-white py-24 relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="mb-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#9ee86f] uppercase">
              SOUND FAMILIAR?
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start mb-16">
            <div>
              <h2 className="text-[38px] sm:text-[54px] font-extrabold leading-[1.08] tracking-tight mb-6">
                This month, you needed <br />
                <span className="text-[#9ee86f]">urgent specialist care.</span>
              </h2>
              <p className="text-[17px] text-[#a1a89f] leading-relaxed max-w-[560px]">
                And yet the earliest clinic appointment was <span className="text-[#9ee86f] font-semibold">3 weeks away</span>.
                It&apos;s not your fault. Navigating legacy healthcare while managing a family or demanding career is exhausting.
              </p>
            </div>

            {/* Stepped Checklist of Traditional Frustrations */}
            <div className="text-right text-[#697267] font-bold text-lg sm:text-xl space-y-2 select-none hidden lg:block">
              <div>called four clinic desks.</div>
              <div>waited 45 mins on hold.</div>
              <div>clipboard paper intake.</div>
              <div className="text-[#849182]">missing medical history.</div>
              <div className="text-[#a4b4a1]">unclear consultation pricing.</div>
              <div className="text-[#9ee86f]">finally: instant booking with Aurora.</div>
            </div>
          </div>

          {/* Testimonial Quote Columns (Direct match to Screenshot 2) */}
          <div className="grid md:grid-cols-4 gap-6 pt-6 border-t border-[#262b26]">
            <div>
              <p className="text-[13.5px] text-[#e0ded8] leading-relaxed mb-4">
                &ldquo;Before Aurora Care our process for booking in-home nursing was basically{' '}
                <span className="text-[#9ee86f] font-semibold">hopefully we remember to call three agencies</span>.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1e5e3a] flex items-center justify-center font-bold text-xs text-white">
                  BD
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Brennan Dunn</div>
                  <div className="text-[11px] text-[#7e857b]">Family Caregiver</div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13.5px] text-[#e0ded8] leading-relaxed mb-4">
                &ldquo;We need specialized physical therapy twice every week.{' '}
                <span className="text-[#9ee86f] font-semibold">Waiting weeks for referral approvals was hell</span>.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#344033] flex items-center justify-center font-bold text-xs text-[#9ee86f]">
                  TR
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Tristan Roth</div>
                  <div className="text-[11px] text-[#7e857b]">Patient</div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13.5px] text-[#e0ded8] leading-relaxed mb-4">
                &ldquo;I used to put off skin concerns for months. With the AI triage and immediate doctor consult,{' '}
                <span className="text-[#9ee86f] font-semibold">I solved it in day one</span>.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1e5e3a] flex items-center justify-center font-bold text-xs text-white">
                  FD
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Fed G.</div>
                  <div className="text-[11px] text-[#7e857b]">Dermatology Patient</div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13.5px] text-[#e0ded8] leading-relaxed mb-4">
                &ldquo;Finding a trustworthy nurse was something{' '}
                <span className="text-[#9ee86f] font-semibold">I was terrified of doing blindly</span>. Aurora&apos;s vetting gave total confidence.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#344033] flex items-center justify-center font-bold text-xs text-[#9ee86f]">
                  LE
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Laura Elizabeth</div>
                  <div className="text-[11px] text-[#7e857b]">Care Coordinator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NUMBERED 01 02 03 FEATURE GRID (FERNDESK STYLE - SCREENSHOT 3) ================= */}
      <section className="bg-[#faf7ee] py-24 relative bg-dot-matrix">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-[720px] mb-16">
            <h2 className="text-[38px] sm:text-[48px] font-extrabold text-[#121412] leading-[1.1] tracking-tight mb-4">
              Stop hoping your care is right. <span className="text-[#1e5e3a]">Know.</span>
            </h2>
            <p className="text-[17px] text-[#5f665e] leading-relaxed">
              Connect your symptoms. Aurora matches you against licensed professionals who review your records,
              prescribe remedies, and follow up until you recover.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 01 */}
            <div className="bg-white border border-[#e6e1d4] rounded-2xl p-7 flex flex-col justify-between shadow-card hover:border-[#1e5e3a] transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#ebf5ee] text-[#1e5e3a] flex items-center justify-center text-lg">
                    🏠
                  </div>
                  <span className="font-mono text-xs font-bold text-[#828a81]">01</span>
                </div>
                <h3 className="text-xl font-bold text-[#121412] mb-3">In-Home Nursing &amp; PT</h3>
                <p className="text-[14px] text-[#5f665e] leading-relaxed">
                  Certified nurses, physiotherapists, and massage therapists available hourly, for full day visits, or recurring sessions.
                  Fully background-checked.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e6e1d4]">
                <Link href="/caretakers" className="text-xs font-bold text-[#1e5e3a] hover:underline flex items-center gap-1">
                  Find a caregiver &rarr;
                </Link>
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-white border border-[#e6e1d4] rounded-2xl p-7 flex flex-col justify-between shadow-card hover:border-[#1e5e3a] transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#ebf5ee] text-[#1e5e3a] flex items-center justify-center text-lg">
                    🔬
                  </div>
                  <span className="font-mono text-xs font-bold text-[#828a81]">02</span>
                </div>
                <h3 className="text-xl font-bold text-[#121412] mb-3">Instant AI Skin Check</h3>
                <p className="text-[14px] text-[#5f665e] leading-relaxed">
                  Photograph affected skin for an immediate pattern analysis, confidence rating, home care remedies,
                  and direct specialist referral where needed.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e6e1d4]">
                <Link href="/skin-check" className="text-xs font-bold text-[#1e5e3a] hover:underline flex items-center gap-1">
                  Run AI assessment &rarr;
                </Link>
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-white border border-[#e6e1d4] rounded-2xl p-7 flex flex-col justify-between shadow-card hover:border-[#1e5e3a] transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#ebf5ee] text-[#1e5e3a] flex items-center justify-center text-lg">
                    🩺
                  </div>
                  <span className="font-mono text-xs font-bold text-[#828a81]">03</span>
                </div>
                <h3 className="text-xl font-bold text-[#121412] mb-3">Doctor Telehealth Consults</h3>
                <p className="text-[14px] text-[#5f665e] leading-relaxed">
                  Book secure private video and voice calls with board-certified physicians in cardiology, general practice,
                  geriatrics, and family medicine.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e6e1d4]">
                <Link href="/doctors" className="text-xs font-bold text-[#1e5e3a] hover:underline flex items-center gap-1">
                  Browse doctors &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FULL BLEED FOREST GREEN SECTION (FERNDESK STYLE - SCREENSHOT 4) ================= */}
      <section className="bg-[#1e5e3a] text-white py-24 relative overflow-hidden">
        {/* Subtle top ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 ribbon-checker-forest opacity-50"></div>

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-[36px] sm:text-[48px] font-extrabold leading-[1.1] tracking-tight mb-5">
                The care you keep putting off <br />
                takes ten minutes.
              </h2>
              <p className="text-[16.5px] text-[#d6ede0] leading-relaxed mb-6 max-w-[520px]">
                You&apos;ve stayed put because booking care traditionally means endless hold music,
                lost medical history, and filling clipboard forms. Aurora brings certified staff,
                verified health records, and direct provider numbers directly to you.
              </p>

              {/* Dotted lime green indicators (Direct match to Screenshot 4) */}
              <div className="flex gap-2 mb-6">
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
                <span className="w-3.5 h-1.5 rounded-full bg-[#9ee86f]"></span>
              </div>

              {/* Bullet comparisons */}
              <div className="space-y-3 text-[14px] text-[#e3f4ea] mb-9">
                <div>&ldquo;We don&apos;t know your vitals.&rdquo; <span className="text-white font-semibold">Every record &amp; allergy is preserved.</span></div>
                <div>&ldquo;It&apos;ll take a week to verify a nurse.&rdquo; <span className="text-white font-semibold">Pre-verified providers ready today.</span></div>
                <div>&ldquo;We can&apos;t give direct provider contact.&rdquo; <span className="text-white font-semibold">Direct phone &amp; email shared instantly.</span></div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3.5 flex-wrap">
                <Link
                  href="/doctors"
                  className="bg-white text-[#1e5e3a] hover:bg-[#faf7ee] font-bold px-6 py-3.5 rounded-lg text-sm transition shadow-sm"
                >
                  Book your visit in 10 minutes
                </Link>
                <Link
                  href="/provider-register"
                  className="bg-[#174b2e] border border-[#2b794f] text-white hover:bg-[#134027] font-bold px-5 py-3.5 rounded-lg text-sm transition"
                >
                  🤝 Join our network
                </Link>
              </div>

              {/* Discipline pills at bottom */}
              <div className="mt-10 pt-6 border-t border-[#29784e]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#a2d8b5] mb-2">
                  CERTIFIED DISCIPLINES
                </div>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-[#174b2e] px-2.5 py-1 rounded-md border border-[#2d8355]">Registered Nursing</span>
                  <span className="bg-[#174b2e] px-2.5 py-1 rounded-md border border-[#2d8355]">Cardiology</span>
                  <span className="bg-[#174b2e] px-2.5 py-1 rounded-md border border-[#2d8355]">Physiotherapy</span>
                  <span className="bg-[#174b2e] px-2.5 py-1 rounded-md border border-[#2d8355]">Geriatric Care</span>
                  <span className="bg-[#174b2e] px-2.5 py-1 rounded-md border border-[#2d8355]">Dermatology</span>
                </div>
              </div>
            </div>

            {/* Right Side Testimonial Cards (White cards on deep green with Lime highlights) */}
            <div className="space-y-4">
              <div className="bg-white text-[#121412] rounded-2xl p-6 shadow-lg2">
                <p className="text-[15px] leading-relaxed mb-5">
                  &ldquo;Not only was it{' '}
                  <mark className="bg-[#9ee86f] text-[#111311] px-1.5 py-0.5 rounded font-bold">
                    super easy to find an in-home nurse
                  </mark>
                  , now my father&apos;s recovery visits are scheduled automatically every Tuesday.
                  The clarity and dignity of care is unparalleled.&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-[#e6e1d4] pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1e5e3a] text-white flex items-center justify-center font-bold text-xs">
                      FG
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#121412]">Fed G.</div>
                      <div className="text-[11px] text-[#5f665e]">Patient Family</div>
                    </div>
                  </div>
                  <Link href="/caretakers" className="text-xs font-bold text-[#1e5e3a] hover:underline">
                    View Caretaker Profiles &rarr;
                  </Link>
                </div>
              </div>

              <div className="bg-white text-[#121412] rounded-2xl p-6 shadow-lg2">
                <p className="text-[15px] leading-relaxed mb-5">
                  &ldquo;We booked Dr. Priya Menon for a telemedicine review, and it{' '}
                  <mark className="bg-[#9ee86f] text-[#111311] px-1.5 py-0.5 rounded font-bold">
                    felt like upgrading from healthcare of the 90s
                  </mark>
                  . Faster, transparent pricing, and instant prescription coordination.&rdquo;
                </p>
                <div className="flex items-center justify-between border-t border-[#e6e1d4] pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#121412] text-white flex items-center justify-center font-bold text-xs">
                      JP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#121412]">Juan Perez</div>
                      <div className="text-[11px] text-[#5f665e]">Verified Patient</div>
                    </div>
                  </div>
                  <Link href="/doctors" className="text-xs font-bold text-[#1e5e3a] hover:underline">
                    See Specialist Directory &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL NUMBERED ACCORDION FAQ (FERNDESK STYLE - SCREENSHOT 5) ================= */}
      <section className="bg-[#faf7ee] py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left Column Editorial Heading */}
            <div>
              <h2 className="text-[38px] sm:text-[46px] font-extrabold text-[#121412] leading-[1.08] tracking-tight mb-4">
                The things <br />
                people ask before <br />
                they switch.
              </h2>
              <p className="text-[15px] text-[#5f665e]">
                Something we missed?{' '}
                <a href="mailto:support@auroracare.com" className="text-[#1e5e3a] underline font-bold">
                  Write to us
                </a>
                , a human answers.
              </p>
            </div>

            {/* Right Column Numbered Accordion */}
            <div className="border-t border-[#e6e1d4]">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const numStr = String(idx + 1).padStart(2, '0');
                return (
                  <div key={idx} className="border-b border-[#e6e1d4] py-5">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="w-full text-left flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-5">
                        <span className="font-mono text-xs font-bold text-[#828a81] pt-1">
                          {numStr}
                        </span>
                        <span className="text-[17px] font-extrabold text-[#121412] group-hover:text-[#1e5e3a] transition">
                          {faq.q}
                        </span>
                      </div>
                      <span className="font-mono text-xl text-[#121412] font-semibold flex-shrink-0">
                        {isOpen ? '—' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="mt-3.5 pl-9 pr-6 text-[14.5px] text-[#5f665e] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
