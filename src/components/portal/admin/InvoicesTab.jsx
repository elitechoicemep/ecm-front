import { useState } from 'react';
import { INVOICE_STATUSES } from '../utils';
import { Modal } from '../Modal';

const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

function invoiceFileUrl(inv) {
  return inv.fileUrl || '';
}

function downloadUrl(inv) {
  if (!inv.fileUrl) return '';
  return inv.fileUrl.includes('/upload/') ? inv.fileUrl.replace('/upload/', '/upload/fl_attachment/') : inv.fileUrl;
}

function invoiceFormat(inv) {
  const url = invoiceFileUrl(inv).split('?')[0].toLowerCase();
  const format = String(inv.fileFormat || '').toLowerCase();
  return format || url.split('.').pop() || '';
}

function isPdfInvoice(inv) {
  return invoiceFormat(inv) === 'pdf' || invoiceFileUrl(inv).startsWith('data:application/pdf');
}

function isImageInvoice(inv) {
  const url = invoiceFileUrl(inv);
  const format = invoiceFormat(inv);
  if (isPdfInvoice(inv)) return false;
  return url.startsWith('data:image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(format);
}

export function InvoicesTab({ invoices, projects, setStatusModal, printInvoice }) {
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const previewUrl = previewInvoice ? invoiceFileUrl(previewInvoice) : '';

  return (
    <>
      <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#C8922A]/15">
          <h3 className="font-bold text-[15px] text-white">
            All Supplier Invoices <span className="text-white/40 text-[12px] font-normal">({invoices.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#0B1D33]/60">
              <tr>
                <TH>Invoice No.</TH><TH>Company</TH><TH>Project</TH>
                <TH>Amount</TH><TH>Date</TH><TH>Status</TH><TH>Actions</TH>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => {
                const proj = projects.find(p => p.projectId === inv.projectId);
                const st = INVOICE_STATUSES.find(s => s.key === inv.status);
                const key = String(inv._id || inv.invoiceId);
                const hasFile = !!invoiceFileUrl(inv);
                return (
                  <tr key={key} className="hover:bg-[#C8922A]/4 transition-colors">
                    <TD><span className="font-mono-jet text-[#C8922A] text-[12px]">{inv.invoiceNo}</span></TD>
                    <TD><span className="font-bold text-white">{inv.company}</span></TD>
                    <TD><span className="text-white/60 text-[12px]">{proj?.name || inv.projectId}</span></TD>
                    <TD mono>AED {Number(inv.amount).toLocaleString('en-AE', { minimumFractionDigits: 2 })}</TD>
                    <TD>{inv.date}</TD>
                    <TD>
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px] whitespace-nowrap ${st?.color || 'bg-white/10 text-white/60'}`}>
                        {st?.label || inv.status}
                      </span>
                    </TD>
                    <TD>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          disabled={!hasFile}
                          title={hasFile ? 'View invoice' : 'No invoice attachment'}
                          className="w-8 h-8 inline-flex items-center justify-center border border-white/10 rounded-md text-white/55 hover:border-[#C8922A] hover:text-[#C8922A] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-white/55 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setStatusModal({ invId: inv.invoiceId, current: inv.status })}
                          className="px-3 py-1.5 border border-[#C8922A]/30 rounded-md text-[11px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="px-3 py-1.5 border border-white/10 rounded-md text-[11px] text-white/50 hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
                        >
                          Print
                        </button>
                      </div>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!previewInvoice} onClose={() => setPreviewInvoice(null)} title="Invoice Attachment" maxWidth="max-w-[960px]">
        {previewInvoice && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-[13px] text-white/60">
              <span><strong className="text-white">Invoice:</strong> {previewInvoice.invoiceNo}</span>
              <span><strong className="text-white">File:</strong> {previewInvoice.fileName || 'Invoice attachment'}</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0B1D33]/70 overflow-hidden min-h-[420px] flex items-center justify-center">
              {isImageInvoice(previewInvoice) ? (
                <img src={previewUrl} alt={previewInvoice.invoiceNo} className="max-h-[70vh] w-full object-contain" />
              ) : isPdfInvoice(previewInvoice) ? (
                <object data={`${previewUrl}#toolbar=1&navpanes=0`} type="application/pdf" className="w-full h-[70vh] bg-white">
                  <div className="p-6 text-center text-white/60">
                    <p className="mb-4 text-[13px]">PDF preview is not available in this browser.</p>
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-[#C8922A] font-bold text-[13px] hover:underline">Open PDF in new tab</a>
                  </div>
                </object>
              ) : (
                <iframe title={previewInvoice.invoiceNo} src={previewUrl} className="w-full h-[70vh] bg-white" />
              )}
            </div>

            <a
              href={downloadUrl(previewInvoice)}
              download={previewInvoice.fileName || `${previewInvoice.invoiceNo}-attachment`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg text-[13px] font-bold text-[#0B1D33] hover:opacity-85 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
            >
              Download Invoice
            </a>
          </div>
        )}
      </Modal>
    </>
  );
}
