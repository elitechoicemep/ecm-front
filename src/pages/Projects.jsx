import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const projects = [
  {
    id: 1,
    name: 'DESS School',
    location: 'Silicon Oasis, Academic City, Dubai',
    tag: 'Electrical · HVAC',
    type: 'Electrical',
    desc: 'Supply and installation of complete Electrical & HVAC systems for a large academic facility in Silicon Oasis, Dubai.',
    img: '/assets/images/dess_scl.webp',
  },
  {
    id: 2,
    name: 'Ronak Tiles Group of Companies',
    location: 'Sharjah Branch Office, Sahara Mall',
    tag: 'Full MEP',
    type: 'Full MEP',
    desc: 'Complete MEP project covering Electrical, Plumbing, HVAC & Fire Fighting for the Ronak Tiles Sharjah branch office at Sahara Mall.',
    img: '/assets/images/ronakTiles.jpg',
  },
  {
    id: 3,
    name: 'Abdul Aziz Thani Tarish Al Shamsi',
    location: 'Al Quarien - 5, Sharjah',
    tag: 'Full MEP',
    type: 'Full MEP',
    desc: 'Complete MEP project — additional first floor addition to existing villa. Project value: 1 million dirham.',
    img: '/assets/images/abdul_aziz.jpg',
  },
  {
    id: 4,
    name: 'Mahmoud Issa Mohammed Nahleh',
    location: 'Al Rahmaniya - 1, Sharjah',
    tag: 'Full MEP',
    type: 'Full MEP',
    desc: 'Complete MEP project for proposed villa in Al Rahmaniya, Sharjah. Project value: 1 million dirham.',
    img: '/assets/images/mahmood_issa.jpg',
  },
  {
    id: 5,
    name: 'Fins and Furs',
    location: 'Up Town Mirdif Mall, Dubai',
    tag: 'Full MEP',
    type: 'Full MEP',
    desc: 'Complete MEP project for a retail outlet in Up Town Mirdif Mall, Dubai — covering all mechanical, electrical and plumbing works.',
    img: '/assets/images/fins_n_furs.jpg',
  },
  {
    id: 6,
    name: 'Emarati School',
    location: 'Al Abar, Sharjah',
    tag: 'Electrical · HVAC',
    type: 'Electrical',
    desc: 'Supply and installation of Electrical & HVAC systems for a school facility in Al Abar, Sharjah.',
    img: '/assets/images/emarati_scl.jpg',
  },
];

function ProjectCard({ name, location, tag, desc, img }) {
  return (
    <div className="bg-white border border-[#E2E8F0] overflow-hidden group hover:border-[#C8922A]/40 hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 bg-[#F5F7FA] overflow-hidden">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback placeholder */}
        <div className="absolute inset-0 bg-[#0B1D33] hidden items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🏗️</div>
            <div className="text-[#C8922A] font-condensed font-bold text-[13px] uppercase tracking-[1px]">MEP Project</div>
          </div>
        </div>
        {/* Tag overlay */}
        <div className="absolute top-3 left-3">
          <span className="inline-block text-[10px] font-bold tracking-[1px] uppercase text-[#0B1D33] bg-[#C8922A] px-3 py-1">
            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-condensed text-[20px] font-extrabold text-[#0B1D33] mb-1 leading-tight">{name}</h3>
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
  );
}

export default function Projects() {
  const gridRef = useScrollReveal();

  return (
    <>
      {/* Hero */}
      <section className="pt-[68px] bg-[#0B1D33]">
        <div className="gold-grid relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-24 relative z-10">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#C8922A] mb-4">Portfolio</div>
            <h1
              className="font-condensed font-extrabold text-white leading-none mb-4"
              style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
            >
              Our <span className="text-[#C8922A]">Projects</span>
            </h1>
            <p className="text-[16px] text-white/55 max-w-[560px] leading-[1.75]">
              A selection of completed MEP works across the UAE — schools, retail, villas,
              commercial and industrial facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-[#112540] border-b border-[#C8922A]/15 py-6">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex flex-wrap gap-10 justify-center md:justify-start">
          {[['6+', 'Projects Shown'], ['UAE', 'Nationwide Coverage'], ['2019', 'Operating Since'], ['Full MEP', 'Single Contractor']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <div className="font-condensed text-[28px] font-extrabold text-white leading-none">{val}</div>
              <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-[#C8922A] mt-1">{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-[#F5F7FA] text-[#1A2B3C]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">

          {/* Grid */}
          <div ref={gridRef} className="rv grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
              <ProjectCard key={p.id} {...p} />
            ))}
          </div>

          <p className="text-center text-[13px] text-[#64748B] mt-12">
            More project references and site photos available on request —{' '}
            <a href="mailto:inquiry@elitechoicemep.com" className="text-[#C8922A] hover:underline font-semibold">
              inquiry@elitechoicemep.com
            </a>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0B1D33] py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 text-center">
          <h2 className="font-condensed text-[34px] font-extrabold text-white mb-3">
            Have a project to offer?
          </h2>
          <p className="text-[14px] text-white/50 mb-8">
            Consultants and brokers welcome — we execute on commission, with material supply or labour only.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-10 py-5 hover:bg-[#E5A93A] transition-colors"
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}