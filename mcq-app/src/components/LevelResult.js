function LevelResult({ detectedLevel, topic, getContentForLevel, loading, onBack }) {
  return (
    <div className="card">
      <h2>🏅 Your Knowledge Level</h2>
      <p style={{ fontSize: "32px", fontWeight: "bold", color: "#FF6F00", margin: "20px 0" }}>
        {detectedLevel}
      </p>
      <p style={{ marginTop: "15px", color: "#555" }}>
        Based on your performance in the assessment on <strong>{topic}</strong>
      </p>

      <button
        onClick={getContentForLevel}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3F51B5",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "20px"
        }}
      >
        {loading ? "Generating..." : "📚 Generate Content for My Level"}
      </button>

      <button
        onClick={onBack}
        style={{
          padding: "10px 20px",
          backgroundColor: "#757575",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
          marginLeft: "10px"
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default LevelResult;
