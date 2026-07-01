import { Field } from './Field';
import { Toast } from './Toast';
import { fmt, sel, MONTHS } from './utils';

export function EmployeePortal({ slip, selMonth, setSelMonth, selYear, setSelYear, fetchSlip, printSlip, printOnly, toast }) {
  const gross = slip ? slip.basic + slip.hra + slip.ta + slip.med + slip.other : 0;
  const ded   = slip ? slip.pf   + slip.tax  + slip.pt + slip.esi + slip.loan  : 0;
  const net   = gross - ded;

  return (
    <div className="min-h-screen pt-[68px] bg-[#0B1D33]">
      <div className="max-w-[960px] mx-auto px-5 md:px-10 py-10">
        <h2 className="font-condensed text-[28px] font-extrabold text-white mb-1">My Salary Slips</h2>
        <p className="text-[13px] text-white/50 mb-8">Select a month and year to view your salary details.</p>

        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-3 mb-8">
          <div>
            <Field label="Month">
              <select value={selMonth} onChange={e => setSelMonth(+e.target.value)} className={sel}>
                {MONTHS.slice(1).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </Field>
          </div>
          <div>
            <Field label="Year">
              <select value={selYear} onChange={e => setSelYear(+e.target.value)} className={sel}>
                {[2026, 2025, 2024].map(y => <option key={y}>{y}</option>)}
              </select>
            </Field>
          </div>
          <button
            onClick={fetchSlip}
            className="col-span-2 md:col-span-1 mt-[26px] px-7 py-3 font-bold text-[13px] tracking-[0.3px] text-[#0B1D33] hover:opacity-85 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
          >
            View Slip
          </button>
        </div>

        {slip && (
          <div className="border border-[#C8922A]/18 rounded-2xl overflow-hidden bg-[#112540]/80">
            <div
              className="px-7 py-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#C8922A]/15"
              style={{ background: 'linear-gradient(135deg,rgba(200,146,42,0.14),rgba(200,146,42,0.05))' }}
            >
              <div>
                <div className="font-condensed text-[20px] font-extrabold text-white">Elite Choice Electromechanical Contracting LLC</div>
                <div className="text-[13px] text-white/50 mt-1">Pay Period: {MONTHS[slip.month]} {slip.year}</div>
              </div>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-[0.5px] uppercase ${
                slip.status === 'paid' ? 'bg-green-500/12 text-green-400' : 'bg-red-500/12 text-red-400'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current" />
                {slip.status === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/[0.08]">
              {[
                ['Employee Name', slip.employee?.name],
                ['Employee ID',   slip.employee?.empId],
                ['Department',    slip.employee?.dept],
                ['Designation',   slip.employee?.desig],
              ].map(([l, v]) => (
                <div key={l} className="p-5 border-r border-white/[0.08] last:border-r-0">
                  <div className="text-[10px] font-bold tracking-[1px] uppercase text-[#C8922A] mb-1">{l}</div>
                  <div className="text-[14px] font-bold text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="p-7 grid md:grid-cols-2 gap-7">
              <div>
                <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#C8922A] mb-3">Earnings</div>
                {[
                  ['Basic Salary',       slip.basic],
                  ['Housing Allowance',  slip.hra],
                  ['Transport Allowance',slip.ta],
                  ['Medical Allowance',  slip.med],
                  ['Other Allowance',    slip.other],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2.5 border-b border-white/[0.08] last:border-b-0">
                    <span className="text-[13px] text-white/50">{l}</span>
                    <span className="text-[13px] font-semibold font-mono-jet text-white">{fmt(v)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-[#C8922A] mb-3">Deductions</div>
                {[
                  ['Provident Fund',   slip.pf],
                  ['Income Tax',       slip.tax],
                  ['Professional Tax', slip.pt],
                  ['Insurance (ESI)',  slip.esi],
                  ['Loan Recovery',    slip.loan],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-2.5 border-b border-white/[0.08] last:border-b-0">
                    <span className="text-[13px] text-white/50">{l}</span>
                    <span className={`text-[13px] font-semibold font-mono-jet ${v ? 'text-red-400' : 'text-white/30'}`}>
                      {v ? fmt(v) : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="mx-7 mb-7 px-6 py-5 rounded-xl border border-[#C8922A]/25 flex flex-wrap items-center justify-between gap-3"
              style={{ background: 'linear-gradient(135deg,rgba(200,146,42,0.12),rgba(200,146,42,0.05))' }}
            >
              <div>
                <div className="text-[14px] font-bold text-white">Net Take-Home Pay</div>
                <div className="text-[11px] text-white/50 mt-1">Gross: {fmt(gross)} &nbsp;|&nbsp; Deductions: {fmt(ded)}</div>
              </div>
              <div className="font-mono-jet text-[28px] font-extrabold text-[#C8922A] tracking-[-0.5px]">{fmt(net)}</div>
            </div>

            <div className="px-7 pb-6 flex flex-wrap gap-3 border-t border-white/[0.08] pt-5">
              <button
                onClick={printOnly}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg text-[13px] font-semibold text-white/60 hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
              >
                🖨️ Print
              </button>
              <button
                onClick={printSlip}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-bold text-[#0B1D33] hover:opacity-85 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                ⬇️ Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast {...toast} />
    </div>
  );
}

