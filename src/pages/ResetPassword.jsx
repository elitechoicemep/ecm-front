import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const inp = 'w-full px-4 py-3 bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/20 transition-colors text-[14px]';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token,    setToken]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) setErr('Invalid or missing reset token. Request a new link.');
    else setToken(t);
  }, []);

  const submit = async () => {
    if (!password) { setErr('Enter a new password.'); return; }
    if (password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setErr('Passwords do not match.'); return; }
    setLoading(true); setErr('');
    try {
      await api.resetPassword({ token, password });
      setDone(true);
    } catch (e) {
      setErr(e.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-[68px] bg-[#0B1D33] flex items-center justify-center px-5 pb-10"
      style={{ background: 'radial-gradient(ellipse at 70% 0%, rgba(200,146,42,0.08) 0%, transparent 55%), #0B1D33' }}
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-[#0B1D33]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <h1 className="font-condensed text-[26px] font-extrabold text-white tracking-[0.5px]">Set New Password</h1>
          <p className="text-[13px] text-white/50 mt-1">Elite Choice Electromechanical — Dashboard</p>
        </div>

        <div className="bg-[#112540]/90 border border-[#C8922A]/18 rounded-2xl p-9 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-2">Password updated!</h3>
              <p className="text-[13px] text-white/50 mb-6">Your password has been reset. You can now sign in with your new password.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 font-bold text-[13px] text-[#0B1D33] rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              {err && !token ? (
                <div className="text-center py-4">
                  <p className="text-red-400 text-[13px] mb-5">{err}</p>
                  <button onClick={() => navigate('/dashboard')} className="text-[12px] text-[#C8922A] hover:underline">← Back to Dashboard</button>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={inp}
                      onKeyDown={e => e.key === 'Enter' && submit()}
                    />
                  </div>

                  <div className="mt-4 mb-2">
                    <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      placeholder="Repeat new password"
                      className={inp}
                      onKeyDown={e => e.key === 'Enter' && submit()}
                    />
                  </div>

                  {err && <p className="text-red-400 text-[12px] mt-2 mb-1 text-center">{err}</p>}

                  <button
                    onClick={submit}
                    disabled={loading || !token}
                    className="w-full py-[13px] mt-4 font-bold text-[14px] text-[#0B1D33] disabled:opacity-50 transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
                  >
                    {loading ? 'Updating…' : 'Reset Password'}
                  </button>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full mt-3 text-[12px] text-white/40 hover:text-white transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

