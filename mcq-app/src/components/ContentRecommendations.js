function ContentRecommendations({ generatedTopics, detectedLevel, topic, onAssessAnother, onNewSession }) {
  return (
    <div className="card">
      <h3>📚 Recommended Content for {detectedLevel} Level</h3>
      <p>Based on your level assessment in <strong>{topic}</strong>:</p>

      <div style={{ marginTop: "15px" }}>
        <ul style={{ lineHeight: "1.8" }}>
          {generatedTopics.map((t, i) => (
            <li key={i} style={{ marginBottom: "10px" }}>
              <strong>✓</strong> {t}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onAssessAnother}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "15px"
        }}
      >
        🎯 Assess Another Topic
      </button>

      <button
        onClick={onNewSession}
        style={{
          padding: "10px 20px",
          backgroundColor: "#607D8B",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "10px",
          marginLeft: "10px"
        }}
      >
        🔄 New Session
      </button>
    </div>
  );
}

export default ContentRecommendations;
