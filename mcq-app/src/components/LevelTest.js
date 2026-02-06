function LevelTest({ levelTestQuestions, levelTestIndex, levelTestSelected, setLevelTestSelected, nextLevelTestQuestion }) {
  const currentQuestion = levelTestQuestions[levelTestIndex];

  return (
    <div className="card">
      <h3>🎯 Knowledge Assessment ({levelTestIndex + 1}/{levelTestQuestions.length})</h3>
      <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
        Difficulty: <strong>{currentQuestion.difficulty || "Mixed"}</strong>
      </p>
      <p style={{ fontSize: "18px", marginBottom: "15px" }}>
        {currentQuestion.question}
      </p>

      {currentQuestion.options.map((opt, i) => (
        <label key={i} className="option" style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="radio"
            name="levelOption"
            value={opt}
            checked={levelTestSelected === opt}
            onChange={(e) => setLevelTestSelected(e.target.value)}
          />
          <span style={{ marginLeft: "10px" }}>{opt}</span>
        </label>
      ))}

      <button
        onClick={nextLevelTestQuestion}
        disabled={!levelTestSelected}
        style={{
          padding: "10px 20px",
          backgroundColor: levelTestSelected ? "#FF6F00" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: levelTestSelected ? "pointer" : "not-allowed",
          marginTop: "15px"
        }}
      >
        {levelTestIndex + 1 === levelTestQuestions.length ? "Finish & Get Result" : "Next Question"}
      </button>
    </div>
  );
}

export default LevelTest;
