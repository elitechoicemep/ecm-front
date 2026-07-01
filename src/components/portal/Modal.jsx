export function Modal({ open, onClose, title, children, maxWidth = 'max-w-[540px]' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/75 z-[200] flex items-center justify-center p-5" onClick={onClose}>
      <div
        className={`bg-[#112540] border border-[#C8922A]/20 rounded-2xl p-8 w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.5)]`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-condensed text-[18px] font-extrabold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-white/10 rounded-lg text-white/50 hover:border-red-500 hover:text-red-400 transition-all flex items-center justify-center"
          >✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

