const TH = ({ children }) => <th className="px-5 py-3 text-left text-[10px] font-bold text-[#C8922A] uppercase tracking-[1px]">{children}</th>;
const TD = ({ children, mono }) => <td className={`px-5 py-4 text-[13px] text-white/80 border-t border-white/[0.06] ${mono ? 'font-mono-jet' : ''}`}>{children}</td>;

export function EmployeesTab({ employees, deleteEmployee, onAdd, onEdit }) {
  return (
    <div className="bg-[#112540]/80 border border-[#C8922A]/15 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C8922A]/15 flex items-center justify-between">
        <h3 className="font-bold text-[15px] text-white">
          All Employees <span className="text-white/40 text-[12px] font-normal">({employees.length})</span>
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 text-[12px] font-bold text-[#0B1D33] rounded-lg"
          style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
        >
          + Add Employee
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-[#0B1D33]/60">
            <tr><TH>Name</TH><TH>ID</TH><TH>Department</TH><TH>Designation</TH><TH>Actions</TH></tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.empId} className="hover:bg-[#C8922A]/4 transition-colors">
                <TD><span className="font-bold text-white">{e.name}</span></TD>
                <TD mono><span className="text-[#C8922A]">{e.empId}</span></TD>
                <TD>{e.dept}</TD>
                <TD>{e.desig}</TD>
                <TD>
                  <button
                    onClick={() => onEdit(e)}
                    className="px-3 py-1.5 border border-[#C8922A]/30 rounded-md text-[12px] text-[#C8922A] hover:bg-[#C8922A]/10 transition-all mr-2"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(e.empId)}
                    className="px-3 py-1.5 border border-white/10 rounded-md text-[12px] text-white/50 hover:border-red-500 hover:text-red-400 transition-all"
                  >
                    ✕ Remove
                  </button>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
