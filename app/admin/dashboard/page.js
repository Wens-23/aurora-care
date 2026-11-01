'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../providers';
import Modal from '../../../components/Modal';

const TABS = [
  { id: 'stats', label: '📊 Stats' },
  { id: 'applications', label: '📋 Applications' },
  { id: 'doctors', label: '🩺 Doctor Management' },
  { id: 'caretakers', label: '🧑\u200d⚕️ Caretaker Management' },
  { id: 'bookings', label: '📅 Bookings' },
  { id: 'payments', label: '💳 Payments' },
  { id: 'notifications', label: '✉️ Notifications' },
];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('stats');
  const [authorized, setAuthorized] = useState(null);
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const router = useRouter();
  const toast = useToast();

  async function loadAll() {
    const statsRes = await fetch('/api/admin/stats');
    if (statsRes.status === 403) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
    setStats(await statsRes.json());
    const [dRes, cRes, bRes, nRes, aRes] = await Promise.all([
      fetch('/api/doctors'),
      fetch('/api/caretakers'),
      fetch('/api/bookings'),
      fetch('/api/admin/notifications'),
      fetch('/api/provider-applications'),
    ]);
    setDoctors((await dRes.json()).doctors);
    setCaretakers((await cRes.json()).caretakers);
    setBookings((await bRes.json()).bookings);
    setNotifications((await nRes.json()).notifications || []);
    setApplications((await aRes.json()).applications || []);
  }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    if (authorized === false) router.push('/admin/login');
  }, [authorized, router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    toast('Signed out of admin portal', 'ok');
    router.push('/');
  }

  async function removeDoctor(id) {
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Doctor removed from directory', 'ok'); loadAll(); }
    else toast('Could not remove doctor', 'bad');
  }
  async function removeCaretaker(id) {
    const res = await fetch(`/api/caretakers/${id}`, { method: 'DELETE' });
    if (res.ok) { toast('Caretaker removed from directory', 'ok'); loadAll(); }
    else toast('Could not remove caretaker', 'bad');
  }

  if (authorized === null) return null;
  if (authorized === false) return null;

  return (
    <div className="flex min-h-screen">
      <div className="w-[240px] bg-[#111311] text-white p-4 flex-shrink-0 flex flex-col border-r border-[#262b26] overflow-x-auto">
        <div className="font-extrabold text-[18px] px-2 pb-6 pt-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#1e5e3a] flex items-center justify-center text-xs">✚</span>
          Aurora Admin
        </div>
        <div className="space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                'flex items-center gap-2.5 px-3 py-2 rounded-lg font-bold text-[13px] w-full text-left transition ' +
                (tab === t.id
                  ? 'bg-[#1e5e3a] text-white'
                  : 'text-[#9da39b] hover:text-white hover:bg-white/5')
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg font-bold text-[13px] mt-8 text-[#ff8e8a] text-left hover:bg-white/5 transition"
        >
          🚪 Sign Out
        </button>
      </div>

      <div className="flex-1 p-8 bg-[#faf7ee]">
        <div className="mb-6 pb-4 border-b border-[#e6e1d4]">
          <div className="text-[11px] text-[#5f665e] font-mono uppercase tracking-wider font-bold">AURORA CLINICAL GOVERNANCE</div>
          <h1 className="text-[26px] text-[#121412] font-extrabold tracking-tight mt-0.5">
            {TABS.find((t) => t.id === tab)?.label.replace(/^\S+\s/, '')}
          </h1>
        </div>

        {tab === 'stats' && stats && <StatsTab stats={stats} onGoToApplications={() => setTab('applications')} />}
        {tab === 'applications' && <ApplicationsTab applications={applications} onChanged={loadAll} toast={toast} />}
        {tab === 'doctors' && <DoctorsTab doctors={doctors} onAdded={loadAll} onRemove={removeDoctor} toast={toast} />}
        {tab === 'caretakers' && <CaretakersTab caretakers={caretakers} onAdded={loadAll} onRemove={removeCaretaker} toast={toast} />}
        {tab === 'bookings' && <BookingsTab bookings={bookings} />}
        {tab === 'payments' && <PaymentsTab bookings={bookings} />}
        {tab === 'notifications' && <NotificationsTab notifications={notifications} />}
      </div>
    </div>
  );
}

function ApplicationsTab({ applications, onChanged, toast }) {
  const [approveTarget, setApproveTarget] = useState(null);
  const [feeOrRate, setFeeOrRate] = useState('');
  const [busy, setBusy] = useState(false);

  const pending = applications.filter((a) => a.status === 'Pending Review');
  const reviewed = applications.filter((a) => a.status !== 'Pending Review');

  async function confirmApprove() {
    if (!approveTarget) return;
    setBusy(true);
    try {
      const isDoctor = approveTarget.field === 'Doctor';
      const payload = isDoctor ? { fee: feeOrRate } : { rate: feeOrRate };
      const res = await fetch(`/api/provider-applications/${approveTarget.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Could not approve application', 'bad');
        return;
      }
      toast(`${approveTarget.fullName} added to the directory`, 'ok');
      onChanged();
    } finally {
      setBusy(false);
      setApproveTarget(null);
      setFeeOrRate('');
    }
  }

  async function reject(app) {
    const res = await fetch(`/api/provider-applications/${app.id}/reject`, { method: 'POST' });
    if (res.ok) {
      toast('Application rejected', 'ok');
      onChanged();
    } else {
      toast('Could not reject application', 'bad');
    }
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl p-5.5 mb-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-1">Pending Applications ({pending.length})</h3>
        <p className="text-[13px] text-muted mb-4">Submitted via the public Provider Registration form.</p>
        {pending.length ? (
          pending.map((a) => (
            <div key={a.id} className="border border-border rounded-xl p-4 mb-3 flex justify-between items-start gap-4 flex-wrap">
              <div>
                <div className="font-bold text-navy text-[14.5px]">{a.fullName} <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eef2f8] text-navy-soft ml-1">{a.field}</span></div>
                <div className="text-[12.5px] text-muted mt-0.5">{a.specialty || '—'} · 📱 {a.phone} · ✉️ {a.email}</div>
                {a.quals && <div className="text-[12.5px] text-muted mt-1">{a.quals}</div>}
                {a.availability?.length > 0 && <div className="text-[11px] text-muted mt-1">Availability: {a.availability.join(', ')}</div>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="btn btn-danger btn-sm" onClick={() => reject(a)}>Reject</button>
                <button className="btn btn-teal btn-sm" onClick={() => setApproveTarget(a)}>Approve &amp; Add</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-sm">No pending applications.</p>
        )}
      </div>

      <div className="bg-white border border-border rounded-2xl p-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Reviewed ({reviewed.length})</h3>
        {reviewed.length ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
                <th className="p-3">Name</th><th className="p-3">Field</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewed.map((a) => (
                <tr key={a.id} className="border-b border-border text-[13.5px]">
                  <td className="p-3">{a.fullName}</td><td className="p-3">{a.field}</td>
                  <td className="p-3">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted text-sm">Nothing reviewed yet.</p>}
      </div>

      <Modal open={!!approveTarget} onClose={() => setApproveTarget(null)}>
        {approveTarget && (
          <>
            <h3 className="text-lg text-navy font-bold mb-2.5">Approve {approveTarget.fullName}?</h3>
            <p className="text-sm text-muted mb-4">This adds them straight to the public directory.</p>
            <div className="field mb-1">
              <label>{approveTarget.field === 'Doctor' ? 'Consultation Fee ($)' : 'Rate (e.g. $45/hr)'}</label>
              <input
                value={feeOrRate}
                onChange={(e) => setFeeOrRate(e.target.value)}
                placeholder={approveTarget.field === 'Doctor' ? '150' : '$45/hr'}
              />
            </div>
            <div className="flex gap-2.5 justify-end mt-5">
              <button className="btn btn-ghost" onClick={() => setApproveTarget(null)}>Cancel</button>
              <button className="btn btn-teal" onClick={confirmApprove} disabled={busy}>{busy ? 'Approving…' : 'Approve & Add to Directory'}</button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

function StatCard({ icon, bg, val, label }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4.5">
      <div className="flex justify-between items-center mb-2.5">
        <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[15px]" style={{ background: bg }}>{icon}</div>
      </div>
      <div className="text-2xl font-extrabold text-navy">{val}</div>
      <div className="text-xs text-muted font-semibold">{label}</div>
    </div>
  );
}

function StatsTab({ stats, onGoToApplications }) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🩺" bg="#e7f2ff" val={stats.totalDoctors} label="Doctors Listed" />
        <StatCard icon="🧑‍⚕️" bg="#f3e9ff" val={stats.totalCaretakers} label="Caretakers Listed" />
        <StatCard icon="📅" bg="#e5f5ee" val={stats.totalBookings} label="Total Bookings" />
        <StatCard icon="💳" bg="#fdf3e2" val={`$${stats.totalRevenue.toFixed(0)}`} label="Revenue Booked" />
      </div>
      {stats.pendingApplications > 0 && (
        <button
          onClick={onGoToApplications}
          className="w-full text-left bg-[#fdf3e2] border border-[#f3dcae] rounded-2xl p-4 mb-6 flex justify-between items-center hover:brightness-95"
        >
          <span className="font-semibold text-[#8a5f0f] text-sm">📋 {stats.pendingApplications} provider application{stats.pendingApplications === 1 ? '' : 's'} waiting for review</span>
          <span className="text-[#8a5f0f] text-sm font-bold">Review →</span>
        </button>
      )}
      <div className="bg-white border border-border rounded-2xl p-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Recent Bookings</h3>
        {stats.recentBookings.length ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
                <th className="p-3">Booking ID</th><th className="p-3">Patient</th><th className="p-3">Professional</th><th className="p-3">Date &amp; Time</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-border text-[13.5px]">
                  <td className="p-3">{b.id}</td><td className="p-3">{b.patientEmail}</td><td className="p-3">{b.providerName}</td><td className="p-3">{b.date}, {b.time}</td><td className="p-3">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted text-sm">No bookings yet.</p>}
      </div>
    </>
  );
}

function DoctorsTab({ doctors, onAdded, onRemove, toast }) {
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      specialty: form.specialty.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      fee: form.fee.value,
      desc: form.bio.value.trim(),
    };
    setSubmitting(true);
    try {
      const res = await fetch('/api/doctors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMsg({ kind: 'bad', text: data.error }); return; }
      setMsg({ kind: 'ok', text: 'Doctor added to the directory.' });
      form.reset();
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl p-5.5 mb-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Add a Doctor</h3>
        {msg && <div className={'text-[13px] px-3 py-2.5 rounded-lg mb-3.5 font-semibold ' + (msg.kind === 'ok' ? 'bg-[#e7f8f0] text-teal-dark' : 'bg-[#fdeceb] text-[#d5473f]')}>{msg.text}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div className="field"><label>Full Name</label><input name="name" placeholder="Dr. Jane Doe" /></div>
            <div className="field"><label>Specialty</label><input name="specialty" placeholder="Cardiology" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div className="field"><label>Phone Number</label><input name="phone" type="tel" placeholder="+1 (555) 000-0000" /></div>
            <div className="field"><label>Consultation Fee ($)</label><input name="fee" type="number" placeholder="150" /></div>
          </div>
          <div className="field mb-3.5"><label>Email (optional — used to notify the doctor of new bookings)</label><input name="email" type="email" placeholder="jane.doe@clinic.com" /></div>
          <div className="field mb-3.5"><label>Short Bio</label><input name="bio" placeholder="Focus area and approach..." /></div>
          <button className="btn btn-teal" disabled={submitting}>{submitting ? 'Adding…' : '+ Add Doctor'}</button>
        </form>
      </div>
      <div className="bg-white border border-border rounded-2xl p-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Current Doctors ({doctors.length})</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
              <th className="p-3">Name</th><th className="p-3">Specialty</th><th className="p-3">Phone</th><th className="p-3">Fee</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id} className="border-b border-border text-[13.5px]">
                <td className="p-3">{d.name}</td><td className="p-3">{d.specialty}</td><td className="p-3">{d.phone}</td><td className="p-3">${d.fee}</td>
                <td className="p-3"><button className="btn btn-danger btn-sm" onClick={() => onRemove(d.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CaretakersTab({ caretakers, onAdded, onRemove }) {
  const [msg, setMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      role: form.role.value,
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      rate: form.rate.value.trim(),
      desc: form.bio.value.trim(),
    };
    setSubmitting(true);
    try {
      const res = await fetch('/api/caretakers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMsg({ kind: 'bad', text: data.error }); return; }
      setMsg({ kind: 'ok', text: 'Caretaker added to the directory.' });
      form.reset();
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl p-5.5 mb-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Add a Caretaker</h3>
        {msg && <div className={'text-[13px] px-3 py-2.5 rounded-lg mb-3.5 font-semibold ' + (msg.kind === 'ok' ? 'bg-[#e7f8f0] text-teal-dark' : 'bg-[#fdeceb] text-[#d5473f]')}>{msg.text}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div className="field"><label>Full Name</label><input name="name" placeholder="Sarah Jenkins" /></div>
            <div className="field">
              <label>Role</label>
              <select name="role" defaultValue="Registered Nurse">
                <option>Registered Nurse</option>
                <option>Physiotherapist</option>
                <option>Massage Therapist</option>
                <option>Senior Care Specialist</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3.5">
            <div className="field"><label>Phone Number</label><input name="phone" type="tel" placeholder="+1 (555) 000-0000" /></div>
            <div className="field"><label>Rate</label><input name="rate" placeholder="$45/hr" /></div>
          </div>
          <div className="field mb-3.5"><label>Email (optional — used to notify them of new bookings)</label><input name="email" type="email" placeholder="sarah.jenkins@clinic.com" /></div>
          <div className="field mb-3.5"><label>Short Bio</label><input name="bio" placeholder="Experience and specialties..." /></div>
          <button className="btn btn-teal" disabled={submitting}>{submitting ? 'Adding…' : '+ Add Caretaker'}</button>
        </form>
      </div>
      <div className="bg-white border border-border rounded-2xl p-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Current Caretakers ({caretakers.length})</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
              <th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Phone</th><th className="p-3">Rate</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {caretakers.map((c) => (
              <tr key={c.id} className="border-b border-border text-[13.5px]">
                <td className="p-3">{c.name}</td><td className="p-3">{c.role}</td><td className="p-3">{c.phone}</td><td className="p-3">{c.rate}</td>
                <td className="p-3"><button className="btn btn-danger btn-sm" onClick={() => onRemove(c.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function BookingsTab({ bookings }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5.5">
      <h3 className="text-[16px] text-navy font-bold mb-4">All Bookings ({bookings.length})</h3>
      {bookings.length ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
              <th className="p-3">ID</th><th className="p-3">Patient</th><th className="p-3">Provider</th><th className="p-3">Type</th><th className="p-3">Date/Time</th><th className="p-3">Fee</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border text-[13.5px]">
                <td className="p-3">{b.id}</td><td className="p-3">{b.patientEmail}</td><td className="p-3">{b.providerName}</td><td className="p-3">{b.kind}</td><td className="p-3">{b.date}, {b.time}</td><td className="p-3">{b.fee}</td><td className="p-3">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="text-muted text-sm">No bookings yet.</p>}
    </div>
  );
}

function NotificationsTab({ notifications }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5.5">
      <h3 className="text-[16px] text-navy font-bold mb-1">Email Notifications</h3>
      <p className="text-[13px] text-muted mb-4">
        Booking confirmations are emailed to the patient (with the provider&apos;s contact info) and, when a provider has
        an email on file, to the provider too (with the patient&apos;s contact info). Without SMTP configured in{' '}
        <code>.env</code>, these are logged here as mock sends instead of leaving the server.
      </p>
      {notifications.length ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
              <th className="p-3">To</th><th className="p-3">Subject</th><th className="p-3">Mode</th><th className="p-3">Sent At</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b border-border text-[13.5px] align-top">
                <td className="p-3">{n.to}</td>
                <td className="p-3">{n.subject}</td>
                <td className="p-3">
                  <span className={'text-[11px] font-bold px-2 py-0.5 rounded-full ' + (n.mode === 'sent' ? 'bg-[#e5f5ee] text-teal-dark' : n.mode === 'failed' ? 'bg-[#fdeceb] text-[#d5473f]' : 'bg-[#eef2f8] text-navy-soft')}>
                    {n.mode}
                  </span>
                </td>
                <td className="p-3">{new Date(n.sentAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-muted text-sm">No notifications yet.</p>
      )}
    </div>
  );
}

function PaymentsTab({ bookings }) {
  const paid = bookings.filter((b) => b.status !== 'Cancelled');
  const total = paid.reduce((sum, b) => sum + (parseFloat((b.fee || '0').toString().replace(/[^0-9.]/g, '')) || 0), 0);
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard icon="💳" bg="#fdf3e2" val={`$${total.toFixed(0)}`} label="Total Revenue Booked" />
        <StatCard icon="✅" bg="#e5f5ee" val={paid.length} label="Paid Bookings" />
      </div>
      <div className="bg-white border border-border rounded-2xl p-5.5">
        <h3 className="text-[16px] text-navy font-bold mb-4">Payment Ledger</h3>
        {paid.length ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-wide text-muted bg-bg">
                <th className="p-3">Booking ID</th><th className="p-3">Patient</th><th className="p-3">Amount</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((b) => (
                <tr key={b.id} className="border-b border-border text-[13.5px]">
                  <td className="p-3">{b.id}</td><td className="p-3">{b.patientEmail}</td><td className="p-3">{b.fee}</td><td className="p-3">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-muted text-sm">No payments yet.</p>}
      </div>
    </>
  );
}
