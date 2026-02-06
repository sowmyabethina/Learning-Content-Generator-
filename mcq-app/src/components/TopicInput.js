function TopicInput({ topic, setTopic, onGenerateLearningQuestions, onBack, loading, error }) {
  return (
    <div className="card">
      <h3>📌 Knowledge Level Assessment</h3>
      <p>Enter a topic to assess your knowledge level:</p>

      <input
        type="text"
        placeholder="Enter a topic (e.g., React, Python, Databases)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px"
        }}
      />

      <button
        onClick={onGenerateLearningQuestions}
        disabled={loading || !topic.trim()}
        style={{
          padding: "10px 20px",
          backgroundColor: topic.trim() ? "#FF6F00" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: topic.trim() ? "pointer" : "not-allowed"
        }}
      >
        {loading ? "Preparing..." : "🎯 Begin Learning Assessment"}
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
          marginLeft: "10px"
        }}
      >
        ← Back
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default TopicInput;
