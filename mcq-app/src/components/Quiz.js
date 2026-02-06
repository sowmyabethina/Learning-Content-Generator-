function Quiz({ questions, index, selected, setSelected, nextQuestion }) {
  const currentQuestion = questions[index];

  return (
    <div className="card">
      <h3>
        🎯 Quiz ({index + 1}/{questions.length})
      </h3>
      <p style={{ fontSize: "18px", marginBottom: "15px" }}>
        {currentQuestion.question}
      </p>

      {currentQuestion.options.map((opt, i) => (
        <label key={i} className="option" style={{ display: "block", marginBottom: "10px" }}>
          <input
            type="radio"
            name="option"
            value={opt}
            checked={selected === opt}
            onChange={(e) => setSelected(e.target.value)}
          />
          <span style={{ marginLeft: "10px" }}>{opt}</span>
        </label>
      ))}

      <button
        onClick={nextQuestion}
        disabled={!selected}
        style={{
          padding: "10px 20px",
          backgroundColor: selected ? "#FF9800" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: selected ? "pointer" : "not-allowed",
          marginTop: "15px"
        }}
      >
        Next Question
      </button>
    </div>
  );
}

export default Quiz;
