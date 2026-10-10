import "dotenv/config";

console.log("Key loaded:", Boolean(process.env.GEMINI_API_KEY));
console.log("Key length:", process.env.GEMINI_API_KEY?.length);
console.log("Key prefix:", process.env.GEMINI_API_KEY?.slice(0, 3));
