import os
import io
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import PyPDF2

load_dotenv()

# New Gemini 2.5 Flash Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_ID = "gemini-2.5-flash"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    context_text: str
    topic: str

class EvalRequest(BaseModel):
    user_answers: list
    quiz_data: list

@app.get("/")
async def root():
    return {"status": "Backend is Online"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Invalid file type. Upload a PDF.")
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = "".join([page.extract_text() for page in pdf_reader.pages])
    return {"text": text}

@app.post("/generate-quiz")
async def generate_quiz(data: QuizRequest):
    prompt = f"""
    You are an expert technical interviewer conducting a theoretical knowledge assessment.
    
    ## RULES FOR QUESTION GENERATION:
    1. Analyze the candidate's resume/context thoroughly to identify their technical skills, projects, and areas of expertise.
    2. Generate questions that test CONCEPTUAL UNDERSTANDING, not just memorization.
    3. Focus on "why" and "how" questions that reveal depth of knowledge.
    4. Questions should require candidates to explain concepts, trade-offs, best practices, and real-world applications.
    5. Include scenario-based questions that test problem-solving abilities.
    6. Mix of difficulty levels: 2 easy (foundational concepts), 2 medium (application of concepts), 1 hard (advanced scenarios or optimizations).
    7. Each question must have 4 options with only ONE correct answer.
    8. Ensure questions are specific to technologies/frameworks mentioned in the resume.
    
    ## INTERVIEWER PERSONA:
    - Be professional, precise, and challenging.
    - Questions should simulate real interview scenarios.
    - Test both theoretical knowledge and practical understanding.
    
    ## CONTEXT:
    {data.context_text}
    
    ## TARGET SKILLS/TOPIC:
    {data.topic}
    
    ## OUTPUT FORMAT:
    Return a JSON array of 5 questions with this structure:
    [
        {{
            "question": "The interview question (clear, specific, theoretical)",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer_index": 0-3,
            "explanation": "Brief explanation of why the correct answer is right (for feedback)",
            "difficulty": "easy|medium|hard"
        }}
    ]
    
    IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.
    """
    response = client.models.generate_content(model=MODEL_ID, contents=prompt)
    # Clean JSON output from Gemini
    clean_json = response.text.strip().replace("```json", "").replace("```", "")
    return {"quiz": json.loads(clean_json)}

@app.post("/evaluate")
async def evaluate(data: EvalRequest):
    score = 0
    for i, ans in enumerate(data.user_answers):
        if ans == data.quiz_data[i]['answer_index']:
            score += 1
    
    level = "Beginner" if score <= 2 else "Intermediate" if score <= 4 else "Expert"
    return {"score": score, "level": level}