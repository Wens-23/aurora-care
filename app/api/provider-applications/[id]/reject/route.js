import { NextResponse } from 'next/server';
import { insforge } from '../../../../../lib/insforge';
import { getSessionAdmin } from '../../../../../lib/auth';

export async function POST(req, { params }) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const { data: apps, error } = await insforge.database.from('providerApplications').select('*').eq('id', params.id);
  if (error || !apps || apps.length === 0) return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
  const application = apps[0];
  if (application.status !== 'Pending Review') {
    return NextResponse.json({ error: `This application is already ${application.status}.` }, { status: 409 });
  }

  const { data: updatedApps, error: updateErr } = await insforge.database.from('providerApplications')
    .update({ 
      status: 'Rejected',
      reviewedAt: new Date().toISOString()
    })
    .eq('id', params.id)
    .eq('status', 'Pending Review')
    .select('*');

  if (updateErr || !updatedApps || updatedApps.length === 0) {
    return NextResponse.json({ error: 'Could not reject — application may have just changed status.' }, { status: 409 });
  }
  return NextResponse.json({ application: updatedApps[0] });
}
