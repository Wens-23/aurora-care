'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../../providers';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signupPassword, setSignupPassword] = useState('');

  const { refresh } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const rules = {
    length: signupPassword.length >= 8,
    uppercase: /[A-Z]/.test(signupPassword),
    lowercase: /[a-z]/.test(signupPassword),
    number: /[0-9]/.test(signupPassword),
    special: /[!@#$%^&*]/.test(signupPassword),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg(null);
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setMsg({ kind: 'bad', text: 'Please fill in both fields.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ kind: 'bad', text: data.error || 'Something went wrong.' });
        return;
      }
      await refresh();
      toast('Welcome back, ' + data.user.name.split(' ')[0] + '!', 'ok');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMsg(null);
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const password = signupPassword;

    if (!name || !email || !phone || !password) {
      setMsg({ kind: 'bad', text: 'All fields, including phone number, are required.' });
      return;
    }

    if (!isPasswordValid) {
      setMsg({ kind: 'bad', text: 'Please satisfy all password requirements.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ kind: 'bad', text: data.error || 'Something went wrong.' });
        return;
      }
      await refresh();
      toast('Account created — welcome to Aurora Care!', 'ok');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-65px)]">
      {/* Left Brand Panel: Deep Forest Green / Obsidian */}
      <div className="hidden md:flex flex-col justify-between p-14 bg-[#1e5e3a] text-white relative overflow-hidden">
        {/* Subtle dot matrix overlay */}
        <div className="absolute inset-0 bg-dot-matrix-dark opacity-30 pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl text-white">
            <span className="w-[34px] h-[34px] rounded-lg bg-white/10 flex items-center justify-center font-bold">
              ✚
            </span>
            <span>Aurora Care</span>
          </Link>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-[420px]">
          <div className="inline-block bg-[#16482c] border border-[#2b794f] text-[#9ee86f] text-xs font-mono font-bold px-3 py-1 rounded-full mb-4">
            PATIENT PORTAL ACCESS
          </div>
          <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-tight mb-4">
            Clinical excellence, <br />
            <span className="text-[#9ee86f]">redefined.</span>
          </h2>
          <p className="text-[#d2ecd9] text-[15px] leading-relaxed mb-6">
            Access your health records, consult specialists, coordinate in-home care visits, and track your well-being with unprecedented clarity.
          </p>
          <div className="space-y-2 text-xs text-[#e3f4ea]">
            <div className="flex items-center gap-2">
              <span className="text-[#9ee86f]">✓</span> 256-bit encrypted health data storage
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9ee86f]">✓</span> Direct provider contact upon confirmation
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#9ee86f]">✓</span> Seamless booking &amp; cancel anytime
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#a3d8b5]">
          &copy; 2026 Aurora Care Systems. Designed to connect.
        </div>
      </div>

      {/* Right Form Panel: Warm Cream Canvas with Clean Card */}
      <div className="bg-[#faf7ee] flex items-center justify-center p-6 sm:p-10">
        <div className="bg-white border border-[#e6e1d4] rounded-2xl shadow-card p-8 w-full max-w-[420px]">
          {/* Segmented Switcher */}
          <div className="flex bg-[#faf7ee] border border-[#e6e1d4] rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setMsg(null); }}
              className={'flex-1 text-center py-2 rounded-lg font-bold text-[13px] transition ' + (tab === 'login' ? 'bg-white text-[#121412] shadow-sm' : 'text-[#5f665e] hover:text-[#121412]')}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setMsg(null); }}
              className={'flex-1 text-center py-2 rounded-lg font-bold text-[13px] transition ' + (tab === 'signup' ? 'bg-white text-[#121412] shadow-sm' : 'text-[#5f665e] hover:text-[#121412]')}
            >
              Create Account
            </button>
          </div>

          {msg && (
            <div className={'text-[13px] px-3.5 py-2.5 rounded-lg mb-4 font-semibold ' + (msg.kind === 'ok' ? 'bg-[#ebf5ee] text-[#1e5e3a] border border-[#d2ecd9]' : 'bg-[#fdf2f1] text-[#c93b32] border border-[#f3b5b1]')}>
              {msg.text}
            </div>
          )}

          {tab === 'login' ? (
            <>
              <h3 className="text-[#121412] text-xl font-extrabold mb-1">Welcome back</h3>
              <p className="text-[13px] text-[#5f665e] mb-5">Sign in to manage your appointments and records.</p>
              <form onSubmit={handleLogin} noValidate>
                <div className="field mb-4">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="patient@example.com" />
                </div>
                <div className="field mb-5">
                  <label>Password</label>
                  <input name="password" type="password" placeholder="••••••••" />
                </div>
                <button className="btn btn-primary w-full py-2.5" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign In →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-[#121412] text-xl font-extrabold mb-1">Create your account</h3>
              <p className="text-[13px] text-[#5f665e] mb-5">Join Aurora Care in under a minute.</p>
              <form onSubmit={handleSignup} noValidate>
                <div className="field mb-3.5">
                  <label>Full Legal Name</label>
                  <input name="name" type="text" placeholder="Jane Doe" />
                </div>
                <div className="field mb-3.5">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="field mb-3.5">
                  <label>Phone Number</label>
                  <input name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="field mb-4">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <div className="mt-2.5 bg-[#faf7ee] border border-[#e6e1d4] rounded-lg p-3 text-[12px] text-[#5f665e]">
                    <div className="font-bold text-[#121412] mb-1.5">Password requirements:</div>
                    <ul className="space-y-1">
                      <li className={'flex items-center gap-1.5 ' + (rules.length ? 'text-[#1e5e3a] font-bold' : '')}>
                        <span>{rules.length ? '✓' : '•'}</span> At least 8 characters
                      </li>
                      <li className={'flex items-center gap-1.5 ' + (rules.uppercase ? 'text-[#1e5e3a] font-bold' : '')}>
                        <span>{rules.uppercase ? '✓' : '•'}</span> One uppercase letter
                      </li>
                      <li className={'flex items-center gap-1.5 ' + (rules.lowercase ? 'text-[#1e5e3a] font-bold' : '')}>
                        <span>{rules.lowercase ? '✓' : '•'}</span> One lowercase letter
                      </li>
                      <li className={'flex items-center gap-1.5 ' + (rules.number ? 'text-[#1e5e3a] font-bold' : '')}>
                        <span>{rules.number ? '✓' : '•'}</span> One number
                      </li>
                      <li className={'flex items-center gap-1.5 ' + (rules.special ? 'text-[#1e5e3a] font-bold' : '')}>
                        <span>{rules.special ? '✓' : '•'}</span> One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="btn btn-primary w-full py-2.5" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create Account →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
