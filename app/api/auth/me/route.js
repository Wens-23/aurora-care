import { NextResponse } from 'next/server';
import { insforge } from '../../../../lib/insforge';
import { getSessionUser } from '../../../../lib/auth';

export async function GET(req) {
  const session = getSessionUser(req);
  if (!session) return NextResponse.json({ user: null });
  const { data: users, error } = await insforge.database.from('users').select('*').eq('id', session.id);
  if (error || !users || users.length === 0) return NextResponse.json({ user: null });
  const u = users[0];
  return NextResponse.json({
    user: {
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
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
      zipCode: u.zipCode || ''
    }
  });
}
