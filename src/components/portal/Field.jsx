/**
 * Reusable form field wrapper — renders a consistent label above any input/select.
 *
 * Props:
 *   label   – string shown above the field
 *   span2   – if true, applies sm:col-span-2 (for use inside grid forms)
 *   children – the input / select / textarea
 */
export function Field({ label, span2, children }) {
  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
