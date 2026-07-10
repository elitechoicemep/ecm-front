const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

export function SuppliersTab({ suppliers, projects, invoices, deleteSupplier, deleteProject, onAddSupplier, onAddProject }) {
  return (
    <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8922A]/15 flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-bold text-[15px] text-white">
          Suppliers <span className="text-white/40 text-[12px] font-normal">({suppliers.length})</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onAddProject}
            className="px-4 py-2 text-[12px] font-bold text-[#C8922A] border border-[#C8922A]/30 rounded-lg hover:bg-[#C8922A]/10"
          >
            + Add Project
          </button>
          <button
            onClick={onAddSupplier}
            className="px-4 py-2 text-[12px] font-bold text-[#0B1D33] rounded-lg"
            style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
          >
            + Add Supplier
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B1D33]/60">
            <tr><TH>Username</TH><TH>Company</TH><TH>Contact</TH><TH>Invoices</TH><TH>Actions</TH></tr>
          </thead>
          <tbody>
            {suppliers.map(s => {
              const count = invoices.filter(inv => inv.supplierUsername === s.username).length;
              return (
                <tr key={s.username} className="hover:bg-[#C8922A]/4 transition-colors">
                  <TD mono><span className="text-white">{s.username}</span></TD>
                  <TD><span className="font-bold text-white">{s.company}</span></TD>
                  <TD>{s.contact || '—'}</TD>
                  <TD><span className="text-[#C8922A] font-bold">{count}</span></TD>
                  <TD>
                    <button
                      onClick={() => { if (window.confirm(`Remove supplier "${s.company}"? This cannot be undone.`)) deleteSupplier(s.username); }}
                      className="px-3 py-1.5 border border-white/10 rounded-md text-[12px] text-white/50 hover:border-red-500 hover:text-red-400 transition-all"
                    >
                      ✕ Remove
                    </button>
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Projects sub-section */}
      <div className="border-t border-[#C8922A]/15 px-5 py-4">
        <h4 className="font-bold text-[11px] text-white/60 mb-3 uppercase tracking-[1px]">Registered Projects</h4>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {projects.map(p => (
            <div key={p.projectId} className="bg-[#0B1D33]/60 border border-white/8 rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <div className="font-mono-jet text-[10px] text-[#C8922A] mb-1">{p.projectId}</div>
                <div className="text-[12px] font-semibold text-white">{p.name}</div>
              </div>
              <button
                onClick={() => { if (window.confirm(`Remove project "${p.name}"? This cannot be undone.`)) deleteProject(p.projectId); }}
                className="ml-3 text-white/20 hover:text-red-400 transition-colors text-[11px]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
