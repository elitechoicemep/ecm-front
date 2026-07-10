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
  const [invoicePagination, setInvoicePagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
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
      setInvoices([]); setInvoicePagination({ page: 1, limit: 15, total: 0, totalPages: 1 }); setMessages([]); setMessagePagination({ page: 1, limit: 10, total: 0, totalPages: 1 }); setEmployees([]); setSalaries([]);
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
          setSuppliers(sups); setInvoices(invs.invoices || []); setInvoicePagination(invs.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
          setMessages(msgs.messages || []); setMessagePagination(msgs.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }); setProjects(projs);
        })
        .catch(err => showToast(err.message, 'error'))
        .finally(() => setDataLoading(false));
    }

    if (user.role === 'supplier') {
      Promise.all([api.getMyInvoices(), api.getProjectList()])
        .then(([invs, projs]) => {
          setInvoices(invs.invoices || []); setInvoicePagination(invs.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
          setProjects(projs);
        })
        .catch(err => showToast(err.message, 'error'));
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchInvoices = async (page = 1) => {
    try {
      const data = user.role === 'admin' ? await api.getInvoices(page) : await api.getMyInvoices(page);
      setInvoices(data.invoices || []);
      setInvoicePagination(data.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (err) { showToast(err.message, 'error'); }
  };

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
      await api.submitInvoice({
        projectId, invoiceNo,
        amount: +amount,
        company: user.company,
        attachmentDataUrl: fileDataUrl,
        fileName: _fileName || undefined,
      });
      await fetchInvoices(1);
      invForm.reset();
      showToast('Invoice submitted successfully');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const printInvoice = async (inv) => {
    const { jsPDF } = await import('jspdf');
    const proj      = projects.find(p => p.projectId === inv.projectId);
    const statusObj = INVOICE_STATUSES.find(s => s.key === inv.status);
    const fmtAED    = n => 'AED ' + Number(n).toLocaleString('en-AE', { minimumFractionDigits: 2 });

    const navy  = [11, 29, 51];
    const gold  = [200, 146, 42];
    const slate = [100, 116, 139];
    const line  = [226, 232, 240];

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const marginX = 18;
    let y = 22;

    // Header
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor(...navy);
    doc.text('ELITE CHOICE', marginX, y);
    const eliteW = doc.getTextWidth('ELITE CHOICE ');
    doc.setTextColor(...gold);
    doc.text('Electromechanical Contracting LLC', marginX + eliteW, y);
    doc.setTextColor(...slate); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text('Invoice Receipt / Payment Tracking', marginX, y + 6);

    const badgeText = inv.invoiceId || inv.id || '';
    doc.setFontSize(10); doc.setTextColor(...gold);
    const badgeW = doc.getTextWidth(badgeText) + 10;
    doc.roundedRect(pageW - marginX - badgeW, y - 8, badgeW, 8, 4, 4);
    doc.text(badgeText, pageW - marginX - badgeW / 2, y - 2.7, { align: 'center' });

    y += 12;
    doc.setDrawColor(...gold); doc.setLineWidth(0.8);
    doc.line(marginX, y, pageW - marginX, y);
    y += 12;

    // Info boxes (2x2 grid)
    const boxW = (pageW - marginX * 2 - 8) / 2;
    const boxH = 20;
    const boxes = [
      ['SUPPLIER / COMPANY', inv.company],
      ['INVOICE NO.', inv.invoiceNo],
      ['PROJECT', proj?.name || inv.projectId],
      ['SUBMISSION DATE', inv.date],
    ];
    boxes.forEach((b, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const bx = marginX + col * (boxW + 8);
      const by = y + row * (boxH + 6);
      doc.setDrawColor(...line); doc.setLineWidth(0.3);
      doc.roundedRect(bx, by, boxW, boxH, 2, 2);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...gold);
      doc.text(b[0], bx + 5, by + 7);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...navy);
      doc.text(String(b[1] ?? '-'), bx + 5, by + 15);
    });
    y += boxH * 2 + 6 + 10;

    // Amount panel
    doc.setFillColor(250, 247, 240); doc.setDrawColor(...gold); doc.setLineWidth(0.4);
    doc.roundedRect(marginX, y, pageW - marginX * 2, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...navy);
    doc.text('Invoice Amount', marginX + 6, y + 11);
    doc.setFontSize(16); doc.setTextColor(...gold);
    doc.text(fmtAED(inv.amount), pageW - marginX - 6, y + 12, { align: 'right' });
    y += 28;

    // Payment status box
    doc.setDrawColor(...line); doc.setLineWidth(0.3);
    doc.roundedRect(marginX, y, pageW - marginX * 2, 18, 2, 2);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...gold);
    doc.text('PAYMENT STATUS', marginX + 6, y + 7);
    doc.setFontSize(11); doc.setTextColor(...gold);
    doc.text(statusObj?.label || inv.status, marginX + 6, y + 15);
    y += 24;

    if (inv.note) {
      doc.setDrawColor(...line); doc.setLineWidth(0.3);
      const noteLines = doc.splitTextToSize(inv.note, pageW - marginX * 2 - 12);
      const noteH = 12 + noteLines.length * 5;
      doc.roundedRect(marginX, y, pageW - marginX * 2, noteH, 2, 2);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...gold);
      doc.text('NOTE', marginX + 6, y + 7);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...navy);
      doc.text(noteLines, marginX + 6, y + 14);
      y += noteH + 6;
    }

    // Footer
    const pageH = doc.internal.pageSize.getHeight();
    const footY = pageH - 16;
    doc.setDrawColor(...line); doc.setLineWidth(0.3);
    doc.line(marginX, footY - 6, pageW - marginX, footY - 6);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...slate);
    doc.text('Elite Choice Electromechanical Contracting LLC — Supplier Portal', marginX, footY);
    doc.text(`Printed: ${new Date().toLocaleDateString('en-AE')}`, pageW - marginX, footY, { align: 'right' });

    doc.save(`Invoice_${inv.invoiceNo}_${inv.invoiceId || inv.id}.pdf`);
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

  const deleteInvoice = async (invoiceId) => {
    try {
      await api.deleteInvoice(invoiceId);
      await fetchInvoices(invoicePagination.page);
      showToast('Invoice deleted');
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
    if (role === 'admin' && !window.confirm(`Grant full admin access to "${username}"? Admins can manage all users, salaries, and cannot be suspended or deleted by other admins.`)) {
      return;
    }
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
      invoices={invoices} invoicePagination={invoicePagination} fetchInvoices={fetchInvoices} projects={projects}
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
      suppliers={suppliers} projects={projects} invoices={invoices} invoicePagination={invoicePagination} fetchInvoices={fetchInvoices}
      messages={messages} messagePagination={messagePagination}
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
      updateStatus={updateStatus} printInvoice={printInvoice} deleteInvoice={deleteInvoice}
      messageFilters={messageFilters} filterMessages={filterMessages} updateMessageStatus={updateMessageStatus} deleteMessage={deleteMessage}
      toast={toast}
    />
  );
}






