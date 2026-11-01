import { NextResponse } from 'next/server';
import { signSession, ADMIN_COOKIE_NAME, ADMIN_ID, ADMIN_PASSWORD } from '../../../../lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { adminId, password } = body;

  if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid admin ID or password.' }, { status: 401 });
  }

  const token = signSession({ type: 'admin', id: 'admin' });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 });
  return res;
}
