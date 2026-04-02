export default function MetricsCard({ title, value }) {
  return (
    <div style={{
      padding: "16px",
      borderRadius: "10px",
      background: "#fff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      width: "200px"
    }}>
      <p style={{ margin: 0, color: "#6b7280" }}>{title}</p>
      <h2 style={{ margin: "6px 0" }}>{value}</h2>
    </div>
  );
}