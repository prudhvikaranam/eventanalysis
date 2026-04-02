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
    const url = "https://8080-edfeacdaaaeceedaedbacbbbaecafbaeaaad.premiumproject.examly.io/api/events/analytics/summary";

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        const funnelArray = data.funnel
          ? Object.entries(data.funnel).map(([step, users]) => ({ step, users }))
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


  {
    analyticsData.funnel.map((f, i) => (
      <div
        key={i}
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
          padding: "14px 16px",
          marginBottom: "10px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "500",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.25s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
          e.currentTarget.style.boxShadow =
            "0 8px 20px rgba(0,0,0,0.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.15)";
        }}
      >
        <span>{f.step}</span>
        <span style={{ fontWeight: "bold" }}>{f.users}</span>
      </div>
    ))
  }

  const getColor = (index) => {
    const colors = [
      "linear-gradient(135deg, #3b82f6, #06b6d4)",
      "linear-gradient(135deg, #6366f1, #8b5cf6)",
      "linear-gradient(135deg, #8b5cf6, #ec4899)",
      "linear-gradient(135deg, #ec4899, #f43f5e)",
      "linear-gradient(135deg, #f59e0b, #ef4444)",
      "linear-gradient(135deg, #10b981, #059669)",
      "linear-gradient(135deg, #0ea5a4, #14b8a6)"
    ];
    return colors[index % colors.length];
  };

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

      <br /><br />

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <MetricsCard title="Users" value={analyticsData.totalUsers} />
        <MetricsCard title="Orders" value={analyticsData.totalOrders} />
        <MetricsCard title="Revenue" value={analyticsData.revenue} />
        <MetricsCard title="Conversion" value={analyticsData.conversionRate} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Funnel</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px"
          }}
        >
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
                  flex: "1 1 220px", // responsive width
                  minWidth: "200px",
                  maxWidth: "260px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: getColor(i),
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 28px rgba(0,0,0,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,0,0,0.1)";
                }}
              >
                {/* Step */}
                <div style={{ fontWeight: 600, fontSize: "14px" }}>
                  {f.step.replaceAll("_", " ")}
                </div>

                {/* Users */}
                <div style={{ fontSize: "1.5rem", fontWeight: 800, marginTop: "10px" }}>
                  {f.users}
                </div>

                {/* Drop */}
                {drop && (
                  <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "6px" }}>
                    ↓ {drop}% drop
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

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