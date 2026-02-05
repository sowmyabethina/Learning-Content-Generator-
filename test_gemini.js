import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    console.log("API Key:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing");

    const prompt = "Generate 2 simple questions in JSON format: [{\"question\": \"...\", \"options\": [...], \"answer\": \"...\"}]";
    
    console.log("Sending prompt to Gemini...");
    const result = await model.generateContent(prompt);
    
    console.log("Response received!");
    console.log("Response type:", typeof result.response);
    console.log("Response keys:", Object.keys(result.response || {}));
    
    const text = result.response.text();
    console.log("Text type:", typeof text);
    console.log("First 200 chars:", text.substring(0, 200));
    
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error("Error type:", err.constructor.name);
  }
}

test();
