import { Link } from 'react-router-dom';
import { useScrollReveal, useCounter } from '../hooks/useScrollReveal';

// ── Real services from company profile ──
const services = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: 'Electrical Works',
    sub: 'Power · Cabling · Lighting · Panels',
    desc: 'Safe, code-compliant electrical systems from power distribution to intelligent lighting. Certified for every project type across the UAE.',
    img: '/assets/images/electrical.webp',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h4v11H3zM10 3h4v18h-4zM17 6h4v15h-4z"/>
      </svg>
    ),
    title: 'Plumbing Systems',
    sub: 'Water Supply · Drainage · Sanitary',
    desc: 'Complete water supply, drainage and sanitary systems. Reliable pipework, fixtures, pumps and treatment for all project types.',
    img: '/assets/images/plumbing.webp',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    title: 'HVAC & Ducting',
    sub: 'AC · Ducting · Ventilation · Maintenance',
    desc: 'Climate control solutions including air conditioning, mechanical ventilation and custom duct fabrication for comfortable environments.',
    img: '/assets/images/hvac.webp',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    title: 'Full MEP Turnkey',
    sub: 'Design → Supply → Install → Handover',
    desc: 'Design to handover — we manage the complete MEP scope as a single accountable contractor, coordinated with civil works.',
    img: '/assets/images/full_mep.webp',
  },
];

// ── Real recent projects from PDF ──
const recentProjects = [
  {
    tag: 'Electrical · HVAC',
    client: 'DESS School',
    location: 'Silicon Oasis, Dubai',
    desc: 'Supply and installation of complete Electrical & HVAC systems for a large academic facility.',
    img: '/assets/images/dess_scl.webp',
  },
  {
    tag: 'Full MEP',
    client: 'Ronak Tiles Group',
    location: 'Sahara Mall, Sharjah',
    desc: 'Complete MEP project covering Electrical, Plumbing, HVAC & Fire Fighting for the Sharjah branch office.',
    img: '/assets/images/ronakTiles.jpg',
  },
  {
    tag: 'Full MEP',
    client: 'Fins and Furs',
    location: 'Mirdif Mall, Dubai',
    desc: 'Complete MEP project for a retail outlet at Up Town Mirdif Mall, Dubai.',
    img: '/assets/images/fins_n_furs.jpg',
  },
  {
    tag: 'Full MEP',
    client: 'Abdul Aziz Thani Tarish Al Shamsi',
    location: 'Al Quarien - 5, Sharjah',
    desc: 'Complete MEP project — additional first floor addition to existing villa. Project value: 1 million dirham.',
    img: '/assets/images/abdul_aziz.jpg',
  },
  {
    tag: 'Full MEP',
    client: 'Mahmoud Issa Mohammed Nahleh',
    location: 'Al Rahmaniya - 1, Sharjah',
    desc: 'Complete MEP project for proposed villa in Al Rahmaniya, Sharjah. Project value: 1 million dirham.',
    img: '/assets/images/mahmood_issa.jpg',
  },
  {
    tag: 'Electrical · HVAC',
    client: 'Emarati School',
    location: 'Al Abar, Sharjah',
    desc: 'Supply and installation of Electrical & HVAC systems for a school facility in Al Abar, Sharjah.',
    img: '/assets/images/emarati_scl.jpg',
  },
];

// ── Updated clients with new logos ──
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

// ── Licenses from PDF ──
const licenses = [
  { num: '01', title: 'Trade License',     authority: 'SEDD — No. 774030',      img: '/assets/images/ECEM_LICENSE_01.webp' },
];

function StatCard({ target, suffix, label }) {
  const ref = useCounter(target);
  return (
    <div className="text-center">
      <div className="font-condensed font-extrabold text-[52px] leading-none text-white mb-1">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/40">{label}</div>
    </div>
  );
}

export default function Home() {
  const aboutRef    = useScrollReveal();
  const servicesRef = useScrollReveal();
  const projectsRef = useScrollReveal();
  const certRef     = useScrollReveal();
  const clientsRef  = useScrollReveal();
  const careerRef   = useScrollReveal();
  const ctaRef      = useScrollReveal();
  const experience = new Date().getFullYear() - 2019;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1D33]">
        <video className="absolute inset-0 w-full h-full object-cover opacity-85" autoPlay muted loop playsInline src="/assets/videos/mep2.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D33]/50 to-[#0B1D33]/75" />
        <div className="gold-grid absolute inset-0" />
        <div className="relative z-10 text-center px-5 max-w-[800px] mx-auto">
          <div className="inline-block border border-[#C8922A]/50 text-[#C8922A] text-[11px] font-bold tracking-[3px] uppercase px-[18px] py-[6px] mb-7">
            UAE MEP Contracting
          </div>
          <h1 className="font-condensed font-extrabold text-white leading-[0.95] tracking-[-1px] mb-5" style={{ fontSize: 'clamp(46px, 8vw, 96px)' }}>
            COMPLETE MEP SOLUTIONS<br /><span className="text-[#C8922A]">UNDER ONE ROOF</span>
          </h1>
          <p className="text-[17px] text-white/60 leading-[1.7] max-w-[520px] mx-auto mb-10">
            Complete MEP solutions for residential, commercial &amp; industrial projects across the United Arab Emirates since 2019.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-9 py-4 hover:bg-[#E5A93A] transition-colors duration-200">
              Get a Free Quote
            </Link>
            <Link to="/services" className="border border-white/30 text-white font-bold text-[12px] tracking-[1px] uppercase px-9 py-4 hover:border-white/60 transition-colors duration-200">
              Our Services
            </Link>
          </div>
        </div>
       
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#112540] border-y border-[#C8922A]/15 py-10">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard target={25} suffix="+" label="Projects Completed" />
          <StatCard target={7}  suffix="+" label="Active Clients"     />
          <StatCard target={experience} suffix="+" label="Years of Experience" />
          <StatCard target={96}  suffix="%" label="Client Retention"   />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 bg-white text-[#1A2B3C]">
        <div ref={aboutRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-start">
          {/* Left — intro text + stats */}
          <div>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">About Us</div>
            <h2 className="font-condensed text-[42px] font-extrabold text-[#0B1D33] leading-none mb-6">
              A Dependable <span className="text-[#C8922A]">MEP Partner</span>
            </h2>
            <div className="w-[40px] h-[3px] bg-[#C8922A] mb-6" />
            <p className="text-[15px] text-[#64748B] leading-[1.75] mb-4">
              Elite Choice Electromechanical Contracting LLC is a UAE-based company specialising in complete MEP solutions — electrical, plumbing, HVAC and fire fighting — for residential, commercial, and industrial projects.
            </p>
            <p className="text-[15px] text-[#64748B] leading-[1.75] mb-8">
              With an experienced engineering and technician team, we deliver reliable execution, on-time completion, and strict quality control on every project, from small fit-outs to large-scale developments.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[[`${experience}+`, 'Years Active'], ['UAE', 'Nationwide'], ['2019', 'Founded']].map(([v, l]) => (
                <div key={l} className="border border-[#E2E8F0] p-4 text-center">
                  <div className="font-condensed text-[24px] font-extrabold text-[#0B1D33]">{v}</div>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-[#C8922A] mt-1">{l}</div>
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-block bg-[#0B1D33] text-white font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#112540] transition-colors">
              Learn More About Us
            </Link>
          </div>

          {/* Right — Vision & Mission */}
          <div className="flex flex-col gap-6">
            {/* Vision */}
            <div className="bg-[#F5F7FA] border border-[#E2E8F0] p-8">
              <h3 className="font-condensed text-[20px] font-extrabold text-[#0B1D33] mb-3">Our Vision</h3>
              <p className="text-[14px] text-[#64748B] leading-[1.75]">
                To achieve 100% customer satisfaction by delivering quality products and services at an affordable cost. Our long-term goal is to become a technology-based corporate solutions entity with an unconditional response to our targeted niche.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-[#0B1D33] p-8">
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-3">Our Mission</h3>
              <p className="text-[14px] text-white/55 leading-[1.75]">
                To achieve the reputation of a quality, high-standard, and reliable solution provider by maintaining a thorough knowledge of client objectives and helping them maximise benefits. We aim to establish ourselves as the best choice in MEP Services, Consultancy, and Development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 bg-[#0B1D33]">
        <div ref={servicesRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">What We Do</div>
            <h2 className="font-condensed text-[42px] font-extrabold text-white leading-none mb-4">Our Services</h2>
            <p className="text-[15px] text-white/50 max-w-[480px] mx-auto">
              End-to-end electromechanical contracting — one accountable team, zero gaps.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(({ icon, title, sub, desc, img }, i) => (
              <div key={title}
                className={`group relative overflow-hidden border border-[#C8922A]/15 cursor-default`}>
                <div className="absolute inset-0">
                  <img src={img} alt={title} className="w-full h-full object-cover opacity-45" />
                  <div className="absolute inset-0 bg-[#0B1D33]/65" />
                </div>
                <div className="relative z-10 p-8 h-full flex flex-col min-h-[280px]">
                  <div className="font-condensed text-[56px] font-extrabold text-[#C8922A]/20 leading-none mb-4">
                    0{i + 1}
                  </div>
                  <div className="text-[#C8922A] mb-4">
                    {icon}
                  </div>
                  <h3 className="font-condensed text-[22px] font-extrabold text-white mb-1">{title}</h3>
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-[#C8922A] mb-4">{sub}</div>
                  <p className="text-[13px] text-white/60 leading-[1.7] flex-1">
                    {desc}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[11px] font-bold tracking-[1px] uppercase text-[#C8922A]">
                    <Link to="/services">Learn More</Link>
                    <span>→</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#C8922A]" />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-block border border-[#C8922A]/40 text-[#C8922A] font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#C8922A] hover:text-[#0B1D33] transition-all duration-200">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECENT PROJECTS ── */}
      <section className="py-24 bg-[#F5F7FA] text-[#1A2B3C]">
        <div ref={projectsRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Our Work</div>
              <h2 className="font-condensed text-[42px] font-extrabold text-[#0B1D33] leading-none">Recent Projects</h2>
            </div>
            <Link to="/projects" className="text-[12px] font-bold tracking-[1px] uppercase text-[#C8922A] hover:text-[#0B1D33] border-b border-[#C8922A]/40 pb-1 transition-colors">
              View All Projects →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {recentProjects.map(({ tag, client, location, desc, img }) => (
              <div key={client} className="group bg-white border border-[#E2E8F0] overflow-hidden hover:border-[#C8922A]/40 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-[#0B1D33]">
                  <img src={img} alt={client}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block text-[10px] font-bold tracking-[1px] uppercase text-[#0B1D33] bg-[#C8922A] px-3 py-1">
                      {tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-condensed text-[20px] font-extrabold text-[#0B1D33] mb-1">{client}</h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C8922A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span className="text-[12px] font-semibold text-[#C8922A]">{location}</span>
                  </div>
                  <p className="text-[13px] text-[#64748B] leading-[1.7]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LICENSES ── */}
      <section className="py-20 bg-[#112540]">
        <div ref={certRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-14 items-center mb-14">
            <div>
              <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Certified &amp; Compliant</div>
              <h2 className="font-condensed text-[40px] font-extrabold text-white leading-none mb-4">
                Licensed &amp; <span className="text-[#C8922A]">Authorised</span>
              </h2>
              <p className="text-[15px] text-white/50 leading-[1.75] mb-8">
                We hold all required UAE trade and contractor licences issued by the Sharjah Economic Development Department (SEDD), ensuring full compliance on every project.
              </p>
              <Link to="/licenses" className="inline-block bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#E5A93A] transition-colors">
                View All Licences
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {licenses.map(({ num, title, authority, img }) => (
                <div key={num} className="group bg-[#0B1D33] border border-[#C8922A]/20 overflow-hidden hover:border-[#C8922A]/60 transition-all duration-300">
                  <div className="h-28 bg-[#F5F7FA] overflow-hidden relative">
                    <img src={img} alt={title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 hidden items-center justify-center bg-[#0B1D33]/10">
                      <div className="text-center">
                        <div className="font-condensed text-[32px] font-extrabold text-[#C8922A]">{num}</div>
                        <div className="text-[10px] font-bold text-[#0B1D33]/60 uppercase tracking-[1px]">License</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-condensed text-[20px] font-extrabold text-[#C8922A] mb-1">{num}</div>
                    <div className="text-[11px] font-bold text-white mb-1">{title}</div>
                    <div className="text-[9px] font-semibold text-white/40 tracking-[0.5px]">{authority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className="py-20 bg-white text-[#1A2B3C]">
        <div ref={clientsRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Who We Work With</div>
            <h2 className="font-condensed text-[40px] font-extrabold text-[#0B1D33] leading-none mb-3">
              Trusted by <span className="text-[#C8922A]">Industry Leaders</span>
            </h2>
            <p className="text-[15px] text-[#64748B] max-w-[480px] mx-auto">
              Delivering electromechanical excellence for leading developers, contractors and enterprises across the UAE.
            </p>
          </div>
        </div>

        {/* Static grid */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-5">
            {clients.map(({ src, alt }) => (
              <div key={alt} title={alt}
                className="flex flex-col items-center justify-center gap-3 p-6 border border-[#E2E8F0] group hover:border-[#C8922A]/40 hover:shadow-md transition-all duration-300">
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[70px] max-w-[140px] w-full object-contain transition-all duration-300"
                />
                <span className="text-[10px] font-semibold tracking-[0.5px] uppercase text-[#94A3B8] group-hover:text-[#C8922A] transition-colors text-center">
                  {alt}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/clients" className="text-[12px] font-bold tracking-[1px] uppercase text-[#C8922A] border-b border-[#C8922A]/40 pb-1 hover:text-[#0B1D33] hover:border-[#0B1D33] transition-colors">
              View All Clients →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CAREERS ── */}
      <section className="py-24 bg-white text-[#1A2B3C]">
        <div ref={careerRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-3">Join Our Team</div>
            <h2 className="font-condensed text-[40px] font-extrabold text-[#0B1D33] leading-none mb-4">
              Build Your Career <span className="text-[#C8922A]">With Us</span>
            </h2>
            <p className="text-[15px] text-[#64748B] leading-[1.75] mb-8">
              We are always looking for talented engineers and MEP professionals to join our growing team across the UAE. We offer major projects, competitive packages, and real career growth.
            </p>
            <Link to="/careers" className="inline-block bg-[#0B1D33] text-white font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#112540] transition-colors">
              Apply Now
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '', t: 'Major Projects',  d: 'High-profile MEP contracts across Dubai, Sharjah, and the wider UAE.' },
              { icon: '', t: 'Competitive Pay',  d: 'Market-rate salaries and allowances aligned with UAE standards.'      },
              { icon: '', t: 'Career Growth',    d: 'Technical training, certification support, and clear progression paths.' },
              { icon: '', t: 'Team Culture',     d: 'Professional, safety-first culture with strong on-site support.'       },
            ].map(({ icon, t, d }) => (
              <div key={t} className="bg-[#F5F7FA] border border-[#E2E8F0] p-5 hover:border-[#C8922A]/30 hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="font-bold text-[14px] text-[#0B1D33] mb-1">{t}</div>
                <p className="text-[12px] text-[#64748B] leading-[1.6]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#C8922A] py-16">
        <div ref={ctaRef} className="rv max-w-[1280px] mx-auto px-6 md:px-10 flex flex-wrap items-center justify-between gap-8">
          <div>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#0B1D33]/60 mb-2">Get in Touch</div>
            <h2 className="font-condensed text-[36px] font-extrabold text-[#0B1D33] leading-none">Contact Us</h2>
            <p className="text-[14px] text-[#0B1D33]/70 mt-2 max-w-[420px]">
              Ready to discuss your next MEP project? Reach out and we will get back to you promptly.
            </p>
          </div>
          <Link to="/contact" className="inline-block bg-[#0B1D33] text-white font-bold text-[12px] tracking-[1px] uppercase px-10 py-5 hover:bg-[#112540] transition-colors flex-shrink-0">
            Send a Message →
          </Link>
        </div>
      </section>
    </>
  );
}