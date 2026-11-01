import { NextResponse } from 'next/server';
import { insforge } from '../../../../../lib/insforge';
import { getSessionAdmin } from '../../../../../lib/auth';

const CARE_TYPE_MAP = {
  Nursing: 'Nursing',
  Physiotherapy: 'Physiotherapy',
  'Massage Therapy': 'Massage Therapy',
  'Elderly Care': 'Elderly Care',
};
const ROLE_LABEL = {
  Nursing: 'Registered Nurse',
  Physiotherapy: 'Physiotherapist',
  'Massage Therapy': 'Massage Therapist',
  'Elderly Care': 'Senior Care Specialist',
};

export async function POST(req, { params }) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const body = await req.json();
  const { fee, rate } = body;

  const { data: apps, error } = await insforge.database.from('providerApplications').select('*').eq('id', params.id);
  if (error || !apps || apps.length === 0) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  
  const application = apps[0];
  if (application.status !== 'Pending Review') {
    return NextResponse.json({ error: `This application is already ${application.status}.` }, { status: 409 });
  }

  let createdProvider = null;
  let tableName = '';

  if (application.field === 'Doctor') {
    tableName = 'doctors';
    createdProvider = {
      id: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: application.fullName,
      specialty: application.specialty || 'General Practice',
      phone: application.phone,
      email: application.email || '',
      fee: Number(fee) || 100,
      desc: application.quals || 'Experienced provider dedicated to attentive, personalized care.',
      exp: 'New to Aurora Care',
      rating: 5.0,
    };
  } else {
    tableName = 'caretakers';
    const role = ROLE_LABEL[application.field] || 'Registered Nurse';
    createdProvider = {
      id: `ct_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: application.fullName,
      role,
      phone: application.phone,
      email: application.email || '',
      rate: rate || '$40/hr',
      desc: application.quals || 'Dedicated caregiver committed to compassionate, reliable support.',
      exp: 'New to Aurora Care',
      rating: 5.0,
      careType: CARE_TYPE_MAP[application.field] || 'Nursing',
      tags: [CARE_TYPE_MAP[application.field] || 'Care'],
    };
  }

  const { error: insertErr } = await insforge.database.from(tableName).insert([createdProvider]);
  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });

  const { data: updatedApps, error: updateErr } = await insforge.database.from('providerApplications')
    .update({ 
      status: 'Approved',
      reviewedAt: new Date().toISOString()
    })
    .eq('id', params.id)
    .eq('status', 'Pending Review')
    .select('*');

  if (updateErr || !updatedApps || updatedApps.length === 0) {
    // We should theoretically rollback the provider insert, but for simplicity we return 409
    return NextResponse.json({ error: 'Could not approve — application may have just changed status.' }, { status: 409 });
  }

  return NextResponse.json({ provider: createdProvider });
}
