import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --ink: #0A0E1A;
    --ink2: #1A2035;
    --surface: #F4F5F8;
    --surface2: #ECEEF3;
    --border: #E0E3EB;
    --accent: #3B5BFF;
    --accent2: #00D4AA;
    --accent3: #FF6B4A;
    --muted: #8892A4;
    --white: #FFFFFF;
    --success: #00C48C;
    --warning: #FFB020;
    --error: #FF4D6A;
    --sidebar-w: 220px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--surface); color: var(--ink); }

  .shell { display: flex; height: 100vh; overflow: hidden; }

  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--ink);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .sidebar::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 180px; height: 180px;
    background: radial-gradient(circle, rgba(59,91,255,0.25) 0%, transparent 70%);
    pointer-events: none;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--white);
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .logo-mark {
    width: 32px; height: 32px;
    background: var(--accent);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800; color: white;
  }
  .sidebar-section { padding: 16px 12px 8px; }
  .sidebar-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(255,255,255,0.3);
    padding: 0 8px; margin-bottom: 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px;
    font-size: 13.5px; font-weight: 400; color: rgba(255,255,255,0.55);
    cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
    user-select: none;
  }
  .nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
  .nav-item.active { background: var(--accent); color: white; font-weight: 500; }
  .nav-item svg { width: 16px; height: 16px; flex-shrink: 0; opacity: 0.8; }
  .nav-badge {
    margin-left: auto; background: var(--accent2);
    color: var(--ink); font-size: 10px; font-weight: 700;
    padding: 1px 7px; border-radius: 99px;
  }
  .sidebar-footer {
    margin-top: auto; padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .user-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: 8px;
    cursor: pointer;
  }
  .user-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, #3B5BFF, #00D4AA);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,0.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 10.5px; color: rgba(255,255,255,0.35); }

  /* Main content area */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    background: var(--white); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 58px;
    display: flex; align-items: center; gap: 16px; flex-shrink: 0;
  }
  .page-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; }
  .topbar-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .content { flex: 1; overflow-y: auto; padding: 28px; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 8px; font-size: 13.5px;
    font-weight: 500; cursor: pointer; transition: all 0.15s;
    border: none; font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #2a47f0; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(59,91,255,0.35); }
  .btn-secondary { background: var(--surface2); color: var(--ink); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--border); }
  .btn-ghost { background: transparent; color: var(--muted); }
  .btn-ghost:hover { color: var(--ink); background: var(--surface2); }
  .btn-sm { padding: 6px 13px; font-size: 12.5px; }
  .btn-danger { background: #fff0f2; color: var(--error); border: 1px solid #ffd6dc; }

  /* Cards */
  .card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px;
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--white); border: 1px solid var(--border); border-radius: 12px;
    padding: 20px 22px; position: relative; overflow: hidden;
  }
  .stat-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-card.blue::after { background: var(--accent); }
  .stat-card.green::after { background: var(--accent2); }
  .stat-card.orange::after { background: var(--accent3); }
  .stat-card.purple::after { background: #9B5FFF; }
  .stat-label { font-size: 12px; color: var(--muted); font-weight: 500; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.06em; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 700; line-height: 1; }
  .stat-sub { font-size: 12px; color: var(--muted); margin-top: 6px; }
  .stat-trend { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; font-weight: 600; }
  .trend-up { color: var(--success); }
  .trend-down { color: var(--error); }

  /* Pipeline list */
  .pipeline-table { width: 100%; border-collapse: collapse; }
  .pipeline-table th {
    text-align: left; padding: 10px 16px; font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted);
    border-bottom: 1px solid var(--border); background: var(--surface);
  }
  .pipeline-table th:first-child { border-radius: 8px 0 0 0; }
  .pipeline-table th:last-child { border-radius: 0 8px 0 0; }
  .pipeline-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 13.5px; vertical-align: middle; }
  .pipeline-table tr:last-child td { border-bottom: none; }
  .pipeline-table tr:hover td { background: #F9FAFB; }
  .pipeline-name { font-weight: 600; font-size: 13.5px; }
  .pipeline-desc { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* Status badges */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 99px; font-size: 11.5px; font-weight: 600;
  }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; }
  .badge.active { background: #E6FBF5; color: #00A87A; }
  .badge.active .badge-dot { background: var(--success); }
  .badge.indexing { background: #EEF2FF; color: var(--accent); }
  .badge.indexing .badge-dot { background: var(--accent); animation: pulse 1.2s infinite; }
  .badge.draft { background: var(--surface2); color: var(--muted); }
  .badge.draft .badge-dot { background: var(--muted); }
  .badge.error { background: #FFF0F2; color: var(--error); }
  .badge.error .badge-dot { background: var(--error); }

  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  /* Provider chips */
  .provider-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 6px; padding: 3px 9px; font-size: 11.5px; font-weight: 500; color: var(--ink2);
  }

  /* Activity feed */
  .activity-item { display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .activity-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .activity-body { flex: 1; }
  .activity-text { font-size: 13px; color: var(--ink2); }
  .activity-text strong { color: var(--ink); font-weight: 600; }
  .activity-time { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

  /* Pipeline Builder / Wizard */
  .wizard { display: flex; gap: 28px; }
  .wizard-steps {
    width: 220px; flex-shrink: 0;
    background: var(--white); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px; height: fit-content;
  }
  .wizard-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .step-item { display: flex; align-items: center; gap: 10px; padding: 10px 10px; border-radius: 8px; margin-bottom: 4px; }
  .step-item.done { opacity: 0.6; }
  .step-item.active { background: #EEF2FF; }
  .step-num {
    width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--muted); flex-shrink: 0;
  }
  .step-item.active .step-num { background: var(--accent); border-color: var(--accent); color: white; }
  .step-item.done .step-num { background: var(--success); border-color: var(--success); color: white; }
  .step-label { font-size: 13px; font-weight: 500; color: var(--muted); }
  .step-item.active .step-label { color: var(--accent); font-weight: 600; }
  .step-item.done .step-label { color: var(--ink); }

  .wizard-content { flex: 1; }
  .form-group { margin-bottom: 20px; }
  .form-label { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 6px; display: block; }
  .form-sublabel { font-size: 11.5px; color: var(--muted); margin-top: 4px; }
  .form-input {
    width: 100%; padding: 10px 13px; border: 1.5px solid var(--border); border-radius: 8px;
    font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: var(--ink);
    background: var(--white); outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59,91,255,0.1); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%238892A4' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }

  /* Provider cards */
  .provider-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .provider-card {
    border: 2px solid var(--border); border-radius: 10px; padding: 14px;
    cursor: pointer; transition: all 0.15s;
  }
  .provider-card:hover { border-color: var(--accent); background: #f8f9ff; }
  .provider-card.selected { border-color: var(--accent); background: #EEF2FF; }
  .provider-card-logo { font-size: 22px; margin-bottom: 8px; }
  .provider-card-name { font-size: 13px; font-weight: 600; }
  .provider-card-desc { font-size: 11.5px; color: var(--muted); margin-top: 3px; }
  .provider-check {
    width: 18px; height: 18px; border-radius: 50%; background: var(--accent);
    color: white; display: flex; align-items: center; justify-content: center;
    font-size: 10px; float: right; margin-top: -4px;
  }

  /* Chunking strategy cards */
  .strategy-list { display: flex; flex-direction: column; gap: 8px; }
  .strategy-card {
    border: 2px solid var(--border); border-radius: 10px; padding: 13px 16px;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 12px;
  }
  .strategy-card:hover { border-color: var(--accent); }
  .strategy-card.selected { border-color: var(--accent); background: #EEF2FF; }
  .strategy-icon { font-size: 20px; flex-shrink: 0; }
  .strategy-name { font-size: 13.5px; font-weight: 600; }
  .strategy-desc { font-size: 12px; color: var(--muted); }
  .radio-dot {
    width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border);
    margin-left: auto; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  }
  .strategy-card.selected .radio-dot { border-color: var(--accent); background: var(--accent); }
  .radio-dot::after { content: ''; width: 7px; height: 7px; border-radius: 50%; background: white; }

  /* Upload area */
  .upload-zone {
    border: 2px dashed var(--border); border-radius: 12px;
    padding: 40px 24px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: var(--surface);
  }
  .upload-zone:hover { border-color: var(--accent); background: #f8f9ff; }
  .upload-icon { font-size: 36px; margin-bottom: 12px; }
  .upload-title { font-size: 15px; font-weight: 600; margin-bottom: 5px; }
  .upload-sub { font-size: 13px; color: var(--muted); }
  .file-chip {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 12px; font-size: 13px; font-weight: 500; margin: 4px;
  }
  .file-remove { color: var(--muted); cursor: pointer; font-size: 16px; line-height: 1; }
  .file-remove:hover { color: var(--error); }

  /* Index params */
  .param-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .range-input { width: 100%; accent-color: var(--accent); }
  .range-value { font-size: 12px; color: var(--accent); font-weight: 600; font-family: 'DM Mono', monospace; }

  /* API Keys screen */
  .apikey-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; border-bottom: 1px solid var(--border);
  }
  .apikey-row:last-child { border-bottom: none; }
  .key-badge {
    font-family: 'DM Mono', monospace; font-size: 12.5px;
    background: var(--surface2); border: 1px solid var(--border);
    padding: 5px 10px; border-radius: 6px; flex: 1;
  }
  .scope-tag {
    display: inline-flex; align-items: center;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 5px; padding: 2px 8px; font-size: 11.5px; font-weight: 500;
  }

  /* Usage chart mock */
  .chart-bars { display: flex; align-items: flex-end; gap: 6px; height: 80px; }
  .chart-bar {
    flex: 1; border-radius: 4px 4px 0 0;
    background: linear-gradient(180deg, var(--accent) 0%, rgba(59,91,255,0.4) 100%);
    transition: opacity 0.15s; cursor: pointer;
  }
  .chart-bar:hover { opacity: 0.8; }
  .chart-labels { display: flex; gap: 6px; margin-top: 6px; }
  .chart-label { flex: 1; text-align: center; font-size: 10px; color: var(--muted); }

  /* Nav tabs */
  .tab-bar { display: flex; gap: 0; border-bottom: 2px solid var(--border); margin-bottom: 24px; }
  .tab {
    padding: 10px 20px; font-size: 13.5px; font-weight: 500; color: var(--muted);
    cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px;
    transition: all 0.15s;
  }
  .tab:hover { color: var(--ink); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

  /* Notification dot */
  .notif-dot {
    width: 8px; height: 8px; background: var(--error); border-radius: 50%; display: inline-block;
  }

  /* Retrieve test panel */
  .test-panel { background: var(--ink); border-radius: 12px; padding: 20px; color: white; }
  .test-query { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 12px; font-family: 'DM Mono', monospace; font-size: 13px; color: rgba(255,255,255,0.85); width: 100%; outline: none; resize: none; }
  .result-chunk {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px; padding: 14px; margin-top: 12px;
  }
  .chunk-score { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent2); font-weight: 600; }
  .chunk-source { font-size: 11px; color: rgba(255,255,255,0.4); }
  .chunk-text { font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 8px; line-height: 1.6; }
  .score-bar { height: 3px; background: rgba(255,255,255,0.1); border-radius: 99px; margin-top: 8px; }
  .score-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent2), var(--accent)); }

  /* Progress bar */
  .progress-outer { background: var(--surface2); border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-inner { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.5s; }

  /* 2-col grid */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* Breadcrumb */
  .breadcrumb { font-size: 12.5px; color: var(--muted); display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
  .breadcrumb span { color: var(--ink); font-weight: 500; }
  .crumb-sep { color: var(--border); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* Tenant selector */
  .tenant-bar {
    background: var(--ink2); padding: 6px 20px;
    display: flex; align-items: center; gap: 10px; font-size: 12px; color: rgba(255,255,255,0.5);
  }
  .tenant-name { color: rgba(255,255,255,0.85); font-weight: 500; }
  .tenant-plan { background: var(--accent); color: white; border-radius: 99px; padding: 1px 8px; font-size: 10.5px; font-weight: 600; }

  /* Empty state */
  .empty-state { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .empty-sub { font-size: 14px; color: var(--muted); max-width: 300px; margin: 0 auto 20px; }

  /* Tooltip-like info box */
  .info-box {
    background: #EEF2FF; border: 1px solid rgba(59,91,255,0.2);
    border-radius: 8px; padding: 12px 14px;
    font-size: 12.5px; color: var(--ink2); line-height: 1.5;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .info-box-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
`;

// ─── Icons ───
const Icon = ({ name }) => {
  const icons = {
    dashboard: "▦",
    pipelines: "⟶",
    documents: "⊞",
    embeddings: "◈",
    vectordb: "⬡",
    apikeys: "⬗",
    settings: "◎",
    plus: "+",
    search: "⌕",
    bell: "🔔",
    run: "▶",
    test: "⚡",
    edit: "✎",
    trash: "⊗",
    copy: "⎘",
    check: "✓",
    eye: "◉",
    upload: "↑",
    refresh: "↻",
    filter: "⊟",
    arrow: "→",
    lock: "⚿",
    users: "◑",
    chart: "▥",
    tenant: "⊕",
    code: "</>",
    key: "⚷",
  };
  return <span>{icons[name] || "•"}</span>;
};

// ─── Status Badge ───
const Badge = ({ status }) => (
  <span className={`badge ${status}`}>
    <span className="badge-dot" />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

// ─── Sidebar ───
const Sidebar = ({ active, setActive }) => {
  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "pipelines", icon: "pipelines", label: "Pipelines", badge: "4" },
    { id: "builder", icon: "plus", label: "New Pipeline" },
    { id: "documents", icon: "documents", label: "Documents" },
    { id: "embeddings", icon: "embeddings", label: "Embeddings" },
    { id: "vectordb", icon: "vectordb", label: "Vector Stores" },
    { id: "apikeys", icon: "apikeys", label: "API Keys" },
    { id: "retrieve-test", icon: "test", label: "Test Retrieval" },
    { id: "settings", icon: "settings", label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">R</div>
        RAGFlow
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        {navItems.slice(0, 3).map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <Icon name={item.icon} />
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Configuration</div>
        {navItems.slice(3, 7).map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <Icon name={item.icon} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Developer</div>
        {navItems.slice(7).map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
            <Icon name={item.icon} />
            {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <div className="user-name">Jordan Dev</div>
            <div className="user-role">Pipeline Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard Screen ───
const DashboardScreen = ({ setActive }) => {
  const barHeights = [30, 45, 38, 60, 52, 75, 68, 80, 55, 70, 62, 78];
  const days = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F"];
  return (
    <div>
      <div className="tenant-bar">
        <Icon name="tenant" /> Tenant: <span className="tenant-name">Acme Corp</span>
        <span className="tenant-plan">Professional</span>
        <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)" }}>Last sync: 2 min ago</span>
      </div>
      <div className="topbar">
        <span className="page-title">Dashboard</span>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm"><Icon name="search" /> Search</button>
          <button className="btn btn-secondary btn-sm"><Icon name="bell" /> Alerts</button>
          <button className="btn btn-primary btn-sm" onClick={() => setActive("builder")}><Icon name="plus" /> New Pipeline</button>
        </div>
      </div>
      <div className="content">
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-label">Active Pipelines</div>
            <div className="stat-value">12</div>
            <div className="stat-sub"><span className="stat-trend trend-up">↑ 3</span> this month</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Indexed Chunks</div>
            <div className="stat-value">284K</div>
            <div className="stat-sub"><span className="stat-trend trend-up">↑ 12%</span> vs last week</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-label">API Calls Today</div>
            <div className="stat-value">41.2K</div>
            <div className="stat-sub"><span className="stat-trend trend-up">↑ 8%</span> vs yesterday</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-label">Avg Latency (P95)</div>
            <div className="stat-value">187ms</div>
            <div className="stat-sub"><span className="stat-trend trend-up" style={{ color: "var(--success)" }}>↓ 22ms</span> improvement</div>
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-header">
              <span className="card-title">API Call Volume</span>
              <div className="tab-bar" style={{ margin: 0, border: "none" }}>
                {["7d", "30d", "90d"].map(t => (
                  <div key={t} className={`tab ${t === "7d" ? "active" : ""}`} style={{ padding: "4px 10px", fontSize: "12px" }}>{t}</div>
                ))}
              </div>
            </div>
            <div className="chart-bars">
              {barHeights.map((h, i) => <div key={i} className="chart-bar" style={{ height: `${h}%` }} />)}
            </div>
            <div className="chart-labels">
              {days.map((d, i) => <div key={i} className="chart-label">{d}</div>)}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Activity</span>
              <button className="btn btn-ghost btn-sm">View all</button>
            </div>
            {[
              { icon: "▶", bg: "#EEF2FF", text: <><strong>HR Policy Pipeline</strong> finished indexing — 12,400 chunks added</>, time: "3 min ago" },
              { icon: "↑", bg: "#E6FBF5", text: <><strong>jordan@acme.com</strong> uploaded 5 documents to Legal Docs</>, time: "18 min ago" },
              { icon: "⚷", bg: "#FFF5E6", text: <>New API key <strong>rf_...4a2f</strong> created (Read-only)</>, time: "1 hr ago" },
              { icon: "◈", bg: "#F3EEFF", text: <>Embedding model switched to <strong>text-embedding-3-large</strong> on Contracts Pipeline</>, time: "4 hr ago" },
              { icon: "⊗", bg: "#FFF0F2", text: <><strong>Staging Pipeline</strong> encountered an error — re-indexing</>, time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div className="activity-body">
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }} className="card">
          <div className="card-header">
            <span className="card-title">Active Pipelines</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setActive("pipelines")}>View all →</button>
          </div>
          <table className="pipeline-table">
            <thead>
              <tr>
                <th>Pipeline Name</th>
                <th>Embedding Model</th>
                <th>Vector Store</th>
                <th>Chunks</th>
                <th>Status</th>
                <th>Last Run</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "HR Policy Documents", desc: "Employee handbook & benefits", emb: "OpenAI 3-small", db: "Pinecone", chunks: "12,400", status: "active", last: "10 min ago" },
                { name: "Legal Contracts", desc: "NDAs, MSAs, vendor agreements", emb: "Cohere Embed v3", db: "Qdrant", chunks: "38,900", status: "active", last: "2 hr ago" },
                { name: "Product Knowledge Base", desc: "Docs, FAQs, release notes", emb: "OpenAI 3-large", db: "pgvector", chunks: "94,200", status: "indexing", last: "Running..." },
                { name: "Support Tickets Archive", desc: "Historical tickets 2020-2024", emb: "OpenAI 3-small", db: "Weaviate", chunks: "201,000", status: "active", last: "1 day ago" },
              ].map((p, i) => (
                <tr key={i}>
                  <td>
                    <div className="pipeline-name">{p.name}</div>
                    <div className="pipeline-desc">{p.desc}</div>
                  </td>
                  <td><span className="provider-chip">◈ {p.emb}</span></td>
                  <td><span className="provider-chip">⬡ {p.db}</span></td>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>{p.chunks}</td>
                  <td><Badge status={p.status} /></td>
                  <td style={{ color: "var(--muted)", fontSize: "12.5px" }}>{p.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Pipeline List Screen ───
const PipelinesScreen = ({ setActive }) => {
  const [activeTab, setActiveTab] = useState("all");
  const pipelines = [
    { name: "HR Policy Documents", desc: "Employee handbook & benefits", emb: "OpenAI 3-small", db: "Pinecone", chunks: "12,400", status: "active", last: "10 min ago", owner: "Jordan Dev" },
    { name: "Legal Contracts", desc: "NDAs, MSAs, vendor agreements", emb: "Cohere Embed v3", db: "Qdrant", chunks: "38,900", status: "active", last: "2 hr ago", owner: "Priya Shah" },
    { name: "Product Knowledge Base", desc: "Docs, FAQs, release notes", emb: "OpenAI 3-large", db: "pgvector", chunks: "94,200", status: "indexing", last: "Running…", owner: "Alex Lee" },
    { name: "Support Tickets Archive", desc: "Historical tickets 2020-2024", emb: "OpenAI 3-small", db: "Weaviate", chunks: "201,000", status: "active", last: "1 day ago", owner: "Jordan Dev" },
    { name: "Compliance Docs Q4", desc: "Regulatory compliance documents", emb: "HuggingFace E5", db: "Chroma", chunks: "7,800", status: "draft", last: "Never", owner: "Priya Shah" },
    { name: "Onboarding Materials", desc: "New hire docs and training", emb: "OpenAI 3-small", db: "Pinecone", chunks: "0", status: "error", last: "Failed", owner: "Alex Lee" },
  ];
  return (
    <div>
      <div className="topbar">
        <span className="page-title">Pipelines</span>
        <div className="topbar-actions">
          <button className="btn btn-secondary btn-sm"><Icon name="filter" /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={() => setActive("builder")}><Icon name="plus" /> New Pipeline</button>
        </div>
      </div>
      <div className="content">
        <div className="tab-bar">
          {[["all", "All Pipelines", 6], ["active", "Active", 3], ["indexing", "Indexing", 1], ["draft", "Draft", 1], ["error", "Error", 1]].map(([id, label, count]) => (
            <div key={id} className={`tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
              {label} <span style={{ fontSize: "11px", background: "var(--surface2)", padding: "1px 6px", borderRadius: "99px", marginLeft: 4 }}>{count}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <table className="pipeline-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Pipeline</th>
                <th>Embedding</th>
                <th>Vector Store</th>
                <th>Chunks</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Last Run</th>
                <th style={{ textAlign: "right", paddingRight: 20 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((p, i) => (
                <tr key={i}>
                  <td style={{ paddingLeft: 20 }}>
                    <div className="pipeline-name">{p.name}</div>
                    <div className="pipeline-desc">{p.desc}</div>
                  </td>
                  <td><span className="provider-chip">◈ {p.emb}</span></td>
                  <td><span className="provider-chip">⬡ {p.db}</span></td>
                  <td style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px" }}>{p.chunks}</td>
                  <td style={{ fontSize: "12.5px", color: "var(--muted)" }}>{p.owner}</td>
                  <td><Badge status={p.status} /></td>
                  <td style={{ color: "var(--muted)", fontSize: "12.5px" }}>{p.last}</td>
                  <td style={{ textAlign: "right", paddingRight: 16 }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      <button className="btn btn-secondary btn-sm"><Icon name="run" /> Run</button>
                      <button className="btn btn-ghost btn-sm"><Icon name="test" /> Test</button>
                      <button className="btn btn-ghost btn-sm"><Icon name="edit" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Pipeline Builder Wizard ───
const BuilderScreen = () => {
  const [step, setStep] = useState(2);
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [selectedStrategy, setSelectedStrategy] = useState("paragraph");
  const [selectedModel, setSelectedModel] = useState("text-embedding-3-small");
  const [chunkSize, setChunkSize] = useState(512);
  const [overlap, setOverlap] = useState(64);
  const [topK, setTopK] = useState(5);
  const [minScore, setMinScore] = useState(0.72);
  const [files] = useState(["refund_policy_v3.pdf", "employee_handbook_2024.docx", "benefits_guide.pdf"]);

  const steps = [
    { n: 1, label: "Name & Description", done: step > 1 },
    { n: 2, label: "Embedding Model", done: step > 2 },
    { n: 3, label: "Upload Documents", done: step > 3 },
    { n: 4, label: "Chunking Strategy", done: step > 4 },
    { n: 5, label: "Vector Store", done: step > 5 },
    { n: 6, label: "Index Parameters", done: step > 6 },
    { n: 7, label: "Review & Create", done: false },
  ];

  const providers = [
    { id: "openai", logo: "🤖", name: "OpenAI", desc: "text-embedding-3-small/large" },
    { id: "cohere", logo: "⚡", name: "Cohere", desc: "embed-english-v3.0" },
    { id: "huggingface", logo: "🤗", name: "HuggingFace", desc: "all-MiniLM, E5, mpnet" },
    { id: "azure", logo: "☁️", name: "Azure OpenAI", desc: "Azure-hosted OAI models" },
    { id: "custom", logo: "⚙️", name: "Custom Endpoint", desc: "Any OpenAI-compatible API" },
  ];

  const strategies = [
    { id: "fixed", icon: "▤", name: "Fixed-Size", desc: "Split at fixed character/token count with configurable overlap" },
    { id: "sentence", icon: "☰", name: "Sentence", desc: "Split at sentence boundaries using NLP detection" },
    { id: "paragraph", icon: "¶", name: "Paragraph", desc: "Split at paragraph boundaries — best for prose and reports" },
    { id: "semantic", icon: "◎", name: "Semantic", desc: "Group semantically similar sentences using embedding similarity" },
    { id: "custom", icon: "⌗", name: "Custom Delimiter", desc: "User-defined regex or delimiter-based splitting" },
  ];

  const renderStepContent = () => {
    if (step === 1) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 20 }}>Pipeline Details</div>
        <div className="form-group">
          <label className="form-label">Pipeline Name *</label>
          <input className="form-input" defaultValue="HR Policy Documents" />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" defaultValue="Employee handbook, benefits guide, and HR policies" />
          <div className="form-sublabel">Helps your team identify this pipeline's purpose</div>
        </div>
        <div className="form-group">
          <label className="form-label">Use Case Tags</label>
          <input className="form-input" defaultValue="hr, policy, onboarding" placeholder="e.g. legal, support, internal" />
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Select Embedding Provider</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Your documents will be converted to vectors using this model. This determines retrieval quality and cost.</div>
        <div className="provider-grid" style={{ marginBottom: 20 }}>
          {providers.map(p => (
            <div key={p.id} className={`provider-card ${selectedProvider === p.id ? "selected" : ""}`} onClick={() => setSelectedProvider(p.id)}>
              {selectedProvider === p.id && <div className="provider-check">✓</div>}
              <div className="provider-card-logo">{p.logo}</div>
              <div className="provider-card-name">{p.name}</div>
              <div className="provider-card-desc">{p.desc}</div>
            </div>
          ))}
        </div>
        {selectedProvider === "openai" && (
          <div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <select className="form-input form-select" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                <option value="text-embedding-3-small">text-embedding-3-small (1536 dims, recommended)</option>
                <option value="text-embedding-3-large">text-embedding-3-large (3072 dims, best quality)</option>
                <option value="text-embedding-ada-002">text-embedding-ada-002 (legacy)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">API Key Reference</label>
              <select className="form-input form-select">
                <option>openai-api-key (configured ✓)</option>
                <option>Add new secret…</option>
              </select>
              <div className="form-sublabel">API keys are stored encrypted in your tenant's secret vault</div>
            </div>
          </div>
        )}
        <div className="info-box">
          <div className="info-box-icon">ℹ️</div>
          <div><strong>Tip:</strong> text-embedding-3-small offers a good balance of quality and cost ($0.02/1M tokens). Use 3-large for highest accuracy on technical or specialized documents.</div>
        </div>
      </div>
    );

    if (step === 3) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Upload Documents</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Supported formats: PDF, DOCX, TXT, MD, HTML, CSV, JSON</div>
        <div className="upload-zone">
          <div className="upload-icon">⬆</div>
          <div className="upload-title">Drop files here or click to browse</div>
          <div className="upload-sub">Max 50MB per file · Batch upload supported</div>
        </div>
        <div style={{ marginTop: 14, marginBottom: 6, fontSize: 13, fontWeight: 600 }}>Queued ({files.length})</div>
        <div>
          {files.map((f, i) => (
            <div key={i} className="file-chip">
              📄 {f}
              <span className="file-remove" style={{ marginLeft: 6 }}>×</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }} className="info-box">
          <div className="info-box-icon">ℹ️</div>
          <div>You can also add documents after the pipeline is created via <strong>Documents → Upload</strong>. The pipeline will auto-re-index on update.</div>
        </div>
      </div>
    );

    if (step === 4) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Chunking Strategy</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>How documents are split into indexed chunks affects retrieval quality significantly.</div>
        <div className="strategy-list" style={{ marginBottom: 20 }}>
          {strategies.map(s => (
            <div key={s.id} className={`strategy-card ${selectedStrategy === s.id ? "selected" : ""}`} onClick={() => setSelectedStrategy(s.id)}>
              <div className="strategy-icon">{s.icon}</div>
              <div>
                <div className="strategy-name">{s.name}</div>
                <div className="strategy-desc">{s.desc}</div>
              </div>
              <div className="radio-dot" />
            </div>
          ))}
        </div>
        {(selectedStrategy === "fixed" || selectedStrategy === "paragraph" || selectedStrategy === "sentence") && (
          <div className="param-grid">
            <div className="form-group">
              <label className="form-label">Chunk Size (tokens) <span className="range-value">{chunkSize}</span></label>
              <input type="range" className="range-input form-input" min="128" max="2048" step="64" value={chunkSize} onChange={e => setChunkSize(+e.target.value)} style={{ padding: "4px 0", border: "none" }} />
            </div>
            <div className="form-group">
              <label className="form-label">Overlap (tokens) <span className="range-value">{overlap}</span></label>
              <input type="range" className="range-input form-input" min="0" max="256" step="16" value={overlap} onChange={e => setOverlap(+e.target.value)} style={{ padding: "4px 0", border: "none" }} />
            </div>
          </div>
        )}
      </div>
    );

    if (step === 5) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Select Vector Store</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Choose where your document vectors will be stored and searched.</div>
        <div className="provider-grid" style={{ marginBottom: 20 }}>
          {[
            { id: "pinecone", logo: "📌", name: "Pinecone", desc: "Serverless, fully managed" },
            { id: "qdrant", logo: "🎯", name: "Qdrant", desc: "Fast, self-hostable" },
            { id: "pgvector", logo: "🐘", name: "pgvector", desc: "PostgreSQL extension" },
            { id: "weaviate", logo: "🔮", name: "Weaviate", desc: "Cloud & self-hosted" },
            { id: "chroma", logo: "🎨", name: "Chroma", desc: "Lightweight, local dev" },
            { id: "milvus", logo: "⚡", name: "Milvus", desc: "High-performance cluster" },
          ].map(p => (
            <div key={p.id} className={`provider-card ${p.id === "pgvector" ? "selected" : ""}`}>
              {p.id === "pgvector" && <div className="provider-check">✓</div>}
              <div className="provider-card-logo">{p.logo}</div>
              <div className="provider-card-name">{p.name}</div>
              <div className="provider-card-desc">{p.desc}</div>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Connection</label>
          <select className="form-input form-select">
            <option>prod-pgvector (configured ✓)</option>
            <option>Add new connection…</option>
          </select>
        </div>
      </div>
    );

    if (step === 6) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 6 }}>Index Parameters</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>Fine-tune how retrieval operates for this pipeline.</div>
        <div className="param-grid">
          <div className="form-group">
            <label className="form-label">Distance Metric</label>
            <select className="form-input form-select">
              <option>Cosine Similarity (recommended)</option>
              <option>Euclidean Distance</option>
              <option>Dot Product</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Default Top-K <span className="range-value">{topK}</span></label>
            <input type="range" className="range-input form-input" min="1" max="20" step="1" value={topK} onChange={e => setTopK(+e.target.value)} style={{ padding: "4px 0", border: "none" }} />
            <div className="form-sublabel">Max results returned per query</div>
          </div>
          <div className="form-group">
            <label className="form-label">Min Similarity Score <span className="range-value">{minScore}</span></label>
            <input type="range" className="range-input form-input" min="0.3" max="0.99" step="0.01" value={minScore} onChange={e => setMinScore(+e.target.value)} style={{ padding: "4px 0", border: "none" }} />
            <div className="form-sublabel">Filter out results below this threshold</div>
          </div>
          <div className="form-group">
            <label className="form-label">Reranking</label>
            <select className="form-input form-select">
              <option>Disabled</option>
              <option>Cohere Rerank v3</option>
              <option>Cross-Encoder (local)</option>
            </select>
            <div className="form-sublabel">Improves result quality, adds latency</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Filterable Metadata Fields</label>
          <input className="form-input" defaultValue="department, doc_type, author, created_date" />
          <div className="form-sublabel">Comma-separated. These fields can be filtered in retrieve() calls.</div>
        </div>
      </div>
    );

    if (step === 7) return (
      <div className="card">
        <div className="card-title" style={{ marginBottom: 20 }}>Review Configuration</div>
        {[
          { label: "Pipeline Name", value: "HR Policy Documents" },
          { label: "Description", value: "Employee handbook, benefits guide, and HR policies" },
          { label: "Embedding Model", value: "OpenAI · text-embedding-3-small (1536 dims)" },
          { label: "Documents", value: "3 files queued (refund_policy_v3.pdf + 2 more)" },
          { label: "Chunking Strategy", value: `Paragraph · ${chunkSize} tokens · ${overlap} overlap` },
          { label: "Vector Store", value: "pgvector · prod-pgvector connection" },
          { label: "Distance Metric", value: "Cosine Similarity" },
          { label: "Default Top-K", value: String(topK) },
          { label: "Min Score Threshold", value: String(minScore) },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13.5 }}>
            <div style={{ width: 200, color: "var(--muted)", fontWeight: 500 }}>{row.label}</div>
            <div style={{ flex: 1, fontWeight: 500 }}>{row.value}</div>
          </div>
        ))}
        <div style={{ marginTop: 20 }} className="info-box">
          <div className="info-box-icon">🚀</div>
          <div>Creating this pipeline will begin indexing your documents immediately. Estimated time: <strong>~3 minutes</strong> for 3 documents.</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="topbar">
        <span className="page-title">New Pipeline</span>
        <div className="topbar-actions">
          <button className="btn btn-secondary btn-sm">Save Draft</button>
          <button className="btn btn-ghost btn-sm">Cancel</button>
        </div>
      </div>
      <div className="content">
        <div style={{ marginBottom: 16 }}>
          <div className="progress-outer" style={{ height: 4 }}>
            <div className="progress-inner" style={{ width: `${(step / 7) * 100}%` }} />
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Step {step} of 7</div>
        </div>
        <div className="wizard">
          <div className="wizard-steps">
            <div className="wizard-title">Steps</div>
            {steps.map(s => (
              <div key={s.n} className={`step-item ${step === s.n ? "active" : ""} ${s.done ? "done" : ""}`} onClick={() => setStep(s.n)}>
                <div className="step-num">{s.done ? "✓" : s.n}</div>
                <div className="step-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="wizard-content">
            {renderStepContent()}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
              {step < 7
                ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
                : <button className="btn btn-primary" style={{ background: "var(--accent2)", color: "var(--ink)" }}>🚀 Create Pipeline & Start Indexing</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── API Keys Screen ───
const APIKeysScreen = () => {
  const keys = [
    { name: "Production Agent", key: "rf_prod_********************4a2f", scope: "All Pipelines", created: "Dec 12, 2024", calls: "41,200", status: "active" },
    { name: "Staging Agent", key: "rf_stg_********************8b3c", scope: "Product KB, HR Policy", created: "Nov 5, 2024", calls: "8,400", status: "active" },
    { name: "CI/CD Testing", key: "rf_test_*******************1e9d", scope: "HR Policy (Read-Only)", created: "Oct 2, 2024", calls: "1,100", status: "active" },
    { name: "Legacy Key", key: "rf_old_********************0f7a", scope: "All Pipelines", created: "Aug 1, 2024", calls: "0", status: "revoked" },
  ];
  return (
    <div>
      <div className="topbar">
        <span className="page-title">API Keys</span>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm"><Icon name="plus" /> Generate New Key</button>
        </div>
      </div>
      <div className="content">
        <div className="info-box" style={{ marginBottom: 20 }}>
          <div className="info-box-icon">⚷</div>
          <div>Use these API keys to authenticate calls to the RAGFlow Retrieval API and Python SDK. Keys are tenant-scoped and can be restricted to specific pipelines. The full key is shown only once at creation.</div>
        </div>

        <div className="card" style={{ marginBottom: 20, padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>
              <div style={{ width: 180 }}>Key Name</div>
              <div style={{ flex: 1 }}>Key</div>
              <div style={{ width: 200 }}>Scope</div>
              <div style={{ width: 110 }}>Calls (30d)</div>
              <div style={{ width: 120 }}>Status</div>
              <div style={{ width: 80 }}>Actions</div>
            </div>
          </div>
          {keys.map((k, i) => (
            <div key={i} className="apikey-row" style={{ opacity: k.status === "revoked" ? 0.5 : 1 }}>
              <div style={{ width: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{k.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Created {k.created}</div>
              </div>
              <div className="key-badge" style={{ flex: 1 }}>{k.key}</div>
              <div style={{ width: 200 }}>
                <span className="scope-tag">{k.scope}</span>
              </div>
              <div style={{ width: 110, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{k.calls}</div>
              <div style={{ width: 120 }}>
                <Badge status={k.status === "active" ? "active" : "error"} />
              </div>
              <div style={{ width: 80, display: "flex", gap: 4 }}>
                <button className="btn btn-ghost btn-sm" title="Copy"><Icon name="copy" /></button>
                <button className="btn btn-ghost btn-sm" style={{ color: "var(--error)" }} title="Revoke"><Icon name="trash" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>SDK Quick Start</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Install the Python package and start retrieving in seconds:</div>
          {[
            "pip install ragflow-sdk",
            "",
            "from ragflow import RAGFlowClient",
            "",
            "client = RAGFlowClient(api_key='rf_prod_...4a2f')",
            "",
            "results = client.retrieve(",
            "    pipeline_id='pip_hr_policy',",
            "    query='What is the parental leave policy?',",
            "    top_k=5",
            ")",
            "",
            "for r in results:",
            "    print(r.score, r.content[:100])",
          ].map((line, i) => (
            <div key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5, lineHeight: 1.8, color: line.startsWith("from") || line.startsWith("import") || line.startsWith("pip") ? "var(--accent2)" : line.startsWith("#") ? "var(--muted)" : "var(--ink)", background: "var(--surface)", padding: "0 16px", marginLeft: 0 }}>{line || "\u00A0"}</div>
          ))}
          <div style={{ padding: "8px 16px", background: "var(--surface)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary btn-sm"><Icon name="copy" /> Copy Code</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Retrieval Test Screen ───
const RetrievalTestScreen = () => {
  const [query, setQuery] = useState("What is the company's parental leave policy?");
  const [ran, setRan] = useState(true);
  const results = [
    { score: 0.94, source: "employee_handbook_2024.docx · Page 14", text: "Eligible employees may take up to 16 weeks of fully paid parental leave following the birth, adoption, or foster placement of a child. Leave may be taken consecutively or intermittently within 12 months of the qualifying event. Both primary and secondary caregivers are eligible." },
    { score: 0.87, source: "benefits_guide.pdf · Page 3", text: "Parental Leave Benefits: Employees must notify HR at least 30 days before anticipated leave when possible. During leave, all health benefits remain active at the company-sponsored rate. Employees returning from leave are guaranteed reinstatement to their same or equivalent position." },
    { score: 0.81, source: "employee_handbook_2024.docx · Page 16", text: "Short-Term Disability and Parental Leave may run concurrently for the birth parent. Contact your HR Business Partner to coordinate overlapping leave types. For adoption or surrogacy, documentation of placement is required within 14 days." },
  ];
  return (
    <div>
      <div className="topbar">
        <span className="page-title">Test Retrieval</span>
        <div className="topbar-actions">
          <select className="form-input form-select" style={{ width: 220, padding: "7px 32px 7px 12px", fontSize: 13 }}>
            <option>HR Policy Documents</option>
            <option>Legal Contracts</option>
            <option>Product Knowledge Base</option>
          </select>
        </div>
      </div>
      <div className="content">
        <div className="two-col" style={{ alignItems: "start" }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-title" style={{ marginBottom: 14 }}>Query</div>
              <textarea className="form-input" rows={3} value={query} onChange={e => setQuery(e.target.value)} style={{ resize: "none", fontFamily: "'DM Sans', sans-serif" }} />
              <div className="param-grid" style={{ marginTop: 14 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Top-K</label>
                  <select className="form-input form-select" style={{ padding: "7px 32px 7px 10px", fontSize: 13 }}>
                    <option>5</option><option>3</option><option>10</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Min Score</label>
                  <select className="form-input form-select" style={{ padding: "7px 32px 7px 10px", fontSize: 13 }}>
                    <option>0.72 (default)</option><option>0.60</option><option>0.80</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 12 }} className="form-group">
                <label className="form-label" style={{ fontSize: 12 }}>Metadata Filter (optional)</label>
                <input className="form-input" defaultValue='{"department": "hr"}' style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5 }} />
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 4, justifyContent: "center" }} onClick={() => setRan(true)}>
                ⚡ Run Retrieval
              </button>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Equivalent SDK Call</div>
              {[
                "results = client.retrieve(",
                `    pipeline_id='pip_hr_policy',`,
                `    query="${query.substring(0, 40)}...",`,
                "    top_k=5,",
                `    filters={'department': 'hr'}`,
                ")",
              ].map((l, i) => <div key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "var(--ink)", lineHeight: 1.9 }}>{l}</div>)}
            </div>
          </div>

          <div>
            {ran && (
              <div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--success)", fontWeight: 600 }}>✓ {results.length} results</span>
                  · 187ms · Pipeline: HR Policy Documents
                </div>
                {results.map((r, i) => (
                  <div key={i} className="card" style={{ marginBottom: 12, borderLeft: "3px solid var(--accent)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "#EEF2FF", padding: "2px 8px", borderRadius: 5 }}>
                        {(r.score * 100).toFixed(0)}% match
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", flex: 1 }}>📄 {r.source}</div>
                    </div>
                    <div className="progress-outer" style={{ marginBottom: 10 }}>
                      <div className="progress-inner" style={{ width: `${r.score * 100}%` }} />
                    </div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--ink2)" }}>{r.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Settings / Tenant Management ───
const SettingsScreen = () => (
  <div>
    <div className="topbar">
      <span className="page-title">Settings</span>
    </div>
    <div className="content">
      <div className="tab-bar">
        {["Tenant", "Users & Roles", "Audit Log", "Integrations", "Billing"].map(t => (
          <div key={t} className={`tab ${t === "Tenant" ? "active" : ""}`}>{t}</div>
        ))}
      </div>

      <div className="two-col">
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>Tenant Details</div>
            <div className="form-group">
              <label className="form-label">Tenant Name</label>
              <input className="form-input" defaultValue="Acme Corp" />
            </div>
            <div className="form-group">
              <label className="form-label">Tenant Slug</label>
              <input className="form-input" defaultValue="acme-corp" />
              <div className="form-sublabel">Used as namespace prefix for all vector indices: acme-corp_{"{pipeline_id}"}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Plan</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input className="form-input" defaultValue="Professional" readOnly style={{ background: "var(--surface)" }} />
                <button className="btn btn-secondary btn-sm">Upgrade</button>
              </div>
            </div>
            <button className="btn btn-primary">Save Changes</button>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Security</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>MFA Enforcement</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Require multi-factor auth for all users</div>
              </div>
              <div style={{ width: 44, height: 24, background: "var(--accent)", borderRadius: 99, padding: 3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <div style={{ width: 18, height: 18, background: "white", borderRadius: 50 }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>SAML SSO</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Enterprise SSO integration</div>
              </div>
              <button className="btn btn-secondary btn-sm">Configure</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Audit Log Retention</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>How long to keep audit events</div>
              </div>
              <select className="form-input form-select" style={{ width: 140, padding: "7px 32px 7px 10px", fontSize: 13 }}>
                <option>90 days</option><option>180 days</option><option>1 year</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>Usage This Month</div>
            {[
              { label: "Indexed Chunks", used: 284000, limit: 500000, unit: "" },
              { label: "API Calls", used: 412000, limit: 2000000, unit: "" },
              { label: "Pipelines", used: 12, limit: 50, unit: "" },
              { label: "Users", used: 8, limit: 25, unit: "" },
            ].map((u, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ fontWeight: 500 }}>{u.label}</span>
                  <span style={{ color: "var(--muted)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{u.used.toLocaleString()} / {u.limit.toLocaleString()}</span>
                </div>
                <div className="progress-outer">
                  <div className="progress-inner" style={{ width: `${(u.used / u.limit) * 100}%`, background: (u.used / u.limit) > 0.85 ? "linear-gradient(90deg, var(--warning), var(--accent3))" : undefined }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>Team Members</div>
            {[
              { name: "Jordan Dev", email: "jordan@acme.com", role: "Admin", avatar: "JD" },
              { name: "Priya Shah", email: "priya@acme.com", role: "Pipeline Owner", avatar: "PS" },
              { name: "Alex Lee", email: "alex@acme.com", role: "Pipeline Owner", avatar: "AL" },
              { name: "Sam Rivers", email: "sam@acme.com", role: "API Consumer", avatar: "SR" },
            ].map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>{u.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{u.email}</div>
                </div>
                <span className="scope-tag">{u.role}</span>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: 12, justifyContent: "center" }}><Icon name="plus" /> Invite Member</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Screen Map ───
const screens = {
  dashboard: DashboardScreen,
  pipelines: PipelinesScreen,
  builder: BuilderScreen,
  apikeys: APIKeysScreen,
  "retrieve-test": RetrievalTestScreen,
  settings: SettingsScreen,
};

// ─── App Shell ───
export default function App() {
  const [active, setActive] = useState("dashboard");
  const Screen = screens[active] || DashboardScreen;

  return (
    <>
      <style>{styles}</style>
      <div className="shell">
        <Sidebar active={active} setActive={setActive} />
        <div className="main">
          <Screen setActive={setActive} />
        </div>
      </div>
    </>
  );
}
