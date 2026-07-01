import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B1D33]">
      <div className="border-t border-white/[0.07]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-3 gap-14">
          {/* Brand */}
          <div>
            <div className="font-condensed text-[22px] font-extrabold text-white tracking-[1px] mb-3">
              ELITE<span className="text-[#C8922A]">CHOICE</span>
            </div>
            <div className="w-[30px] h-[2px] bg-[#C8922A] mb-4" />
            <p className="text-[13px] text-white/40 leading-[1.7] mb-5">
              Elite Choice Electromechanical Contracting LLC — delivering complete MEP solutions across the UAE since 2019.
            </p>
            <p className="text-[13px] text-white/40 mb-1">
              <a href="tel:+971585716322" className="hover:text-[#C8922A] transition-colors">+971 58 571 6322</a>
            </p>
            <p className="text-[13px] text-white/40 mb-1">
              <a href="mailto:inquiry@elitechoicemep.com" className="hover:text-[#C8922A] transition-colors">inquiry@elitechoicemep.com</a>
            </p>
            <p className="text-[13px] text-white/40">Al Yarmook, Sharjah, UAE</p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="font-condensed text-[12px] font-bold tracking-[2px] uppercase text-white/28 mb-5">Navigation</h5>
            {[
              { to: '/',         label: 'Home'     },
              { to: '/about',    label: 'About Us' },
              { to: '/services', label: 'Services' },
              { to: '/projects', label: 'Projects' },
              { to: '/clients',  label: 'Clients'  },
              { to: '/licenses', label: 'Licenses' },
              { to: '/careers',  label: 'Careers'  },
              { to: '/contact',  label: 'Contact'  },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="block text-[13px] text-white/50 mb-[9px] hover:text-[#C8922A] transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h5 className="font-condensed text-[12px] font-bold tracking-[2px] uppercase text-white/28 mb-5">Services</h5>
            {[
              'Electrical Works',
              'Plumbing Systems',
              'HVAC & Ducting',
             
              'Full MEP Turnkey',
              'Fire Fighting',
            ].map((s) => (
              <Link key={s} to="/services" className="block text-[13px] text-white/50 mb-[9px] hover:text-[#C8922A] transition-colors">
                {s}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.07] max-w-[1280px] mx-auto px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] text-white/20">
            © {new Date().getFullYear()} Elite Choice Electromechanical Contracting LLC. All rights reserved.
          </p>
          {/* <Link to="/dashboard" className="text-[12px] text-white/20 hover:text-[#C8922A] transition-colors">
            Dashboard
          </Link> */}
        </div>
      </div>
    </footer>
  );
}

