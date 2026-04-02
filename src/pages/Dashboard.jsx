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

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <MetricsCard title="Users" value={analyticsData.totalUsers} />
        <MetricsCard title="Orders" value={analyticsData.totalOrders} />
        <MetricsCard title="Revenue" value={analyticsData.revenue} />
        <MetricsCard title="Conversion" value={analyticsData.conversionRate} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Funnel</h3>
        {analyticsData.funnel.map((f, i) => (
          <div key={i} style={{
            background: "#fff",
            padding: "10px",
            marginBottom: "6px",
            borderRadius: "6px"
          }}>
            {f.step} → {f.users}
          </div>
        ))}
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