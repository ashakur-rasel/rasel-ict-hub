import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { message } = await req.json();
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction:
        "You are an assistant for Rasel ICT Hub. The lead instructor is Ashakur Rahaman Rasel. You help students with ICT, Programming, and Tech tips. Keep answers concise and in Bengali if the user asks in Bengali.",
    });

    // কাস্টম প্রম্পট যেন সে ইনস্ট্রাক্টরের নাম এবং আইসিটি হাব নিয়ে কথা বলে
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Got it" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 },
    );
  }
}
