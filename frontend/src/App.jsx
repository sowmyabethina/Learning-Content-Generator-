import { useState } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Upload, CheckCircle, BrainCircuit, ArrowRight, Award } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Quiz, 3: Topic/Result
  const [quiz, setQuiz] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Upload and immediately generate quiz based on resume skills
  const handleUploadAndQuiz = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      // 1. Extract text
      const uploadRes = await axios.post('http://127.0.0.1:8000/upload-pdf', formData);
      const resumeText = uploadRes.data.text;

      // 2. Automatically trigger quiz based on that text
      const quizRes = await axios.post('http://127.0.0.1:8000/generate-quiz', {
        context_text: resumeText,
        topic: "Technical Assessment"
      });
      
      setQuiz(quizRes.data.quiz);
      setStep(2); // Move to Quiz
    } catch (err) {
      alert("Error: Make sure your Python backend is running!");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Score the quiz
  const submitQuiz = async () => {
    const answersArray = quiz.map((_, i) => userAnswers[i] ?? -1);
    const res = await axios.post('http://127.0.0.1:8000/evaluate', {
      user_answers: answersArray,
      quiz_data: quiz
    });
    setResults(res.data);
    setStep(3); // Move to Results
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><BrainCircuit size={24} /></div>
          <h1 className="text-xl font-bold">AI Interviewer</h1>
        </div>
        <div className="flex items-center gap-4">
          <SignedOut><SignInButton mode="modal" /></SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <SignedIn>
          {loading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-blue-600 font-bold">Analyzing Resume & Generating Questions...</p>
            </div>
          )}

          {/* STEP 1: UPLOAD */}
          {!loading && step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center border">
              <Upload size={48} className="mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2">Upload Resume to Start</h2>
              <p className="text-slate-500 mb-8">We will generate questions based on your skills automatically.</p>
              <label className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all inline-block">
                Choose PDF
                <input type="file" onChange={handleUploadAndQuiz} className="hidden" />
              </label>
            </div>
          )}

          {/* STEP 2: QUIZ */}
          {!loading && step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-4">Technical Assessment</h2>
              {quiz.map((q, qIdx) => (
                <div key={qIdx} className="bg-white p-6 rounded-xl shadow-md border">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-bold text-lg">{qIdx + 1}. {q.question}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                      q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {q.difficulty?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="grid gap-2">
                    {q.options.map((opt, oIdx) => (
                      <button 
                        key={oIdx} 
                        onClick={() => setUserAnswers({...userAnswers, [qIdx]: oIdx})}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          userAnswers[qIdx] === oIdx ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg">
                Submit & Get My Level
              </button>
            </div>
          )}

          {/* STEP 3: RESULTS */}
          {!loading && step === 3 && (
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border">
              <Award size={64} className="mx-auto mb-4 text-purple-500" />
              <h2 className="text-4xl font-black mb-2">Evaluation Result</h2>
              <div className="flex gap-4 justify-center my-8">
                <div className="bg-blue-50 p-6 rounded-2xl border flex-1">
                  <p className="text-sm font-bold text-slate-400">SCORE</p>
                  <p className="text-4xl font-black text-blue-600">{results.score} / 5</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl border flex-1">
                  <p className="text-sm font-bold text-slate-400">LEVEL</p>
                  <p className="text-4xl font-black text-purple-600">{results.level}</p>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="text-blue-600 font-bold hover:underline">
                Upload Another Resume
              </button>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="text-center py-20">
            <h1 className="text-5xl font-black mb-4">Master Your Next <span className="text-blue-600">Interview.</span></h1>
            <p className="text-xl text-slate-500 mb-8">AI-driven assessments tailored to your unique profile.</p>
            <SignInButton mode="modal">
              <button className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold">Sign In to Start</button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}