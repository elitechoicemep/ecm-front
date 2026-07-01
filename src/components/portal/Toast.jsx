export function Toast({ msg, type, visible }) {
  return (
    <div className={`fixed bottom-7 right-7 z-[999] px-5 py-3 text-[13px] font-bold text-white rounded-[10px] shadow-xl transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
    } ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {msg}
    </div>
  );
}
