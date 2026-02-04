import { useState } from 'react';
import axios from 'axios';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function App() {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('upload'); // 'upload', 'goal', 'quiz'
  const [topic, setTopic] = useState('');
  const [learningStyle, setLearningStyle] = useState('Standard');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const startLearningFlow = async () => {
    if (!file) return alert("Please upload a PDF first!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Step 1: Upload PDF to get extracted text
      const uploadRes = await axios.post('http://127.0.0.1:8000/upload-pdf', formData);
      const extractedText = uploadRes.data.extracted_text;

      // Step 2: Send text to Gemini to generate the quiz
      const quizRes = await axios.post('http://127.0.0.1:8000/generate-quiz', {
        context_text: extractedText,
        topic: "Technical Interview"
      });

      // Gemini returns a string, so we parse it into a JSON array
      setQuiz(JSON.parse(quizRes.data.quiz));
    } catch (err) {
      console.error(err);
      alert("Error processing your request. Make sure your Python backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 font-sans max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-10 border-b pb-4">
        <h1 className="text-2xl font-bold text-blue-600">AI Learning Agent</h1>
        <SignedOut><SignInButton /></SignedOut>
        <SignedIn><UserButton /></SignedIn>
      </div>

      <SignedIn>
        <div className="bg-white shadow p-6 rounded-lg mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload your Resume (PDF)</label>
          <input type="file" onChange={handleFileChange} className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
          <button 
            onClick={startLearningFlow} 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Generate Technical Quiz"}
          </button>
        </div>

        {quiz.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Skills Assessment</h2>
            {quiz.map((item, idx) => (
              <div key={idx} className="p-4 border rounded bg-gray-50">
                <p className="font-semibold mb-2">{idx + 1}. {item.question}</p>
                {item.options.map((opt, i) => (
                  <button key={i} className="block w-full text-left p-2 mt-1 bg-white border rounded hover:bg-blue-50">
                    {opt}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}