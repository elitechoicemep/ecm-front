import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function useRv() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

// Sub-component so each service gets its own hook call (no hooks-in-loop)
function ServiceRow({ num, title, desc, features, img, reverse }) {
  const ref = useRv();
  return (
    <section className={`py-20 ${reverse ? 'bg-[#F5F7FA]' : 'bg-white'} text-[#1A2B3C]`}>
      <div ref={ref} className="rv max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
        <div className={reverse ? 'md:order-2' : ''}>
          <div className="font-condensed text-[64px] font-extrabold text-[#C8922A]/10 leading-none mb-2">{num}</div>
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-2">Service {num}</div>
          <h2 className="font-condensed text-[36px] font-extrabold text-[#0B1D33] leading-none mb-4">{title}</h2>
          <div className="w-[36px] h-[3px] bg-[#C8922A] mb-5" />
          <p className="text-[15px] text-[#64748B] leading-[1.75] mb-6">{desc}</p>
          <ul className="space-y-2 mb-8">
            {features.map(f => (
              <li key={f} className="flex items-center gap-3 text-[13px] text-[#64748B]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#C8922A] flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
          <Link to="/contact" className="inline-block bg-[#0B1D33] text-white font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#112540] transition-colors">
            Request Service →
          </Link>
        </div>
        <div className={reverse ? 'md:order-1' : ''}>
          <div className="relative">
            <div className="absolute -top-3 -right-3 w-full h-full border-2 border-[#C8922A]/15" />
            <img src={img} alt={title} className="w-full h-[340px] object-cover relative z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

const services = [
  {
    num: '01', title: 'Plumbing Systems',
    desc: 'Complete water supply, drainage, and sanitary systems. We design and install reliable pipework, fixtures, pumps, and treatment systems for residential, commercial, and industrial projects.',
    features: ['Water supply and pressurised distribution', 'Drainage, sewage and waste systems', 'Fixtures, sanitary ware and pumps', 'Leak detection, maintenance and repairs'],
    img: '/assets/images/plumbing.jpg',
  },
  {
    num: '02', title: 'Electrical Works',
    desc: 'Safe, code-compliant electrical systems from power distribution to intelligent lighting. Our certified electricians handle panel boards, cabling, controls, and energy-efficient lighting for every project type.',
    features: ['Power distribution and panel boards', 'High and low-voltage wiring and cabling', 'Lighting systems and smart controls', 'Inspection, testing and commissioning'],
    img: '/assets/images/electrical.jpg',
  },
  {
    num: '03', title: 'HVAC & Ducting',
    desc: 'Climate control solutions including air conditioning, mechanical ventilation, and custom duct fabrication for comfortable, healthy, and energy-efficient indoor environments.',
    features: ['AC installation, servicing and overhaul', 'Custom duct design and sheet metal fabrication', 'Mechanical ventilation and air quality systems', 'Fire-rated ducting and preventive maintenance'],
    img: '/assets/images/hvac.jpg',
  },
  {
    num: '04', title: 'Fire Fighting Systems',
    desc: 'Complete fire protection and suppression systems designed and installed to UAE Civil Defence standards. From sprinkler networks to hose reels, we ensure full compliance and certification.',
    features: ['Fire sprinkler system design and installation', 'Hose reels and hydrant systems', 'Fire alarm and detection integration', 'UAE Civil Defence compliance and certification'],
    img: '/assets/images/ff.jpg',
  },
  {
    num: '05', title: 'Full MEP Turnkey',
    desc: 'Design to handover — we manage the complete MEP scope as a single accountable contractor, coordinated with civil works for on-time delivery.',
    features: ['Integrated MEP design coordination', 'Material procurement and supply chain', 'End-to-end project management', 'Final commissioning and handover documentation'],
    img: '/assets/images/full_mep.jpg',
  },
  // {
  //   num: '06', title: 'Maintenance Services',
  //   desc: 'Planned and reactive maintenance services to keep your MEP systems running at peak efficiency long after project handover.',
  //   features: ['Planned preventive maintenance schedules', 'Reactive breakdown response', 'System performance audits', 'Replacement and upgrade works'],
  //   img: '/assets/images/plumbing.jpg',
  // },
];

export default function Services() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">What We Do</div>
            <h1 className="font-condensed font-extrabold text-white leading-none mb-4"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              Our <span className="text-[#C8922A]">Services</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[540px] leading-[1.75]">
              Integrated MEP and construction solutions — designed, installed, and maintained under one roof.
            </p>
          </div>
        </div>
      </section>

      {/* Services List — each row is its own component with its own hook */}
      {services.map(({ num, title, desc, features, img }, i) => (
        <ServiceRow key={num} num={num} title={title} desc={desc} features={features} img={img} reverse={i % 2 === 1} />
      ))}

      {/* CTA */}
      <section className="bg-[#C8922A] py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-8">
          <div>
            <h2 className="font-condensed text-[36px] font-extrabold text-[#0B1D33] leading-none mb-2">Ready to start your project?</h2>
            <p className="text-[14px] text-[#0B1D33]/70">Get in touch for a free consultation and competitive quote.</p>
          </div>
          <Link to="/contact" className="inline-block bg-[#0B1D33] text-white font-bold text-[12px] tracking-[1px] uppercase px-10 py-5 hover:bg-[#112540] transition-colors flex-shrink-0">
            Get a Free Quote →
          </Link>
        </div>
      </section>
    </>
  );
}
