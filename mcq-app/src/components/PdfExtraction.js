function PdfExtraction({ githubLink, setGithubLink, extractDocument, loading, error }) {
  return (
    <div className="card">
      <h3>📄 Upload & Extract PDF</h3>

      <input
        type="text"
        placeholder="Paste GitHub PDF link"
        value={githubLink}
        onChange={(e) => setGithubLink(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={extractDocument}
        disabled={loading}
        style={{ 
          padding: "10px 20px", 
          backgroundColor: "#4CAF50", 
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Extracting..." : "Extract Document"}
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default PdfExtraction;
