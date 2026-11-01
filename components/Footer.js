import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111311] text-[#e5e1d8] border-t border-[#262b26] py-14 mt-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 pb-12 border-b border-[#262b26]">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg text-white mb-3">
              <span className="w-[30px] h-[30px] rounded-lg bg-[#1e5e3a] text-white flex items-center justify-center text-sm">
                ✚
              </span>
              <span>Aurora Care</span>
            </Link>
            <p className="text-[13px] text-[#9a9e99] leading-relaxed">
              Precision medicine, empathetic care. Certified nurses, therapists, and doctors unified with intelligent triage.
            </p>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9ee86f] mb-3">Care Services</h4>
            <ul className="space-y-2 text-[13.5px] text-[#b8bcb7]">
              <li><Link href="/doctors" className="hover:text-white transition">Consult a Doctor</Link></li>
              <li><Link href="/caretakers" className="hover:text-white transition">Book a Caregiver</Link></li>
              <li><Link href="/skin-check" className="hover:text-white transition">AI Skin Analysis</Link></li>
              <li><Link href="/caretakers" className="hover:text-white transition">Home Nursing &amp; PT</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9ee86f] mb-3">For Providers</h4>
            <ul className="space-y-2 text-[13.5px] text-[#b8bcb7]">
              <li><Link href="/provider-register" className="hover:text-white transition">Join the Network</Link></li>
              <li><Link href="/admin/login" className="hover:text-white transition">Admin Portal</Link></li>
              <li><Link href="/" className="hover:text-white transition">Verification Guidelines</Link></li>
              <li><Link href="/" className="hover:text-white transition">Clinical Standards</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9ee86f] mb-3">Security &amp; Legal</h4>
            <ul className="space-y-2 text-[13.5px] text-[#b8bcb7]">
              <li><Link href="/" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-white transition">HIPAA Compliance</Link></li>
              <li><Link href="/" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-white transition">Patient Rights</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12.5px] text-[#868b85]">
          <div>&copy; 2026 Aurora Care, Inc. All rights reserved. Designed to connect.</div>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1.5 text-[#9ee86f]">
              <span className="w-2 h-2 rounded-full bg-[#9ee86f] animate-pulse"></span>
              All clinical systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
