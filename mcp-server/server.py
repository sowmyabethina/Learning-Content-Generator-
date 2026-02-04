from fastmcp import FastMCP

mcp = FastMCP("PersonalLearner")

@mcp.tool()
def get_knowledge_level(score: int) -> str:
    """Categorizes user based on quiz score."""
    if score <= 2: return "Beginner"
    if score <= 4: return "Intermediate"
    return "Advanced"

if __name__ == "__main__":
    mcp.run()