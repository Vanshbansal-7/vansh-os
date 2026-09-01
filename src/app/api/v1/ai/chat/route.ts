export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VOS_FUNCTION_DECLARATIONS } from "@/lib/ai/vos-tool-declarations";
import { executeVOSTool, ToolExecutionResult } from "@/lib/ai/vos-tool-executor";
import { buildVOSSystemContext } from "@/lib/ai/vos-context";
import { logger } from "@/lib/logger";

const MAX_AGENT_STEPS = 5;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    let apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      apiKey = apiKey.replace(/^["']|["']$/g, "").trim();
    }

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        message: "⚠️ **Gemini API Key Missing in Production Environment**\n\nTo enable Vansh AI on your deployed Vercel site:\n1. Go to your **Vercel Project Dashboard** -> **Settings** -> **Environment Variables**.\n2. Add `GEMINI_API_KEY` with your Google Gemini API key value.\n3. Redeploy your project.",
        executedTools: [],
      });
    }

    const body = await req.json();
    const { messages, attachments, currentRoute } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemInstruction = await buildVOSSystemContext(currentRoute);
    const genAI = new GoogleGenerativeAI(apiKey);

    // Primary official model: gemini-3.6-flash
    let modelName = "gemini-3.6-flash";
    let model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction,
      tools: [{ functionDeclarations: VOS_FUNCTION_DECLARATIONS }],
    });

    // Format previous history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: m.parts || [{ text: m.content }],
    }));

    const latestMessageObj = messages[messages.length - 1];
    const userParts: any[] = [];

    // Attach multimodal files (PDF / Image) if present
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.data && att.type) {
          // Remove data:image/...;base64, prefix if present
          const base64Data = att.data.includes("base64,") ? att.data.split("base64,")[1] : att.data;
          userParts.push({
            inlineData: {
              data: base64Data,
              mimeType: att.type,
            },
          });
        }
      }
    }

    userParts.push({ text: latestMessageObj.content || "Please process this request." });

    let chat = model.startChat({ history });
    let result;

    try {
      result = await chat.sendMessage(userParts);
    } catch (modelErr: any) {
      logger.warn(`Gemini model ${modelName} failed, falling back to gemini-1.5-flash`, { modelErr });
      modelName = "gemini-1.5-flash";
      model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        tools: [{ functionDeclarations: VOS_FUNCTION_DECLARATIONS }],
      });
      chat = model.startChat({ history });
      result = await chat.sendMessage(userParts);
    }

    const executedToolsLog: Array<{ name: string; args: any; result: ToolExecutionResult }> = [];
    let allCitations: any[] = [];
    let finalNavigatedTo: string | undefined;

    // Multi-Step Autonomous Agent Execution Loop
    let currentStep = 0;
    while (currentStep < MAX_AGENT_STEPS) {
      currentStep++;
      const response = result.response;
      const functionCalls = response.functionCalls();

      if (!functionCalls || functionCalls.length === 0) {
        break; // No further tool calls requested by model
      }

      const functionResponses = [];

      for (const call of functionCalls) {
        const name = call.name;
        const args = call.args;
        
        const toolResult = await executeVOSTool(name, args as any);
        executedToolsLog.push({ name, args, result: toolResult });

        if (toolResult.navigatedTo) {
          finalNavigatedTo = toolResult.navigatedTo;
        }

        if (toolResult.citations && Array.isArray(toolResult.citations)) {
          allCitations = [...allCitations, ...toolResult.citations];
        }

        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        });
      }

      // Send tool outputs back into the conversation turn
      result = await chat.sendMessage(functionResponses);
    }

    const finalText = result.response.text() || "I have executed the requested actions.";

    return NextResponse.json({
      success: true,
      message: finalText,
      executedTools: executedToolsLog,
      navigatedTo: finalNavigatedTo,
      citations: allCitations,
    });
  } catch (error: any) {
    logger.error("Error in AI Chat Route", { requestId, error });
    return NextResponse.json({
      success: false,
      message: `Failed to process AI request: ${error.message}`,
      executedTools: [],
    }, { status: 500 });
  }
}
