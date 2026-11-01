import nodemailer from 'nodemailer';
import { insforge } from './insforge.js';

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

/**
 * Sends an email if SMTP_* env vars are configured in .env.local.
 * Otherwise, records a mock email in the InsForge notifications table and console.
 */
export async function sendMail({ to, subject, text, html }) {
  const recordId = 'mail_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  const now = new Date().toISOString();
  let mode = 'mock';

  const t = getTransporter();
  if (t) {
    try {
      await t.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        text,
        html: html || undefined,
      });
      mode = 'sent';
      console.log(`[SMTP EMAIL SENT] To: ${to} | Subject: ${subject}`);
    } catch (err) {
      mode = 'failed';
      console.error(`[SMTP EMAIL FAILED] To: ${to} | Error:`, err.message || err);
    }
  } else {
    console.log(`\n================== [MOCK EMAIL] ==================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text}`);
    console.log(`(Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local to send live emails)`);
    console.log(`==================================================\n`);
  }

  // Persist notification log to InsForge notifications table
  try {
    await insforge.database.from('notifications').insert([
      {
        id: recordId,
        date: now,
        to,
        subject,
        body: text,
      },
    ]);
  } catch (dbErr) {
    console.error('Failed to save notification record to InsForge:', dbErr);
  }

  return { id: recordId, to, subject, text, sentAt: now, mode };
}

export function bookingEmails({ booking, provider, patient }) {
  const patientText =
    `Hi ${patient.name || 'there'},\n\n` +
    `Your booking with ${provider.name} is confirmed!\n\n` +
    `--- Appointment Details ---\n` +
    `• Service: ${booking.kind} (${provider.specialty || provider.role || booking.sub || 'Consultation'})\n` +
    `• Date: ${booking.date}\n` +
    `• Time: ${booking.time}\n` +
    `• Format: ${booking.plan || 'Standard'}\n` +
    `• Fee: ${booking.fee || '—'}\n\n` +
    `--- Service Provider Direct Contact ---\n` +
    `• Name: ${provider.name}\n` +
    `• Phone: ${provider.phone || 'Provided upon request'}\n` +
    `• Email: ${provider.email || 'Provided upon request'}\n\n` +
    `You can reach them directly if you have any questions or schedule changes.\n\n` +
    `Best regards,\n` +
    `Aurora Care Team`;

  const providerText =
    `Hi ${provider.name},\n\n` +
    `You have received a new booking from ${patient.name}!\n\n` +
    `--- Booking Details ---\n` +
    `• Date: ${booking.date}\n` +
    `• Time: ${booking.time}\n` +
    `• Consultation Format: ${booking.plan || 'Standard'}\n` +
    `• Patient Notes: ${booking.notes || 'None'}\n\n` +
    `--- Patient Contact Info ---\n` +
    `• Name: ${patient.name}\n` +
    `• Phone: ${patient.phone || 'N/A'}\n` +
    `• Email: ${patient.email}\n\n` +
    `Best regards,\n` +
    `Aurora Care Team`;

  const jobs = [
    sendMail({
      to: patient.email,
      subject: `Your Aurora Care booking with ${provider.name} is confirmed`,
      text: patientText,
    }),
  ];

  if (provider.email) {
    jobs.push(
      sendMail({
        to: provider.email,
        subject: `New Aurora Care appointment with ${patient.name} (${booking.date})`,
        text: providerText,
      })
    );
  }

  return Promise.all(jobs);
}

export function cancellationEmails({ booking, provider, patient, cancelledBy }) {
  const patientText =
    `Hi ${patient?.name || booking.patientName || 'there'},\n\n` +
    `Your booking with ${provider?.name || booking.providerName} for ${booking.date} at ${booking.time} has been CANCELLED.\n\n` +
    `• Booking ID: ${booking.id}\n` +
    `• Provider: ${provider?.name || booking.providerName}\n` +
    `• Date & Time: ${booking.date} at ${booking.time}\n` +
    `• Status: Cancelled\n\n` +
    `If you wish to reschedule, you can book a new slot anytime through Aurora Care.\n\n` +
    `Best regards,\n` +
    `Aurora Care Team`;

  const providerEmail = provider?.email || booking.providerEmail;
  const providerText =
    `Hi ${provider?.name || booking.providerName},\n\n` +
    `The appointment on ${booking.date} at ${booking.time} with patient ${patient?.name || booking.patientName || booking.patientEmail} has been CANCELLED.\n\n` +
    `That time slot has now been reopened in your schedule for other patients.\n\n` +
    `Best regards,\n` +
    `Aurora Care Team`;

  const jobs = [
    sendMail({
      to: booking.patientEmail,
      subject: `Cancelled: Booking with ${provider?.name || booking.providerName} on ${booking.date}`,
      text: patientText,
    }),
  ];

  if (providerEmail) {
    jobs.push(
      sendMail({
        to: providerEmail,
        subject: `Cancellation notice: Appointment with ${patient?.name || booking.patientName || booking.patientEmail} on ${booking.date}`,
        text: providerText,
      })
    );
  }

  return Promise.all(jobs);
}
