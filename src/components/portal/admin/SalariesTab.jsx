import { useState } from 'react';
import { Modal } from '../Modal';
import { MONTHS, fmt, buildSlipHTML } from '../utils';

const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

const gross = s => s.basic + s.hra + s.ta + (s.ot || 0) + s.other;
const ded   = s => (s.advance || 0) + (s.absent || 0);

const BreakRow = ({ label, value, red }) => (
  <div className="flex justify-between py-2.5 border-b border-white/[0.08] last:border-b-0">
    <span className="text-[13px] text-white/50">{label}</span>
    <span className={`text-[13px] font-semibold font-mono-jet ${red ? (value ? 'text-red-400' : 'text-white/30') : 'text-white'}`}>
      {red && !value ? '—' : fmt(value)}
    </span>
  </div>
);

export function SalariesTab({ salaries, employees, toggleSalaryStatus, deleteSalary, onAdd }) {
  const [view, setView] = useState(null);

  const downloadPDF = (s) => {
    const emp  = employees.find(e => e.empId === s.empId) || { name: s.empName, empId: s.empId };
    const html = buildSlipHTML(s, emp);
    const existing = document.getElementById('__print_frame__');
    if (existing) document.body.removeChild(existing);
    const iframe = document.createElement('iframe');
    iframe.id = '__print_frame__';
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    iframe.onload = () => setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); }, 500);
  };

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
              const g = gross(s);
              const d = ded(s);
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
                      onClick={() => setView(s)}
                      className="px-3 py-1.5 border border-white/10 rounded-md text-[12px] text-white/50 hover:border-[#C8922A] hover:text-[#C8922A] transition-all mr-2"
                    >
                      View
                    </button>
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

      {/* ── Salary Breakdown Modal ── */}
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view ? `${view.empName || view.empId} — ${MONTHS[view.month]} ${view.year}` : ''}
        maxWidth="max-w-[640px]"
      >
        {view && (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-[12px] text-white/50">{view.empId}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px] ${
                view.status === 'paid' ? 'bg-green-500/12 text-green-400' : 'bg-red-500/12 text-red-400'
              }`}>
                {view.status}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#C8922A] mb-2 pb-2 border-b border-[#C8922A]/25">Earnings</div>
                <BreakRow label="Basic Salary"        value={view.basic} />
                <BreakRow label="Housing Allowance"   value={view.hra} />
                <BreakRow label="Transport Allowance" value={view.ta} />
                <BreakRow label="Overtime"            value={view.ot} />
                <BreakRow label="Other Allowance"     value={view.other} />
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#C8922A] mb-2 pb-2 border-b border-[#C8922A]/25">Deductions</div>
                <BreakRow label="Advance Paid"             value={view.advance} red />
                <BreakRow label="Leave Deduction (Absent)" value={view.absent}  red />
              </div>
            </div>

            <div
              className="mt-6 px-5 py-4 rounded-xl border border-[#C8922A]/25 flex flex-wrap items-center justify-between gap-3"
              style={{ background: 'linear-gradient(135deg,rgba(200,146,42,0.12),rgba(200,146,42,0.05))' }}
            >
              <div>
                <div className="text-[13px] font-bold text-white">Net Take-Home Pay</div>
                <div className="text-[11px] text-white/50 mt-0.5">Gross: {fmt(gross(view))} &nbsp;|&nbsp; Deductions: {fmt(ded(view))}</div>
              </div>
              <div className="font-mono-jet text-[22px] font-extrabold text-[#C8922A]">{fmt(gross(view) - ded(view))}</div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setView(null)}
                className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60"
              >
                Close
              </button>
              <button
                onClick={() => downloadPDF(view)}
                className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                ⬇ Download PDF
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
