import {
  GoogleGenerativeAI,
  //   HarmCategory,
  //   HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

async function generateSubtasks(mainTask) {
  try {
    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(
      `Generate 5 to 7 subtasks for: ${mainTask} in js array. Only js array and should contain subtasks only.No numbers, no - and nod bulletins.`
    );
    console.log("API Response:", result); // Check the full API response
    const generatedSubtasks = result.response
      .text()
      .split("\n")
      .map((task) => task.replace(/^\s*[\d.-]+\s*/, ""));
    console.log("Generated Subtasks:", generatedSubtasks); // Check subtasks format
    return generatedSubtasks;
  } catch (error) {
    console.error("Error generating subtasks:", error);
    return [];
  }
}

export default generateSubtasks;
