function SuccessMessage({ successMessage }) {
  if (!successMessage) return null;

  return (
    <div className="card" style={{ backgroundColor: "#d4edda", border: "1px solid #c3e6cb" }}>
      <p style={{ color: "#155724", margin: "10px 0" }}>{successMessage}</p>
    </div>
  );
}

export default SuccessMessage;
