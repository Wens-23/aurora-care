import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { insforge } from '../../../../lib/insforge';
import { signSession, COOKIE_NAME } from '../../../../lib/auth';

export async function POST(req) {
  const body = await req.json();
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const phone = (body.phone || '').trim();
  const password = body.password || '';

  if (!name || !email || !phone || !password) {
    return NextResponse.json({ error: 'Name, email, phone, and password are all required.' }, { status: 400 });
  }

  const missingRules = [];
  if (password.length < 8) missingRules.push('Password must be at least 8 characters long.');
  if (!/[A-Z]/.test(password)) missingRules.push('Password must contain at least one uppercase letter.');
  if (!/[a-z]/.test(password)) missingRules.push('Password must contain at least one lowercase letter.');
  if (!/[0-9]/.test(password)) missingRules.push('Password must contain at least one number.');
  if (!/[!@#$%^&*]/.test(password)) missingRules.push('Password must contain at least one special character (!@#$%^&*).');

  if (missingRules.length > 0) {
    return NextResponse.json({ error: missingRules.join(' ') }, { status: 400 });
  }

  const { data: existingUser } = await insforge.database.from('users').select('id').eq('email', email);
  if (existingUser && existingUser.length > 0) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: 'user_' + Date.now(),
    name,
    email,
    phone,
    password: passwordHash
  };

  const { error } = await insforge.database.from('users').insert([user]);
  if (error) {
    console.error('Signup insert error:', error);
    return NextResponse.json({ error: 'Failed to create account. ' + error.message }, { status: 500 });
  }

  const token = signSession({ type: 'user', id: user.id, email: user.email, name: user.name });
  const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  res.cookies.set(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
