import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useForm } from '../hooks/useForm';
import { buildSlipHTML, INVOICE_STATUSES } from '../components/portal/utils';
import { LoginScreen }    from '../components/portal/LoginScreen';
import { EmployeePortal } from '../components/portal/EmployeePortal';
import { SupplierPortal } from '../components/portal/SupplierPortal';
import { AdminPanel }     from '../components/portal/AdminPanel';

function normaliseSession(data) {
  const u = data?.user;
  if (!u) return null;
  return {
    role: u.role,
    username: u.username,
    email: u.email || '',
    ...(data.employee ? { empId: data.employee.empId, empName: data.employee.name } : {}),
    ...(data.supplier ? { company: data.supplier.company } : {}),
  };
}

export default function Portal() {
  const navigate = useNavigate();

  /* ── Auth ── */
  const [user,         setUser]         = useState(null);
  const [loginErr,     setLoginErr]     = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const loginForm = useForm({ username: '', password: '' });

  /* ── Data ── */
  const [employees,   setEmployees]   = useState([]);
  const [salaries,    setSalaries]    = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [suppliers,   setSuppliers]   = useState([]);
  const [projects,    setProjects]    = useState([]);
  const [invoices,    setInvoices]    = useState([]);
  const [messages,    setMessages]    = useState([]);
  const [messagePagination, setMessagePagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [dataLoading, setDataLoading] = useState(false);

  /* ── Employee UI ── */
  const [selMonth, setSelMonth] = useState(new Date().getMonth() + 1);
  const [selYear,  setSelYear]  = useState(new Date().getFullYear());
  const [slip,     setSlip]     = useState(null);

  /* ── Admin UI ── */
  const [adminTab,    setAdminTab]    = useState('employees');
  const [modal,       setModal]       = useState(null);
  const [addSupModal, setAddSupModal] = useState(false);
  const [addPrjModal, setAddPrjModal] = useState(false);
  const [statusModal, setStatusModal] = useState(null);
  const [editEmp,     setEditEmp]     = useState(null); // employee being edited
  const [messageFilters, setMessageFilters] = useState({ status: '', service: '', from: '', to: '', page: 1, limit: 10 });

  /* ── Forms ── */
  const empForm     = useForm({ id: '', name: '', dept: 'MEP', desig: '', username: '', password: '', email: '' });
  const editEmpForm = useForm({ name: '', dept: 'MEP', desig: '' });
  const salForm     = useForm({ empId: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), basic: '', hra: '', ta: '', med: '', other: '', pf: '', tax: '', pt: '', esi: '', loan: '', status: 'paid' });
  const credForm    = useForm({ username: '', password: '', role: 'employee', empId: '', email: '' });
  const supForm     = useForm({ username: '', password: '', company: '', contact: '', email: '' });
  const prjForm     = useForm({ id: '', name: '' });
  const invForm     = useForm({ projectId: '', invoiceNo: '', amount: '', fileDataUrl: null, _fileName: '' });

  /* ── Toast ── */
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false });
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  };

  /* ── Session restore ── */
  useEffect(() => {
    api.me()
      .then(data => { setUser(normaliseSession(data)); })
      .catch(() => {});

    const onExpired = () => {
      setUser(null);
      setInvoices([]); setMessages([]); setMessagePagination({ page: 1, limit: 10, total: 0, totalPages: 1 }); setEmployees([]); setSalaries([]);
      setCredentials([]); setSuppliers([]); setProjects([]);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  /* ── Load role data after login ── */
  useEffect(() => {
    if (!user) return;

    if (user.role === 'admin') {
      setDataLoading(true);
      Promise.all([
        api.getEmployees(),
        api.getSalaries(),
        api.getCredentials(),
        api.getSuppliers(),
        api.getInvoices(),
        api.getMessages(messageFilters),
        api.getProjects(),
      ])
        .then(([emps, sals, creds, sups, invs, msgs, projs]) => {
          setEmployees(emps); setSalaries(sals); setCredentials(creds);
          setSuppliers(sups); setInvoices(invs); setMessages(msgs.messages || []); setMessagePagination(msgs.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }); setProjects(projs);
        })
        .catch(err => showToast(err.message, 'error'))
        .finally(() => setDataLoading(false));
    }

    if (user.role === 'supplier') {
      Promise.all([api.getMyInvoices(), api.getProjectList()])
        .then(([invs, projs]) => { setInvoices(invs); setProjects(projs); })
        .catch(err => showToast(err.message, 'error'));
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ══ HANDLERS ══════════════════════════════════════════════════ */

  const doLogin = async () => {
    const { username, password } = loginForm.values;
    if (!username.trim() || !password) { setLoginErr('Please enter username/email and password.'); return; }
    setLoginLoading(true); setLoginErr('');
    try {
      const loginData = await api.login({ username: username.trim(), password });
      const sessionUser = normaliseSession(loginData);
      setUser(sessionUser);
      window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: sessionUser } }));
    } catch (err) {
      if (err.status === 403 && /verify/i.test(err.message || '')) {
        navigate('/verify-pending', { state: { identifier: username.trim() } });
        return;
      }
      setLoginErr(err.message || 'Invalid username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const fetchSlip = async () => {
    try {
      const data = await api.getSlip(selMonth, selYear);
      setSlip({ ...data.slip, employee: data.employee });
    } catch (err) {
      showToast(err.message || 'No record found', 'error');
      setSlip(null);
    }
  };

  const printSlip = () => {
    if (!slip) return;
    const html = buildSlipHTML(slip, slip.employee);
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `SalarySlip_${(slip.employee?.name || '').replace(/\s+/g, '_')}_${slip.month}_${slip.year}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showToast('Salary slip downloaded');
  };

  const printOnly = () => {
    if (!slip) return;
    const html    = buildSlipHTML(slip, slip.employee);
    const existing = document.getElementById('__print_frame__');
    if (existing) document.body.removeChild(existing);
    const iframe  = document.createElement('iframe');
    iframe.id     = '__print_frame__';
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    iframe.onload = () => setTimeout(() => { iframe.contentWindow.focus(); iframe.contentWindow.print(); }, 500);
  };

  const submitInvoice = async () => {
    const { projectId, invoiceNo, amount, fileDataUrl, _fileName } = invForm.values;
    if (!projectId || !invoiceNo || !amount || !fileDataUrl) { showToast('Please fill all required fields and upload the invoice', 'error'); return false; }
    try {
      const data = await api.submitInvoice({
        projectId, invoiceNo,
        amount: +amount,
        company: user.company,
        attachmentDataUrl: fileDataUrl,
        fileName: _fileName || undefined,
      });
      setInvoices(prev => [data.invoice, ...prev]);
      invForm.reset();
      showToast('Invoice submitted successfully');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const printInvoice = (inv) => {
    const proj      = projects.find(p => p.projectId === inv.projectId);
    const statusObj = INVOICE_STATUSES.find(s => s.key === inv.status);
    const fmtAED    = n => 'AED ' + Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2 });
    const html = [
      '<!DOCTYPE html><html><head><meta charset="UTF-8"/>',
      '<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet"/>',
      '<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Barlow,sans-serif;color:#1a2b3c;background:#fff;padding:40px;max-width:800px;margin:0 auto}.hd{border-bottom:3px solid #C8922A;padding-bottom:20px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start}.co{font-family:"Barlow Condensed",sans-serif;font-size:22px;font-weight:800;color:#0B1D33}.co span{color:#C8922A}.sub{font-size:12px;color:#64748b;margin-top:3px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}.box{border:1px solid #e2e8f0;border-radius:8px;padding:16px}.bl{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#C8922A;margin-bottom:6px}.bv{font-size:14px;font-weight:700;color:#0B1D33}.amt{background:#faf7f0;border:1px solid #C8922A;border-radius:8px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.aml{font-size:14px;font-weight:700;color:#0B1D33}.amv{font-family:monospace;font-size:26px;font-weight:800;color:#C8922A}.badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;border:1px solid #C8922A;color:#C8922A}.foot{margin-top:24px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;display:flex;justify-content:space-between}@media print{body{padding:24px}@page{margin:1.5cm;size:A4}}</style>',
      '</head><body>',
      `<div class="hd"><div><div class="co">ELITE<span>CHOICE</span> Electromechanical Contracting LLC</div><div class="sub">Invoice Receipt / Payment Tracking</div></div><span class="badge">${inv.invoiceId || inv.id}</span></div>`,
      '<div class="grid">',
      `<div class="box"><div class="bl">Supplier / Company</div><div class="bv">${inv.company}</div></div>`,
      `<div class="box"><div class="bl">Invoice No.</div><div class="bv">${inv.invoiceNo}</div></div>`,
      `<div class="box"><div class="bl">Project</div><div class="bv">${proj?.name || inv.projectId}</div></div>`,
      `<div class="box"><div class="bl">Submission Date</div><div class="bv">${inv.date}</div></div>`,
      '</div>',
      `<div class="amt"><div class="aml">Invoice Amount</div><div class="amv">${fmtAED(inv.amount)}</div></div>`,
      `<div class="box" style="margin-bottom:20px"><div class="bl">Payment Status</div><div class="bv" style="color:#C8922A;margin-top:4px">${statusObj?.label || inv.status}</div></div>`,
      inv.note ? `<div class="box" style="margin-bottom:20px"><div class="bl">Note</div><div class="bv" style="font-weight:400;font-size:13px">${inv.note}</div></div>` : '',
      `<div class="foot"><span>Elite Choice Electromechanical Contracting LLC — Supplier Portal</span><span>Printed: ${new Date().toLocaleDateString('en-AE')}</span></div>`,
      '</body></html>',
    ].join('');
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Invoice_${inv.invoiceNo}_${inv.invoiceId || inv.id}.html`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showToast('Invoice downloaded');
  };

  const updateStatus = async (invoiceId, newStatus) => {
    try {
      await api.updateInvoiceStatus(invoiceId, newStatus);
      setInvoices(prev => prev.map(inv =>
        (inv.invoiceId || inv.id) === invoiceId ? { ...inv, status: newStatus } : inv
      ));
      setStatusModal(null);
      showToast('Status updated');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const filterMessages = async (filters) => {
    const nextFilters = { ...messageFilters, ...filters };
    setMessageFilters(nextFilters);
    try {
      const data = await api.getMessages(nextFilters);
      setMessages(data.messages || []);
      setMessagePagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) { showToast(err.message, 'error'); }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      await api.updateMessageStatus(id, status);
      const data = await api.getMessages(messageFilters);
      setMessages(data.messages || []);
      setMessagePagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      showToast(`Message marked ${status}`);
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteMessage = async (id) => {
    try {
      await api.deleteMessage(id);
      const data = await api.getMessages(messageFilters);
      setMessages(data.messages || []);
      setMessagePagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      showToast('Message deleted');
    } catch (err) { showToast(err.message, 'error'); }
  };
  /* ── Employees ── */

  const saveEmployee = async () => {
    const { id, name, dept, desig, username, password, email } = empForm.values;
    if (!id || !name || !desig || !username || !password || !email) {
      showToast('All fields are required', 'error'); return;
    }
    try {
      await api.addEmployee({ id, name, dept, desig });
      await api.addCredential({ username, password, role: 'employee', empId: id, email });
      const [emps, creds] = await Promise.all([api.getEmployees(), api.getCredentials()]);
      setEmployees(emps); setCredentials(creds);
      setModal(null); empForm.reset();
      showToast('Employee added — verification email sent');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const openEditEmp = (emp) => {
    setEditEmp(emp);
    editEmpForm.setValues({ name: emp.name, dept: emp.dept, desig: emp.desig });
    setModal('editEmp');
  };

  const saveEditEmployee = async () => {
    const { name, dept, desig } = editEmpForm.values;
    if (!name || !desig) { showToast('All fields required', 'error'); return; }
    try {
      await api.updateEmployee(editEmp.empId, { name, dept, desig });
      setEmployees(prev => prev.map(e => e.empId === editEmp.empId ? { ...e, name, dept, desig } : e));
      setModal(null); setEditEmp(null);
      showToast('Employee updated');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteEmployee = async (empId) => {
    try {
      await api.deleteEmployee(empId);
      setEmployees(prev => prev.filter(e => e.empId !== empId));
      showToast('Employee removed');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Salaries ── */
  const saveSalary = async () => {
    const v = salForm.values;
    if (!v.empId) { showToast('Select an employee', 'error'); return; }
    try {
      await api.addSalary({
        empId: v.empId, month: +v.month, year: +v.year,
        basic: +v.basic||0, hra: +v.hra||0, ta: +v.ta||0, med: +v.med||0, other: +v.other||0,
        pf: +v.pf||0, tax: +v.tax||0, pt: +v.pt||0, esi: +v.esi||0, loan: +v.loan||0,
        status: v.status,
      });
      const sals = await api.getSalaries();
      setSalaries(sals);
      setModal(null);
      showToast('Salary record saved');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const toggleSalaryStatus = async (_id) => {
    try {
      const { status } = await api.toggleSalary(_id);
      setSalaries(prev => prev.map(s => String(s._id) === String(_id) ? { ...s, status } : s));
      showToast('Status updated');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteSalary = async (_id) => {
    try {
      await api.deleteSalary(_id);
      setSalaries(prev => prev.filter(s => String(s._id) !== String(_id)));
      showToast('Record deleted');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Credentials ── */
  const saveCred = async () => {
    const { username, password, role, empId, email } = credForm.values;
    if (!username || !password) { showToast('Fill all fields', 'error'); return; }
    try {
      await api.addCredential({
        username, password, role,
        ...(empId ? { empId } : {}),
        ...(email ? { email } : {}),
      });
      const creds = await api.getCredentials();
      setCredentials(creds);
      setModal(null); credForm.reset();
      showToast('User created — verification email sent');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteCredential = async (id) => {
    try {
      await api.deleteCredential(id);
      setCredentials(prev => prev.filter(c => String(c.id) !== String(id)));
      showToast('User removed');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const toggleUserActive = async (id, currentlyActive) => {
    try {
      const { isActive } = await api.setUserActive(id, !currentlyActive);
      setCredentials(prev => prev.map(c => String(c.id) === String(id) ? { ...c, isActive } : c));
      showToast(isActive ? 'User activated' : 'User suspended');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Suppliers ── */
  const saveSupplier = async () => {
    const { username, password, company, contact, email } = supForm.values;
    if (!username || !password || !company) { showToast('Fill all fields', 'error'); return; }
    try {
      await api.addSupplier({ username, password, company, contact, ...(email ? { email } : {}) });
      const sups = await api.getSuppliers();
      setSuppliers(sups);
      setAddSupModal(false); supForm.reset();
      showToast('Supplier added — verification email sent');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteSupplier = async (username) => {
    try {
      await api.deleteSupplier(username);
      setSuppliers(prev => prev.filter(s => s.username !== username));
      showToast('Supplier removed');
    } catch (err) { showToast(err.message, 'error'); }
  };

  /* ── Projects ── */
  const saveProject = async () => {
    const { id, name } = prjForm.values;
    if (!id || !name) { showToast('Fill all fields', 'error'); return; }
    try {
      await api.addProject({ id, name });
      setProjects(prev => [...prev, { projectId: id, name }]);
      setAddPrjModal(false); prjForm.reset();
      showToast('Project added');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const deleteProject = async (projectId) => {
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.projectId !== projectId));
      showToast('Project removed');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => invForm.merge({ fileDataUrl: ev.target.result, _fileName: file.name });
    reader.readAsDataURL(file);
  };

  /* ══ RENDER ════════════════════════════════════════════════════ */

  if (!user) return (
    <LoginScreen
      loginErr={loginErr} loginLoading={loginLoading}
      loginForm={loginForm} doLogin={doLogin}
      toast={toast}
    />
  );

  if (user.role === 'employee') return (
    <EmployeePortal
      slip={slip} selMonth={selMonth} setSelMonth={setSelMonth} selYear={selYear} setSelYear={setSelYear}
      fetchSlip={fetchSlip} printSlip={printSlip} printOnly={printOnly}
      toast={toast}
    />
  );

  if (user.role === 'supplier') return (
    <SupplierPortal
      user={user}
      invoices={invoices} projects={projects}
      invForm={invForm} submitInvoice={submitInvoice} handleFile={handleFile}
      printInvoice={printInvoice}
      toast={toast}
    />
  );

  if (user.role === 'admin') return (
    <AdminPanel
      dataLoading={dataLoading}
      adminTab={adminTab} setAdminTab={setAdminTab}
      employees={employees} salaries={salaries} credentials={credentials}
      suppliers={suppliers} projects={projects} invoices={invoices} messages={messages} messagePagination={messagePagination}
      modal={modal} setModal={setModal}
      addSupModal={addSupModal} setAddSupModal={setAddSupModal}
      addPrjModal={addPrjModal} setAddPrjModal={setAddPrjModal}
      statusModal={statusModal} setStatusModal={setStatusModal}
      editEmp={editEmp} openEditEmp={openEditEmp}
      empForm={empForm} editEmpForm={editEmpForm} salForm={salForm}
      credForm={credForm} supForm={supForm} prjForm={prjForm}
      saveEmployee={saveEmployee} saveEditEmployee={saveEditEmployee} deleteEmployee={deleteEmployee}
      saveSalary={saveSalary} toggleSalaryStatus={toggleSalaryStatus} deleteSalary={deleteSalary}
      saveCred={saveCred} deleteCredential={deleteCredential} toggleUserActive={toggleUserActive}
      saveSupplier={saveSupplier} deleteSupplier={deleteSupplier}
      saveProject={saveProject} deleteProject={deleteProject}
      updateStatus={updateStatus} printInvoice={printInvoice}
      messageFilters={messageFilters} filterMessages={filterMessages} updateMessageStatus={updateMessageStatus} deleteMessage={deleteMessage}
      toast={toast}
    />
  );
}






