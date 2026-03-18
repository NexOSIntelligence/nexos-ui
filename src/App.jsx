import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [viewStack, setViewStack] = useState(["master"]);
  const [focusNode, setFocusNode] = useState(null);
  const [timeTick, setTimeTick] = useState(Date.now());

  const currentView = viewStack[viewStack.length - 1];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const baseData = {
    master: [
      { id: "Rooms", strain: 72 },
      { id: "Housekeeping", strain: 55 },
      { id: "Front Desk", strain: 48 },
      { id: "Food & Beverage", strain: 63 },
      { id: "Culinary", strain: 70 },
      { id: "Engineering", strain: 80 },
      { id: "Security", strain: 45 },
    ],

    Engineering: [
      { id: "Electrical", strain: 60 },
      { id: "Plumbing", strain: 75 },
      { id: "HVAC", strain: 82 },
    ],

    Rooms: [
      { id: "Housekeeping", strain: 60 },
      { id: "Maintenance", strain: 78 },
      { id: "Guest Issues", strain: 85 },
    ],

    Housekeeping: [
      { id: "Cleaning", strain: 58 },
      { id: "Laundry", strain: 62 },
      { id: "Supplies", strain: 30 },
    ],

    Laundry: [
      { id: "Machines", strain: 75 },
      { id: "Staff", strain: 65 },
    ],

    "Front Desk": [
      { id: "Check-In", strain: 50 },
      { id: "Guest Services", strain: 45 },
      { id: "Billing", strain: 35 },
      { id: "Reservations", strain: 55 },
    ],

    "Food & Beverage": [
      { id: "Restaurants", strain: 65 },
      { id: "Bars", strain: 50 },
      { id: "Banquets", strain: 72 },
    ],

    Culinary: [
      { id: "Hot Line", strain: 80 },
      { id: "Cold Prep", strain: 55 },
      { id: "Pastry", strain: 35 },
    ],

    Security: [
      { id: "Surveillance", strain: 30 },
      { id: "Patrol", strain: 45 },
      { id: "Incidents", strain: 78 },
    ],
  };

  const propagationMap = {
    HVAC: [
      { target: "Rooms", impact: 0.25 },
      { target: "Front Desk", impact: 0.15 },
    ],
    Maintenance: [{ target: "Rooms", impact: 0.2 }],
    Laundry: [{ target: "Housekeeping", impact: 0.2 }],
    Incidents: [{ target: "Security", impact: 0.3 }],
  };

  const applyPropagation = (data) => {
    let updated = JSON.parse(JSON.stringify(data));

    Object.values(data).flat().forEach((node) => {
      const effects = propagationMap[node.id];
      if (effects) {
        effects.forEach(({ target, impact }) => {
          updated.master.forEach((m) => {
            if (m.id === target) {
              m.strain += node.strain * impact;
            }
          });
        });
      }
    });

    return updated;
  };

  const data = applyPropagation(baseData);

  // 🔥 UPDATED RECOMMENDATIONS WITH BRAND LANGUAGE
  const generateRecommendations = () => {
    const recs = [];

    const get = (id) =>
      data.master.find((d) => d.id === id)?.strain || 0;

    const hvac = 82;
    const rooms = get("Rooms");
    const security = get("Security");

    if (hvac > 75) {
      recs.push({
        text: "Deploy engineering to HVAC immediately",
        priority: 10,
        impact: "Cooling failure spreading to guest rooms",
        oeo: 12000,
        revenue: 8000,
        gss: 0.03,
      });
    }

    if (rooms > 75) {
      recs.push({
        text: "Delay non-essential room turns",
        priority: 8,
        impact: "Arrival delays impacting guests",
        oeo: 6000,
        revenue: 4000,
        gss: 0.02,
      });
    }

    if (security > 70) {
      recs.push({
        text: "Increase security patrol presence",
        priority: 6,
        impact: "Incident escalation risk",
        oeo: 3000,
        revenue: 1500,
        gss: 0.01,
      });
    }

    return recs.sort((a, b) => b.priority - a.priority);
  };

  const recommendations = generateRecommendations();
  const topRec = recommendations[0];

  const getColor = (strain) => {
    if (strain > 75) return "red";
    if (strain > 50) return "yellow";
    return "green";
  };

  const getPulseStyle = (strain) => ({
    animationDuration: `${2 - strain / 100}s`,
    transform: `scale(${1 + strain / 300})`,
  });

  const goForward = (node) => {
    if (!data[node.id]) return;

    setFocusNode(node);

    setTimeout(() => {
      setViewStack((prev) => [...prev, node.id]);
      setFocusNode(null);
    }, 300);
  };

  const goBack = () => {
    setViewStack((prev) => prev.slice(0, -1));
  };

  const getRadialPosition = (index, total, radius = 240) => {
    const angle = (index / total) * 2 * Math.PI;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    return {
      left: cx + radius * Math.cos(angle),
      top: cy + radius * Math.sin(angle),
    };
  };

  return (
    <div className="app">
      {viewStack.length > 1 && (
        <button className="back" onClick={goBack}>
          ← Back
        </button>
      )}

      <div className="recommendations">
        <div className="rec-title">Top Priority</div>

        {topRec && (
          <div className="rec-priority">
            <div className="rec-main">{topRec.text}</div>

            <div className="rec-financials oeo">
              💰 OEO: ${topRec.oeo.toLocaleString()}
            </div>

            <div className="rec-financials revenue">
              📈 Revenue Capture: ${topRec.revenue.toLocaleString()}
            </div>

            <div className="rec-financials gss">
              ⭐ Guest Service Impact: +{topRec.gss}% GSS
            </div>

            <div className="rec-impact">
              ⚠️ If ignored: {topRec.impact}
            </div>
          </div>
        )}

        <div className="rec-subtitle">Other Actions</div>

        {recommendations.slice(1).map((rec, i) => (
          <div key={i} className="rec-item">
            {rec.text}
          </div>
        ))}
      </div>

      <div className={`center ${focusNode ? "zoom-target" : ""}`}>
        <div className="pulse master" />
        <div className="label">
          {currentView === "master" ? "Master Pulse" : currentView}
        </div>
      </div>

      {data[currentView]?.map((node, i) => {
        const pos = getRadialPosition(i, data[currentView].length);
        const focused = focusNode?.id === node.id;

        return (
          <div
            key={node.id}
            className={`node ${focused ? "focused" : ""}`}
            style={{ top: pos.top, left: pos.left }}
          >
            <div
              className={`pulse ${getColor(node.strain)}`}
              style={getPulseStyle(node.strain)}
              onClick={() => goForward(node)}
            />
            <div className="node-label">
              {node.id} ({Math.round(node.strain)})
            </div>
          </div>
        );
      })}
    </div>
  );
}