/**
 * Home – public landing page for RAGFlow.
 * Shows a high-level product description and a login form.
 * Users can also navigate to /register to create an account.
 */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const navigate = useNavigate();
  const { saveToken, isAuthenticated } = useAuth();

  // If already logged in, skip straight to the app.
  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      saveToken(res.access_token);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      {/* ── Nav bar ── */}
      <header className="home-nav">
        <span className="home-nav-logo">RAGFlow</span>
        <nav className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
        </nav>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="home-hero">
          <div className="home-hero-content">
            <h1 className="home-hero-title">
              Simplifying RAG for Every Enterprise
            </h1>
            <p className="home-hero-subtitle">
              RAGFlow is a multi-tenant, enterprise-ready platform that
              radically simplifies the implementation of Retrieval-Augmented
              Generation pipelines — so your teams can build AI-powered
              knowledge systems without the infrastructure headache.
            </p>
            <div className="home-hero-cta">
              <Link to="/register" className="btn-primary-lg">
                Get Started Free
              </Link>
              <a href="#features" className="btn-outline-lg">
                Learn More
              </a>
            </div>
          </div>

          {/* ── Login card ── */}
          <div className="home-login-card">
            <h2 className="home-login-title">Sign in</h2>
            <p className="home-login-sub">
              Don't have an account?{' '}
              <Link to="/register" className="home-link">
                Register
              </Link>
            </p>
            <form onSubmit={handleLogin} className="home-login-form">
              <label className="form-label">
                Email
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </label>
              <label className="form-label">
                Password
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button
                type="submit"
                className="btn-primary-full"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="home-section">
          <h2 className="home-section-title">Why RAGFlow?</h2>
          <div className="home-features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-icon">{f.icon}</div>
                <h3 className="home-feature-title">{f.title}</h3>
                <p className="home-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="home-section home-section-dark">
          <h2 className="home-section-title">How It Works</h2>
          <div className="home-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="home-step">
                <div className="home-step-num">{i + 1}</div>
                <h3 className="home-step-title">{s.title}</h3>
                <p className="home-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="home-section">
          <h2 className="home-section-title">Simple Pricing</h2>
          <div className="home-pricing-grid">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`home-plan-card${p.featured ? ' home-plan-featured' : ''}`}
              >
                <div className="home-plan-name">{p.name}</div>
                <div className="home-plan-price">{p.price}</div>
                <ul className="home-plan-features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={p.featured ? 'btn-primary-full' : 'btn-outline-full'}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <span className="home-nav-logo">RAGFlow</span>
        <p>&copy; {new Date().getFullYear()} RAGFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}

/* ── Static data ── */

const FEATURES = [
  {
    icon: '🔗',
    title: 'Pipeline Builder',
    desc: 'Visually configure end-to-end RAG pipelines — from document ingestion to retrieval — with no infrastructure code.',
  },
  {
    icon: '🗄️',
    title: 'Vector Store Management',
    desc: 'Connect to Pinecone, Weaviate, Qdrant or pgvector. Switch providers without re-indexing your documents.',
  },
  {
    icon: '🤖',
    title: 'Embedding Model Agnostic',
    desc: 'Supports OpenAI, Cohere, Voyage, and local models. Swap providers at any time with a single config change.',
  },
  {
    icon: '🏢',
    title: 'Multi-Tenant Ready',
    desc: 'Purpose-built tenant isolation from day one. Safe for enterprise deployments and multi-team environments.',
  },
  {
    icon: '📡',
    title: 'REST API & Python SDK',
    desc: 'Query your pipelines programmatically from any AI agent. Consistent interface regardless of the underlying stack.',
  },
  {
    icon: '🔒',
    title: 'Self-Hosted or SaaS',
    desc: 'Deploy on your own cloud for full data sovereignty, or use our managed SaaS for instant access.',
  },
];

const STEPS = [
  {
    title: 'Create a Pipeline',
    desc: 'Name your pipeline, choose an embedding model, upload documents, and configure chunking — all in a guided wizard.',
  },
  {
    title: 'Index Your Documents',
    desc: 'RAGFlow automatically chunks, embeds, and indexes your content into the vector store of your choice.',
  },
  {
    title: 'Test Retrieval',
    desc: 'Use the built-in retrieval test tool to verify result quality before shipping to production.',
  },
  {
    title: 'Integrate via API',
    desc: 'Call your pipeline from any LLM agent using your API key and our simple REST endpoint.',
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    cta: 'Get Started',
    featured: false,
    features: ['1 pipeline', '10K documents', '1M API calls/mo', 'Community support'],
  },
  {
    name: 'Growth',
    price: '$99 / mo',
    cta: 'Start Trial',
    featured: true,
    features: ['10 pipelines', '1M documents', '10M API calls/mo', 'Email support', 'Analytics dashboard'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cta: 'Contact Us',
    featured: false,
    features: ['Unlimited pipelines', 'Self-hosted option', 'SOC 2 / ISO 27001', 'Dedicated SLA'],
  },
];
