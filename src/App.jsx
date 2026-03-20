import React, { useState } from "react";
import "./app.css";

/* =========================
   FULL ORGANIZATION
========================= */
const organization = [
  {
    name: "Front Office",
    children: [
      { name: "Valet" },
      { name: "Bellperson" },
      { name: "Concierge" },
      { name: "Front Desk Agent" },
      { name: "Guest Service Agent" }
    ]
  },
  {
    name: "Housekeeping",
    children: [
      { name: "Room Attendant" },
      { name: "Room Assistant" },
      { name: "Turndown Attendant" },
      { name: "Public Areas Attendant" },
      { name: "Laundry Attendant" }
    ]
  },
  {
    name: "Event Operations",
    children: [
      { name: "Event Coordinator" },
      { name: "Banquet Captain" },
      { name: "Server" },
      { name: "Bartender" },
      { name: "Banquet Houseman" }
    ]
  },
  {
    name: "Engineering",
    children: [
      { name: "Engineer" },
      { name: "HVAC" },
      { name: "Painter" },
      { name: "Carpenter" },
      { name: "Landscape" }
    ]
  },
  {
    name: "F&B",
    children: [
      {
        name: "Eggs",
        children: [
          { name: "Host" }, { name: "Server" }, { name: "Server Assistant" },
          { name: "Bartender" }, { name: "Runner" }
        ]
      },
      {
        name: "3 Meal",
        children: [
          { name: "Host" }, { name: "Server" }, { name: "Server Assistant" },
          { name: "Bartender" }, { name: "Barback" }, { name: "Runner" }
        ]
      },
      { name: "Coffee", children: [{ name: "Barista" }] },
      { name: "IRD", children: [{ name: "In Room Dining Attendant" }] },
      {
        name: "Steak",
        children: [
          { name: "Host" }, { name: "Server" }, { name: "Server Assistant" },
          { name: "Bartender" }, { name: "Barback" }, { name: "Runner" }
        ]
      },
      { name: "Market", children: [{ name: "Market Attendant" }] },
      {
        name: "Sushi",
        children: [
          { name: "Host" }, { name: "Server" }, { name: "Server Assistant" },
          { name: "Bartender" }, { name: "Barback" }, { name: "Runner" }
        ]
      },
      { name: "Food Truck", children: [{ name: "Food Truck Attendant" }] },
      {
        name: "Pool Bar",
        children: [
          { name: "Server" }, { name: "Bartender" },
          { name: "Barback" }, { name: "Runner" }
        ]
      },
      { name: "Patisserie", children: [{ name: "Patisserie Attendant" }] }
    ]
  },
  {
    name: "Culinary",
    children: [
      {
        name: "Cafeteria",
        children: [
          { name: "Cafeteria Cook" },
          { name: "Cafeteria Attendant" },
          { name: "Stewarding" }
        ]
      },
      {
        name: "Culinary Banquets",
        children: [
          { name: "Banquet Cook" },
          { name: "Garde Manger" },
          { name: "Pastry" },
          { name: "Stewarding" }
        ]
      },
      {
        name: "Eggs",
        children: [
          { name: "Hot Side - Grill" },
          { name: "Hot Side - Flat Top" },
          { name: "Hot Side - Middle" },
          { name: "Cold Side - Pantry" },
          { name: "Prep" },
          { name: "Stewarding" },
          { name: "Expo" }
        ]
      },
      {
        name: "3 Meal",
        children: [
          { name: "Hot Side - Grill" },
          { name: "Hot Side - Flat Top" },
          { name: "Hot Side - Middle" },
          { name: "Cold Side - Pantry" },
          { name: "Prep" },
          { name: "Stewarding" },
          { name: "Expo" }
        ]
      },
      { name: "Coffee", children: [{ name: "Coffee Prep" }] },
      {
        name: "IRD",
        children: [
          { name: "In Room Dining Cook - Hot" },
          { name: "In Room Dining Cook - Cold" }
        ]
      },
      {
        name: "Steak",
        children: [
          { name: "Hot Side - Grill" },
          { name: "Hot Side - Flat Top" },
          { name: "Hot Side - Middle" },
          { name: "Cold Side - Pantry" },
          { name: "Prep" },
          { name: "Stewarding" },
          { name: "Expo" }
        ]
      },
      {
        name: "Market",
        children: [
          { name: "Market Cook" },
          { name: "Stewarding" }
        ]
      },
      {
        name: "Sushi",
        children: [
          { name: "Sushi Prep" },
          { name: "Sushi Cook" },
          { name: "Stewarding" }
        ]
      },
      { name: "Food Truck", children: [{ name: "Food Truck Cook" }] },
      { name: "Patisserie", children: [{ name: "Patisserie Cook" }] }
    ]
  },
  {
    name: "Club Lounge",
    children: [
      { name: "Mixologist" },
      { name: "Server" },
      { name: "Host" },
      { name: "Attendant" }
    ]
  },
  {
    name: "Spa",
    children: [
      { name: "Massage Therapist" },
      { name: "Esthetician" },
      { name: "Fitness Attendant" },
      { name: "Host" }
    ]
  },
  {
    name: "Pool",
    children: [
      {
        name: "Lagoon",
        children: [
          { name: "Lifeguard" },
          { name: "Attendant" },
          { name: "Aquatic Services" }
        ]
      },
      {
        name: "Wave",
        children: [
          { name: "Lifeguard" },
          { name: "Attendant" },
          { name: "Aquatic Services" }
        ]
      }
    ]
  },
  {
    name: "Loss Prevention",
    children: [
      { name: "Base" },
      { name: "Officers" }
    ]
  },
  {
    name: "Accounting",
    children: [
      {
        name: "Purchasing",
        children: [
          { name: "Purchaser" },
          { name: "Receiver" },
          { name: "Purchasing Attendant" }
        ]
      }
    ]
  }
];

/* =========================
   HELPERS
========================= */
const rand = () => Math.floor(Math.random() * 100);

const normalize = (node) => ({
  ...node,
  strain: node.strain ?? rand(),
  children: node.children ? node.children.map(normalize) : []
});

const getColor = (s) =>
  s <= 40 ? "#00e5ff" : s <= 70 ? "#ffcc00" : "#ff3b30";

const getRadius = (s) =>
  s <= 40 ? 45 : s <= 70 ? 30 : 15;

const root = {
  name: "Hotel",
  strain: 50,
  children: organization.map(normalize)
};

/* =========================
   APP
========================= */
export default function App() {
  const [stack, setStack] = useState([root]);

  const current = stack[stack.length - 1];

  return (
    <div className="app">
      <div className="brand">NexOS Pulse™</div>

      {stack.length > 1 && (
        <button className="back" onClick={() => setStack(stack.slice(0, -1))}>
          ← Back
        </button>
      )}

      <div className="radar">

        <div className="ring r1"></div>
        <div className="ring r2"></div>
        <div className="ring r3"></div>
        <div className="sweep"></div>

        <div className="center">
          <div
            className="pulse"
            style={{
              background:
                stack.length === 1 ? "#00e5ff" : getColor(current.strain)
            }}
          />
          <div className="center-label">{current.strain}</div>
          <div className="center-name">{current.name}</div>
        </div>

        {(current.children || []).map((c, i) => {
          const angle = (i / current.children.length) * 2 * Math.PI;
          const r = getRadius(c.strain);

          const x = 50 + r * Math.cos(angle);
          const y = 50 + r * Math.sin(angle);

          const clickable = c.children && c.children.length > 0;

          return (
            <div
              key={c.name}
              className="node"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color: getColor(c.strain),
                opacity: clickable ? 1 : 0.6
              }}
              onClick={() => clickable && setStack([...stack, c])}
            >
              <div
                className="node-pulse"
                style={{ background: getColor(c.strain) }}
              />
              {c.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}