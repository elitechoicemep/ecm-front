export const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

export const INVOICE_STATUSES = [
  { key: 'submitted',          label: 'Submitted',                    color: 'bg-blue-500/15 text-blue-400'       },
  { key: 'site_approval',      label: 'Waiting for Site Approval',    color: 'bg-yellow-500/15 text-yellow-400'   },
  { key: 'pending_accounts',   label: 'Pending in Accounts',          color: 'bg-orange-500/15 text-orange-400'   },
  { key: 'cheque_process',     label: 'Cheque Issuance In Process',   color: 'bg-purple-500/15 text-purple-400'   },
  { key: 'cheque_issued',      label: 'Cheque Issued',                color: 'bg-indigo-500/15 text-indigo-400'   },
  { key: 'transfer_initiated', label: 'Bank Transfer Initiated',      color: 'bg-cyan-500/15 text-cyan-400'       },
  { key: 'transfer_done',      label: 'Transfer Done',                color: 'bg-green-500/15 text-green-400'     },
  { key: 'cheque_cleared',     label: 'Cheque Cleared',               color: 'bg-emerald-500/15 text-emerald-400' },
];

export const fmt = n => 'AED ' + Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const inp = 'w-full px-4 py-3 bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/20 transition-colors text-[14px] font-barlow';
export const sel = inp + ' bg-[#112540]';

export function buildSlipHTML(slip, emp) {
  const f = n => 'AED ' + Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const gross = slip.basic + slip.hra + slip.ta + (slip.ot || 0) + slip.other;
  const ded   = (slip.advance || 0) + (slip.absent || 0);
  const net   = gross - ded;
  const row = (l, v, red) =>
    `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;border-bottom:1px solid #f1f5f9">${l}</td>` +
    `<td style="padding:8px 0;text-align:right;font-family:monospace;font-size:13px;font-weight:600;color:${red ? '#dc2626' : '#0B1D33'};border-bottom:1px solid #f1f5f9">${v}</td></tr>`;

  return [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"/>',
    '<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet"/>',
    '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Barlow,sans-serif;color:#1a2b3c;background:#fff;padding:40px;max-width:800px;margin:0 auto}',
    '.hd{border-bottom:3px solid #C8922A;padding-bottom:20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start}',
    '.co{font-family:"Barlow Condensed",sans-serif;font-size:22px;font-weight:800;color:#0B1D33}.co span{color:#C8922A}',
    '.period{font-size:13px;color:#64748b;margin-top:4px}.badge{padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}',
    '.paid{background:#dcfce7;color:#16a34a}.unpaid{background:#fee2e2;color:#dc2626}',
    '.meta{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px}',
    '.mi{padding:12px 16px;border-right:1px solid #e2e8f0}.mi:last-child{border-right:none}',
    '.ml{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8922A;margin-bottom:3px}.mv{font-size:13px;font-weight:700;color:#0B1D33}',
    '.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:20px}',
    '.st{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8922A;margin-bottom:8px;padding-bottom:5px;border-bottom:2px solid #C8922A}',
    'table{width:100%;border-collapse:collapse}',
    '.total{background:#faf7f0;border:1px solid #C8922A;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center}',
    '.tl{font-size:14px;font-weight:700;color:#0B1D33}.tn{font-size:11px;color:#64748b;margin-top:2px}.ta{font-family:monospace;font-size:26px;font-weight:800;color:#C8922A}',
    '.foot{margin-top:28px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between}',
    '@media print{body{padding:24px}@page{margin:1.5cm;size:A4}}</style></head><body>',
    `<div class="hd"><div><div class="co">ELITE<span>CHOICE</span> Electromechanical Contracting LLC</div>`,
    `<div class="period">Salary Slip — Pay Period: ${MONTHS[slip.month]} ${slip.year}</div></div>`,
    `<span class="badge ${slip.status === 'paid' ? 'paid' : 'unpaid'}">${slip.status === 'paid' ? '✓ Paid' : 'Unpaid'}</span></div>`,
    `<div class="meta">`,
    `<div class="mi"><div class="ml">Employee Name</div><div class="mv">${emp?.name || ''}</div></div>`,
    `<div class="mi"><div class="ml">Employee ID</div><div class="mv">${emp?.empId || ''}</div></div>`,
    `<div class="mi"><div class="ml">Department</div><div class="mv">${emp?.dept || ''}</div></div>`,
    `<div class="mi"><div class="ml">Designation</div><div class="mv">${emp?.desig || ''}</div></div></div>`,
    `<div class="grid"><div><div class="st">Earnings</div><table>`,
    row('Basic Salary', f(slip.basic)), row('Housing Allowance', f(slip.hra)),
    row('Transport Allowance', f(slip.ta)), row('Overtime', f(slip.ot)), row('Other Allowance', f(slip.other)),
    `</table></div><div><div class="st">Deductions</div><table>`,
    row('Advance Paid',             slip.advance ? f(slip.advance) : '—', !!slip.advance),
    row('Leave Deduction (Absent)', slip.absent  ? f(slip.absent)  : '—', !!slip.absent),
    `</table></div></div>`,
    `<div class="total"><div><div class="tl">Net Take-Home Pay</div><div class="tn">Gross: ${f(gross)} &nbsp;|&nbsp; Deductions: ${f(ded)}</div></div><div class="ta">${f(net)}</div></div>`,
    `<div class="foot"><span>Elite Choice Electromechanical Contracting LLC</span><span>Generated: ${new Date().toLocaleDateString('en-AE')}</span></div>`,
    `<script>window.onload = () => window.print();</script></body></html>`,
  ].join('');
}
