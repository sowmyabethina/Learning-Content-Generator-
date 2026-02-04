import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import axios from 'axios';

export default function App() {
  const [quiz, setQuiz] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await axios.post("http://localhost:8000/upload", formData);
    // After upload, trigger quiz generation
    const quizRes = await axios.post("http://localhost:8000/generate-quiz", {
      context_text: res.data.extracted_text
    });
    setQuiz(JSON.parse(quizRes.data.quiz));
  };

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">AI Learner</h1>
        <SignedOut><SignInButton mode="modal" /></SignedOut>
        <SignedIn><UserButton /></SignedIn>
      </header>

      <SignedIn>
        <input type="file" onChange={handleUpload} className="mb-4" />
        {quiz && (
          <div className="bg-gray-100 p-4 rounded">
            {quiz.map((q, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold">{q.question}</p>
                {q.options.map((opt, j) => (
                  <button key={j} className="block border p-1 m-1 w-full text-left">{opt}</button>
                ))}
              </div>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}