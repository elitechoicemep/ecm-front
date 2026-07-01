import { useState } from 'react';
import { Field } from './Field';
import { Toast } from './Toast';
import { inp } from './utils';
import { api } from '../../api';

/* Three screens: 'login' | 'forgot' | 'sent' */
export function LoginScreen({ loginErr, loginLoading, loginForm, doLogin, toast }) {
  const [screen,    setScreen]    = useState('login');
  const [fEmail,    setFEmail]    = useState('');
  const [fLoading,  setFLoading]  = useState(false);
  const [fErr,      setFErr]      = useState('');

  const sendReset = async () => {
    if (!fEmail.trim()) { setFErr('Please enter your email address.'); return; }
    setFLoading(true); setFErr('');
    try {
      await api.forgotPassword({ email: fEmail.trim() });
      setScreen('sent');
    } catch (err) {
      setFErr(err.message || 'Something went wrong. Try again.');
    } finally {
      setFLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-[68px] bg-[#0B1D33] flex items-center justify-center px-5 pb-10"
      style={{ background: 'radial-gradient(ellipse at 70% 0%, rgba(200,146,42,0.08) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(200,146,42,0.05) 0%, transparent 50%), #0B1D33' }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-9">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#0B1D33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 className="font-condensed text-[26px] font-extrabold text-white tracking-[0.5px]">Dashboard</h1>
          <p className="text-[13px] text-white/50 mt-1">Salary &amp; payroll management</p>
          <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C8922A] mt-2">Elite Choice Electromechanical</p>
        </div>

        <div className="bg-[#112540]/90 border border-[#C8922A]/18 rounded-2xl p-9 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.4)]">

          {/* ── Login screen ── */}
          {screen === 'login' && (
            <>
              <Field label="Username">
                <input
                  value={loginForm.values.username}
                  onChange={loginForm.set('username')}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className={inp}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                />
              </Field>

              <div className="mt-4 mb-2">
                <Field label="Password">
                  <input
                    type="password"
                    value={loginForm.values.password}
                    onChange={loginForm.set('password')}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={inp}
                    onKeyDown={e => e.key === 'Enter' && doLogin()}
                  />
                </Field>
              </div>

              {loginErr && <p className="text-red-400 text-[12px] mb-2 text-center">{loginErr}</p>}

              <button
                onClick={doLogin}
                disabled={loginLoading}
                className="w-full py-[13px] mt-2 font-bold text-[14px] tracking-[0.3px] text-[#0B1D33] disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                {loginLoading ? 'Signing in…' : 'Sign In'}
              </button>

              <button
                onClick={() => { setScreen('forgot'); setFErr(''); setFEmail(''); }}
                className="w-full mt-4 text-[12px] text-white/40 hover:text-[#C8922A] transition-colors"
              >
                Forgot password?
              </button>
            </>
          )}

          {/* ── Forgot password screen ── */}
          {screen === 'forgot' && (
            <>
              <div className="mb-5">
                <h3 className="font-condensed text-[18px] font-extrabold text-white mb-1">Reset Password</h3>
                <p className="text-[12px] text-white/50">Enter your registered email and we'll send a reset link.</p>
              </div>

              <Field label="Email Address">
                <input
                  type="email"
                  value={fEmail}
                  onChange={e => setFEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={inp}
                  onKeyDown={e => e.key === 'Enter' && sendReset()}
                />
              </Field>

              {fErr && <p className="text-red-400 text-[12px] mt-2 text-center">{fErr}</p>}

              <button
                onClick={sendReset}
                disabled={fLoading}
                className="w-full py-[13px] mt-4 font-bold text-[14px] text-[#0B1D33] disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                {fLoading ? 'Sending…' : 'Send Reset Link'}
              </button>

              <button
                onClick={() => setScreen('login')}
                className="w-full mt-3 text-[12px] text-white/40 hover:text-white transition-colors"
              >
                ← Back to Sign In
              </button>
            </>
          )}

          {/* ── Sent confirmation ── */}
          {screen === 'sent' && (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[18px] font-extrabold text-white mb-2">Check your email</h3>
              <p className="text-[13px] text-white/50 mb-6 leading-relaxed">
                If <span className="text-white/80">{fEmail}</span> is registered, a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <button
                onClick={() => { setScreen('login'); setFEmail(''); }}
                className="text-[12px] text-[#C8922A] hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          )}

        </div>
      </div>
      <Toast {...toast} />
    </div>
  );
}

