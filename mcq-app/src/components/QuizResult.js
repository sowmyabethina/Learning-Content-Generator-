function QuizResult({ correctCount, questions, score, onAssessLevel, onNewSession }) {
  return (
    <div className="card">
      <h2>🏆 Quiz Complete</h2>
      <p className="result" style={{ fontSize: "24px", fontWeight: "bold", margin: "20px 0" }}>
        Your Score: {correctCount !== null ? correctCount : 0} / {questions.length}
      </p>
      <p style={{ color: "#666" }}>
        Percentage: {score}%
      </p>

      <button
        onClick={onAssessLevel}
        style={{
          padding: "10px 20px",
          backgroundColor: "#9C27B0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "15px"
        }}
      >
        📖 Assess Your Knowledge Level
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

export default QuizResult;
