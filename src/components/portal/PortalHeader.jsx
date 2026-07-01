export function PortalHeader({ user, doLogout }) {
  const roleLabel  = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const displayName =
    user.role === 'admin'    ? 'Administrator'              :
    user.role === 'employee' ? (user.empName || user.username) :
                               (user.company  || user.username);
  const initial = displayName[0].toUpperCase();

  return (
    <div className="bg-[#112540]/95 border-b border-[#C8922A]/18 px-6 md:px-10 h-[52px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-extrabold text-[#0B1D33] flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
        >
          {initial}
        </div>
        <span className="text-[13px] font-bold text-white">{displayName}</span>
        <span className="text-[10px] font-bold tracking-[1px] uppercase text-[#C8922A] bg-[#C8922A]/10 px-2 py-0.5 rounded-full">
          {roleLabel}
        </span>
      </div>
      <button
        onClick={doLogout}
        className="text-[12px] font-bold text-white/50 border border-white/10 px-4 py-1.5 rounded-lg hover:border-red-500 hover:text-red-400 transition-all"
      >
        Sign out
      </button>
    </div>
  );
}
