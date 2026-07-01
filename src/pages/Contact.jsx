import { useState } from 'react';
import { api } from '../api';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [chars,   setChars]   = useState(0);
  const formRef = useScrollReveal();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'message') setChars(e.target.value.length);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.submitContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        message: form.message,
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
      setChars(0);
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly.');
      console.error('Contact message error:', err);
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: '📞', label: 'Phone / WhatsApp', val: '+971 58 571 6322',           href: 'tel:+971585716322'                 },
    { icon: '✉️', label: 'Email',            val: 'inquiry@elitechoicemep.com', href: 'mailto:inquiry@elitechoicemep.com' },
    { icon: '📍', label: 'Address',          val: 'Al Yarmook, Sharjah — behind Sharjah Consultative Office, No. G1 & G2' },
    { icon: '🕐', label: 'Working Hours',    val: 'Saturday – Thursday, 8:00 AM – 10:00 PM' },
  ];

  const inputCls = "w-full px-4 py-3 border border-[#E2E8F0] text-[#1A2B3C] placeholder-[#94A3B8] focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/20 transition-colors text-[14px]";

  return (
    <>
      {/* Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">Get in Touch</div>
            <h1 className="font-condensed font-extrabold text-white leading-none mb-4"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              Contact <span className="text-[#C8922A]">Us</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[500px] leading-[1.75]">
              Let's discuss your next project. We respond within 24 hours, Saturday to Thursday.
            </p>
          </div>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-24 bg-white text-[#1A2B3C]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16">

          {/* Info */}
          <div>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Get in Touch</div>
            <h2 className="font-condensed text-[36px] font-extrabold text-[#0B1D33] leading-none mb-6">
              Let's Build Something <span className="text-[#C8922A]">Reliable</span>
            </h2>
            <p className="text-[15px] text-[#64748B] leading-[1.75] mb-8">
              Reach out for quotes, consultations, or any questions about our electromechanical and construction services. We execute full MEP works with material supply or labour only.
            </p>
            <div className="space-y-5">
              {info.map(({ icon, label, val, href }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-[#F5F7FA] border border-[#E2E8F0] flex items-center justify-center text-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold tracking-[1px] uppercase text-[#C8922A] mb-1">{label}</div>
                    {href ? (
                      <a href={href} className="text-[14px] font-semibold text-[#0B1D33] hover:text-[#C8922A] transition-colors">{val}</a>
                    ) : (
                      <p className="text-[14px] text-[#64748B]">{val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-[#F5F7FA] border-l-4 border-[#C8922A]">
              <p className="text-[13px] text-[#64748B] leading-[1.7]">
                <strong className="text-[#0B1D33]">Business Opportunity:</strong> Consultants and brokers are welcome — bring us your MEP project on commission. We execute with material supply or labour only.
              </p>
            </div>
          </div>

          {/* Form */}
          <div ref={formRef} className="rv">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Send a Message</div>
            <p className="text-[13px] text-[#64748B] mb-6">We respond to all enquiries within 24 hours.</p>

            {sent ? (
              <div className="bg-[#F0FDF4] border border-green-200 p-8 text-center">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-condensed text-[22px] font-extrabold text-[#0B1D33] mb-2">Message Received</h3>
                <p className="text-[14px] text-[#64748B] mb-5">
                  Thank you for reaching out. Our team will be in touch within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-[12px] font-bold tracking-[1px] uppercase text-[#C8922A] border-b border-[#C8922A]/40 pb-1"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#64748B] mb-2">Full Name *</label>
                    <input
                      name="name" value={form.name} onChange={handleChange} required
                      placeholder="Your Name" className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#64748B] mb-2">Email Address *</label>
                    <input
                      name="email" type="email" value={form.email} onChange={handleChange} required
                      placeholder="you@company.com" className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#64748B] mb-2">Phone / WhatsApp</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                  
                    placeholder="+971 XX XXX XXXX" className={inputCls}
                    
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#64748B] mb-2">Service Required</label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    className={inputCls + ' bg-white'}
                  >
                    <option value="">Select a service...</option>
                    <option>Electrical Works</option>
                    <option>Plumbing Systems</option>
                    <option>HVAC &amp; Ducting</option>
                   
                    <option>Full MEP Turnkey</option>
                    <option>Fire Fighting</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[1px] uppercase text-[#64748B] mb-2">Project Description</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={5} maxLength={500} required
                    placeholder="Brief overview of your project scope, location, and timeline..."
                    className={inputCls + ' resize-none'}
                  />
                  <div className="text-[11px] text-[#94A3B8] text-right mt-1">{chars} / 500</div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0B1D33] text-white font-bold text-[13px] tracking-[1px] uppercase py-4 hover:bg-[#112540] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send Message →'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Call CTA */}
      <section className="bg-[#C8922A] py-14">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-[12px] font-bold tracking-[1px] uppercase text-[#0B1D33]/60 mb-1">Prefer to call?</p>
            <p className="text-[15px] text-[#0B1D33]/70">
              Reach us directly on WhatsApp or phone — we're available Sat–Thu, 8AM to 10PM.
            </p>
          </div>
          <a
            href="tel:+971585716322"
            className="inline-block bg-[#0B1D33] text-white font-bold text-[14px] tracking-[0.5px] px-8 py-4 hover:bg-[#112540] transition-colors"
          >
            📞 +971 58 571 6322
          </a>
        </div>
      </section>
    </>
  );
}
