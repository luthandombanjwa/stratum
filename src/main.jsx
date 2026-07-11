import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const initialCases = [
  { id: 'SLA-1842', customer: 'Acme Logistics', service: 'Priority support', remaining: 18, owner: 'N. Mokoena', risk: 'Critical' },
  { id: 'SLA-1839', customer: 'Northstar Health', service: 'Incident response', remaining: 42, owner: 'J. Patel', risk: 'High' },
  { id: 'SLA-1836', customer: 'Orbital Finance', service: 'Data request', remaining: 95, owner: 'L. Mensah', risk: 'Medium' },
  { id: 'SLA-1831', customer: 'Mosaic Retail', service: 'Technical support', remaining: 138, owner: 'K. Dlamini', risk: 'Low' }
]

function scoreCase(age, priority, updates, sentiment) {
  const priorityWeight = { Critical: 38, High: 27, Normal: 15, Low: 6 }[priority]
  const sentimentWeight = { Negative: 22, Neutral: 10, Positive: 2 }[sentiment]
  const score = Math.min(99, Math.round(priorityWeight + sentimentWeight + Math.max(0, 30 - updates * 5) + Math.min(28, age * 1.35)))
  return { score, label: score >= 75 ? 'Critical' : score >= 55 ? 'High' : score >= 30 ? 'Medium' : 'Low' }
}

function App() {
  const [cases, setCases] = useState(initialCases)
  const [form, setForm] = useState({ age: 12, priority: 'High', updates: 2, sentiment: 'Neutral' })
  const prediction = useMemo(() => scoreCase(Number(form.age), form.priority, Number(form.updates), form.sentiment), [form])
  const critical = cases.filter(c => c.risk === 'Critical').length
  const atRisk = cases.filter(c => ['Critical', 'High'].includes(c.risk)).length
  const avg = Math.round(cases.reduce((sum, c) => sum + c.remaining, 0) / cases.length)
  const addCase = () => {
    const item = { id: `SLA-${1843 + cases.length}`, customer: 'New intake', service: 'Support request', remaining: Math.max(12, 180 - Number(form.age) * 4), owner: 'Unassigned', risk: prediction.label }
    setCases([item, ...cases])
  }
  return <main>
    <nav><div className="brand"><span className="brand-mark">S</span> stratum</div><div className="nav-links"><span className="active">Overview</span><span>Cases</span><span>Analytics</span><span>Settings</span></div><button className="avatar">LM</button></nav>
    <section className="hero"><div><p className="eyebrow">SLA intelligence</p><h1>See risk before it becomes a breach.</h1><p className="sub">Prioritize the conversations that need attention, using a transparent real-time risk score.</p></div><button className="primary" onClick={addCase}>＋ Add predicted case</button></section>
    <section className="stats"><article><span>Open cases</span><strong>{cases.length}</strong><small>Across all service queues</small></article><article><span>At-risk cases</span><strong className="coral">{atRisk}</strong><small>Need attention today</small></article><article><span>Critical risk</span><strong className="red">{critical}</strong><small>Likely to breach soon</small></article><article><span>Avg. time remaining</span><strong>{avg}m</strong><small>Until SLA target</small></article></section>
    <section className="grid"><div className="panel predictor"><div className="panel-title"><div><p className="eyebrow">Risk simulator</p><h2>Predict a case</h2></div><span className={`badge ${prediction.label.toLowerCase()}`}>{prediction.label} risk</span></div><div className="meter"><div style={{ width: `${prediction.score}%` }}></div></div><div className="score"><strong>{prediction.score}%</strong><span>breach likelihood</span></div><div className="inputs"><label>Case age <input type="number" min="0" value={form.age} onChange={e => setForm({...form, age: e.target.value})}/><small>hours since creation</small></label><label>Priority <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>{['Low','Normal','High','Critical'].map(x => <option key={x}>{x}</option>)}</select></label><label>Agent updates <input type="number" min="0" value={form.updates} onChange={e => setForm({...form, updates: e.target.value})}/></label><label>Customer sentiment <select value={form.sentiment} onChange={e => setForm({...form, sentiment: e.target.value})}>{['Positive','Neutral','Negative'].map(x => <option key={x}>{x}</option>)}</select></label></div><p className="hint">Risk increases when priority is high, sentiment declines, or a case goes without updates.</p></div>
    <div className="panel queue"><div className="panel-title"><div><p className="eyebrow">Live queue</p><h2>Needs attention</h2></div><button className="text-button">View all →</button></div><div className="case-list">{cases.map(c => <div className="case" key={c.id}><div className="case-main"><strong>{c.customer}</strong><span>{c.id} · {c.service}</span></div><div className="case-owner">{c.owner}<small>{c.remaining}m remaining</small></div><span className={`badge ${c.risk.toLowerCase()}`}>{c.risk}</span></div>)}</div></div></section>
    <section className="panel explanation"><div><p className="eyebrow">How it works</p><h2>Decisions you can explain.</h2></div><p>Stratum weighs urgency, elapsed time, customer sentiment, and support activity—so your team can act on a clear, understandable signal.</p></section>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
