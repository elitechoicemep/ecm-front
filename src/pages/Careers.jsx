import { useState, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useScrollReveal } from '../hooks/useScrollReveal';

const EMAILJS_SERVICE_ID      = 'YOUR_SERVICE_ID';
const EMAILJS_CAREER_TEMPLATE = 'YOUR_CAREER_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY      = 'YOUR_PUBLIC_KEY';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXT_LABEL = 'PDF, DOC, DOCX';

const perks = [
  { icon: '', t: 'Major Projects',   d: 'Work on high-profile MEP contracts across Dubai, Abu Dhabi, and the wider UAE region.' },
  { icon: '', t: 'Career Growth',     d: 'Structured development paths with training, mentorship, and promotion opportunities.' },
  { icon: '', t: 'Professional Team', d: 'Collaborate with a highly skilled, diverse team of engineers and project managers.' },
  { icon: '', t: 'UAE Experience',    d: "Gain internationally recognised experience in one of the world's most dynamic markets." },
];

/* ── helpers ── */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]); // strip data:...;base64,
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ── CV Upload field ── */
function CVUpload({ file, onFile, onClear, error }) {
  const inputRef   = useRef(null);
  const [drag, setDrag] = useState(false);

  const validate = useCallback((f) => {
    if (!f) return null;
    if (!ALLOWED_TYPES.includes(f.type)) return `Unsupported format. Please upload ${ALLOWED_EXT_LABEL}.`;
    if (f.size > MAX_FILE_SIZE) return `File too large. Maximum size is 5 MB.`;
    return null;
  }, []);

  const handleFiles = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    const err = validate(f);
    onFile(f, err);
  }, [validate, onFile]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const onDragOver  = (e) => { e.preventDefault(); setDrag(true);  };
  const onDragLeave = (e) => { e.preventDefault(); setDrag(false); };

  const ext = file ? file.name.split('.').pop().toUpperCase() : null;
  const extColor = { PDF: '#E5534B', DOC: '#2B5CE6', DOCX: '#2B5CE6' }[ext] || '#C8922A';

  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">
        CV / Resume <span className="text-white/30 normal-case font-normal tracking-normal">({ALLOWED_EXT_LABEL} · max 5 MB)</span>
      </label>

      {/* drop zone */}
      {!file ? (
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer border-2 border-dashed rounded-sm transition-all duration-200
            flex flex-col items-center justify-center gap-2 py-8 px-4 text-center
            ${drag
              ? 'border-[#C8922A] bg-[#C8922A]/10'
              : error
                ? 'border-red-500/50 bg-red-900/10 hover:border-red-500/70'
                : 'border-[#C8922A]/25 bg-[#112540] hover:border-[#C8922A]/60 hover:bg-[#112540]/80'
            }
          `}
        >
          {/* upload icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={drag ? '#C8922A' : 'rgba(255,255,255,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <div>
            <span className="text-[13px] font-semibold text-white/70">Drop your CV here</span>
            <span className="text-[12px] text-white/35 block mt-0.5">or <span className="text-[#C8922A]">click to browse</span></span>
          </div>
          <span className="text-[11px] text-white/25">{ALLOWED_EXT_LABEL} · max 5 MB</span>
        </div>
      ) : (
        /* file preview */
        <div className={`flex items-center gap-4 px-4 py-4 border rounded-sm transition-colors ${error ? 'border-red-500/40 bg-red-900/10' : 'border-[#C8922A]/30 bg-[#112540]'}`}>
          {/* badge */}
          <div
            className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-[10px] font-extrabold text-white"
            style={{ background: extColor }}
          >
            {ext}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{file.name}</p>
            <p className="text-[11px] text-white/40 mt-0.5">{formatBytes(file.size)}</p>
          </div>

          {/* actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* replace */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8922A] hover:text-[#E5A93A] transition-colors"
            >
              Replace
            </button>
            {/* remove */}
            <button
              type="button"
              onClick={onClear}
              className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
              aria-label="Remove file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {error && (
        <p className="mt-1.5 text-[12px] text-red-400">{error}</p>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function Careers() {
  const [form,    setForm]    = useState({ name: '', phone: '', email: '', position: '', about: '' });
  const [cvFile,  setCvFile]  = useState(null);
  const [cvError, setCvError] = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const perksRef = useScrollReveal();
  const formRef  = useScrollReveal();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = useCallback((file, err) => {
    setCvFile(file);
    setCvError(err || '');
  }, []);

  const handleClear = useCallback(() => {
    setCvFile(null);
    setCvError('');
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (cvError) return; // block if file error present

    setLoading(true);
    setError('');

    try {
      // Build template params
      const templateParams = {
        from_name:  form.name,
        from_email: form.email,
        phone:      form.phone    || 'Not provided',
        position:   form.position || 'Not specified',
        about:      form.about,
        reply_to:   form.email,
        to_email:   'inquiry@elitechoicemep.com',
        cv_name:    cvFile ? cvFile.name : 'No CV attached',
        cv_size:    cvFile ? formatBytes(cvFile.size) : '',
      };

      // If CV attached, encode to base64 and add to params
      // Note: EmailJS file attachment requires Pro plan.
      // The base64 string is included as a template variable (cv_data)
      // which you can use in your EmailJS template or handle server-side.
      if (cvFile) {
        const base64 = await fileToBase64(cvFile);
        templateParams.cv_data = base64; // use in EmailJS template if on Pro plan
      }

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CAREER_TEMPLATE,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setSent(true);
      setForm({ name: '', phone: '', email: '', position: '', about: '' });
      setCvFile(null);
    } catch (err) {
      setError('Something went wrong. Please try again or email us directly.');
      console.error('EmailJS error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-[68px] bg-[#0B1D33] relative overflow-hidden min-h-[60vh] flex items-end">
        {/* <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80"
          alt="MEP engineering professionals at work"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33] via-[#0B1D33]/60 to-transparent" />
        <div className="gold-grid absolute inset-0" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 py-20 w-full">
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">Join Our Team</div>
          <h1
            className="font-condensed font-extrabold text-white leading-none mb-4"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Careers at <span className="text-[#C8922A]">Elite Choice</span>
          </h1>
          <p className="text-[16px] text-white/55 max-w-[540px] leading-[1.75]">
            We are always looking for talented engineers and professionals to join our growing team across the UAE.
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-20 bg-white text-[#1A2B3C]">
        <div className="max-w-[860px] mx-auto px-6 md:px-10 text-center">
          <p className="text-[16px] text-[#64748B] leading-[1.85]">
            At Elite Choice Electromechanical Contracting LLC, we deliver excellence in Mechanical, Electrical, and Plumbing (MEP) solutions across the UAE. If you are passionate about engineering, driven by quality, and ready to contribute to landmark projects — we want to hear from you.
          </p>
        </div>
      </section>

      {/* ── Why us ── */}
      <section className="py-20 bg-[#F5F7FA] text-[#1A2B3C]">
        <div ref={perksRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="mb-12 text-center">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Why Elite Choice</div>
            <h2 className="font-condensed text-[38px] font-extrabold text-[#0B1D33] leading-none">
              A Place to <span className="text-[#C8922A]">Grow Your Career</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map(({ icon, t, d }) => (
              <div key={t} className="bg-white border border-[#E2E8F0] p-7 hover:border-[#C8922A]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-[15px] text-[#0B1D33] mb-2">{t}</h3>
                <p className="text-[13px] text-[#64748B] leading-[1.65]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section className="py-24 bg-[#0B1D33]">
        <div ref={formRef} className="rv max-w-[720px] mx-auto px-6 md:px-10">
          <div className="mb-10 text-center">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Apply Now</div>
            <h2 className="font-condensed text-[38px] font-extrabold text-white leading-none mb-3">
              Submit Your Application
            </h2>
            <p className="text-[14px] text-white/50">
              Fill in the form below and attach your CV. Our HR team will review your profile.
            </p>
          </div>

          {sent ? (
            <div className="bg-[#112540] border border-[#C8922A]/30 rounded p-10 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-condensed text-[24px] font-extrabold text-white mb-2">Application Received</h3>
              <p className="text-[14px] text-white/50 mb-6">
                Thank you for your interest. Our HR team will review your profile and be in touch.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-[12px] font-bold tracking-[1px] uppercase text-[#C8922A] hover:text-[#E5A93A] border-b border-[#C8922A]/40 pb-1"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">Full Name *</label>
                  <input
                    name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-[#112540] border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/30 transition-colors text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">Phone</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+971 XX XXX XXXX"
                    className="w-full px-4 py-3 bg-[#112540] border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/30 transition-colors text-[14px]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">Email *</label>
                <input
                  name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 bg-[#112540] border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/30 transition-colors text-[14px]"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">Position Applied For</label>
                <input
                  name="position" value={form.position} onChange={handleChange}
                  placeholder="MEP Engineer, HVAC Technician..."
                  className="w-full px-4 py-3 bg-[#112540] border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/30 transition-colors text-[14px]"
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">About Yourself *</label>
                <textarea
                  name="about" value={form.about} onChange={handleChange} rows={4} required
                  placeholder="Brief overview of your experience and skills..."
                  className="w-full px-4 py-3 bg-[#112540] border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/30 transition-colors text-[14px] resize-none"
                />
              </div>

              {/* CV Upload */}
              <CVUpload
                file={cvFile}
                onFile={handleFile}
                onClear={handleClear}
                error={cvError}
              />

              {/* Global error */}
              {error && (
                <div className="bg-red-900/30 border border-red-500/40 text-red-400 text-[13px] px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !!cvError}
                className="w-full font-bold text-[13px] tracking-[1px] uppercase py-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[#0B1D33]"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-[#0B1D33]/30 border-t-[#0B1D33] rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Submit Application →'
                )}
              </button>

              {/* EmailJS note for devs */}
              {/* 
                To receive the CV attachment in email:
                - EmailJS Pro plan required for file/attachment support.
                - Add {{cv_name}} and {{cv_data}} variables to your EmailJS template.
                - Alternatively, switch to a backend endpoint (Node/Express) 
                  and use nodemailer with buffer attachment from base64.
              */}
            </form>
          )}
        </div>
      </section>
    </>
  );
}