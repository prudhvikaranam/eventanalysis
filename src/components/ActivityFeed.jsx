export default function ActivityFeed({ data }) {
  return (
    <div style={{
      background: "#fff",
      padding: "16px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
    }}>
      <h3>Recent Activity</h3>
      {data.map((item, i) => (
        <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
          {item}
        </div>
      ))}
    </div>
  );
}