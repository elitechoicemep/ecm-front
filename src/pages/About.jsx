import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const values = [
  { title: 'Quality First',       desc: 'Every installation meets strict UAE engineering and safety standards. No shortcuts, no compromises.' },
  { title: 'On-Time Delivery',    desc: 'We coordinate tightly with civil works programs to ensure reliable, on-schedule handovers every time.' },
  { title: 'Integrity',           desc: 'Transparent pricing, honest timelines, and clear communication from first consultation to final handover.' },
  { title: 'Safety-First Culture',desc: 'Strict adherence to UAE Civil Defence and safety regulations on every site, on every project.' },
  { title: 'Flexible Contracting',desc: 'Full turnkey with material supply, or labour-only execution — structured to match your project needs.' },
  { title: 'Full MEP Capability', desc: 'Electrical, plumbing, HVAC, and fire fighting delivered under one accountable contract.' },
];

export default function About() {
  const storyRef  = useScrollReveal();
  const valuesRef = useScrollReveal();
  const ctaRef    = useScrollReveal();

  return (
    <>
      {/* Page Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">About Us</div>
            <h1 className="font-condensed font-extrabold text-white leading-none mb-4"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              About <span className="text-[#C8922A]">Elite Choice</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[540px] leading-[1.75]">
              Engineering excellence in electrical, plumbing, HVAC and full MEP services since 2019.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white text-[#1A2B3C]">
        <div ref={storyRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-block bg-[#C8922A]/10 text-[#C8922A] text-[10px] font-bold tracking-[1.5px] uppercase px-3 py-1 mb-4">Since 2019</div>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-2">Our Story</div>
            <h2 className="font-condensed text-[38px] font-extrabold text-[#0B1D33] leading-none mb-6">
              A Dependable MEP <span className="text-[#C8922A]">Contracting Partner</span>
            </h2>
            <div className="w-[40px] h-[3px] bg-[#C8922A] mb-6" />
            <p className="text-[15px] text-[#64748B] leading-[1.75] mb-4">
              Elite Choice Electromechanical Contracting LLC was established in 2019 as a UAE-based contracting company specialising in complete MEP solutions for residential, commercial, and industrial projects.
            </p>
            <p className="text-[15px] text-[#64748B] leading-[1.75]">
              With an experienced engineering and technician team, we deliver reliable execution, on-time completion, and strict quality control on every project — from small fit-outs to large-scale developments. We work either as a full turnkey contractor supplying materials and labour, or as a labour-only partner when clients prefer to supply materials themselves.
            </p>
          </div>
          <div className="space-y-6">
            <div className="bg-[#F5F7FA] border border-[#E2E8F0] p-8">
              <h3 className="font-condensed text-[20px] font-extrabold text-[#0B1D33] mb-3">Our Vision</h3>
              <p className="text-[14px] text-[#64748B] leading-[1.75]">
                To achieve 100% customer satisfaction by delivering quality products and services at an affordable cost. Our long-term goal is to become a technology-based corporate solutions entity with an unconditional response to our targeted niche.
              </p>
            </div>
            <div className="bg-[#0B1D33] p-8">
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-3">Our Mission</h3>
              <p className="text-[14px] text-white/55 leading-[1.75]">
                To achieve the reputation of a quality, high-standard, and reliable solution provider by maintaining a thorough knowledge of client objectives and helping them maximise benefits. We aim to establish ourselves as the best choice in MEP Services, Consultancy, and Development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#F5F7FA] text-[#1A2B3C]">
        <div ref={valuesRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="mb-14">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Why Choose Us</div>
            <h2 className="font-condensed text-[40px] font-extrabold text-[#0B1D33] leading-none">Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ title, desc }, i) => (
              <div key={title} className="bg-white border border-[#E2E8F0] p-7 hover:border-[#C8922A]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="font-condensed text-[30px] font-extrabold text-[#C8922A]/20 mb-3">0{i + 1}</div>
                <h3 className="font-bold text-[16px] text-[#0B1D33] mb-2">{title}</h3>
                <p className="text-[13px] text-[#64748B] leading-[1.7]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1D33] py-20">
        <div ref={ctaRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-condensed text-[36px] font-extrabold text-white mb-4">
            Ready to discuss your project?
          </h2>
          <p className="text-[15px] text-white/50 mb-8">Get in touch for a consultation and competitive quote.</p>
          <Link to="/contact" className="inline-block bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-10 py-5 hover:bg-[#E5A93A] transition-colors">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
