from fastmcp import FastMCP
import PyPDF2

mcp = FastMCP("DataExtractor")

@mcp.tool()
def read_pdf_text(file_path: str) -> str:
    """Extracts text from a PDF file."""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        return " ".join([page.extract_text() for page in reader.pages])

if __name__ == "__main__":
    mcp.run()