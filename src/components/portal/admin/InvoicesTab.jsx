import { useState } from 'react';
import { INVOICE_STATUSES } from '../utils';
import { Modal } from '../Modal';

const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

function downloadUrl(attachment) {
  if (!attachment?.url) return '';
  return attachment.url.includes('/upload/') ? attachment.url.replace('/upload/', '/upload/fl_attachment/') : attachment.url;
}

export function InvoicesTab({ invoices, pagination, onPageChange, projects, setStatusModal, printInvoice, deleteInvoice, uploadInvoiceAttachment, deleteInvoiceAttachment }) {
  const [actionsInvoiceId, setActionsInvoiceId] = useState(null);
  const [documentsInvoiceId, setDocumentsInvoiceId] = useState(null);
  const [uploadInvoiceId, setUploadInvoiceId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [confirmDeleteAttachment, setConfirmDeleteAttachment] = useState(null);

  const findInvoice = id => invoices.find(inv => (inv.invoiceId || inv._id) === id) || null;
  const actionsInvoice = findInvoice(actionsInvoiceId);
  const documentsInvoice = findInvoice(documentsInvoiceId);
  const uploadInvoice = findInvoice(uploadInvoiceId);

  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total ?? invoices.length;

  const handleUploadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadFile({ dataUrl: ev.target.result, name: file.name });
    reader.readAsDataURL(file);
  };

  const closeUploadModal = () => { setUploadInvoiceId(null); setUploadFile(null); setUploading(false); };

  const submitUpload = async () => {
    if (!uploadInvoice || !uploadFile) return;
    setUploading(true);
    const ok = await uploadInvoiceAttachment(uploadInvoice.invoiceId, { attachmentDataUrl: uploadFile.dataUrl, fileName: uploadFile.name });
    setUploading(false);
    if (ok) closeUploadModal();
  };

  const confirmDeleteAttachmentAction = async () => {
    if (!confirmDeleteAttachment) return;
    const { invoiceId, index } = confirmDeleteAttachment;
    setDeletingIndex(index);
    await deleteInvoiceAttachment(invoiceId, index);
    setDeletingIndex(null);
    setConfirmDeleteAttachment(null);
  };

  return (
    <>
      <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#C8922A]/15">
          <h3 className="font-bold text-[15px] text-white">
            All Supplier Invoices <span className="text-white/40 text-[12px] font-normal">({total})</span>
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
                      <button
                        onClick={() => setActionsInvoiceId(inv.invoiceId || inv._id)}
                        className="px-3 py-1.5 border border-[#C8922A]/30 rounded-md text-[11px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all"
                      >
                        Actions
                      </button>
                    </TD>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[12px] text-white/45">
          <div>Page {page} of {totalPages} - {total} total</div>
          <div className="flex items-center gap-2">
            <button onClick={() => onPageChange(Math.max(page - 1, 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
              Previous
            </button>
            <button onClick={() => onPageChange(Math.min(page + 1, totalPages))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal open={!!actionsInvoice} onClose={() => setActionsInvoiceId(null)} title="Invoice Actions" maxWidth="max-w-[420px]">
        {actionsInvoice && (
          <>
            <div className="flex flex-col gap-1 text-[13px] text-white/60 mb-5">
              <span><strong className="text-white">Invoice:</strong> {actionsInvoice.invoiceNo}</span>
              <span><strong className="text-white">Company:</strong> {actionsInvoice.company}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setDocumentsInvoiceId(actionsInvoice.invoiceId || actionsInvoice._id); setActionsInvoiceId(null); }}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[13px] text-white/70 hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
              >
                View Invoice
              </button>
              <button
                onClick={() => { setUploadInvoiceId(actionsInvoice.invoiceId || actionsInvoice._id); setActionsInvoiceId(null); }}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[13px] text-white/70 hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
              >
                Update Invoice
              </button>
              <button
                onClick={() => { setStatusModal({ invId: actionsInvoice.invoiceId, current: actionsInvoice.status }); setActionsInvoiceId(null); }}
                className="w-full px-4 py-3 border border-[#C8922A]/30 rounded-lg text-[13px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all"
              >
                Update Status
              </button>
              <button
                onClick={() => { printInvoice(actionsInvoice); setActionsInvoiceId(null); }}
                className="w-full px-4 py-3 border border-white/10 rounded-lg text-[13px] text-white/70 hover:border-[#C8922A] hover:text-[#C8922A] transition-all"
              >
                Print
              </button>
              <button
                onClick={() => { if (window.confirm('Delete this invoice? This cannot be undone.')) { deleteInvoice(actionsInvoice.invoiceId); setActionsInvoiceId(null); } }}
                className="w-full px-4 py-3 border border-red-400/30 rounded-lg text-[13px] text-red-300 hover:bg-red-500/10 transition-all"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal open={!!documentsInvoice} onClose={() => setDocumentsInvoiceId(null)} title="Invoice Documents" maxWidth="max-w-[540px]">
        {documentsInvoice && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-[13px] text-white/60">
              <span><strong className="text-white">Invoice:</strong> {documentsInvoice.invoiceNo}</span>
              <span><strong className="text-white">Company:</strong> {documentsInvoice.company}</span>
            </div>

            {!documentsInvoice.attachments?.length ? (
              <div className="text-center py-8 text-[13px] text-white/40">No documents uploaded for this invoice.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {documentsInvoice.attachments.map((att, i) => (
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
                        download={att.fileName || `${documentsInvoice.invoiceNo}-doc-${i + 1}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 border border-white/10 rounded-md text-[11px] text-white/60 hover:border-[#C8922A] hover:text-[#C8922A] transition-all whitespace-nowrap"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => setConfirmDeleteAttachment({ invoiceId: documentsInvoice.invoiceId, index: i, docLabel: att.fileName || `Document ${i + 1}` })}
                        disabled={deletingIndex === i}
                        className="px-3 py-1.5 border border-red-400/30 rounded-md text-[11px] text-red-300 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                      >
                        {deletingIndex === i ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setUploadInvoiceId(documentsInvoice.invoiceId || documentsInvoice._id); setDocumentsInvoiceId(null); }}
              className="w-full px-4 py-3 rounded-lg text-[13px] font-bold text-[#0B1D33] hover:opacity-85 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
            >
              Update Invoice
            </button>
          </div>
        )}
      </Modal>

      <Modal open={!!confirmDeleteAttachment} onClose={() => setConfirmDeleteAttachment(null)} title="Delete Document" maxWidth="max-w-[420px]">
        {confirmDeleteAttachment && (
          <div className="space-y-5">
            <div className="flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-400/25 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-[13px] text-red-200">
                <strong>"{confirmDeleteAttachment.docLabel}"</strong> will be permanently deleted and cannot be recovered.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteAttachment(null)}
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg text-[13px] text-white/70 hover:border-white/25 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAttachmentAction}
                disabled={deletingIndex === confirmDeleteAttachment.index}
                className="flex-1 px-4 py-3 bg-red-500/90 rounded-lg text-[13px] font-bold text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {deletingIndex === confirmDeleteAttachment.index ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!uploadInvoice} onClose={closeUploadModal} title="Update Invoice" maxWidth="max-w-[460px]">
        {uploadInvoice && (
          <div className="space-y-4">
            <div className="flex flex-col gap-1 text-[13px] text-white/60">
              <span><strong className="text-white">Invoice:</strong> {uploadInvoice.invoiceNo}</span>
              <span className="text-white/40 text-[12px]">
                New document will be added as Document {(uploadInvoice.attachments?.length || 0) + 1}, below the existing ones.
              </span>
            </div>

            <label className="block w-full px-4 py-6 border border-dashed border-white/15 rounded-lg text-center text-[13px] text-white/50 hover:border-[#C8922A] hover:text-[#C8922A] transition-all cursor-pointer">
              {uploadFile?.name || 'Click to upload new invoice document (PDF, JPG, PNG)'}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleUploadFile} />
            </label>

            {uploadFile?.dataUrl && /\.(jpg|jpeg|png)$/i.test(uploadFile.name) && (
              <img src={uploadFile.dataUrl} alt="preview" className="max-h-40 rounded border border-[#C8922A]/20 object-contain mx-auto" />
            )}

            <button
              onClick={submitUpload}
              disabled={!uploadFile || uploading}
              className="w-full px-4 py-3 rounded-lg text-[13px] font-bold text-[#0B1D33] hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
            >
              {uploading ? 'Uploading…' : 'Upload Document'}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
