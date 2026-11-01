import { NextResponse } from 'next/server';
import { insforge } from '../../../lib/insforge';
import { getSessionAdmin } from '../../../lib/auth';

export async function GET() {
  const { data: doctors, error } = await insforge.database.from('doctors').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ doctors: doctors || [] });
}

export async function POST(req) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const body = await req.json();
  const { name, specialty, phone, fee, desc, email } = body;
  if (!name || !specialty || !phone || !fee) {
    return NextResponse.json({ error: 'Name, specialty, phone, and fee are required.' }, { status: 400 });
  }

  const doctor = {
    id: `doc_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name,
    specialty,
    phone,
    email: email || '',
    fee: Number(fee),
    desc: desc || 'Experienced provider dedicated to attentive, personalized care.',
    exp: 'New to Aurora Care',
    rating: 5.0,
  };

  const { error } = await insforge.database.from('doctors').insert([doctor]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ doctor }, { status: 201 });
}
