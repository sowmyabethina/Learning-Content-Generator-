import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai  # NEW IMPORT
from google.genai import types
from dotenv import load_dotenv
import PyPDF2
import io

load_dotenv()

# NEW CLIENT INITIALIZATION
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
    topic: str = "General"

# Added a "Home" route so you don't see 404 anymore!
@app.get("/")
async def root():
    return {"message": "AI Learning Backend is running!"}

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = "".join([page.extract_text() for page in pdf_reader.pages])
    return {"extracted_text": text}

@app.post("/generate-quiz")
async def generate_quiz(data: QuizRequest):
    prompt = f"Context: {data.context_text}\nTopic: {data.topic}\nGenerate 5 technical MCQs. Return ONLY JSON: [{{'question': '...', 'options': ['...'], 'answer_index': 0}}]"
    
    # NEW GENERATION CALL
    response = client.models.generate_content(
        model=MODEL_ID,
        contents=prompt
    )
    
    # Clean output
    clean_json = response.text.replace("```json", "").replace("```", "").strip()
    return {"quiz": clean_json}