import { NextResponse } from 'next/server';
import { insforge } from '../../../lib/insforge';
import { getSessionAdmin } from '../../../lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { fullName, email, phone, field, specialty, quals, availability } = body;
  if (!fullName || !email || !phone || !field) {
    return NextResponse.json({ error: 'Name, email, phone, and field of work are required.' }, { status: 400 });
  }

  const application = {
    id: `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    fullName,
    email,
    phone,
    field,
    specialty: specialty || '',
    quals: quals || '',
    availability: availability || [],
    status: 'Pending Review',
    submittedAt: new Date().toISOString(),
  };

  const { error } = await insforge.database.from('providerApplications').insert([application]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ application }, { status: 201 });
}

export async function GET(req) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  
  const { data: applications, error } = await insforge.database.from('providerApplications').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ applications: applications || [] });
}
