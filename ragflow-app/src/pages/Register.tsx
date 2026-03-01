/**
 * Register – collect name, email and password, call the register API,
 * then redirect to /verify with the pending email stored in sessionStorage.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || undefined,
      });

      // Store email so the verify page knows what to verify.
      sessionStorage.setItem('pending_email', form.email);

      // In dev mode the API returns a simulated_code — surface it so the tester can proceed.
      const simCode = res.simulated_code
        ? `\n\nDev tip: your code is ${res.simulated_code}`
        : '';
      navigate('/verify', { state: { message: res.message + simCode } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">RAGFlow</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">
          Already have an account?{' '}
          <Link to="/" className="home-link">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-row">
            <label className="form-label">
              First Name
              <input
                type="text"
                className="form-input"
                value={form.first_name}
                onChange={set('first_name')}
                required
                minLength={1}
                maxLength={100}
              />
            </label>
            <label className="form-label">
              Last Name
              <input
                type="text"
                className="form-input"
                value={form.last_name}
                onChange={set('last_name')}
                required
                minLength={1}
                maxLength={100}
              />
            </label>
          </div>

          <label className="form-label">
            Email
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={set('email')}
              placeholder="you@company.com"
              required
            />
          </label>

          <label className="form-label">
            Phone <span className="form-optional">(optional)</span>
            <input
              type="tel"
              className="form-input"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+1-555-000-1234"
            />
          </label>

          <label className="form-label">
            Password
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={set('password')}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              maxLength={128}
            />
          </label>

          <label className="form-label">
            Confirm Password
            <input
              type="password"
              className="form-input"
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Re-enter password"
              required
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary-full"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
