function LearningQuestions({ learningQuestions, learningIndex, learningSelected, setLearningSelected, nextLearningQuestion, loading }) {
  const currentQuestion = learningQuestions[learningIndex];

  return (
    <div className="card">
      <h2>🎓 Learning Preference Assessment</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Question {learningIndex + 1} of {learningQuestions.length}
      </p>

      <div style={{ marginBottom: "20px" }}>
        <h3>{currentQuestion?.question}</h3>
        
        <div style={{ marginTop: "15px" }}>
          {currentQuestion?.options?.map((option, idx) => (
            <label
              key={idx}
              style={{
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                border: learningSelected === option ? "2px solid #2196F3" : "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: learningSelected === option ? "#E3F2FD" : "white",
                cursor: "pointer"
              }}
            >
              <input
                type="radio"
                name="learning-option"
                value={option}
                checked={learningSelected === option}
                onChange={(e) => setLearningSelected(e.target.value)}
                style={{ marginRight: "10px" }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={nextLearningQuestion}
        disabled={!learningSelected}
        style={{
          padding: "10px 20px",
          backgroundColor: learningSelected ? "#2196F3" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: learningSelected ? "pointer" : "not-allowed"
        }}
      >
        {learningIndex + 1 === learningQuestions.length ? "Complete Assessment" : "Next"}
      </button>

      {loading && <p style={{ marginTop: "10px", color: "#666" }}>Processing...</p>}
    </div>
  );
}

export default LearningQuestions;
