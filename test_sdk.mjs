import { config } from 'dotenv';
import { createClient } from '@insforge/sdk';

config({ path: '.env.local' });
const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.INSFORGE_API_KEY,
});

insforge.database.from('users').select('*').limit(1).then(console.log).catch(console.error);
