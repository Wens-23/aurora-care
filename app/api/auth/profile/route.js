import { NextResponse } from 'next/server';
import { insforge } from '../../../../lib/insforge';
import { getSessionUser, signSession, COOKIE_NAME } from '../../../../lib/auth';

export async function PUT(req) {
  const session = getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const body = await req.json();
  const name = (body.name || '').trim();
  const phone = (body.phone || '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
  }

  const updates = {
    name,
    phone,
    dob: (body.dob || '').trim(),
    gender: (body.gender || '').trim(),
    bloodGroup: (body.bloodGroup || '').trim(),
    bloodPressure: (body.bloodPressure || '').trim() || '120/80',
    weight: (body.weight || '').trim() || '145 lbs',
    height: (body.height || '').trim(),
    allergies: (body.allergies || '').trim(),
    medicalHistory: (body.medicalHistory || '').trim(),
    currentMedications: (body.currentMedications || '').trim(),
    emergencyContactName: (body.emergencyContactName || '').trim(),
    emergencyContactRelation: (body.emergencyContactRelation || '').trim(),
    emergencyContactPhone: (body.emergencyContactPhone || '').trim(),
    address: (body.address || '').trim(),
    city: (body.city || '').trim(),
    state: (body.state || '').trim(),
    zipCode: (body.zipCode || '').trim(),
  };

  const { error } = await insforge.database
    .from('users')
    .update(updates)
    .eq('id', session.id);

  if (error) {
    console.error('Failed to update patient profile:', error);
    return NextResponse.json({ error: 'Failed to update profile: ' + error.message }, { status: 500 });
  }

  // Fetch updated user to return
  const { data: users } = await insforge.database
    .from('users')
    .select('*')
    .eq('id', session.id);

  const u = users && users[0] ? users[0] : { ...session, ...updates };

  const safeUser = {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    dob: u.dob || '',
    gender: u.gender || '',
    bloodGroup: u.bloodGroup || '',
    bloodPressure: u.bloodPressure || '120/80',
    weight: u.weight || '145 lbs',
    height: u.height || '',
    allergies: u.allergies || '',
    medicalHistory: u.medicalHistory || '',
    currentMedications: u.currentMedications || '',
    emergencyContactName: u.emergencyContactName || '',
    emergencyContactRelation: u.emergencyContactRelation || '',
    emergencyContactPhone: u.emergencyContactPhone || '',
    address: u.address || '',
    city: u.city || '',
    state: u.state || '',
    zipCode: u.zipCode || '',
  };

  // Re-sign session cookie if name changed
  const token = signSession({ type: 'user', id: safeUser.id, email: safeUser.email, name: safeUser.name });
  const res = NextResponse.json({ success: true, user: safeUser });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function POST(req) {
  return PUT(req);
}
