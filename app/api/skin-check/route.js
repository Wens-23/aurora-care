import { NextResponse } from 'next/server';

// NOTE: this is a simulated demo endpoint for prototyping the product flow.
// It does not run a real image-classification model and must not be treated
// as a medical diagnostic tool. Swap this out for a real model/service
// before using it with real patients.
const CONDITIONS = [
  {
    name: 'Mild Contact Dermatitis / Rash',
    severity: 'low',
    remedies: [
      'Wash the area gently with lukewarm water and mild soap',
      'Apply a fragrance-free moisturizer 2–3x daily',
      'Avoid scratching and known irritants (new soaps, fabrics)',
      'Use a cool compress to reduce itching',
    ],
    rx: 'Look for an over-the-counter cream containing 1% Hydrocortisone, or Zinc Oxide 10–15% for a soothing barrier.',
  },
  {
    name: 'Insect Bite Reaction',
    severity: 'low',
    remedies: [
      'Clean the site with soap and water',
      'Apply a cold pack for 10 minutes to reduce swelling',
      'Avoid scratching to prevent infection',
      'Elevate the area if swelling is significant',
    ],
    rx: 'An antihistamine cream with Diphenhydramine 1–2%, or a Calamine lotion, can ease itching and swelling.',
  },
  {
    name: 'Possible Fungal Infection (Tinea)',
    severity: 'medium',
    remedies: [
      'Keep the area clean and completely dry',
      'Avoid tight clothing over the affected area',
      'Do not share towels or clothing while healing',
      'Wash bedding and clothing in hot water',
    ],
    rx: 'Look for a topical antifungal with Clotrimazole 1% or Terbinafine 1%, applied twice daily for 2 weeks.',
  },
  {
    name: 'Possible Bacterial Skin Infection',
    severity: 'high',
    remedies: [
      'Keep the wound clean and covered with a sterile dressing',
      'Avoid squeezing or picking at the area',
      'Wash hands thoroughly before and after touching it',
      'Monitor for spreading redness, warmth, or fever',
    ],
    rx: 'This pattern can need an oral or topical antibiotic prescribed by a clinician — home remedies alone are not enough here.',
  },
];

export async function POST() {
  const pick = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
  const confidence = 78 + Math.floor(Math.random() * 20);
  return NextResponse.json({ result: { ...pick, confidence }, disclaimer: 'Simulated demo result — not a real medical diagnosis.' });
}
