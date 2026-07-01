import { useMemo, useState } from 'react';

const SERVICE_OPTIONS = ['Electrical Works', 'Plumbing Systems', 'HVAC & Ducting', 'Full MEP Turnkey', 'Fire Fighting', 'Other'];

const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, className = '', ...props }) => <td {...props} className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] align-top ${className}`}>{children}</td>;

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-AE', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export function MessagesTab({ messages, pagination, filters, onFilter, onStatusChange, onDelete }) {
  const [draft, setDraft] = useState(filters || { status: '', service: '', from: '', to: '', page: 1, limit: 10 });
  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  const counts = useMemo(() => ({
    all: total,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
  }), [messages, total]);

  const services = useMemo(() => {
    const existing = messages.map(m => m.service).filter(Boolean);
    return [...new Set([...SERVICE_OPTIONS, ...existing])].sort((a, b) => a.localeCompare(b));
  }, [messages]);

  const apply = next => {
    setDraft(next);
    onFilter(next);
  };

  const set = key => e => apply({ ...draft, [key]: e.target.value, page: 1 });

  const clearFilters = () => apply({ status: '', service: '', from: '', to: '', page: 1, limit: draft.limit || 10 });
  const goToPage = nextPage => apply({ ...draft, page: nextPage });

  return (
    <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8922A]/15 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-[15px] text-white">
            Contact Messages <span className="text-white/40 text-[12px] font-normal">({counts.all})</span>
          </h3>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-full bg-white/8 text-white/50">Unread on page: {counts.unread}</span>
            <span className="px-2.5 py-1 rounded-full bg-white/8 text-white/50">Read on page: {counts.read}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-[150px_200px_1fr_1fr_auto] gap-3 items-end">
          <label className="block">
            <span className="block text-[10px] font-bold uppercase tracking-[1px] text-[#C8922A]/70 mb-1">Status</span>
            <select value={draft.status || ''} onChange={set('status')} className="w-full px-3 py-2.5 rounded-lg bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white text-[13px] focus:outline-none focus:border-[#C8922A]">
              <option value="">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-[10px] font-bold uppercase tracking-[1px] text-[#C8922A]/70 mb-1">Service</span>
            <select value={draft.service || ''} onChange={set('service')} className="w-full px-3 py-2.5 rounded-lg bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white text-[13px] focus:outline-none focus:border-[#C8922A]">
              <option value="">All services</option>
              {services.map(service => <option key={service} value={service}>{service}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-[10px] font-bold uppercase tracking-[1px] text-[#C8922A]/70 mb-1">From</span>
            <input type="date" value={draft.from || ''} onChange={set('from')} className="w-full px-3 py-2.5 rounded-lg bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white text-[13px] focus:outline-none focus:border-[#C8922A]" />
          </label>
          <label className="block">
            <span className="block text-[10px] font-bold uppercase tracking-[1px] text-[#C8922A]/70 mb-1">To</span>
            <input type="date" value={draft.to || ''} onChange={set('to')} className="w-full px-3 py-2.5 rounded-lg bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white text-[13px] focus:outline-none focus:border-[#C8922A]" />
          </label>
          <button onClick={clearFilters} className="px-4 py-2.5 rounded-lg border border-white/10 text-[12px] font-bold text-white/55 hover:text-white hover:border-white/25 transition-all">
            Clear
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[960px]">
          <thead className="bg-[#0B1D33]/60">
            <tr><TH>Date</TH><TH>Sender</TH><TH>Service</TH><TH>Message</TH><TH>Status</TH><TH>Actions</TH></tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><TD className="text-center text-white/40" colSpan={6}>No messages found.</TD></tr>
            ) : messages.map(msg => {
              const isRead = msg.status === 'read';
              return (
                <tr key={msg._id} className="hover:bg-[#C8922A]/4 transition-colors">
                  <TD><span className="text-white/55 text-[12px] whitespace-nowrap">{formatDate(msg.createdAt)}</span></TD>
                  <TD>
                    <div className="font-bold text-white">{msg.name}</div>
                    <a href={`mailto:${msg.email}`} className="block text-[12px] text-[#C8922A] hover:underline">{msg.email}</a>
                    {msg.phone && <a href={`tel:${msg.phone}`} className="block text-[12px] text-white/45 hover:text-white">{msg.phone}</a>}
                  </TD>
                  <TD><span className="text-white/60 text-[12px]">{msg.service || 'Not specified'}</span></TD>
                  <TD><p className="max-w-[360px] whitespace-pre-wrap leading-6 text-white/70">{msg.message}</p></TD>
                  <TD>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.5px] ${isRead ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-300'}`}>
                      {msg.status}
                    </span>
                    {msg.readAt && <div className="mt-1 text-[10px] text-white/35">{formatDate(msg.readAt)}</div>}
                  </TD>
                  <TD>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => onStatusChange(msg._id, isRead ? 'unread' : 'read')} className="px-3 py-1.5 border border-[#C8922A]/30 rounded-md text-[11px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all whitespace-nowrap">
                        Mark {isRead ? 'Unread' : 'Read'}
                      </button>
                      <button onClick={() => { if (window.confirm('Delete this message?')) onDelete(msg._id); }} className="px-3 py-1.5 border border-red-400/30 rounded-md text-[11px] text-red-300 hover:bg-red-500/10 transition-all whitespace-nowrap">
                        Delete
                      </button>
                    </div>
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
          <button onClick={() => goToPage(Math.max(page - 1, 1))} disabled={page <= 1} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
            Previous
          </button>
          <button onClick={() => goToPage(Math.min(page + 1, totalPages))} disabled={page >= totalPages} className="px-3 py-1.5 rounded-md border border-white/10 text-white/60 disabled:opacity-35 disabled:cursor-not-allowed hover:border-[#C8922A]/40 hover:text-[#C8922A] transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}