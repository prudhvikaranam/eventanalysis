import React, { useEffect, useState } from "react";
import MetricsCard from "../components/MetricsCard";
import ActivityFeed from "../components/ActivityFeed";
import InsightCard from "../components/InsightCard";
import Chatbot from "../components/Chatbot";

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    funnel: [],
    insights: [],
    activities: [],
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    conversionRate: 0
  });

  useEffect(() => {
    let mounted = true;
    const url =
      "https://8080-edfeacdaaaeceedaedbacbbbaecafbaeaaad.premiumproject.examly.io/api/events/analytics/summary";

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        const funnelArray = data.funnel
          ? Object.entries(data.funnel).map(([step, users]) => ({
              step,
              users
            }))
          : [];

        const transformed = {
          funnel: funnelArray,
          insights: [
            `Top category: ${data.topCategory ?? "n/a"}`,
            `Drop off: ${data.dropOff ?? "n/a"}%`
          ],
          activities: [
            `Top category: ${data.topCategory ?? "n/a"}`,
            `Drop off rate: ${data.dropOff ?? "n/a"}%`
          ],
          totalUsers: data.totalUsers ?? 0,
          totalOrders: data.totalOrders ?? 0,
          revenue: data.revenue ?? 0,
          conversionRate: data.conversionRate ?? 0
        };

        setAnalyticsData(transformed);
      } catch (err) {
        console.error("Failed to fetch analytics summary:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{
        margin: 0,
        fontSize: "1.5rem",
        fontWeight: 700,
        background: "linear-gradient(90deg,#2563eb 0%, #06b6d4 50%, #0ea5a4 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent"
      }}>Analytics Dashboard</h2>

      <br />

      {/* Metrics */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <MetricsCard title="Users" value={analyticsData.totalUsers} index={0} />
        <MetricsCard title="Orders" value={analyticsData.totalOrders} index={1} />
        <MetricsCard title="Revenue" value={`₹${analyticsData.revenue}`} index={2} />
        <MetricsCard title="Conversion" value={`${analyticsData.conversionRate}%`} index={3} />
      </div>

      {/* Funnel */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Funnel</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", background: "#041158", padding: "24px", borderRadius: "5px" }}>
          {analyticsData.funnel.map((f, i) => {
            const prevUsers = analyticsData.funnel[i - 1]?.users;

            const drop =
              prevUsers && prevUsers > 0
                ? (((prevUsers - f.users) / prevUsers) * 100).toFixed(1)
                : null;

            return (
              <div
                key={i}
                style={{
                  flex: "1 1 220px",
                  minWidth: "200px",
                  maxWidth: "260px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  color: "#111",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 22px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  {f.step.replaceAll("_", " ")}
                </div>

                <div style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "10px" }}>
                  {f.users}
                </div>

                {drop && (
                  <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px" }}>
                    ↓ {drop}% drop
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights + Activity */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>AI Insights</h3>
          {analyticsData.insights.map((i, idx) => (
            <InsightCard key={idx} text={i} />
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <ActivityFeed data={analyticsData.activities} />
        </div>
      </div>

      <Chatbot />
    </div>
  );
}