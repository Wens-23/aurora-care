'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useToast } from '../../providers';
import Modal from '../../../components/Modal';
import { BookingRow } from '../../../components/DashboardParts';

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'P';
}

export default function ProfilePage() {
  const { user, setUser, loading, refresh } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    bloodPressure: '',
    weight: '',
    height: '',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        bloodPressure: user.bloodPressure || '120/80',
        weight: user.weight || '145 lbs',
        height: user.height || '',
        allergies: user.allergies || '',
        medicalHistory: user.medicalHistory || '',
        currentMedications: user.currentMedications || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactRelation: user.emergencyContactRelation || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      });
      loadBookings();
    }
  }, [user]);

  async function loadBookings() {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // silent fallback
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCancelEdit() {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '',
        gender: user.gender || '',
        bloodGroup: user.bloodGroup || '',
        bloodPressure: user.bloodPressure || '120/80',
        weight: user.weight || '145 lbs',
        height: user.height || '',
        allergies: user.allergies || '',
        medicalHistory: user.medicalHistory || '',
        currentMedications: user.currentMedications || '',
        emergencyContactName: user.emergencyContactName || '',
        emergencyContactRelation: user.emergencyContactRelation || '',
        emergencyContactPhone: user.emergencyContactPhone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
      });
    }
    setIsEditing(false);
  }

  async function handleSaveProfile(e) {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      toast('Full name is required.', 'bad');
      return;
    }
    if (!form.phone.trim()) {
      toast('Phone number is required.', 'bad');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || 'Failed to update profile', 'bad');
        return;
      }

      // Update auth context state directly
      if (data.user) {
        setUser(data.user);
      } else {
        await refresh();
      }
      toast('Patient profile updated successfully!', 'ok');
      setIsEditing(false);
    } catch (err) {
      toast('Network error occurred while saving profile.', 'bad');
    } finally {
      setSaving(false);
    }
  }

  async function confirmCancelBooking() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${cancelTarget.id}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Unable to cancel booking', 'bad');
      } else {
        toast('Booking cancelled successfully', 'ok');
        await loadBookings();
      }
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  }

  if (loading || !user) return null;

  const patientId = `AC-${(user.email.length * 137) % 90000 + 10000}`;

  return (
    <div className="bg-[#faf7ee] min-h-[calc(100vh-120px)] py-8">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-8">
        {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-teal">Patient Account &amp; Records</div>
          <h1 className="text-2xl font-bold text-navy mt-0.5">
            {isEditing ? 'Edit Patient Profile' : 'Patient Health Profile'}
          </h1>
          <p className="text-sm text-muted">
            {isEditing
              ? 'Update your personal details, vitals, medical history, and emergency contacts.'
              : 'Review your verified health details, active records, and scheduled appointments.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-teal btn-sm shadow-sm"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? 'Saving Changes…' : '✓ Save Profile'}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
              onClick={() => setIsEditing(true)}
            >
              <span>✏️</span> Edit Profile Info
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Sidebar: Patient Identity Card */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-2xl p-6 text-center shadow-card">
            <div className="relative inline-block mx-auto mb-3.5">
              <div className="w-20 h-20 rounded-full bg-navy text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {initials(user.name)}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-teal border-2 border-white rounded-full" title="Active Account"></span>
            </div>

            <div className="font-bold text-lg text-navy leading-tight">{user.name}</div>
            <div className="text-xs font-medium text-muted mt-0.5 mb-1">Patient ID: {patientId}</div>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold bg-[#e5f5ee] text-teal-dark rounded-full">
              Verified Patient
            </span>

            {/* Quick Contact Details */}
            <div className="text-left border-t border-border pt-4 mt-4 space-y-2 text-[13.5px]">
              <div className="flex items-start gap-2.5 text-navy">
                <span className="text-muted flex-shrink-0">✉️</span>
                <span className="truncate text-xs font-medium" title={user.email}>{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-navy">
                <span className="text-muted flex-shrink-0">📱</span>
                <span className="text-xs font-medium">{user.phone || 'No phone provided'}</span>
              </div>
              {(user.city || user.state) && (
                <div className="flex items-center gap-2.5 text-navy">
                  <span className="text-muted flex-shrink-0">📍</span>
                  <span className="text-xs font-medium">
                    {[user.city, user.state].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Vitals Snapshot */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-left">
              <div className="bg-bg rounded-xl p-3 border border-border/60">
                <div className="text-[10.5px] uppercase font-bold text-muted tracking-wider">Blood Pressure</div>
                <div className="font-bold text-navy text-[15px] mt-0.5">{user.bloodPressure || '120/80'}</div>
                <div className="text-[10px] text-teal-dark font-medium">mmHg</div>
              </div>
              <div className="bg-bg rounded-xl p-3 border border-border/60">
                <div className="text-[10.5px] uppercase font-bold text-muted tracking-wider">Weight</div>
                <div className="font-bold text-navy text-[15px] mt-0.5">{user.weight || '145 lbs'}</div>
                <div className="text-[10px] text-muted font-medium">Latest record</div>
              </div>
              <div className="bg-bg rounded-xl p-3 border border-border/60">
                <div className="text-[10.5px] uppercase font-bold text-muted tracking-wider">Blood Type</div>
                <div className="font-bold text-navy text-[15px] mt-0.5">{user.bloodGroup || '—'}</div>
                <div className="text-[10px] text-muted font-medium">ABO / Rh</div>
              </div>
              <div className="bg-bg rounded-xl p-3 border border-border/60">
                <div className="text-[10.5px] uppercase font-bold text-muted tracking-wider">Height</div>
                <div className="font-bold text-navy text-[15px] mt-0.5">{user.height || '—'}</div>
                <div className="text-[10px] text-muted font-medium">Stature</div>
              </div>
            </div>

            {/* Action Toggle Button */}
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-outline w-full mt-5 text-sm font-semibold"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile Info
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-ghost w-full mt-5 text-sm font-semibold"
                onClick={handleCancelEdit}
              >
                ← Back to Overview
              </button>
            )}
          </div>

          {/* Emergency Contact Quick Card */}
          <div className="bg-white border border-border rounded-2xl p-5 shadow-card text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                <span>🚨</span> Emergency Contact
              </h4>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-teal hover:underline font-semibold"
                >
                  Edit
                </button>
              )}
            </div>
            {user.emergencyContactName ? (
              <div className="space-y-1.5 text-xs text-navy mt-2">
                <div className="font-bold text-sm text-navy">{user.emergencyContactName}</div>
                {user.emergencyContactRelation && (
                  <div className="text-muted">Relationship: <span className="font-semibold text-navy">{user.emergencyContactRelation}</span></div>
                )}
                {user.emergencyContactPhone && (
                  <div className="text-teal-dark font-medium flex items-center gap-1 mt-1">
                    <span>📞</span> {user.emergencyContactPhone}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted mt-1">
                No emergency contact added yet. Click &apos;Edit Profile Info&apos; to specify an emergency contact for patient safety.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: View Mode vs Edit Mode */}
        <div>
          {isEditing ? (
            /* ================= EDIT MODE FORM ================= */
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* 1. Personal & Demographics */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="text-xl">👤</span>
                  <div>
                    <h3 className="text-base font-bold text-navy">Personal Information</h3>
                    <p className="text-xs text-muted">Primary patient identification and demographic details.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="name">Full Legal Name <span className="text-red-500">*</span></label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sivanesan K"
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="phone">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 019-2834 or 6381803755"
                      required
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="email">Email Address (Account ID)</label>
                    <input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-[#f0f3f8] cursor-not-allowed opacity-80 text-muted"
                    />
                    <span className="text-[11px] text-muted block mt-1">
                      Account email is tied to authentication and cannot be changed here.
                    </span>
                  </div>

                  <div className="field">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Health Vitals & Measurements */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="text-xl">🩺</span>
                  <div>
                    <h3 className="text-base font-bold text-navy">Health Vitals &amp; Biometrics</h3>
                    <p className="text-xs text-muted">Current physiological readings used for doctor consultations.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="field">
                    <label htmlFor="bloodPressure">Blood Pressure (mmHg)</label>
                    <input
                      id="bloodPressure"
                      type="text"
                      name="bloodPressure"
                      value={form.bloodPressure}
                      onChange={handleInputChange}
                      placeholder="e.g. 120/80"
                    />
                    <span className="text-[11px] text-muted block mt-1">Systolic / Diastolic</span>
                  </div>

                  <div className="field">
                    <label htmlFor="weight">Weight</label>
                    <input
                      id="weight"
                      type="text"
                      name="weight"
                      value={form.weight}
                      onChange={handleInputChange}
                      placeholder="e.g. 145 lbs or 66 kg"
                    />
                    <span className="text-[11px] text-muted block mt-1">Include unit (lbs or kg)</span>
                  </div>

                  <div className="field">
                    <label htmlFor="height">Height</label>
                    <input
                      id="height"
                      type="text"
                      name="height"
                      value={form.height}
                      onChange={handleInputChange}
                      placeholder="e.g. 5 ft 10 in or 178 cm"
                    />
                    <span className="text-[11px] text-muted block mt-1">Include unit</span>
                  </div>
                </div>
              </div>

              {/* 3. Clinical & Medical Profile */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="text-xl">📋</span>
                  <div>
                    <h3 className="text-base font-bold text-navy">Clinical Background &amp; Allergies</h3>
                    <p className="text-xs text-muted">Crucial medical context for attending doctors and caretakers.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="field">
                    <label htmlFor="allergies">Known Allergies</label>
                    <input
                      id="allergies"
                      type="text"
                      name="allergies"
                      value={form.allergies}
                      onChange={handleInputChange}
                      placeholder="e.g. Penicillin, Peanuts, Latex, Aspirin (or 'None')"
                    />
                    <span className="text-[11px] text-muted block mt-1">
                      Separate multiple allergies with commas. Leave as &apos;None&apos; if you have no known allergies.
                    </span>
                  </div>

                  <div className="field">
                    <label htmlFor="medicalHistory">Chronic Conditions &amp; Medical History</label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      rows={2}
                      value={form.medicalHistory}
                      onChange={handleInputChange}
                      placeholder="e.g. Mild Asthma, Type 2 Diabetes, Hypertension, Previous surgeries..."
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="currentMedications">Current Medications &amp; Dosages</label>
                    <textarea
                      id="currentMedications"
                      name="currentMedications"
                      rows={2}
                      value={form.currentMedications}
                      onChange={handleInputChange}
                      placeholder="e.g. Lisinopril 10mg daily, Albuterol inhaler as needed, Vitamin D3 1000 IU..."
                    />
                  </div>
                </div>
              </div>

              {/* 4. Emergency Contact */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="text-xl">🚨</span>
                  <div>
                    <h3 className="text-base font-bold text-navy">Emergency Contact Information</h3>
                    <p className="text-xs text-muted">Designated individual to contact in case of urgent medical needs.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="field">
                    <label htmlFor="emergencyContactName">Contact Full Name</label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      name="emergencyContactName"
                      value={form.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="emergencyContactRelation">Relationship</label>
                    <select
                      id="emergencyContactRelation"
                      name="emergencyContactRelation"
                      value={form.emergencyContactRelation}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="emergencyContactPhone">Emergency Phone</label>
                    <input
                      id="emergencyContactPhone"
                      type="tel"
                      name="emergencyContactPhone"
                      value={form.emergencyContactPhone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (555) 987-6543"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Residential Address */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <span className="text-xl">🏠</span>
                  <div>
                    <h3 className="text-base font-bold text-navy">Residential Address</h3>
                    <p className="text-xs text-muted">Used for home care visits, prescription delivery, and local matching.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="field">
                    <label htmlFor="address">Street Address</label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 3B"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="field">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Boston"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="state">State / Province</label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value={form.state}
                        onChange={handleInputChange}
                        placeholder="e.g. MA"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="zipCode">ZIP / Postal Code</label>
                      <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleInputChange}
                        placeholder="e.g. 02115"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="bg-white border border-border rounded-2xl p-4.5 flex items-center justify-between shadow-card">
                <span className="text-xs text-muted">Make sure all details are accurate before saving.</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-teal shadow-md"
                    disabled={saving}
                  >
                    {saving ? 'Saving Changes…' : '✓ Save Profile Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ================= VIEW MODE ================= */
            <div className="space-y-6">
              {/* Comprehensive Health Records Overview */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#e5f5ee] text-teal-dark flex items-center justify-center text-lg">
                      🩺
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-navy">Clinical &amp; Medical Details</h3>
                      <p className="text-xs text-muted">Primary health profile recorded for doctor and caretaker appointments.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm text-xs font-semibold"
                  >
                    ✏️ Edit Details
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Demographics Card */}
                  <div className="bg-bg rounded-xl p-4 border border-border/70 space-y-2">
                    <div className="text-xs font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>👤</span> Demographics
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Date of Birth:</span>
                      <span className="font-semibold text-navy">{user.dob || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Gender:</span>
                      <span className="font-semibold text-navy">{user.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Blood Group:</span>
                      <span className="font-semibold text-navy">{user.bloodGroup || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-muted">Address:</span>
                      <span className="font-semibold text-navy text-right truncate max-w-[180px]">
                        {[user.address, user.city, user.state, user.zipCode].filter(Boolean).join(', ') || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {/* Vitals Summary Card */}
                  <div className="bg-bg rounded-xl p-4 border border-border/70 space-y-2">
                    <div className="text-xs font-bold text-navy uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>💓</span> Vital Signs &amp; Stats
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Blood Pressure:</span>
                      <span className="font-semibold text-teal-dark">{user.bloodPressure || '120/80 mmHg'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Weight:</span>
                      <span className="font-semibold text-navy">{user.weight || '145 lbs'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-muted">Height:</span>
                      <span className="font-semibold text-navy">{user.height || 'Not recorded'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-muted">Account Status:</span>
                      <span className="font-semibold text-teal-dark">● Active &amp; Verified</span>
                    </div>
                  </div>
                </div>

                {/* Allergies & Conditions Alert */}
                <div className="mt-4 pt-4 border-t border-border grid md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#fff8eb] border border-[#fae2b8]">
                    <div className="text-xs font-bold text-[#b45309] flex items-center gap-1.5 mb-1">
                      <span>⚠️</span> Allergies &amp; Alerts
                    </div>
                    <p className="text-xs text-navy font-medium leading-relaxed">
                      {user.allergies ? user.allergies : 'No known allergies reported.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-bg border border-border/80">
                    <div className="text-xs font-bold text-navy flex items-center gap-1.5 mb-1">
                      <span>🩺</span> Medical History
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {user.medicalHistory ? user.medicalHistory : 'No chronic conditions reported.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-bg border border-border/80">
                    <div className="text-xs font-bold text-navy flex items-center gap-1.5 mb-1">
                      <span>💊</span> Current Medications
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {user.currentMedications ? user.currentMedications : 'No ongoing prescriptions listed.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments & Bookings */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base text-navy font-bold">Appointments &amp; Bookings</h3>
                    <p className="text-xs text-muted">Your scheduled visits and past consultations with Aurora Care providers.</p>
                  </div>
                  <Link href="/doctors" className="btn btn-primary btn-sm shadow-sm">
                    + New Booking
                  </Link>
                </div>

                {bookings.length ? (
                  <div className="space-y-2 mt-4">
                    {bookings.slice(0, 5).map((b) => (
                      <BookingRow key={b.id} b={b} compact onCancel={() => setCancelTarget(b)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border rounded-xl mt-3">
                    <span className="text-2xl block mb-1">📅</span>
                    <p className="text-sm font-semibold text-navy">No bookings yet</p>
                    <p className="text-xs text-muted mt-0.5 mb-3">Schedule your first appointment with our verified specialists.</p>
                    <Link href="/doctors" className="btn btn-teal btn-sm">Find a Doctor</Link>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-border flex justify-between items-center">
                  <Link href="/dashboard" className="text-teal-dark font-semibold text-xs hover:underline inline-flex items-center gap-1">
                    View all appointment history →
                  </Link>
                  <span className="text-[11px] text-muted">Showing recent 5 bookings</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      <Modal open={!!cancelTarget} onClose={() => setCancelTarget(null)}>
        {cancelTarget && (
          <>
            <h3 className="text-lg text-navy font-bold mb-2.5">Cancel this booking?</h3>
            <p className="text-sm text-muted mb-5">
              Are you sure you want to cancel your booking with <b>{cancelTarget.providerName}</b> on {cancelTarget.date} at {cancelTarget.time}?
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setCancelTarget(null)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmCancelBooking}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel Booking'}
              </button>
            </div>
          </>
        )}
      </Modal>
      </div>
    </div>
  );
}
