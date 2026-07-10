import { MONTHS, fmt } from '../utils';

const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

export function SalariesTab({ salaries, employees, toggleSalaryStatus, deleteSalary, onAdd }) {
  return (
    <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8922A]/15 flex items-center justify-between">
        <h3 className="font-bold text-[15px] text-white">Salary Records</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 text-[12px] font-bold text-[#0B1D33] rounded-lg"
          style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
        >
          + Add Record
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B1D33]/60">
            <tr><TH>Employee</TH><TH>Period</TH><TH>Gross</TH><TH>Net Pay</TH><TH>Status</TH><TH>Actions</TH></tr>
          </thead>
          <tbody>
            {salaries.map(s => {
              const g = s.basic + s.hra + s.ta + s.med + s.other;
              const d = s.pf + s.tax + s.pt + s.esi + s.loan;
              return (
                <tr key={String(s._id)} className="hover:bg-[#C8922A]/4 transition-colors">
                  <TD><span className="font-bold text-white">{s.empName || s.empId}</span></TD>
                  <TD>{MONTHS[s.month]} {s.year}</TD>
                  <TD mono>{fmt(g)}</TD>
                  <TD mono><span className="text-[#C8922A]">{fmt(g - d)}</span></TD>
                  <TD>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px] ${
                      s.status === 'paid' ? 'bg-green-500/12 text-green-400' : 'bg-red-500/12 text-red-400'
                    }`}>
                      {s.status}
                    </span>
                  </TD>
                  <TD>
                    <button
                      onClick={() => toggleSalaryStatus(s._id)}
                      className="px-3 py-1.5 border border-white/10 rounded-md text-[12px] text-white/50 hover:border-[#C8922A] hover:text-[#C8922A] transition-all mr-2"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => { if (window.confirm(`Delete salary record for ${s.empName || s.empId} (${MONTHS[s.month]} ${s.year})? This cannot be undone.`)) deleteSalary(s._id); }}
                      className="px-3 py-1.5 border border-white/10 rounded-md text-[12px] text-white/50 hover:border-red-500 hover:text-red-400 transition-all"
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
