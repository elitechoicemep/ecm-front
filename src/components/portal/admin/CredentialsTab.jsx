const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

export function CredentialsTab({ credentials, employees, deleteCredential, toggleUserActive, onAdd }) {
  return (
    <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8922A]/15 flex items-center justify-between">
        <h3 className="font-bold text-[15px] text-white">
          Portal Users <span className="text-white/40 text-[12px] font-normal">({credentials.length})</span>
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 text-[12px] font-bold text-[#0B1D33] rounded-lg"
          style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
        >
          + Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B1D33]/60">
            <tr>
              <TH>Username</TH><TH>Role</TH><TH>Email</TH><TH>Verified</TH><TH>Status</TH><TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {credentials.map(c => {
              const emp = employees.find(e => e.empId === c.empId);
              return (
                <tr key={String(c.id)} className={`transition-colors ${c.isActive ? 'hover:bg-[#C8922A]/4' : 'bg-red-500/4 hover:bg-red-500/6'}`}>
                  <TD mono>
                    <span className={c.isActive ? 'text-white' : 'text-white/40 line-through'}>{c.username}</span>
                    {emp && <span className="block text-[10px] text-white/30 mt-0.5">{emp.name}</span>}
                  </TD>
                  <TD>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px] ${
                      c.role === 'admin'    ? 'bg-[#C8922A]/12 text-[#C8922A]' :
                      c.role === 'supplier' ? 'bg-blue-500/12 text-blue-400'   :
                                              'bg-green-500/12 text-green-400'
                    }`}>{c.role}</span>
                  </TD>
                  <TD><span className="text-white/40 text-[12px]">{c.email || '—'}</span></TD>
                  <TD>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isEmailVerified ? 'bg-green-500/12 text-green-400' : 'bg-yellow-500/12 text-yellow-400'}`}>
                      {c.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </TD>
                  <TD>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-500/12 text-green-400' : 'bg-red-500/12 text-red-400'}`}>
                      {c.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </TD>
                  <TD>
                    <button
                      onClick={() => toggleUserActive(c.id, c.isActive)}
                      className={`px-3 py-1.5 border rounded-md text-[11px] transition-all mr-2 ${
                        c.isActive
                          ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
                          : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      {c.isActive ? '⏸ Suspend' : '▶ Activate'}
                    </button>
                    <button
                      onClick={() => deleteCredential(c.id)}
                      className="px-3 py-1.5 border border-white/10 rounded-md text-[11px] text-white/50 hover:border-red-500 hover:text-red-400 transition-all"
                    >
                      ✕
                    </button>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
