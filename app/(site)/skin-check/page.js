'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

export default function SkinCheckPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const inputRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  async function analyze() {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/skin-check', { method: 'POST' });
      const data = await res.json();
      setResult(data.result);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="bg-[#faf7ee] min-h-[calc(100vh-120px)] py-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Top Header */}
        <div className="pb-6 border-b border-[#e6e1d4]">
          <div className="text-xs text-[#5f665e] font-semibold mb-2">
            <Link href="/" className="text-[#1e5e3a] hover:underline">Home</Link> › Diagnostics › AI Skin Care Check
          </div>
          <h1 className="text-[32px] sm:text-[38px] font-extrabold text-[#121412] tracking-tight">
            AI Skin Care Check
          </h1>
          <p className="text-[14.5px] text-[#5f665e] mt-1 max-w-[620px]">
            Upload a clear, well-lit photo of the affected area. Our assistant gives you preliminary triage and home-care guidance — it does not replace a licensed medical diagnosis.
          </p>
        </div>

        {/* 2-Column Diagnostic Workspace */}
        <div className="grid md:grid-cols-2 gap-8 py-8 items-start">
          {/* Left Column: Upload Dropzone */}
          <div className="bg-white border border-[#e6e1d4] rounded-2xl p-6 shadow-card">
            <div className="text-xs font-bold uppercase tracking-wider text-[#5f665e] mb-3">
              Step 1: Upload Photo
            </div>
            <div
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-[#e6e1d4] rounded-xl px-5 py-10 text-center flex flex-col items-center gap-3 cursor-pointer hover:border-[#1e5e3a] hover:bg-[#faf7ee] transition"
            >
              {preview ? (
                <img src={preview} alt="Uploaded skin photo" className="max-h-[220px] rounded-lg shadow-sm" />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-[#ebf5ee] text-[#1e5e3a] flex items-center justify-center text-2xl mb-1">
                    📷
                  </div>
                  <div className="font-bold text-[#121412] text-sm">Click to select or drop a photo</div>
                  <div className="text-xs text-[#5f665e]">JPG or PNG, well-lit close-up of the affected area</div>
                </>
              )}
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            {preview && (
              <button
                className="btn btn-primary w-full mt-5 py-3 text-sm font-bold"
                onClick={analyze}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing clinical patterns…' : result ? 'Re-analyze photo' : 'Analyze Photo Now →'}
              </button>
            )}

            <div className="mt-4 p-3 bg-[#faf7ee] border border-[#e6e1d4] rounded-lg text-[12px] text-[#5f665e] leading-relaxed">
              🔒 <b>Privacy Notice:</b> Photos are processed in secure memory and never shared with third-party advertisers.
            </div>
          </div>

          {/* Right Column: AI Assessment Results */}
          <div>
            {result ? (
              <div className="bg-white border border-[#e6e1d4] rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e6e1d4]">
                  <span className="text-xs font-bold text-[#1e5e3a] uppercase tracking-wider bg-[#ebf5ee] px-2.5 py-0.5 rounded-full">
                    AI Clinical Assessment
                  </span>
                  <span className="text-xs font-mono font-bold text-[#828a81]">
                    ID: SC-{(result.confidence * 41) % 9000 + 1000}
                  </span>
                </div>

                <h3 className="text-[#121412] text-xl font-extrabold mb-1">{result.name}</h3>
                <div className="text-[12.5px] text-[#5f665e] mb-2 font-medium">Confidence: {result.confidence}%</div>
                <div className="h-2.5 bg-[#faf7ee] border border-[#e6e1d4] rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-[#1e5e3a] rounded-full" style={{ width: `${result.confidence}%` }} />
                </div>

                <div className="font-extrabold text-[13.5px] text-[#121412] uppercase tracking-wider mb-2">
                  Recommended Home Care
                </div>
                <ul className="space-y-2 mb-5">
                  {result.remedies.map((r) => (
                    <li key={r} className="text-[13.5px] text-[#121412] flex items-start gap-2">
                      <span className="text-[#1e5e3a] font-bold">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="font-extrabold text-[13.5px] text-[#121412] uppercase tracking-wider mb-2">
                  Suggested OTC Ingredients
                </div>
                <div className="bg-[#faf7ee] border border-[#e6e1d4] rounded-xl p-3.5 text-[13px] text-[#121412] font-medium leading-relaxed mb-5">
                  {result.rx}
                </div>

                {result.severity === 'high' ? (
                  <div className="space-y-3 pt-3 border-t border-[#e6e1d4]">
                    <div className="bg-[#fdf2f1] border border-[#f3b5b1] text-[#c93b32] p-3.5 rounded-xl text-[13px] font-semibold leading-relaxed">
                      ⚠️ <b>Clinical Warning:</b> This visual pattern suggests potential escalation. We strongly advise booking a specialist consultation rather than relying on home remedies.
                    </div>
                    <Link href="/doctors" className="btn btn-primary w-full py-3">
                      Consult a Dermatologist Now &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 pt-3 border-t border-[#e6e1d4]">
                    <div className="text-[12px] text-[#5f665e]">
                      If symptoms persist past 5 days or redness spreads, schedule a physician review.
                    </div>
                    <Link href="/doctors" className="btn btn-outline w-full py-2.5">
                      Consult a Doctor Anyway &rarr;
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-[#e6e1d4] rounded-2xl p-12 text-center text-[#5f665e] shadow-card">
                <div className="w-14 h-14 rounded-2xl bg-[#faf7ee] border border-[#e6e1d4] text-2xl flex items-center justify-center mx-auto mb-3">
                  🔬
                </div>
                <div className="font-bold text-[#121412] text-sm mb-1">Waiting for upload</div>
                <p className="text-xs text-[#5f665e] max-w-[280px] mx-auto">
                  Upload an image on the left to initiate the automated dermatological analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
