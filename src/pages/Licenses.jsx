import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const licenses = [
  {
    num: '01',
    authority: 'SEDD · License No. 774030',
    title: 'Trade License',
    arabic: 'رخصة تجارية',
    detail: 'Valid: 19 Nov 2019 – 19 Nov 2026',
    img: '/assets/images/ECEM_LICENSE_01.webp',
  },
];

export default function Licenses() {
  const [preview, setPreview] = useState(null);
  const gridRef = useScrollReveal();

  return (
    <>
      {/* Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">Official Documentation</div>
            <h1 className="font-condensed font-extrabold text-white leading-none mb-4"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              Licenses &amp; <span className="text-[#C8922A]">Certifications</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[560px] leading-[1.75]">
              Official company licenses, registrations, and certifications issued by the Government of Sharjah Economic Development Department.
            </p>
          </div>
        </div>
      </section>

      {/* License Cards */}
      <section className="py-24 bg-[#F5F7FA] text-[#1A2B3C]">
        <div ref={gridRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-3 gap-8">
            {licenses.map(({ num, authority, title, arabic, detail, img }) => (
              <div key={num} className="bg-white border border-[#E2E8F0] overflow-hidden hover:border-[#C8922A]/40 hover:-translate-y-1 transition-all duration-300 group">
                {/* License image preview */}
                <div
                  className="relative h-48 bg-[#F5F7FA] overflow-hidden cursor-pointer"
                  onClick={() => setPreview(img)}
                >
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-[#0B1D33]/0 group-hover:bg-[#0B1D33]/20 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-[#0B1D33] text-[12px] font-bold px-4 py-2 rounded">
                      🔍 View
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="font-condensed text-[40px] font-extrabold text-[#C8922A]/15 leading-none mb-2">{num}</div>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-[#C8922A] mb-2">{authority}</div>
                  <h3 className="font-condensed text-[22px] font-extrabold text-[#0B1D33] mb-1">{title}</h3>
                  <p className="text-[14px] text-[#64748B] mb-2" dir="rtl">{arabic}</p>
                  <p className="text-[12px] font-semibold text-[#64748B]">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setPreview(null)}
        >
          <div className="max-w-[800px] w-full bg-white p-4 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white font-bold text-[13px] tracking-[1px] uppercase hover:text-[#C8922A]"
            >
              ✕ Close
            </button>
            <img src={preview} alt="License" className="w-full object-contain max-h-[80vh]" />
          </div>
        </div>
      )}
    </>
  );
}
