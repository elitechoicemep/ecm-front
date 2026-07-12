import { useState } from 'react';
import { Field } from './Field';
import { Modal } from './Modal';
import { Toast } from './Toast';
import { inp, sel, INVOICE_STATUSES } from './utils';

function downloadUrl(attachment) {
  if (!attachment?.url) return '';
  return attachment.url.includes('/upload/') ? attachment.url.replace('/upload/', '/upload/fl_attachment/') : attachment.url;
}

export function SupplierPortal({ user, invoices, invoicePagination, fetchInvoices, projects, invForm, submitInvoice, handleFile, printInvoice, toast }) {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [docsInvoiceId, setDocsInvoiceId] = useState(null);

  const docsInvoice = invoices.find(inv => (inv.invoiceId || inv._id) === docsInvoiceId) || null;
  const filteredInvoices = invoices.filter(inv => statusFilter === 'all' || inv.status === statusFilter);
  const page = invoicePagination?.page || 1;
  const totalPages = invoicePagination?.totalPages || 1;
  const total = invoicePagination?.total ?? invoices.length;

  const handleSubmit = async () => {
    const saved = await submitInvoice();
    if (saved) setInvoiceModalOpen(false);
  };

  return (
    <div className="min-h-screen pt-[68px] bg-[#0B1D33]">
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="font-condensed text-[24px] sm:text-[28px] font-extrabold text-white mb-1">Supplier Dashboard</h2>
            <p className="text-[13px] text-white/50">Submitted invoices and payment status tracking.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Field label="Filter Status">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={sel + ' min-w-full sm:min-w-[230px]'}>
                <option value="all">All statuses</option>
                {INVOICE_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </Field>
            <button
              onClick={() => setInvoiceModalOpen(true)}
              className="h-[46px] sm:mt-[22px] px-5 font-bold text-[13px] tracking-[0.3px] text-[#0B1D33] rounded-lg hover:opacity-85 transition-opacity whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
            >
              + New Invoice
            </button>
          </div>
        </div>

        <section className="bg-[#112540]/55 border border-[#C8922A]/12 rounded-xl overflow-hidden">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-[#C8922A]/15">
            <h3 className="font-bold text-[15px] text-white">
              Submitted Invoices{' '}
              <span className="text-white/30 font-normal text-[12px]">({filteredInvoices.length})</span>
            </h3>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="self-start sm:self-auto text-[11px] font-bold text-[#C8922A] border border-[#C8922A]/25 px-3 py-1.5 rounded-lg hover:bg-[#C8922A]/10 transition-all"
              >
                Clear Filter
              </button>
            )}
          </div>

          {invoices.length === 0 ? (
            <div className="px-4 sm:px-6 py-12 text-center">
              <p className="text-[13px] text-white/45">No invoices submitted yet.</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="px-4 sm:px-6 py-12 text-center">
              <p className="text-[13px] text-white/45">No invoices match this status.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/8">
              {filteredInvoices.map(inv => {
                const proj = projects.find(p => p.projectId === inv.projectId);
                const st = INVOICE_STATUSES.find(s => s.key === inv.status);
                const key = inv._id || inv.invoiceId;
                const currentIndex = INVOICE_STATUSES.findIndex(x => x.key === inv.status);

                return (
                  <article key={key} className="p-4 sm:p-6 hover:bg-white/[0.025] transition-colors">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                          <div className="font-condensed text-[17px] font-extrabold text-white break-words">{inv.invoiceNo}</div>
                          <span className={`w-fit text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.5px] ${st?.color || 'bg-white/10 text-white/60'}`}>
                            {st?.label || inv.status}
                          </span>
                        </div>
                        <div className="mt-1 text-[12px] text-white/40 break-words">{proj?.name || inv.projectId}</div>
                        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                          <span className="font-mono-jet text-[16px] font-bold text-[#C8922A]">
                            AED {Number(inv.amount).toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-[11px] text-white/30">{inv.date}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-fit lg:flex-shrink-0">
                        <button
                          onClick={() => setDocsInvoiceId(inv.invoiceId || inv._id)}
                          className="w-full sm:w-fit text-[11px] font-bold text-white/60 border border-white/10 px-4 py-2 rounded-lg hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
                        >
                          View Documents{inv.attachments?.length ? ` (${inv.attachments.length})` : ''}
                        </button>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="w-full sm:w-fit text-[11px] font-bold text-[#C8922A] border border-[#C8922A]/30 px-4 py-2 rounded-lg hover:bg-[#C8922A]/10 transition-all"
                        >
                          Download
                        </button>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex gap-1">
                        {INVOICE_STATUSES.map((s, idx) => (
                          <div key={s.key} className={`h-1 flex-1 rounded-full transition-all ${idx <= currentIndex ? 'bg-[#C8922A]' : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px] text-white/25">Submitted</span>
                        <span className="text-[9px] text-white/25">Cleared</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {invoices.length > 0 && (
            <div className="px-4 sm:px-6 py-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/45">
              <div>Page {page} of {totalPages} - {total} total</div>
              <div className="flex items-center gap-2">
                <button onClick={() => fetchInvoices(Math.max(page - 1, 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
                  Previous
                </button>
                <button onClick={() => fetchInvoices(Math.min(page + 1, totalPages))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Modal open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} title="Submit New Invoice">
        <div className="space-y-4">
          <Field label="Project Name *">
            <select value={invForm.values.projectId} onChange={invForm.set('projectId')} className={sel}>
              <option value="">-- Select Project --</option>
              {projects.map(p => <option key={p.projectId} value={p.projectId}>{p.name}</option>)}
            </select>
          </Field>

          <Field label="Company Name *">
            <input value={user.company} readOnly className={inp + ' opacity-60 cursor-not-allowed'} />
          </Field>

          <Field label="Invoice Number *">
            <input
              value={invForm.values.invoiceNo}
              onChange={invForm.set('invoiceNo')}
              placeholder="e.g. INV-2026-0099"
              className={inp}
            />
          </Field>

          <Field label="Invoice Amount (AED) *">
            <input
              type="number"
              value={invForm.values.amount}
              onChange={invForm.set('amount')}
              placeholder="0.00"
              className={inp}
            />
          </Field>

          <Field label="Upload Invoice (PDF/Image) *">
            <label className="flex items-center gap-3 px-4 py-3 bg-[#0B1D33]/80 border border-dashed border-[#C8922A]/30 rounded-lg cursor-pointer hover:border-[#C8922A]/60 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#C8922A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <span className="min-w-0 text-[13px] text-white/50 break-words">
                {invForm.values._fileName || 'Click to upload invoice file'}
              </span>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
            </label>
            {invForm.values.fileDataUrl && invForm.values._fileName?.match(/\.(jpg|jpeg|png)$/i) && (
              <img src={invForm.values.fileDataUrl} alt="preview" className="mt-2 max-h-32 rounded border border-[#C8922A]/20 object-contain" />
            )}
          </Field>

          <button
            onClick={handleSubmit}
            className="w-full py-3 font-bold text-[13px] tracking-[0.5px] text-[#0B1D33] rounded-lg hover:opacity-85 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
          >
            Submit Invoice
          </button>
        </div>
      </Modal>

      <Modal open={!!docsInvoice} onClose={() => setDocsInvoiceId(null)} title="Invoice Documents" maxWidth="max-w-[540px]">
        {docsInvoice && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-[13px] text-white/60">
              <span><strong className="text-white">Invoice:</strong> {docsInvoice.invoiceNo}</span>
            </div>

            {!docsInvoice.attachments?.length ? (
              <div className="text-center py-8 text-[13px] text-white/40">No documents uploaded for this invoice.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {docsInvoice.attachments.map((att, i) => (
                  <div key={att.publicId || i} className="flex items-center justify-between gap-3 px-4 py-3 border border-white/10 rounded-lg">
                    <div className="min-w-0">
                      <div className="text-[12px] font-bold text-[#C8922A]">Document {i + 1}</div>
                      <div className="text-[13px] text-white/70 truncate">{att.fileName || 'Invoice attachment'}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 border border-[#C8922A]/30 rounded-md text-[11px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all whitespace-nowrap"
                      >
                        Open in New Tab
                      </a>
                      <a
                        href={downloadUrl(att)}
                        download={att.fileName || `${docsInvoice.invoiceNo}-doc-${i + 1}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 border border-white/10 rounded-md text-[11px] text-white/60 hover:border-[#C8922A] hover:text-[#C8922A] transition-all whitespace-nowrap"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Toast {...toast} />
    </div>
  );
}


