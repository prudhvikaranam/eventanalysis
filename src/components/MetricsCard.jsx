export default function MetricsCard({ title, value, index = 0 }) {
  const gradients = [
    "linear-gradient(135deg, #2563eb, #06b6d4)", // blue
    "linear-gradient(135deg, #7c3aed, #ec4899)", // purple-pink
    "linear-gradient(135deg, #f59e0b, #ef4444)", // orange-red
    "linear-gradient(135deg, #10b981, #059669)"  // green
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: gradient,
        color: "#fff",
        width: "200px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-30%",
          width: "120px",
          height: "120px",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "50%",
          filter: "blur(40px)"
        }}
      />

      <p style={{ margin: 0, opacity: 0.85, fontSize: "13px" }}>
        {title}
      </p>

      <h2 style={{ margin: "8px 0 0", fontWeight: 800 }}>
        {value}
      </h2>
    </div>
  );
}