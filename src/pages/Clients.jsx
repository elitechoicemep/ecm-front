import { Link } from 'react-router-dom';
import { useScrollReveal, useCounter } from '../hooks/useScrollReveal';
import LogoLoop from '../components/LogoLoop';

const clients = [
  { src: '/assets/images/akka.png',                   alt: 'Akka'                   },
  { src: '/assets/images/al_arabia.png',              alt: 'Al Arabia'              },
  { src: '/assets/images/al_sharjah_consultants.png', alt: 'Al Sharjah Consultants' },
  { src: '/assets/images/al_shirawi.png',             alt: 'Al Shirawi'             },
  { src: '/assets/images/al_shirawi_llc.png',         alt: 'Al Shirawi LLC'         },
  { src: '/assets/images/chicago.png',                alt: 'Chicago'                },
  { src: '/assets/images/geco.png',                   alt: 'GECO'                   },
  { src: '/assets/images/sharqa_cons.png',            alt: 'Sharqa Consultants'     },
];

function Stat({ target, suffix, label }) {
  const ref = useCounter(target);
  return (
    <div className="text-center py-8 px-4">
      <div className="font-condensed font-extrabold text-[52px] leading-none text-white mb-2">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C8922A]">{label}</div>
    </div>
  );
}

export default function Clients() {
  const statsRef   = useScrollReveal();
  const clientsRef = useScrollReveal();
  const ctaRef     = useScrollReveal();

  return (
    <>
      {/* Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">Our Clients</div>
            <h1 className="font-condensed font-extrabold text-white leading-none mb-4"
                style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
              TRUSTED BY <span className="text-[#C8922A]">INDUSTRY</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[560px] leading-[1.75]">
              Trusted by leading developers, contractors, and enterprises across the UAE
              for complete electromechanical solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#112540] border-b border-[#C8922A]/15">
        <div ref={statsRef} className="rv max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#C8922A]/15">
          <Stat target={7}  suffix="+" label="Active Clients"     />
          <Stat target={96}  suffix="%" label="Client Retention"   />
          <Stat target={25} suffix="+" label="Projects Delivered" />
          <Stat target={7}   suffix="+" label="Years of Trust"     />
        </div>
      </section>

      {/* Logos grid */}
      <section className="py-24 bg-white text-[#1A2B3C]">
        <div ref={clientsRef} className="rv">

          <div className="max-w-[1280px] mx-auto px-6 md:px-10 mb-14">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Partnerships &amp; Trust</div>
            <h2 className="font-condensed text-[40px] font-extrabold text-[#0B1D33] leading-none mb-4">
              Companies That <span className="text-[#C8922A]">Trust Us</span>
            </h2>
            <p className="text-[15px] text-[#64748B] max-w-[540px]">
              We take pride in delivering exceptional electromechanical solutions to
              industry-leading organizations across the UAE and beyond.
            </p>
          </div>

          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {clients.map(({ src, alt }) => (
                <div
                  key={alt}
                  title={alt}
                  className="flex flex-col items-center justify-center gap-3 p-8 border border-[#E2E8F0] bg-white hover:border-[#C8922A]/40 hover:shadow-md transition-all duration-300 group"
                >
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-[80px] max-w-[160px] w-full object-contain transition-all duration-300"
                  />
                  <span className="text-[11px] font-semibold tracking-[0.5px] text-[#94A3B8] group-hover:text-[#C8922A] transition-colors text-center">
                    {alt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee */}
          <div className="mt-16 border-t border-b border-[#E2E8F0] py-10 bg-[#F9FAFB]">
            <p className="text-center text-[11px] font-bold tracking-[2px] uppercase text-[#94A3B8] mb-8">
              Our Partners Across the UAE
            </p>
            <LogoLoop
              logos={clients}
              speed={50}
              gap={80}
              logoHeight={60}
              fadeOut={true}
              fadeColor="#F9FAFB"
              scaleOnHover={true}
              pauseOnHover={true}
            />
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1D33] py-20">
        <div ref={ctaRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-condensed text-[36px] font-extrabold text-white mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-[15px] text-white/50 mb-8">
            Let us discuss your next electromechanical project requirement.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-10 py-5 hover:bg-[#E5A93A] transition-colors"
          >
            Get a Free Quote →
          </Link>
        </div>
      </section>
    </>
  );
}