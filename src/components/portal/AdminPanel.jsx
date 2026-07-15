import { Modal } from './Modal';
import { Toast } from './Toast';
import { Field } from './Field';
import { inp, sel, MONTHS, INVOICE_STATUSES } from './utils';
import { EmployeesTab }   from './admin/EmployeesTab';
import { SalariesTab }    from './admin/SalariesTab';
import { InvoicesTab }    from './admin/InvoicesTab';
import { MessagesTab }    from './admin/MessagesTab';
import { SuppliersTab }   from './admin/SuppliersTab';
import { CredentialsTab } from './admin/CredentialsTab';

const TABS = ['employees', 'salaries', 'invoices', 'messages', 'suppliers', 'credentials'];

export function AdminPanel({
  dataLoading,
  adminTab, setAdminTab,
  employees, salaries, credentials, suppliers, projects, invoices, invoicePagination, fetchInvoices,
  messages, messagePagination,
  modal, setModal, addSupModal, setAddSupModal, addPrjModal, setAddPrjModal,
  statusModal, setStatusModal,
  editEmp, openEditEmp,
  empForm, editEmpForm, salForm, credForm, supForm, prjForm,
  saveEmployee, saveEditEmployee, deleteEmployee,
  saveSalary, toggleSalaryStatus, deleteSalary,
  saveCred, deleteCredential, toggleUserActive,
  saveSupplier, deleteSupplier,
  saveProject, deleteProject,
  updateStatus, printInvoice, deleteInvoice, uploadInvoiceAttachment, deleteInvoiceAttachment,
  messageFilters, filterMessages, updateMessageStatus, deleteMessage,
  toast,
}) {
  /* Conditionally label email field based on selected role */
  const credRole      = credForm.values.role;
  const emailRequired = credRole === 'supplier';

  return (
    <div className="min-h-screen pt-[68px] bg-[#0B1D33]">
      <div className="container mx-auto px-5 md:px-10 py-10">
        <h2 className="font-condensed text-[28px] font-extrabold text-white mb-1">Admin Dashboard</h2>
        <p className="text-[13px] text-white/50 mb-8">Manage employees, salary records and payment status.</p>

        {dataLoading ? (
          <div className="text-center py-10 text-white/40 text-[13px]">Loading data…</div>
        ) : (
          <>
            {/* Tab bar */}
            <div className="flex flex-wrap bg-[#0B1D33]/80 border border-[#C8922A]/18 rounded-xl p-1 mb-8 gap-1 w-fit">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setAdminTab(t)}
                  className={`px-4 py-2 rounded-[8px] text-[12px] font-bold capitalize transition-all duration-200 ${adminTab === t ? 'text-[#0B1D33]' : 'text-white/50 hover:text-white'}`}
                  style={adminTab === t ? { background: 'linear-gradient(135deg,#C8922A,#E5A93A)' } : {}}
                >
                  {t}
                </button>
              ))}
            </div>

            {adminTab === 'employees' && (
              <EmployeesTab
                employees={employees}
                deleteEmployee={deleteEmployee}
                onAdd={() => setModal('addEmp')}
                onEdit={openEditEmp}
              />
            )}

            {adminTab === 'salaries' && (
              <SalariesTab
                salaries={salaries}
                employees={employees}
                toggleSalaryStatus={toggleSalaryStatus}
                deleteSalary={deleteSalary}
                onAdd={() => { salForm.merge({ empId: employees[0]?.empId || '' }); setModal('addSal'); }}
              />
            )}

            {adminTab === 'invoices' && (
              <InvoicesTab
                invoices={invoices}
                pagination={invoicePagination}
                onPageChange={fetchInvoices}
                projects={projects}
                setStatusModal={setStatusModal}
                printInvoice={printInvoice}
                deleteInvoice={deleteInvoice}
                uploadInvoiceAttachment={uploadInvoiceAttachment}
                deleteInvoiceAttachment={deleteInvoiceAttachment}
              />
            )}


            {adminTab === 'messages' && (
              <MessagesTab
                messages={messages}
                pagination={messagePagination}
                filters={messageFilters}
                onFilter={filterMessages}
                onStatusChange={updateMessageStatus}
                onDelete={deleteMessage}
              />
            )}
            {adminTab === 'suppliers' && (
              <SuppliersTab
                suppliers={suppliers}
                projects={projects}
                invoices={invoices}
                deleteSupplier={deleteSupplier}
                deleteProject={deleteProject}
                onAddSupplier={() => setAddSupModal(true)}
                onAddProject={() => setAddPrjModal(true)}
              />
            )}

            {adminTab === 'credentials' && (
              <CredentialsTab
                credentials={credentials}
                employees={employees}
                deleteCredential={deleteCredential}
                toggleUserActive={toggleUserActive}
                onAdd={() => setModal('addCred')}
              />
            )}
          </>
        )}
      </div>

      {/* ── Add Employee Modal ── */}
      <Modal open={modal === 'addEmp'} onClose={() => setModal(null)} title="Add Employee">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" span2>
            <input value={empForm.values.name} onChange={empForm.set('name')} placeholder="John Smith" className={inp} />
          </Field>
          <Field label="Department">
            <select value={empForm.values.dept} onChange={empForm.set('dept')} className={sel}>
              {['MEP','HVAC','Electrical','Plumbing','Fire Fighting','Admin'].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Designation">
            <input value={empForm.values.desig} onChange={empForm.set('desig')} placeholder="Site Engineer" className={inp} />
          </Field>
        </div>

        <div className="mt-5 pt-5 border-t border-white/8">
          <p className="text-[11px] font-bold uppercase tracking-[1px] text-[#C8922A]/70 mb-4">Portal Access</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Username">
              <input value={empForm.values.username} onChange={empForm.set('username')} placeholder="john.smith" className={inp} />
            </Field>
            <Field label="Password">
              <input type="password" value={empForm.values.password} onChange={empForm.set('password')} placeholder="Min. 6 characters" className={inp} />
            </Field>
            <Field label="Email * (verification required)" span2>
              <input type="email" value={empForm.values.email} onChange={empForm.set('email')} placeholder="employee@company.com" className={inp} />
            </Field>
          </div>
          <p className="text-[11px] text-white/40 mt-2">A verification link will be sent. The employee must verify before they can log in.</p>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModal(null)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveEmployee} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Add Employee</button>
        </div>
      </Modal>

      {/* ── Edit Employee Modal ── */}
      <Modal open={modal === 'editEmp'} onClose={() => setModal(null)} title={`Edit Employee — ${editEmp?.empId || ''}`}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" span2>
            <input value={editEmpForm.values.name} onChange={editEmpForm.set('name')} placeholder="John Smith" className={inp} />
          </Field>
          <Field label="Department">
            <select value={editEmpForm.values.dept} onChange={editEmpForm.set('dept')} className={sel}>
              {['MEP','HVAC','Electrical','Plumbing','Fire Fighting','Admin'].map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Designation">
            <input value={editEmpForm.values.desig} onChange={editEmpForm.set('desig')} placeholder="Site Engineer" className={inp} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModal(null)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveEditEmployee} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Update Employee</button>
        </div>
      </Modal>

      {/* ── Add Salary Modal ── */}
      <Modal open={modal === 'addSal'} onClose={() => setModal(null)} title="Add Salary Record">
        <div className="space-y-3">
          <Field label="Employee">
            <select value={salForm.values.empId} onChange={salForm.set('empId')} className={sel}>
              {employees.map(e => <option key={e.empId} value={e.empId}>{e.name} ({e.empId})</option>)}
            </select>
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Month">
              <select value={salForm.values.month} onChange={salForm.set('month')} className={sel}>
                {MONTHS.slice(1).map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </Field>
            <Field label="Year">
              <select value={salForm.values.year} onChange={salForm.set('year')} className={sel}>
                {[2026, 2025, 2024].map(y => <option key={y}>{y}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Basic','basic'],['Housing','hra'],['Transport','ta'],['Overtime','ot'],['Other','other'],
              ['Advance Paid','advance'],['Leave Deduction','absent'],
            ].map(([l, k]) => (
              <Field key={k} label={`${l} (AED)`}>
                <input type="number" value={salForm.values[k]} onChange={salForm.set(k)} placeholder="0" className={inp} />
              </Field>
            ))}
          </div>
          <Field label="Status">
            <select value={salForm.values.status} onChange={salForm.set('status')} className={sel}>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModal(null)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveSalary} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Save Record</button>
        </div>
      </Modal>

      {/* ── Add Credential Modal ── */}
      <Modal open={modal === 'addCred'} onClose={() => setModal(null)} title="Add Portal User">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Username">
            <input value={credForm.values.username} onChange={credForm.set('username')} placeholder="username" className={inp} />
          </Field>
          <Field label="Password">
            <input type="password" value={credForm.values.password} onChange={credForm.set('password')} placeholder="Min. 6 characters" className={inp} />
          </Field>
          <Field label="Role">
            <select value={credForm.values.role} onChange={credForm.set('role')} className={sel}>
              <option value="supplier">Supplier</option>
              <option value="admin">Admin</option>
            </select>
          </Field>
          <Field label={`Email ${emailRequired ? '*' : '(optional)'}`} span2>
            <input
              type="email"
              value={credForm.values.email}
              onChange={credForm.set('email')}
              placeholder={emailRequired ? 'user@company.com — required for verification' : 'admin@company.com (optional)'}
              className={inp}
            />
          </Field>
        </div>
        {emailRequired && (
          <p className="text-[11px] text-[#C8922A]/70 mt-2">
            A verification email will be sent. The user must verify before logging in.
          </p>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModal(null)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveCred} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Create User</button>
        </div>
      </Modal>

      {/* ── Add Supplier Modal ── */}
      <Modal open={addSupModal} onClose={() => setAddSupModal(false)} title="Add Supplier">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Username">
            <input value={supForm.values.username} onChange={supForm.set('username')} placeholder="supplier3" className={inp} />
          </Field>
          <Field label="Password">
            <input type="password" value={supForm.values.password} onChange={supForm.set('password')} placeholder="Min. 6 characters" className={inp} />
          </Field>
          <Field label="Company Name" span2>
            <input value={supForm.values.company} onChange={supForm.set('company')} placeholder="Company LLC" className={inp} />
          </Field>
          <Field label="Contact">
            <input value={supForm.values.contact} onChange={supForm.set('contact')} placeholder="+971 XX XXX XXXX" className={inp} />
          </Field>
          <Field label="Email *">
            <input type="email" value={supForm.values.email} onChange={supForm.set('email')} placeholder="supplier@company.com" className={inp} />
          </Field>
        </div>
        <p className="text-[11px] text-[#C8922A]/70 mt-2">
          A verification email will be sent. The supplier must verify before logging in.
        </p>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setAddSupModal(false)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveSupplier} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Add Supplier</button>
        </div>
      </Modal>

      {/* ── Add Project Modal ── */}
      <Modal open={addPrjModal} onClose={() => setAddPrjModal(false)} title="Add Project">
        <div className="space-y-4">
          <Field label="Project ID">
            <input value={prjForm.values.id} onChange={prjForm.set('id')} placeholder="PRJ-007" className={inp} />
          </Field>
          <Field label="Project Name">
            <input value={prjForm.values.name} onChange={prjForm.set('name')} placeholder="Project Name — Location" className={inp} />
          </Field>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setAddPrjModal(false)} className="px-6 py-2.5 border border-white/10 rounded-xl text-[13px] text-white/60">Cancel</button>
          <button onClick={saveProject} className="px-6 py-2.5 rounded-xl text-[13px] font-bold text-[#0B1D33]" style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}>Add Project</button>
        </div>
      </Modal>

      {/* ── Invoice Status Modal ── */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/75 z-[200] flex items-center justify-center p-5" onClick={() => setStatusModal(null)}>
          <div
            className="bg-[#112540] border border-[#C8922A]/20 rounded-2xl p-8 w-full max-w-[480px] shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-condensed text-[18px] font-extrabold text-white">Update Invoice Status</h3>
              <button onClick={() => setStatusModal(null)} className="w-8 h-8 border border-white/10 rounded-lg text-white/50 hover:border-red-500 hover:text-red-400 transition-all flex items-center justify-center">✕</button>
            </div>
            <div className="space-y-2">
              {INVOICE_STATUSES.map((s, idx) => {
                const isCurrent = s.key === statusModal.current;
                return (
                  <button
                    key={s.key}
                    onClick={() => updateStatus(statusModal.invId, s.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${isCurrent ? 'border-[#C8922A] bg-[#C8922A]/10' : 'border-white/8 hover:border-[#C8922A]/40 hover:bg-[#C8922A]/5'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isCurrent ? 'border-[#C8922A] bg-[#C8922A]' : 'border-white/20'}`}>
                      {isCurrent && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#0B1D33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <div className="text-[13px] font-bold text-white">{s.label}</div>
                    <div className="ml-auto">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${s.color}`}>Step {idx + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
  );
}

