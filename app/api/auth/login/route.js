import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { insforge } from '../../../../lib/insforge';
import { signSession, COOKIE_NAME } from '../../../../lib/auth';

export async function POST(req) {
  const body = await req.json();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const { data: users, error } = await insforge.database.from('users').select('*').eq('email', email);
  if (error || !users || users.length === 0) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  const user = users[0];
  
  const ok = await bcrypt.compare(password, user.password || user.passwordHash || '');
  if (!ok) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = signSession({ type: 'user', id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
