import { NextResponse } from 'next/server';
import { insforge } from '../../../../lib/insforge';
import { getSessionAdmin } from '../../../../lib/auth';

export async function GET(req) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  
  const { data: notifications, error } = await insforge.database.from('notifications').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ notifications: notifications || [] });
}
