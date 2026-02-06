function ExtractedContentPreview({ extractedContent, generateQuiz, loading, onBack }) {
  return (
    <div className="card">
      <h3>✅ PDF Content Extracted</h3>
      <textarea
        rows="6"
        value={extractedContent.substring(0, 500) + "..."}
        readOnly
        style={{ width: "100%", padding: "10px" }}
      />

      <button
        onClick={() => generateQuiz(true)}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px"
        }}
      >
        {loading ? "Generating..." : "📚 Start Quiz from PDF"}
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

export default ExtractedContentPreview;
