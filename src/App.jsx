import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [activeDept, setActiveDept] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [lastLogged, setLastLogged] = useState({});

  const departments = [
    { id: "kitchen", label: "Kitchen", value: 72, revenuePerHour: 2300, laborPerHour: 800 },
    { id: "housekeeping", label: "Housekeeping", value: 38, revenuePerHour: 900, laborPerHour: 500 },
    { id: "frontdesk", label: "Front Desk", value: 45, revenuePerHour: 1200, laborPerHour: 600 },
    { id: "engineering", label: "Engineering", value: 30, revenuePerHour: 700, laborPerHour: 400 },
    { id: "fnb", label: "F&B Service", value: 55, revenuePerHour: 1800, laborPerHour: 700 },
  ];

  const subDepartments = {
    kitchen: [
      { id: "line", label: "Line", value: 80 },
      { id: "prep", label: "Prep", value: 60 },
      { id: "dish", label: "Dish", value: 50 },
    ],
    housekeeping: [
      { id: "rooms", label: "Rooms", value: 40 },
      { id: "laundry", label: "Laundry", value: 35 },
    ],
    frontdesk: [
      { id: "checkin", label: "Check-In", value: 50 },
      { id: "concierge", label: "Concierge", value: 30 },
    ],
    engineering: [
      { id: "hvac", label: "HVAC", value: 35 },
      { id: "electrical", label: "Electrical", value: 25 },
    ],
    fnb: [
      { id: "service", label: "Service", value: 60 },
      { id: "bar", label: "Bar", value: 45 },
    ],
  };

  /* =========================
     VISUAL ENGINE
  ========================= */

  const getColor = (value) => {
    if (value >= 70) return "#ff4d4d";
    if (value >= 40) return "#ffd24d";
    return "#00c8ff";
  };

  const getRadius = (value) => {
    if (value >= 70) return 18;
    if (value >= 40) return 32;
    return 48;
  };

  const getPosition = (index, total, value) => {
    const angle = (index / total) * 2 * Math.PI;
    const radius = getRadius(value);

    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  const renderNodes = (items, clickable = false) =>
    items.map((item, i) => {
      const pos = getPosition(i, items.length, item.value);

      return (
        <div
          key={item.id}
          className="node"
          style={{ ...pos, background: getColor(item.value) }}
          onClick={() => clickable && setActiveDept(item)}
        >
          <div className="label">{item.label}</div>
        </div>
      );
    });

  /* =========================
     VALUE ENGINE (LOCKED)
  ========================= */

  const calculateScenario = (dept) => {
    const value = dept.value;
    const revenue = dept.revenuePerHour;
    const labor = dept.laborPerHour;

    const minutes = value >= 70 ? 15 : 30;

    const beforeLoss = Math.round((revenue / 60) * minutes);
    const afterLoss = Math.round(beforeLoss * 0.4);

    const revenueSaved = beforeLoss - afterLoss;
    const laborSaved = Math.round((labor / 60) * (minutes * 0.2));

    return {
      beforeLoss,
      afterLoss,
      total: revenueSaved + laborSaved,
    };
  };

  const getConfidence = (value) => {
    if (value >= 70) return 90;
    if (value >= 40) return 75;
    return 60;
  };

  /* =========================
     CONTROLLED EVENT ENGINE
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      departments.forEach((dept) => {
        if (dept.value < 40) return;

        const lastTime = lastLogged[dept.id] || 0;

        // 60s cooldown per department
        if (now - lastTime < 60000) return;

        const scenario = calculateScenario(dept);

        const entry = {
          time: new Date().toLocaleTimeString(),
          dept: dept.label,
          before: scenario.beforeLoss,
          after: scenario.afterLoss,
          total: scenario.total,
          confidence: getConfidence(dept.value),
        };

        setLedger((prev) => [entry, ...prev]);
        setLastLogged((prev) => ({ ...prev, [dept.id]: now }));
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [lastLogged]);

  const totalValue = ledger.reduce((sum, e) => sum + e.total, 0);

  const currentSubs = activeDept
    ? subDepartments[activeDept.id] || []
    : [];

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">
      <div className="title">⚡ NexOS Pulse</div>

      <div className="value-bar">
        Value Created Today: ${totalValue.toLocaleString()}
      </div>

      {!activeDept && (
        <>
          <div className="radar">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>

            <div className="center-pulse">49</div>

            {renderNodes(departments, true)}
          </div>

          <div className="ledger">
            <h3>Value Ledger</h3>

            {ledger.slice(0, 6).map((e, i) => (
              <div key={i} className="ledger-item">
                <strong>{e.dept}</strong> — ${e.total}
                <div className="ledger-detail">
                  ${e.before} → ${e.after}
                </div>
                <div className="confidence">
                  {e.confidence}% confidence
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeDept && (
        <>
          <button
            className="back-button"
            onClick={() => setActiveDept(null)}
          >
            ← Back
          </button>

          <div className="radar">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>

            <div className="center-pulse">
              {activeDept.value}
            </div>

            <div className="dept-title">{activeDept.label}</div>

            {renderNodes(currentSubs)}
          </div>
        </>
      )}
    </div>
  );
}