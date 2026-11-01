'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../providers';

export default function AdminLoginPage() {
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const adminId = e.target.adminId.value.trim();
    const password = e.target.password.value;
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ kind: 'bad', text: data.error || 'Invalid credentials.' });
        return;
      }
      toast('Welcome, Admin', 'ok');
      router.push('/admin/dashboard');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-screen">
      {/* Left Column: Obsidian with Lime accents */}
      <div className="hidden md:flex flex-col justify-between p-14 bg-[#111311] text-white relative">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
            <span className="w-[34px] h-[34px] rounded-lg bg-[#1e5e3a] text-white flex items-center justify-center font-bold">
              ✚
            </span>
            <span>Aurora Care</span>
          </Link>
        </div>

        <div className="max-w-[420px] my-auto py-12">
          <div className="inline-block bg-[#1a2119] border border-[#2b3a2a] text-[#9ee86f] text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
            RESTRICTED ACCESS
          </div>
          <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-tight mb-4">
            Clinical Operations &amp; <br />
            <span className="text-[#9ee86f]">Provider Governance.</span>
          </h2>
          <p className="text-[#9da39b] text-[15px] leading-relaxed">
            Manage provider credential approvals, doctor fee schedules, caretaker directories, and patient appointment auditing.
          </p>
        </div>

        <div className="text-xs text-[#6e756b]">
          Secured with multi-factor audit logging · Aurora Administrative Portal
        </div>
      </div>

      {/* Right Column: Warm Cream Canvas */}
      <div className="bg-[#faf7ee] flex items-center justify-center p-6 sm:p-10">
        <div className="bg-white border border-[#e6e1d4] rounded-2xl shadow-card p-8 w-full max-w-[400px]">
          <h3 className="text-[#121412] text-xl font-extrabold mb-1">Administrative Sign In</h3>
          <p className="text-[13px] text-[#5f665e] mb-5">Enter authorized root credentials to proceed.</p>

          {msg && (
            <div className={'text-[13px] px-3.5 py-2.5 rounded-lg mb-4 font-semibold ' + (msg.kind === 'ok' ? 'bg-[#ebf5ee] text-[#1e5e3a] border border-[#d2ecd9]' : 'bg-[#fdf2f1] text-[#c93b32] border border-[#f3b5b1]')}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field mb-4">
              <label>Admin User ID</label>
              <input name="adminId" type="text" placeholder="admin@aurora_care" required />
            </div>
            <div className="field mb-5">
              <label>Administrative Password</label>
              <input name="password" type="password" placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary w-full py-2.5" disabled={submitting}>
              {submitting ? 'Authenticating…' : 'Sign In as Admin →'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#e6e1d4] text-center">
            <Link href="/" className="text-[#1e5e3a] font-bold text-xs hover:underline">
              ← Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
