import { NextResponse } from 'next/server';
import { insforge } from '../../../../lib/insforge';
import { getSessionAdmin } from '../../../../lib/auth';

export async function DELETE(req, { params }) {
  const admin = getSessionAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });

  const { data: caretakers, error: fetchErr } = await insforge.database.from('caretakers').select('id').eq('id', params.id);
  if (fetchErr || !caretakers || caretakers.length === 0) {
    return NextResponse.json({ error: 'Caretaker not found.' }, { status: 404 });
  }

  const { error } = await insforge.database.from('caretakers').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
