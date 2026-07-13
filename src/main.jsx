import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "plottable/plottable.css";
import {
  BreachTrendChart,
  CasesByPriorityChart,
  ResolutionTimeChart,
} from "./StratumCharts";
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  Alignment,
  Tag,
  Intent,
  InputGroup,
  HTMLSelect,
  FormGroup,
  Card,
  Elevation,
} from "@blueprintjs/core";
import "./styles.css";

const initialCases = [
  {
    id: "SLA-1842",
    customer: "Acme Logistics",
    service: "Priority support",
    remaining: 18,
    owner: "N. Mokoena",
    age: 24,
    priority: "Critical",
    updates: 1,
    sentiment: "Negative",
  },
  {
    id: "SLA-1839",
    customer: "Northstar Health",
    service: "Incident response",
    remaining: 42,
    owner: "J. Patel",
    age: 16,
    priority: "High",
    updates: 2,
    sentiment: "Neutral",
  },
  {
    id: "SLA-1836",
    customer: "Orbital Finance",
    service: "Data request",
    remaining: 95,
    owner: "L. Mensah",
    age: 8,
    priority: "Normal",
    updates: 3,
    sentiment: "Positive",
  },
  {
    id: "SLA-1831",
    customer: "Mosaic Retail",
    service: "Technical support",
    remaining: 138,
    owner: "K. Dlamini",
    age: 4,
    priority: "Low",
    updates: 4,
    sentiment: "Positive",
  },
];

const defaultWeights = {
  priority: { Critical: 38, High: 27, Normal: 15, Low: 6 },
  sentiment: { Negative: 22, Neutral: 10, Positive: 2 },
  updatesMultiplier: 5,
  updatesMaxSubtract: 30,
  ageMultiplier: 1.35,
  ageMaxAdd: 28,
};

function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">S</span>stratum
    </span>
  );
}

const tabIcon = (tab) => {
  switch (tab) {
    case "Overview":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-icon"
        >
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
      );
    case "Cases":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-icon"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      );
    case "Analytics":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-icon"
        >
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      );
    case "Settings":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sidebar-icon"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      );
    default:
      return null;
  }
};

function scoreCase(
  age,
  priority,
  updates,
  sentiment,
  weights = defaultWeights,
) {
  const priorityWeight = weights.priority[priority] ?? 15;
  const sentimentWeight = weights.sentiment[sentiment] ?? 10;
  const updatesSub = Math.max(
    0,
    weights.updatesMaxSubtract - updates * weights.updatesMultiplier,
  );
  const ageAdd = Math.min(weights.ageMaxAdd, age * weights.ageMultiplier);
  const score = Math.min(
    99,
    Math.round(priorityWeight + sentimentWeight + updatesSub + ageAdd),
  );
  return {
    score,
    label:
      score >= 75
        ? "Critical"
        : score >= 55
          ? "High"
          : score >= 30
            ? "Medium"
            : "Low",
  };
}

function Dashboard({ onHome }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [cases, setCases] = useState(initialCases);
  const [weights, setWeights] = useState(defaultWeights);

  // Simulator form state
  const [form, setForm] = useState({
    age: 12,
    priority: "High",
    updates: 2,
    sentiment: "Neutral",
  });

  // Custom states for Case list filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [sortField, setSortField] = useState("remaining"); // 'remaining', 'age', 'score'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'

  // Calculate dynamic case scores using current weights
  const scoredCases = useMemo(() => {
    return cases.map((c) => {
      const { score, label } = scoreCase(
        c.age,
        c.priority,
        c.updates,
        c.sentiment,
        weights,
      );
      return { ...c, score, risk: label };
    });
  }, [cases, weights]);

  const prediction = useMemo(() => {
    return scoreCase(
      Number(form.age),
      form.priority,
      Number(form.updates),
      form.sentiment,
      weights,
    );
  }, [form, weights]);

  // Stats calculations
  const totalCount = scoredCases.length;
  const criticalCount = scoredCases.filter((c) => c.risk === "Critical").length;
  const atRiskCount = scoredCases.filter((c) =>
    ["Critical", "High"].includes(c.risk),
  ).length;
  const averageRemaining =
    totalCount > 0
      ? Math.round(
          scoredCases.reduce((sum, c) => sum + c.remaining, 0) / totalCount,
        )
      : 0;

  // SLA Health Index (% of cases not in High/Critical)
  const slaHealthIndex =
    totalCount > 0
      ? Math.round(((totalCount - atRiskCount) / totalCount) * 100)
      : 100;

  const handleAddCase = () => {
    const newId = `SLA-${1843 + cases.length}`;
    const newCase = {
      id: newId,
      customer: form.customerName || "New intake",
      service: form.serviceName || "Priority support",
      remaining: Math.max(12, 180 - Number(form.age) * 4),
      owner: form.ownerName || "Unassigned",
      age: Number(form.age),
      priority: form.priority,
      updates: Number(form.updates),
      sentiment: form.sentiment,
    };
    setCases([newCase, ...cases]);
    // clear input name helper
    setForm((prev) => ({
      ...prev,
      customerName: "",
      serviceName: "",
      ownerName: "",
    }));
  };

  const handleResolveCase = (id) => {
    setCases(cases.filter((c) => c.id !== id));
  };

  const handleLoadCase = (c) => {
    setForm({
      age: c.age,
      priority: c.priority,
      updates: c.updates,
      sentiment: c.sentiment,
      customerName: c.customer,
      serviceName: c.service,
      ownerName: c.owner,
    });
    setActiveTab("Overview");
  };

  // Filtered cases for search/filtering
  const filteredCases = useMemo(() => {
    return scoredCases
      .filter((c) => {
        const matchesSearch =
          c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = filterRisk === "All" || c.risk === filterRisk;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (sortField === "score") {
          valA = a.score;
          valB = b.score;
        }
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [scoredCases, searchQuery, filterRisk, sortField, sortOrder]);

  const sentimentIndicator = (sentiment) => {
    return <span className={`sentiment-dot ${sentiment.toLowerCase()}`} />;
  };

  return (
    <div className="rich-dashboard-layout">
      {/* Sidebar Nav */}
      <aside
        className="sidebar-nav bp5-dark"
        style={{ backgroundColor: "#161A1D", borderRight: "1px solid #252A31" }}
      >
        <div
          style={{
            padding: "20px 16px 16px 16px",
            borderBottom: "1px solid #252A31",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "15px",
              color: "#F6F7F9",
              letterSpacing: "-0.3px",
            }}
          >
            stratum
          </span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-title" style={{ color: "#8F99A8" }}>
            Main Menu
          </p>
          <nav className="sidebar-links">
            <Button
              className="bp5-minimal"
              text="Overview"
              active={activeTab === "Overview"}
              onClick={() => setActiveTab("Overview")}
              icon="dashboard"
              alignText="left"
              fill={true}
              style={{
                justifyContent: "flex-start",
                marginBottom: "4px",
              }}
            />
            <Button
              className="bp5-minimal"
              text="Cases"
              active={activeTab === "Cases"}
              onClick={() => setActiveTab("Cases")}
              icon="th"
              alignText="left"
              fill={true}
              style={{
                justifyContent: "flex-start",
                marginBottom: "4px",
              }}
            />
            <Button
              className="bp5-minimal"
              text="Analytics"
              active={activeTab === "Analytics"}
              onClick={() => setActiveTab("Analytics")}
              icon="chart"
              alignText="left"
              fill={true}
              style={{
                justifyContent: "flex-start",
                marginBottom: "4px",
              }}
            />
            <Button
              className="bp5-minimal"
              text="Settings"
              active={activeTab === "Settings"}
              onClick={() => setActiveTab("Settings")}
              icon="cog"
              alignText="left"
              fill={true}
              style={{
                justifyContent: "flex-start",
                marginBottom: "4px",
              }}
            />
          </nav>
        </div>

        <div
          className="sidebar-footer"
          style={{ borderTop: "1px solid #252A31", paddingTop: "16px" }}
        >
          <Button
            className="bp5-minimal back-home-btn"
            text="Exit to Home"
            onClick={onHome}
            icon="log-out"
            alignText="left"
            fill={true}
            style={{ justifyContent: "flex-start", color: "#5F6B7C" }}
          />
        </div>
      </aside>

      {/* Main Dashboard Content Area */}
      <main className="rich-dashboard-content">
        {/* Stats Cards Section */}
        <section className="rich-stats">
          <Card
            elevation={Elevation.ZERO}
            style={{
              backgroundColor: "#161A1D",
              border: "1px solid #252A31",
              boxShadow: "none",
            }}
          >
            <p
              style={{
                color: "#8F99A8",
                fontSize: "12px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Open cases
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#F6F7F9",
                margin: "0 0 4px 0",
                lineHeight: 1,
              }}
            >
              {totalCount}
            </p>
            <p style={{ color: "#5F6B7C", fontSize: "12px", margin: 0 }}>
              Across all service queues
            </p>
          </Card>
          <Card
            elevation={Elevation.ZERO}
            style={{
              backgroundColor: "#161A1D",
              border: "1px solid #252A31",
              boxShadow: "none",
            }}
          >
            <p
              style={{
                color: "#8F99A8",
                fontSize: "12px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              At-risk cases
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#F6F7F9",
                margin: "0 0 4px 0",
                lineHeight: 1,
              }}
            >
              {atRiskCount}
            </p>
            <p style={{ color: "#5F6B7C", fontSize: "12px", margin: 0 }}>
              Need attention today
            </p>
          </Card>
          <Card
            elevation={Elevation.ZERO}
            style={{
              backgroundColor: "#161A1D",
              border: "1px solid #252A31",
              boxShadow: "none",
            }}
          >
            <p
              style={{
                color: "#8F99A8",
                fontSize: "12px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Critical risk
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#F6F7F9",
                margin: "0 0 4px 0",
                lineHeight: 1,
              }}
            >
              {criticalCount}
            </p>
            <p style={{ color: "#5F6B7C", fontSize: "12px", margin: 0 }}>
              Likely to breach soon
            </p>
          </Card>
          <Card
            elevation={Elevation.ZERO}
            style={{
              backgroundColor: "#161A1D",
              border: "1px solid #252A31",
              boxShadow: "none",
            }}
          >
            <p
              style={{
                color: "#8F99A8",
                fontSize: "12px",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              SLA Health Index
            </p>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#F6F7F9",
                margin: "0 0 4px 0",
                lineHeight: 1,
              }}
            >
              {slaHealthIndex}%
            </p>
            <p style={{ color: "#5F6B7C", fontSize: "12px", margin: 0 }}>
              Cases within safe bounds
            </p>
          </Card>
        </section>

        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <section className="rich-grid">
            {/* Simulator Panel */}
            <div className="rich-panel simulator">
              <div className="rich-panel-title">
                <div>
                  <p className="eyebrow">Risk simulator</p>
                  <h2>Predict a case</h2>
                </div>
                {prediction.label.toUpperCase() === "CRITICAL" ? (
                  <Tag
                    intent={Intent.DANGER}
                    round={false}
                    style={{
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    CRITICAL ({prediction.score}%)
                  </Tag>
                ) : prediction.label.toUpperCase() === "HIGH" ? (
                  <Tag
                    intent={Intent.WARNING}
                    round={false}
                    style={{
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    HIGH ({prediction.score}%)
                  </Tag>
                ) : prediction.label.toUpperCase() === "MEDIUM" ? (
                  <Tag
                    intent={Intent.PRIMARY}
                    round={false}
                    style={{
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    MEDIUM ({prediction.score}%)
                  </Tag>
                ) : (
                  <Tag
                    intent={Intent.SUCCESS}
                    round={false}
                    style={{
                      fontWeight: 600,
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    LOW ({prediction.score}%)
                  </Tag>
                )}
              </div>

              <div
                className="risk-meter"
                style={{ backgroundColor: "#252A31" }}
              >
                <div
                  className="risk-meter-bar"
                  style={{
                    width: `${prediction.score}%`,
                    backgroundColor:
                      prediction.score <= 30
                        ? "#1C6E42"
                        : prediction.score <= 80
                          ? "#C87619"
                          : "#AC2F33",
                  }}
                />
              </div>

              <div className="risk-inputs">
                <FormGroup label="Customer Name" labelFor="customer-name">
                  <InputGroup
                    id="customer-name"
                    placeholder="e.g. Acme Corp"
                    value={form.customerName || ""}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    large={false}
                  />
                </FormGroup>
                <FormGroup label="SLA Target Service" labelFor="service-type">
                  <InputGroup
                    id="service-type"
                    placeholder="e.g. Incident response"
                    value={form.serviceName || ""}
                    onChange={(e) =>
                      setForm({ ...form, serviceName: e.target.value })
                    }
                    large={false}
                  />
                </FormGroup>
                <FormGroup label="Case age" labelFor="case-age">
                  <InputGroup
                    id="case-age"
                    type="number"
                    placeholder="hours since creation"
                    value={form.age === 0 ? "0" : form.age || ""}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    large={false}
                  />
                </FormGroup>
                <FormGroup label="Priority" labelFor="priority">
                  <HTMLSelect
                    id="priority"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    options={[
                      { label: "Low", value: "Low" },
                      { label: "Normal", value: "Normal" },
                      { label: "High", value: "High" },
                      { label: "Critical", value: "Critical" },
                    ]}
                    fill={true}
                  />
                </FormGroup>
                <FormGroup label="Agent updates" labelFor="agent-updates">
                  <InputGroup
                    id="agent-updates"
                    type="number"
                    value={form.updates === 0 ? "0" : form.updates || ""}
                    onChange={(e) =>
                      setForm({ ...form, updates: e.target.value })
                    }
                    large={false}
                  />
                </FormGroup>
                <FormGroup label="Sentiment" labelFor="sentiment">
                  <HTMLSelect
                    id="sentiment"
                    value={form.sentiment}
                    onChange={(e) =>
                      setForm({ ...form, sentiment: e.target.value })
                    }
                    options={[
                      { label: "Positive", value: "Positive" },
                      { label: "Neutral", value: "Neutral" },
                      { label: "Negative", value: "Negative" },
                    ]}
                    fill={true}
                  />
                </FormGroup>
              </div>

              <Button
                intent={Intent.PRIMARY}
                large={true}
                fill={true}
                text="+ Add predicted case"
                style={{ marginTop: "12px" }}
                onClick={handleAddCase}
              />

              <p className="simulator-note">
                Adjust parameters to instantly forecast breach risk. Live queue
                metrics and tables will update immediately once added.
              </p>
            </div>

            {/* Live Queue Panel */}
            <div className="rich-panel">
              <div className="rich-panel-title">
                <div>
                  <p className="eyebrow">Live queue</p>
                  <h2>Needs attention</h2>
                </div>
                <button
                  className="text-link"
                  onClick={() => setActiveTab("Cases")}
                >
                  View detail grid →
                </button>
              </div>

              {/* Quick Filters */}
              <div className="quick-search-bar">
                <input
                  type="text"
                  placeholder="Search customer or case ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                >
                  <option value="All">All Risks</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="rich-case-list">
                {filteredCases.length === 0 ? (
                  <div className="empty-state">
                    No matching cases in the queue.
                  </div>
                ) : (
                  filteredCases.map((item) => (
                    <div className="rich-case-card" key={item.id}>
                      <div
                        className="case-clickable-area"
                        onClick={() => handleLoadCase(item)}
                      >
                        <div className="case-main-info">
                          <strong>{item.customer}</strong>
                          <span>
                            {item.id} · {item.service}
                          </span>
                        </div>
                        <div className="case-meta-info">
                          <span className="owner-text">{item.owner}</span>
                          <small className="time-remaining">
                            {item.remaining}m remaining
                          </small>
                        </div>
                        <div
                          className="sentiment-display"
                          title={`Sentiment: ${item.sentiment}`}
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {sentimentIndicator(item.sentiment)}
                        </div>
                        {item.risk.toUpperCase() === "CRITICAL" ? (
                          <Tag
                            intent={Intent.DANGER}
                            round={false}
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            CRITICAL ({item.score}%)
                          </Tag>
                        ) : item.risk.toUpperCase() === "HIGH" ? (
                          <Tag
                            intent={Intent.WARNING}
                            round={false}
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            HIGH ({item.score}%)
                          </Tag>
                        ) : item.risk.toUpperCase() === "MEDIUM" ? (
                          <Tag
                            intent={Intent.PRIMARY}
                            round={false}
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            MEDIUM ({item.score}%)
                          </Tag>
                        ) : (
                          <Tag
                            intent={Intent.SUCCESS}
                            round={false}
                            style={{
                              fontWeight: 600,
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            LOW ({item.score}%)
                          </Tag>
                        )}
                      </div>
                      <button
                        className="resolve-case-btn"
                        title="Resolve case"
                        onClick={() => handleResolveCase(item.id)}
                      >
                        ✓
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* CASES DETAILED GRID TAB */}
        {activeTab === "Cases" && (
          <section className="rich-panel cases-tab-container">
            <div className="cases-tab-header">
              <div>
                <button
                  className="text-link"
                  onClick={() => setActiveTab("Overview")}
                  style={{ marginBottom: "8px", display: "block", padding: 0 }}
                >
                  ← Back to simulator
                </button>
                <p className="eyebrow">Detailed queue</p>
                <h2>Manage SLA Cases</h2>
              </div>

              <div className="filter-controls-group">
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="select-input"
                >
                  <option value="All">All Risks</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="select-input"
                >
                  <option value="remaining">Time Remaining</option>
                  <option value="age">Case Age</option>
                  <option value="score">Breach Score</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="sort-direction-btn"
                >
                  {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
                </button>
              </div>
            </div>

            <div className="cases-table-wrapper">
              <table className="custom-cases-table">
                <thead>
                  <tr>
                    <th>Case Info</th>
                    <th>Service</th>
                    <th>Age & Updates</th>
                    <th>Sentiment</th>
                    <th>Breach Risk</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="table-empty-state">
                        No cases found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((item) => (
                      <tr key={item.id} className="case-row-item">
                        <td>
                          <div className="table-customer-cell">
                            <strong>{item.customer}</strong>
                            <span className="case-sub-text">
                              {item.id} · Owner: {item.owner}
                            </span>
                          </div>
                        </td>
                        <td>{item.service}</td>
                        <td>
                          <div className="table-stats-cell">
                            <span>Age: {item.age} hrs</span>
                            <span className="case-sub-text">
                              {item.updates} updates
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            className="sentiment-pill"
                            title={item.sentiment}
                          >
                            {sentimentIndicator(item.sentiment)}{" "}
                            {item.sentiment}
                          </span>
                        </td>
                        <td>
                          <div className="table-risk-cell">
                            {item.risk.toUpperCase() === "CRITICAL" ? (
                              <Tag
                                intent={Intent.DANGER}
                                round={false}
                                style={{
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                CRITICAL ({item.score}%)
                              </Tag>
                            ) : item.risk.toUpperCase() === "HIGH" ? (
                              <Tag
                                intent={Intent.WARNING}
                                round={false}
                                style={{
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                HIGH ({item.score}%)
                              </Tag>
                            ) : item.risk.toUpperCase() === "MEDIUM" ? (
                              <Tag
                                intent={Intent.PRIMARY}
                                round={false}
                                style={{
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                MEDIUM ({item.score}%)
                              </Tag>
                            ) : (
                              <Tag
                                intent={Intent.SUCCESS}
                                round={false}
                                style={{
                                  fontWeight: 600,
                                  fontSize: "11px",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                LOW ({item.score}%)
                              </Tag>
                            )}
                            <span className="risk-percentage">
                              {item.score}% breach likelihood
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions-cell">
                            <button
                              className="table-action-btn load-btn"
                              onClick={() => handleLoadCase(item)}
                              title="Load into simulator"
                            >
                              Simulate
                            </button>
                            <button
                              className="table-action-btn resolve-btn"
                              onClick={() => handleResolveCase(item.id)}
                              title="Resolve SLA case"
                            >
                              Resolve
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "Analytics" && (
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Page header */}
            <div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#5F6B7C",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                ANALYTICS
              </p>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#F6F7F9",
                  margin: 0,
                  letterSpacing: "-0.3px",
                }}
              >
                Queue Intelligence
              </h1>
              <p
                style={{ fontSize: "13px", color: "#8F99A8", marginTop: "6px" }}
              >
                Pattern analysis across all active and resolved cases.
              </p>
            </div>

            {/* Top row — two charts side by side */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {/* Chart 1 */}
              <div
                style={{
                  backgroundColor: "#161A1D",
                  border: "1px solid #252A31",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#5F6B7C",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  SLA BREACH TREND
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#F6F7F9",
                    marginBottom: "16px",
                  }}
                >
                  Risk score over time
                </p>
                <BreachTrendChart />
              </div>

              {/* Chart 2 */}
              <div
                style={{
                  backgroundColor: "#161A1D",
                  border: "1px solid #252A31",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#5F6B7C",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  CASE DISTRIBUTION
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#F6F7F9",
                    marginBottom: "16px",
                  }}
                >
                  Open cases by priority
                </p>
                <CasesByPriorityChart />
              </div>
            </div>

            {/* Bottom row — full width chart */}
            <div
              style={{
                backgroundColor: "#161A1D",
                border: "1px solid #252A31",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#5F6B7C",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                AGENT PERFORMANCE
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#F6F7F9",
                  marginBottom: "16px",
                }}
              >
                Average resolution time by agent (minutes)
              </p>
              <ResolutionTimeChart />
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "Settings" && (
          <section className="rich-panel settings-tab-container">
            <div className="settings-header">
              <p className="eyebrow">Risk model adjustments</p>
              <h2>Configure Weight Matrices</h2>
              <p>
                Customize the math coefficients that calculate SLA breach
                probabilities. Changes apply immediately across the entire
                workspace.
              </p>
            </div>

            <div className="settings-sections-grid">
              {/* Priority Weight settings */}
              <div className="settings-card">
                <h3>Priority Weights</h3>
                <div className="settings-sliders">
                  {Object.keys(weights.priority).map((priority) => (
                    <label key={priority} className="slider-label">
                      <div className="slider-header-info">
                        <span>{priority}</span>
                        <strong>{weights.priority[priority]} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={weights.priority[priority]}
                        onChange={(e) =>
                          setWeights({
                            ...weights,
                            priority: {
                              ...weights.priority,
                              [priority]: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Sentiment Weight settings */}
              <div className="settings-card">
                <h3>Sentiment Weights</h3>
                <div className="settings-sliders">
                  {Object.keys(weights.sentiment).map((sentiment) => (
                    <label key={sentiment} className="slider-label">
                      <div className="slider-header-info">
                        <span>{sentiment} Sentiment</span>
                        <strong>{weights.sentiment[sentiment]} pts</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="55"
                        value={weights.sentiment[sentiment]}
                        onChange={(e) =>
                          setWeights({
                            ...weights,
                            sentiment: {
                              ...weights.sentiment,
                              [sentiment]: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Decay and Coefficients settings */}
              <div className="settings-card long-card">
                <h3>Decay & Age Coefficients</h3>
                <div className="settings-sliders">
                  <label className="slider-label">
                    <div className="slider-header-info">
                      <span>
                        Updates Decay Multiplier (reduces risk per update)
                      </span>
                      <strong>{weights.updatesMultiplier} pts / update</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={weights.updatesMultiplier}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          updatesMultiplier: Number(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="slider-label">
                    <div className="slider-header-info">
                      <span>Maximum updates discount</span>
                      <strong>{weights.updatesMaxSubtract} pts max</strong>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={weights.updatesMaxSubtract}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          updatesMaxSubtract: Number(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label className="slider-label">
                    <div className="slider-header-info">
                      <span>Age multiplier (increases risk over time)</span>
                      <strong>{weights.ageMultiplier} pts / hr</strong>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.05"
                      value={weights.ageMultiplier}
                      onChange={(e) =>
                        setWeights({
                          ...weights,
                          ageMultiplier: Number(e.target.value),
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-actions">
              <button
                className="button-dark reset-weights-btn"
                onClick={() => setWeights(defaultWeights)}
              >
                Reset to system defaults
              </button>
            </div>

            <div className="settings-formula-sandbox">
              <h3>Live Equation Preview</h3>
              <div className="formula-box-preview">
                <code>
                  Breach Score = priorityWeight(
                  {weights.priority[form.priority]}) + sentimentWeight(
                  {weights.sentiment[form.sentiment]}) + max(0,{" "}
                  {weights.updatesMaxSubtract} - updates({form.updates}) ×{" "}
                  {weights.updatesMultiplier}) + min({weights.ageMaxAdd}, age(
                  {form.age}) × {weights.ageMultiplier})
                </code>
                <div className="calculated-result-badge">
                  Result: <strong>{prediction.score}%</strong> likelihood ·{" "}
                  {prediction.label.toUpperCase() === "CRITICAL" ? (
                    <Tag
                      intent={Intent.DANGER}
                      round={false}
                      style={{
                        fontWeight: 600,
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      CRITICAL ({prediction.score}%)
                    </Tag>
                  ) : prediction.label.toUpperCase() === "HIGH" ? (
                    <Tag
                      intent={Intent.WARNING}
                      round={false}
                      style={{
                        fontWeight: 600,
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      HIGH ({prediction.score}%)
                    </Tag>
                  ) : prediction.label.toUpperCase() === "MEDIUM" ? (
                    <Tag
                      intent={Intent.PRIMARY}
                      round={false}
                      style={{
                        fontWeight: 600,
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      MEDIUM ({prediction.score}%)
                    </Tag>
                  ) : (
                    <Tag
                      intent={Intent.SUCCESS}
                      round={false}
                      style={{
                        fontWeight: 600,
                        fontSize: "11px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      LOW ({prediction.score}%)
                    </Tag>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS / FOOTER FOOTPRINT */}
        <section className="rich-panel rich-explanation">
          <div>
            <p className="eyebrow">How it works</p>
            <h2>Decisions you can explain.</h2>
          </div>
          <p>
            Stratum weighs SLA parameters using dynamic algorithms that compute
            severity in real time. Customize these rules inside the Settings tab
            to match your company's support workflows.
          </p>
        </section>
      </main>
    </div>
  );
}

function Landing({ onWorkspace }) {
  return (
    <div className="landing-wrapper">
      <main className="landing-shell">
        <nav className="landing-nav">
          <a href="#top" aria-label="Stratum home">
            <Brand />
          </a>
          <div className="nav-links">
            <a href="#product">Product</a>
            <a href="#why">Why Stratum</a>
          </div>
          <button className="button-dark nav-button" onClick={onWorkspace}>
            Open workspace <span>↗</span>
          </button>
        </nav>

        <section className="landing-hero" id="top">
          <p className="eyebrow">SLA intelligence for support teams</p>
          <h1>
            Keep every
            <br />
            service promise.
          </h1>
          <p className="hero-sub">
            Stratum helps support teams see SLA risk early, focus their
            attention, and move with confidence.
          </p>
          <div className="hero-actions">
            <button className="button-dark" onClick={onWorkspace}>
              Explore the workspace <span>↗</span>
            </button>
            <a href="#why">
              See how it works <span>↓</span>
            </a>
          </div>
        </section>

        <section className="product-band" id="product">
          <div className="product-intro">
            <p className="eyebrow">One clear view</p>
            <h2>Know what needs attention before it becomes a breach.</h2>
            <p>
              Stratum brings the right support signals into a calm, prioritised
              workspace.
            </p>
          </div>

          <div className="product-preview">
            <div className="preview-top">
              <Brand />
              <span>Today</span>
            </div>
            <div className="preview-content">
              <div className="preview-title">
                <div>
                  <p>Priority queue</p>
                  <h3>Cases to review</h3>
                </div>
                <button onClick={onWorkspace}>Open dashboard ↗</button>
              </div>
              <div className="preview-metrics">
                <div>
                  <span>Open cases</span>
                  <b>142</b>
                </div>
                <div>
                  <span>At risk</span>
                  <b>08</b>
                </div>
                <div>
                  <span>Within target</span>
                  <b>94%</b>
                </div>
              </div>
              <div className="preview-row">
                <div>
                  <strong>Acme Logistics</strong>
                  <span>SLA-1842 · Priority support</span>
                </div>
                <em>18m remaining</em>
                <i
                  style={{
                    background: "rgba(207, 45, 86, 0.1)",
                    color: "#cf2d56",
                  }}
                >
                  Critical
                </i>
              </div>
              <div className="preview-row">
                <div>
                  <strong>Northstar Health</strong>
                  <span>SLA-1839 · Incident response</span>
                </div>
                <em>42m remaining</em>
                <i
                  style={{
                    background: "rgba(245, 78, 0, 0.1)",
                    color: "#f54e00",
                  }}
                >
                  High
                </i>
              </div>
            </div>
          </div>
        </section>

        <section className="benefits" id="why">
          <article>
            <span>01</span>
            <h2>See risk early.</h2>
            <p>
              Bring urgency, age, activity, and sentiment into one simple
              signal.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Focus the team.</h2>
            <p>
              Keep everyone aligned on the cases that matter most right now.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Stay on target.</h2>
            <p>
              Build a steady, reliable service experience your customers can
              trust.
            </p>
          </article>
        </section>

        <section className="closing">
          <p className="eyebrow">Service, in control</p>
          <h2>A calmer way to run support.</h2>
          <button className="button-dark" onClick={onWorkspace}>
            Open your workspace <span>↗</span>
          </button>
        </section>
      </main>
    </div>
  );
}

function App() {
  const [view, setView] = useState("landing");
  return (
    <div className="bp5-dark">
      {view === "dashboard" ? (
        <Dashboard onHome={() => setView("landing")} />
      ) : (
        <Landing onWorkspace={() => setView("dashboard")} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
