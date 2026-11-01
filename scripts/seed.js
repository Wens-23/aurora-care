require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const insforgeKey = process.env.INSFORGE_API_KEY;

if (!insforgeUrl || !insforgeKey) {
  throw new Error('Missing InsForge credentials. Please check .env.local');
}

let insforge;

const seedData = {
  users: [
    {
      id: 'usr_test1',
      name: 'Test User',
      email: 'example@gmail.com',
      phone: '+1 (555) 123-4567',
      password: bcrypt.hashSync('password123', 10)
    },
    {
      id: 'usr_admin',
      name: 'Admin User',
      email: 'admin@aurora_care',
      phone: '+1 (555) 999-9999',
      password: bcrypt.hashSync('admin@aurora123', 10)
    }
  ],
  doctors: [
    { id: 'doc1', name: 'Dr. Elena Rostova', specialty: 'Cardiology', exp: '15 Yrs Exp', phone: '+1 (555) 011-2201', email: 'elena.rostova@auroracare.demo', desc: 'Specializing in preventive cardiology and heart failure management. Dedicated to whole-person cardiac wellness.', fee: 150, rating: 4.9, image: '' },
    { id: 'doc2', name: 'Dr. Marcus Vance', specialty: 'General Practice', exp: '22 Yrs Exp', phone: '+1 (555) 011-2202', email: 'marcus.vance@auroracare.demo', desc: 'Comprehensive primary care focused on holistic wellness and chronic disease management.', fee: 120, rating: 4.7, image: '' },
    { id: 'doc3', name: 'Dr. Sarah Lin', specialty: 'Dermatology', exp: 'AI-Assisted Diagnostics Expert', phone: '+1 (555) 011-2203', email: 'sarah.lin@auroracare.demo', desc: 'Dermatology specialist pairing AI-assisted diagnostics with hands-on expertise for skin conditions.', fee: 180, rating: 5.0, image: '' },
    { id: 'doc4', name: 'Dr. Priya Menon', specialty: 'Geriatrics', exp: '11 Yrs Exp', phone: '+1 (555) 011-2204', email: 'priya.menon@auroracare.demo', desc: 'Focused on elder health, medication management, and quality-of-life care for aging patients.', fee: 135, rating: 4.8, image: '' },
  ],
  caretakers: [
    { id: 'ct1', name: 'Sarah Jenkins', role: 'Registered Nurse', careType: 'Nursing', tags: ['Elderly Care', 'Post-Surgery'], exp: '8 Years Experience', phone: '+1 (555) 022-3301', email: 'sarah.jenkins@auroracare.demo', desc: "Compassionate RN with 8 years of experience specializing in post-operative recovery and elderly wellness.", rate: '$45/hr', rating: 4.9, image: '' },
    { id: 'ct2', name: 'David Chen', role: 'Physiotherapist', careType: 'Physiotherapy', tags: ['Mobility', 'Sports Injury'], exp: '12 Years Experience', phone: '+1 (555) 022-3302', email: 'david.chen@auroracare.demo', desc: 'Specializing in stroke recovery and mobility improvement, with personalized therapy plans.', rate: '$60/session', rating: 5.0, image: '' },
    { id: 'ct3', name: 'Maria Rodriguez', role: 'Senior Care Specialist', careType: 'Elderly Care', tags: ['Companionship', 'Dementia Care'], exp: '15 Years Experience', phone: '+1 (555) 022-3303', email: 'maria.rodriguez@auroracare.demo', desc: "Deeply committed to providing dignified, loving care for seniors, experienced with Alzheimer's and dementia.", rate: '$35/hr', rating: 4.8, image: '' },
    { id: 'ct4', name: 'Kenji Watanabe', role: 'Massage Therapist', careType: 'Massage Therapy', tags: ['Relaxation', 'Chronic Pain'], exp: '6 Years Experience', phone: '+1 (555) 022-3304', email: 'kenji.watanabe@auroracare.demo', desc: 'Therapeutic massage focused on chronic pain relief and post-surgery mobility support.', rate: '$50/session', rating: 4.6, image: '' },
  ],
  bookings: [],
  providerApplications: [],
  notifications: [],
};

async function seed() {
  const { createClient } = await import('@insforge/sdk');
  insforge = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeKey,
  });

  console.log('Clearing existing data...');
  await insforge.database.from('users').delete().neq('id', '0');
  await insforge.database.from('doctors').delete().neq('id', '0');
  await insforge.database.from('caretakers').delete().neq('id', '0');
  await insforge.database.from('bookings').delete().neq('id', '0');
  await insforge.database.from('providerApplications').delete().neq('id', '0');
  await insforge.database.from('notifications').delete().neq('id', '0');

  console.log('Seeding data...');
  if (seedData.users.length > 0) await insforge.database.from('users').insert(seedData.users);
  if (seedData.doctors.length > 0) await insforge.database.from('doctors').insert(seedData.doctors);
  if (seedData.caretakers.length > 0) await insforge.database.from('caretakers').insert(seedData.caretakers);
  
  console.log('Database seeded!');
}

seed().catch(console.error);
