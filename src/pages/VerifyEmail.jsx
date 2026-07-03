import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const inp = 'w-full px-4 py-3 bg-[#0B1D33]/80 border border-[#C8922A]/25 text-white placeholder-white/30 focus:border-[#C8922A] focus:outline-none focus:ring-1 focus:ring-[#C8922A]/20 transition-colors text-[14px]';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [status,  setStatus]  = useState('error');
  const [message, setMessage] = useState('');
  const [email,   setEmail]   = useState('');
  const [resent,  setResent]  = useState(false);
  const [resendErr, setResendErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get('status') === 'success' ? 'success' : 'error');
    setMessage(params.get('message') || 'Verification link is invalid or has expired.');
  }, []);

  const resend = async () => {
    if (!email) { setResendErr('Enter your email address.'); return; }
    setLoading(true); setResendErr('');
    try {
      await api.resendVerification({ email });
      setResent(true);
    } catch (e) {
      setResendErr(e.message || 'Failed to resend. Try again later.');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 className="font-condensed text-[26px] font-extrabold text-white tracking-[0.5px]">Email Verification</h1>
          <p className="text-[13px] text-white/50 mt-1">Elite Choice Electromechanical — Dashboard</p>
        </div>

        <div className="bg-[#112540]/90 border border-[#C8922A]/18 rounded-2xl p-9 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-2">Email verified!</h3>
              <p className="text-[13px] text-white/50 mb-6">Your email address has been confirmed. You can now sign in to your account.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 font-bold text-[13px] text-[#0B1D33] rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                Go to Sign In
              </button>
            </div>
          ) : resent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-2">Check your inbox</h3>
              <p className="text-[13px] text-white/50 mb-6">If that email is registered and unverified, a new verification link has been sent.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[12px] text-[#C8922A] hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/15 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
              <h3 className="font-condensed text-[20px] font-extrabold text-white mb-2">Verification failed</h3>
              <p className="text-[13px] text-white/50 mb-6">{message}</p>

              <label className="block text-[11px] font-bold tracking-[1px] uppercase text-white/50 mb-2 text-left">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inp}
                onKeyDown={e => e.key === 'Enter' && resend()}
              />
              {resendErr && <p className="text-red-400 text-[12px] mt-2 mb-1 text-center">{resendErr}</p>}

              <button
                onClick={resend}
                disabled={loading}
                className="w-full py-[13px] mt-4 font-bold text-[14px] text-[#0B1D33] disabled:opacity-50 transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#C8922A,#E5A93A)' }}
              >
                {loading ? 'Sending…' : 'Resend Verification Email'}
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full mt-3 text-[12px] text-white/40 hover:text-white transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}