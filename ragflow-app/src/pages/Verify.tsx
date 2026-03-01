/**
 * Verify – accept a 6-digit code sent to the user's email.
 * After a successful verification the user is prompted to sign in.
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verify } from '../api/auth';

export function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  // Message passed from Register page (includes dev simulated_code hint)
  const initMessage =
    (location.state as { message?: string } | null)?.message ?? '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const email = sessionStorage.getItem('pending_email') ?? '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code sent to your email.');
      return;
    }
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setLoading(true);
    try {
      const res = await verify({ email, code });
      setSuccess(res.message ?? 'Email verified! You can now sign in.');
      sessionStorage.removeItem('pending_email');
      // Short delay then redirect to login
      setTimeout(() => navigate('/', { replace: true }), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">RAGFlow</div>
        <h1 className="auth-title">Verify your email</h1>

        {initMessage && (
          <div className="auth-info-box">
            <pre className="auth-info-pre">{initMessage}</pre>
          </div>
        )}

        {email && (
          <p className="auth-sub">
            We sent a code to <strong>{email}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="form-label">
            6-Digit Code
            <input
              type="text"
              className="form-input form-input-code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="000000"
              required
              maxLength={6}
              inputMode="numeric"
              pattern="\d{6}"
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button
            type="submit"
            className="btn-primary-full"
            disabled={loading || !!success}
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>

        <p className="auth-sub" style={{ marginTop: '1rem' }}>
          <Link to="/register" className="home-link">
            Back to Register
          </Link>
        </p>
      </div>
    </div>
  );
}
