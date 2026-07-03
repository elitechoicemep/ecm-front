import axios from 'axios';

/* ── Axios instance ─────────────────────────────────────────────── */
const client = axios.create({
  baseURL:     `https://ecm-server-kjtl.onrender.com/api`,
  // baseURL:     `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },

});

/* ── Refresh-token interceptor ──────────────────────────────────── */
let isRefreshing = false;
let failedQueue  = [];

function drainQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve());
  failedQueue = [];
}

client.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    if (
      err.response?.status !== 401 ||
      original._retried ||
      original.url === '/auth/refresh' ||
      original.url === '/auth/login' ||
      original.url === '/auth/me'
    ) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => client(original))
        .catch(e => Promise.reject(e));
    }

    original._retried = true;
    isRefreshing = true;

    try {
      await client.post('/auth/refresh');
      drainQueue(null);
      return client(original);
    } catch (refreshErr) {
      drainQueue(refreshErr);
      window.dispatchEvent(new CustomEvent('auth:expired'));
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  },
);

/* ── Normalise axios errors ─────────────────────────────────────── */
function normalise(err) {
  const msg = err.response?.data?.error || err.response?.data?.message || err.message || 'Request failed';
  const out  = new Error(msg);
  out.status = err.response?.status;
  return out;
}

const get   = url         => client.get(url).then(r => r.data).catch(e => { throw normalise(e); });
const post  = (url, body) => client.post(url, body).then(r => r.data).catch(e => { throw normalise(e); });
const del   = url         => client.delete(url).then(r => r.data).catch(e => { throw normalise(e); });
const patch = (url, body) => client.patch(url, body).then(r => r.data).catch(e => { throw normalise(e); });

/* ── API surface ────────────────────────────────────────────────── */
export const api = {
  // ── Auth ──────────────────────────────────────────────────────
  login:               body   => post('/auth/login',   body),
  logout:              ()     => post('/auth/logout',  {}),
  refresh:             ()     => post('/auth/refresh', {}),
  me:                  ()     => get('/auth/me'),
  forgotPassword:      body   => post('/auth/forgot-password', body),
  resetPassword:       body   => post('/auth/reset-password',  body),
  resendVerification:  body   => post('/auth/resend-verification', body),
  submitContactMessage: body   => post('/contact', body),
  submitCareerApplication: body => post('/careers', body),

  // ── Employee ──────────────────────────────────────────────────
  getSlip: (month, year) => get(`/slip?month=${month}&year=${year}`),

  // ── Supplier ──────────────────────────────────────────────────
  getMyInvoices: (page = 1) => get(`/supplier/invoices?page=${page}`),
  submitInvoice: body        => post('/supplier/invoices', body),

  // ── Shared ────────────────────────────────────────────────────
  getProjectList: () => get('/projects'),

  // ── Admin — Employees ─────────────────────────────────────────
  getEmployees:   ()        => get('/admin/employees'),
  addEmployee:    b         => post('/admin/employees', b),
  updateEmployee: (id, b)   => patch(`/admin/employees/${id}`, b),
  deleteEmployee: id        => del(`/admin/employees/${id}`),

  // ── Admin — Salaries ──────────────────────────────────────────
  getSalaries:   ()  => get('/admin/salaries'),
  addSalary:     b   => post('/admin/salaries', b),
  toggleSalary:  id  => patch(`/admin/salaries/${id}/toggle`),
  deleteSalary:  id  => del(`/admin/salaries/${id}`),

  // ── Admin — Credentials / Users ───────────────────────────────
  getCredentials:   ()           => get('/admin/credentials'),
  addCredential:    b            => post('/admin/credentials', b),
  deleteCredential: id           => del(`/admin/credentials/${id}`),
  setUserActive:    (id, isActive) => patch(`/admin/users/${id}/status`, { isActive }),

  // ── Admin — Suppliers ─────────────────────────────────────────
  getSuppliers:   ()  => get('/admin/suppliers'),
  addSupplier:    b   => post('/admin/suppliers', b),
  deleteSupplier: u   => del(`/admin/suppliers/${u}`),

  // ── Admin — Projects ──────────────────────────────────────────
  getProjects:   ()  => get('/admin/projects'),
  addProject:    b   => post('/admin/projects', b),
  deleteProject: id  => del(`/admin/projects/${id}`),

  // ── Admin — Invoices ──────────────────────────────────────────
  getMessages:          params => {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    const qs = search.toString();
    return get(`/admin/messages${qs ? `?${qs}` : ''}`);
  },
  updateMessageStatus:  (id, status) => patch(`/admin/messages/${id}/status`, { status }),
  deleteMessage:        id => del(`/admin/messages/${id}`),

  getInvoices:         (page = 1)    => get(`/admin/invoices?page=${page}`),
  updateInvoiceStatus: (id, status)  => patch(`/admin/invoices/${id}/status`, { status }),
  deleteInvoice:       id            => del(`/admin/invoices/${id}`),
};
