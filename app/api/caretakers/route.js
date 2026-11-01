import { NextResponse } from 'next/server';
import { insforge } from '../../../lib/insforge';
import { getSessionAdmin } from '../../../lib/auth';

const CARE_TYPE_MAP = {
  'Registered Nurse': 'Nursing',
  Physiotherapist: 'Physiotherapy',
  'Massage Therapist': 'Massage Therapy',
  'Senior Care Specialist': 'Elderly Care',
};

export async function GET() {
  const { data: caretakers, error } = await insforge.database.from('caretakers').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ caretakers: caretakers || [] });
}

export async function POST(req) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const body = await req.json();
  const { name, role, phone, rate, desc, email } = body;
  if (!name || !role || !phone || !rate) {
    return NextResponse.json({ error: 'Name, role, phone, and rate are required.' }, { status: 400 });
  }

  const caretaker = {
    id: `ct_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name,
    role,
    phone,
    email: email || '',
    rate,
    desc: desc || 'Dedicated caregiver committed to compassionate, reliable support.',
    exp: 'New to Aurora Care',
    rating: 5.0,
    careType: CARE_TYPE_MAP[role] || 'Nursing',
    tags: [CARE_TYPE_MAP[role] || 'Care'],
  };

  const { error } = await insforge.database.from('caretakers').insert([caretaker]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ caretaker }, { status: 201 });
}
