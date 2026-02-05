import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

console.log("GEMINI_API_KEY from backend:", process.env.GEMINI_API_KEY);
console.log("API_KEY ends with:", process.env.GEMINI_API_KEY?.slice(-10));
