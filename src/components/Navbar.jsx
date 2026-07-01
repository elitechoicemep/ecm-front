import {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {api} from '../api';

const links = [{to: '/', label: 'Home'}, {to: '/about', label: 'About'}, {
    to: '/services',
    label: 'Services'
}, {to: '/projects', label: 'Projects'}, {to: '/clients', label: 'Clients'}, {
    to: '/licenses',
    label: 'Licenses'
}, {to: '/careers', label: 'Careers'},];

function normaliseSession(data) {
    const u = data?.user;
    if (!u) return null;
    return {
        role: u.role, username: u.username, email: u.email || '', ...(data.employee ? {
            empId: data.employee.empId,
            empName: data.employee.name
        } : {}), ...(data.supplier ? {company: data.supplier.company} : {}),
    };
}

function getDisplayName(user) {
    if (!user) return '';
    if (user.role === 'admin') return 'Administrator';
    if (user.role === 'employee') return user.empName || user.username;
    return user.company || user.username;
}

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        let alive = true;
        api.me()
            .then(data => {
                if (alive) setUser(normaliseSession(data));
            })
            .catch(() => {
                if (alive) setUser(null);
            });

        const onChanged = e => setUser(e.detail?.user || null);
        const onExpired = () => {
            setUser(null);
            setAccountOpen(false);
        };
        window.addEventListener('auth:changed', onChanged);
        window.addEventListener('auth:expired', onExpired);
        return () => {
            alive = false;
            window.removeEventListener('auth:changed', onChanged);
            window.removeEventListener('auth:expired', onExpired);
        };
    }, []);

    // Close menus on route change
    useEffect(() => {
        setOpen(false);
        setAccountOpen(false);
    }, [location.pathname]);

    const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

    const displayName = getDisplayName(user);
    const initial = (displayName || user?.username || 'U').charAt(0).toUpperCase();
    const accountLine = [displayName, user?.email || user?.username].filter(Boolean).join(' • ');

    const confirmLogout = async () => {
        try {
            await api.logout();
        } catch {
        }
        setUser(null);
        setConfirmOpen(false);
        setAccountOpen(false);
        window.dispatchEvent(new CustomEvent('auth:expired'));
        navigate('/dashboard');
    };

    const AccountMenu = () => (<div className="relative">
            <button
                type="button"
                onClick={() => setAccountOpen(v => !v)}
                className="relative w-10 h-10 rounded-full bg-green-500 text-white font-extrabold flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,0.12)]"
                aria-label="Open account menu"
            >
                {initial}
                <span
                    className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-[#0B1D33] border border-green-400 flex items-center justify-center text-green-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
            </button>

            {accountOpen && (<div
                    className="absolute right-0 top-[52px] w-[280px] rounded-xl border border-[#C8922A]/20 bg-[#112540] shadow-[0_24px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                    <div
                        className="px-4 py-3 border-b border-white/10 text-[12px] font-semibold text-white break-words">
                        {accountLine}
                    </div>
                    <Link
                        to="/dashboard"
                        className="block px-4 py-3 text-[13px] font-bold text-white/70 hover:bg-[#C8922A]/10 hover:text-[#C8922A] transition-colors"
                    >
                        Dashboard
                    </Link>
                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        className="w-full text-left px-4 py-3 text-[13px] font-bold text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        Logout
                    </button>
                </div>)}
        </div>);

    return (<>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 h-[68px] transition-all duration-300 ${scrolled ? 'bg-[#102037] shadow-[0_4px_30px_rgba(0,0,0,0.4)]' : 'bg-[#102037]'} border-b border-[#C8922A]/20`}
            >
                <div className="max-w-[1280px] mx-auto px-3 md:px-8 h-full flex items-center justify-between">

                    <div className="flex items-center h-full shrink-0">
                        <button
                            className="lg:hidden flex flex-col gap-[5px] p-1 "
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            <span
                                className={`block w-[22px] h-[2px] bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`}/>
                            <span
                                className={`block w-[22px] h-[2px] bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`}/>
                            <span
                                className={`block w-[22px] h-[2px] bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}/>
                        </button>
                        <Link
                            to="/"
                            className="flex items-center gap-1 md:gap-2 shrink-0 h-full ml-1 md:ml-4"
                        >
                        <img
                            src="/assets/images/emec_logo.jpeg"
                            alt="Elite Choice Electromechanical Contracting LLC"
                            className="block h-10 md:h-12 w-auto max-h-12 object-contain"
                        />
                        <span className="font-condensed leading-tight">
              <span className="block text-[15px] md:text-[17px] font-extrabold tracking-[0.5px] text-[#C8922A]">
                ELITE CHOICE
              </span>
              <span className="block text-[11px] md:text-[12px] font-bold tracking-[1px] text-[#C8922A] uppercase">
                  <span className="hidden">ECM</span>
                  <span className="inline">
                      Electromechanical Contracting Company
                  </span>
              </span>
            </span>
                        </Link>
                    </div>

                    <ul className="hidden lg:flex items-center gap-8 list-none">
                        {links.map(({to, label}) => (<li key={to}>
                                <Link
                                    to={to}
                                    className={`nav-link-hover text-[13px] font-semibold tracking-[0.3px] ${isActive(to) ? 'text-white active' : 'text-white/50 hover:text-white'}`}
                                >
                                    {label}
                                </Link>
                            </li>))}
                        <li>
                            <Link
                                to="/contact"
                                className={`text-[11px] font-bold tracking-[1px] uppercase px-5 py-[9px] bg-[#C8922A] text-[#0B1D33] hover:bg-[#E5A93A] transition-colors duration-200 ${isActive('/contact') ? 'bg-[#E5A93A]' : ''}`}
                            >
                                Get a Quote
                            </Link>
                        </li>
                        <li>
                            {user ? <AccountMenu/> : (<Link
                                    to="/dashboard"
                                    className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.8px] uppercase px-4 py-[8px] border border-[#C8922A]/50 rounded-[7px] text-[#C8922A] hover:bg-[#C8922A]/12 hover:border-[#C8922A] transition-all duration-200 ${isActive('/dashboard') ? 'bg-[#C8922A]/12 border-[#C8922A]' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[13px] h-[13px]" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    Login
                                </Link>)}
                        </li>
                    </ul>

                    <div className="lg:hidden flex items-center gap-3">
                        {user && <AccountMenu/>}
                    </div>
                </div>

                <div
                    className={`lg:hidden absolute top-[68px] left-0 right-0 bg-[#102037] border-b border-[#C8922A]/20 overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <ul className="list-none px-6 py-2">
                        {links.map(({to, label}) => (<li key={to} className="border-b border-white/[0.06]">
                                <Link
                                    to={to}
                                    className={`block py-4 text-[14px] font-semibold ${isActive(to) ? 'text-[#C8922A]' : 'text-white/60'}`}
                                >
                                    {label}
                                </Link>
                            </li>))}
                        <li className="border-b border-white/[0.06]">
                            <Link to="/contact" className="block py-4 text-[14px] font-bold text-[#C8922A]">
                                Get a Quote
                            </Link>
                        </li>
                        {!user && (<li className="py-4">
                                <Link to="/dashboard"
                                      className="inline-flex items-center gap-2 text-[13px] font-bold text-[#C8922A]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                    Dashboard
                                </Link>
                            </li>)}
                    </ul>
                </div>
            </nav>

            {confirmOpen && (<div className="fixed inset-0 z-[220] bg-black/75 flex items-center justify-center p-5"
                                  onClick={() => setConfirmOpen(false)}>
                    <div
                        className="w-full max-w-[380px] rounded-xl bg-[#112540] border border-[#C8922A]/20 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                        onClick={e => e.stopPropagation()}>
                        <h3 className="font-condensed text-[20px] font-extrabold text-white mb-2">Confirm Logout</h3>
                        <p className="text-[13px] text-white/50 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded-lg border border-white/10 text-[12px] font-bold text-white/60 hover:text-white hover:border-white/25 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="px-4 py-2 rounded-lg bg-red-500 text-[12px] font-bold text-white hover:bg-red-400 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>)}
        </>);
}