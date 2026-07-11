import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

function ProductPreview() {
  return <div className="product-preview" aria-label="Stratum product preview">
    <aside className="preview-sidebar"><div className="mini-brand"><span className="brand-mark">S</span> stratum</div><span className="side-active">Overview</span><span>Cases</span><span>Signals</span><span>Reports</span></aside>
    <div className="preview-body"><div className="preview-top"><span>Overview / Today</span><span className="preview-user">LM</span></div><div className="preview-heading"><div><p>Support intelligence</p><h2>Your team, ahead of every SLA.</h2></div><button>Review queue</button></div><div className="preview-stats"><div><span>Open cases</span><strong>142</strong><small>+12 this week</small></div><div><span>At-risk cases</span><strong className="alert">08</strong><small>Need attention</small></div><div><span>Within target</span><strong>94%</strong><small>Across all queues</small></div></div><div className="preview-queue"><div className="queue-title"><strong>Priority queue</strong><span>Updated now</span></div><div className="preview-row"><div><b>Acme Logistics</b><span>SLA-1842 · Priority support</span></div><em>18m remaining</em><i>Critical</i></div><div className="preview-row"><div><b>Northstar Health</b><span>SLA-1839 · Incident response</span></div><em>42m remaining</em><i className="high">High</i></div></div></div>
  </div>
}

function App() {
  const [showPreview, setShowPreview] = useState(false)
  return <main className="landing-shell">
    <nav className="landing-nav"><a className="brand" href="#top"><span className="brand-mark">S</span> stratum</a><div className="nav-links"><a href="#product">Product</a><a href="#how-it-works">How it works</a><a href="#about">About</a></div><button className="nav-cta" onClick={() => setShowPreview(true)}>Open workspace <span>↗</span></button></nav>
    <section className="landing-hero" id="top"><div className="hero-copy"><p className="eyebrow">SLA intelligence for support teams</p><h1>Turn <span className="highlight sky">support signals</span> into <span className="line-break">calm, confident</span> <span className="highlight peach">service.</span></h1><p className="hero-sub">Stratum spots the cases most likely to breach their SLA, so your team can act earlier and keep customers moving.</p><div className="hero-actions"><button className="primary" onClick={() => setShowPreview(true)}>Explore the workspace <span>↗</span></button><a href="#how-it-works">How it works <span>↓</span></a></div></div><div className="signal-orbit" aria-hidden="true"><span className="orb orb-one">Priority</span><span className="orb orb-two">Sentiment</span><span className="orb orb-three">Activity</span><div className="orb-center">S</div></div></section>
    <section className="preview-wrap" id="product"><div className="preview-caption"><span>01 / Live prioritization</span><p>One clear view of what needs attention now.</p></div><ProductPreview /></section>
    <section className="benefits" id="how-it-works"><article><span>01</span><h2>See the signal.</h2><p>Combine urgency, elapsed time, customer tone, and team activity in one explainable score.</p></article><article><span>02</span><h2>Focus the team.</h2><p>Bring risk forward in a shared queue before a missed target becomes a customer problem.</p></article><article><span>03</span><h2>Keep moving.</h2><p>Give every support lead a simple, steady view of service performance across queues.</p></article></section>
    <section className="closing" id="about"><p className="eyebrow">Quietly in control</p><h2>Keep the promise you made to every customer.</h2><button className="primary" onClick={() => setShowPreview(true)}>Start with Stratum <span>↗</span></button></section>
    {showPreview && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Stratum workspace preview"><div className="modal"><button className="close" onClick={() => setShowPreview(false)} aria-label="Close preview">×</button><p className="eyebrow">Workspace preview</p><h2>The interactive workspace is next.</h2><p>Stratum's current prototype is ready to connect to your support data source.</p><button className="primary" onClick={() => setShowPreview(false)}>Got it</button></div></div>}
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
