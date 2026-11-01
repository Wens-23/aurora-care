import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const insforgeKey = process.env.INSFORGE_API_KEY;

if (!insforgeUrl || !insforgeKey) {
  throw new Error('Missing InsForge credentials. Please check .env.local');
}

export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeKey,
});
