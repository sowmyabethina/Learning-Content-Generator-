function PersonalizedContent({ personalizedContent, onUnderstood, onBack }) {
  return (
    <div className="card">
      <h2>📚 Your Personalized Learning Path</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Topic: <strong>{personalizedContent.topic}</strong>
      </p>

      <div style={{ marginBottom: "25px" }}>
        <h3>Suggested Learning Resources:</h3>
        <div style={{ marginTop: "15px" }}>
          {personalizedContent.resources?.map((resource, idx) => (
            <div
              key={idx}
              style={{
                padding: "15px",
                marginBottom: "10px",
                border: "1px solid #E0E0E0",
                borderRadius: "4px",
                backgroundColor: "#FAFAFA"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "16px" }}>
                    {resource.type}
                  </p>
                  <p style={{ margin: "0 0 5px 0", fontSize: "15px" }}>
                    {resource.title}
                  </p>
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                    {resource.description}
                  </p>
                </div>
                <p style={{ margin: "0", color: "#999", fontSize: "13px", textAlign: "right", minWidth: "100px" }}>
                  ⏱ {resource.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>📖 Recommended Learning Path:</h3>
        <ol style={{ marginTop: "10px", paddingLeft: "20px" }}>
          {personalizedContent.suggestedPath?.map((step, idx) => (
            <li key={idx} style={{ marginBottom: "8px", color: "#333" }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>💡 Learning Tips:</h3>
        <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
          {personalizedContent.tips?.map((tip, idx) => (
            <li key={idx} style={{ marginBottom: "8px", color: "#333" }}>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onUnderstood}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px"
        }}
      >
        ✓ Understood
      </button>

      <button
        onClick={onBack}
        style={{
          padding: "10px 20px",
          backgroundColor: "#757575",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default PersonalizedContent;
