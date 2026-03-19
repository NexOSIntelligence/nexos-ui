import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [activeDept, setActiveDept] = useState(null);

  const departments = [
    { id: "kitchen", label: "Kitchen", value: 72, revenuePerHour: 2300 },
    { id: "housekeeping", label: "Housekeeping", value: 38, revenuePerHour: 900 },
    { id: "frontdesk", label: "Front Desk", value: 45, revenuePerHour: 1200 },
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
     💰 REVENUE + TIME ENGINE
  ========================= */

  const getRecommendation = (dept, subs = []) => {
    const value = dept.value || 0;
    const revenue = dept.revenuePerHour || 1500;

    const highestSub =
      subs.length > 0
        ? subs.reduce((a, b) => (a.value > b.value ? a : b))
        : null;

    const minutesToImpact = value >= 70 ? 15 : value >= 40 ? 30 : 60;
    const projectedLoss = Math.round((revenue / 60) * minutesToImpact);

    // CRITICAL
    if (value >= 70) {
      return {
        level: "CRITICAL",
        message: `$${revenue.toLocaleString()}/hr at risk — ${
          highestSub ? highestSub.label + " bottleneck. " : ""
        }`,
        impact: `Projected loss: $${projectedLoss.toLocaleString()} in next ${minutesToImpact} minutes`,
      };
    }

    // ELEVATED
    if (value >= 40) {
      return {
        level: "ELEVATED",
        message: `$${Math.round(revenue * 0.5).toLocaleString()}/hr impact — ${
          highestSub ? highestSub.label + " strain detected. " : ""
        }`,
        impact: `Escalation risk: $${projectedLoss.toLocaleString()} within ${minutesToImpact} minutes`,
      };
    }

    // STABLE
    return {
      level: "STABLE",
      message: `Operating efficiently — no revenue risk detected.`,
      impact: `No immediate financial impact expected`,
    };
  };

  const currentSubs = activeDept
    ? subDepartments[activeDept.id] || []
    : [];

  const recommendation = activeDept
    ? getRecommendation(activeDept, currentSubs)
    : getRecommendation({
        value:
          departments.reduce((sum, d) => sum + d.value, 0) /
          departments.length,
        revenuePerHour: 2000,
      });

  /* =========================
     UI
  ========================= */

  return (
    <div className="app">
      <div className="title">⚡ NexOS Pulse</div>

      {!activeDept && (
        <>
          <div className="radar">
            <div className="ring r1"></div>
            <div className="ring r2"></div>
            <div className="ring r3"></div>

            <div className="center-pulse">49</div>

            {renderNodes(departments, true)}
          </div>

          <div className="recommendation">
            <strong>{recommendation.level}</strong>
            <br />
            {recommendation.message}
            <br />
            <span className="impact">{recommendation.impact}</span>
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

          <div className="recommendation">
            <strong>{recommendation.level}</strong>
            <br />
            {recommendation.message}
            <br />
            <span className="impact">{recommendation.impact}</span>
          </div>
        </>
      )}
    </div>
  );
}