'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '../../providers';

const AVAILABILITY = ['Weekdays', 'Weekends', 'Evenings', 'On-Call'];

export default function ProviderRegisterPage() {
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState([]);
  const toast = useToast();

  function toggleAvailability(v) {
    setAvailability((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const form = e.target;
    const payload = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      field: form.field.value,
      specialty: form.specialty.value.trim(),
      quals: form.quals.value.trim(),
      availability,
    };
    setSubmitting(true);
    try {
      const res = await fetch('/api/provider-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ kind: 'bad', text: data.error || 'Something went wrong.' });
        return;
      }
      setMsg({ kind: 'ok', text: 'Application submitted! Our clinical team will verify your license details and follow up by email.' });
      form.reset();
      setAvailability([]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-65px)]">
      {/* Left Column: Forest Green Panel */}
      <div className="hidden md:flex flex-col justify-between p-14 bg-[#1e5e3a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-matrix-dark opacity-30 pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
            <span className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center font-bold">
              ✚
            </span>
            <span>Aurora Care</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-10 max-w-[440px]">
          <div className="inline-block bg-[#16482c] border border-[#2b794f] text-[#9ee86f] text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
            PROVIDER ONBOARDING
          </div>
          <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-tight mb-4">
            Join Our Prestigious <br />
            <span className="text-[#9ee86f]">Care Network.</span>
          </h2>
          <p className="text-[#d2ecd9] text-[15px] leading-relaxed mb-6">
            Partner with Aurora Care to deliver precision medicine and dignified in-home care to thousands of patients seeking trusted wellness management.
          </p>
          <div className="space-y-3 text-xs text-[#e3f4ea]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#9ee86f] font-bold text-sm">✓</span>
              <span><b>Autonomous Scheduling:</b> Set your own hours, rates, and in-person or telehealth format.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[#9ee86f] font-bold text-sm">✓</span>
              <span><b>Direct Patient Relationship:</b> Verified patient health profiles &amp; direct phone/email contact.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[#9ee86f] font-bold text-sm">✓</span>
              <span><b>Guaranteed Timely Compensation:</b> Automated client billing and weekly direct deposits.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#a3d8b5]">
          Verified by Aurora Credentialing Board
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="bg-[#faf7ee] flex items-center justify-center p-6 sm:p-10">
        <div className="bg-white border border-[#e6e1d4] rounded-2xl shadow-card p-8 w-full max-w-[480px]">
          <h3 className="text-[#121412] text-xl font-extrabold mb-1">Provider Application</h3>
          <p className="text-[13px] text-[#5f665e] mb-5">
            Submit your professional credentials to initiate the directory verification process.
          </p>

          {msg && (
            <div className={'text-[13px] px-3.5 py-2.5 rounded-lg mb-4 font-semibold ' + (msg.kind === 'ok' ? 'bg-[#ebf5ee] text-[#1e5e3a] border border-[#d2ecd9]' : 'bg-[#fdf2f1] text-[#c93b32] border border-[#f3b5b1]')}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field mb-3.5">
              <label>Full Legal Name &amp; Title</label>
              <input name="fullName" type="text" placeholder="Dr. Jane Doe, MD or Sarah Jenkins, RN" required />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div className="field">
                <label>Professional Email</label>
                <input name="email" type="email" placeholder="jane@clinic.com" required />
              </div>
              <div className="field">
                <label>Direct Phone</label>
                <input name="phone" type="tel" placeholder="+1 (555) 000-0000" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3.5">
              <div className="field">
                <label>Clinical Discipline</label>
                <select name="field" defaultValue="" required>
                  <option value="" disabled>Select discipline</option>
                  <option value="Doctor">Doctor / Physician</option>
                  <option value="Nursing">Nurse / Caretaker</option>
                  <option value="Physiotherapy">Physiotherapist</option>
                  <option value="Massage Therapy">Massage Therapist</option>
                  <option value="Elderly Care">Elderly Care Specialist</option>
                </select>
              </div>
              <div className="field">
                <label>Sub-Specialty</label>
                <input name="specialty" type="text" placeholder="e.g. Cardiology, Rehab" required />
              </div>
            </div>

            <div className="field mb-3.5">
              <label>License &amp; Board Certifications</label>
              <textarea
                name="quals"
                rows={2}
                placeholder="State license number, issuing medical board, active certifications..."
                required
              />
            </div>

            <div className="field mb-5">
              <label>Preferred Availability</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {AVAILABILITY.map((t) => {
                  const isChecked = availability.includes(t);
                  return (
                    <label
                      key={t}
                      className={
                        'text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border transition ' +
                        (isChecked
                          ? 'bg-[#1e5e3a] text-white border-[#1e5e3a]'
                          : 'bg-[#faf7ee] text-[#121412] border-[#e6e1d4] hover:border-[#1e5e3a]')
                      }
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isChecked}
                        onChange={() => toggleAvailability(t)}
                      />
                      {isChecked ? '✓ ' : '+ '}{t}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#e6e1d4]">
              <Link href="/" className="text-[#5f665e] hover:text-[#121412] font-semibold text-xs">
                ← Cancel
              </Link>
              <button className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Credentials →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
