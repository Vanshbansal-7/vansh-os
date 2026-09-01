export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
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
        message: "⚠️ **Gemini API Key Missing**\n\nPlease add `GEMINI_API_KEY` to your `.env.local` file or Vercel Environment Variables.",
        executedTools: [],
      });
    }

    const body = await req.json();
    const { messages, attachments, currentRoute } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const latestMessageObj = messages[messages.length - 1];
    const rawText = (latestMessageObj.content || "").trim().toLowerCase();

    // ⚡ 1. ULTRA FAST-PATH: Instant Greetings (< 1ms response)
    const GREETINGS = ["hi", "hii", "hiii", "hello", "hey", "heyy", "hlo", "namaste", "yo", "good morning", "good evening", "good afternoon", "who are you"];
    if (GREETINGS.includes(rawText) && (!attachments || attachments.length === 0)) {
      return NextResponse.json({
        success: true,
        message: "Hello Vansh! 👋 I am your VOS Autonomous AI Agent. Ask me to open any module, import syllabus, manage timetable, add priorities, or search your files and web.",
        executedTools: [],
      });
    }

    // ⚡ 2. ULTRA FAST-PATH: Direct Screen Navigation (< 1ms response, auto-routes screen)
    const navMatch = rawText.match(/^(?:open|go to|show|switch to|navigate to|launch)s+(?:thes+)?([a-z0-9s]+?)(?:s+(?:module|page|tab|section|screen))?$/i);
    if (navMatch && (!attachments || attachments.length === 0)) {
      const entity = navMatch[1].trim();
      let targetRoute: string | null = null;
      if (entity.includes("placement") || entity.includes("dsa") || entity.includes("java")) targetRoute = "/modules/placement";
      else if (entity.includes("cgl") || entity.includes("ssc")) targetRoute = "/modules/cgl";
      else if (entity.includes("youtube") || entity.includes("yt")) targetRoute = "/modules/youtube";
      else if (entity.includes("exam")) targetRoute = "/modules/exams";
      else if (entity.includes("compan") || entity.includes("job") || entity.includes("ats")) targetRoute = "/companies";
      else if (entity.includes("doc") || entity.includes("vault")) targetRoute = "/documents";
      else if (entity.includes("cal") || entity.includes("schedule") || entity.includes("time")) targetRoute = "/calendar";
      else if (entity.includes("streak") || entity.includes("hab")) targetRoute = "/streak";
      else if (entity.includes("ana") || entity.includes("stat")) targetRoute = "/analytics";
      else if (entity.includes("sys") || entity.includes("term") || entity.includes("set")) targetRoute = "/system";
      else if (entity === "home" || entity === "dashboard" || entity === "main") targetRoute = "/";

      if (targetRoute) {
        return NextResponse.json({
          success: true,
          message: `Opening ${targetRoute}...`,
          executedTools: [{
            name: "vos_navigate",
            args: { route: targetRoute },
            result: { success: true, navigatedTo: targetRoute, message: `Navigated to ${targetRoute}` }
          }],
          navigatedTo: targetRoute,
        });
      }
    }

    // 🤖 3. FULL AUTONOMOUS LLM ENGINE (Gemini 3.6 Flash)
    const systemInstruction = await buildVOSSystemContext(currentRoute);
    const ai = new GoogleGenAI({ apiKey });

    // Format previous history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: m.parts || [{ text: m.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
        temperature: 0.2,
        tools: [{ functionDeclarations: VOS_FUNCTION_DECLARATIONS }],
      },
      history: history.length > 0 ? (history as any) : undefined,
    });

    const userParts: any[] = [];

    // Attach multimodal files (PDF / Image) if present
    if (attachments && Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.data && att.type) {
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

    let res = await chat.sendMessage({ message: userParts });

    const executedToolsLog: Array<{ name: string; args: any; result: ToolExecutionResult }> = [];
    let allCitations: any[] = [];
    let finalNavigatedTo: string | undefined;

    // Multi-Step Autonomous Agent Execution Loop
    let currentStep = 0;
    while (currentStep < MAX_AGENT_STEPS) {
      currentStep++;
      const functionCalls = res.functionCalls;

      if (!functionCalls || functionCalls.length === 0) {
        break;
      }

      const functionResponses = [];

      for (const call of functionCalls) {
        const name = call.name;
        if (!name) continue;
        const args = (call.args || {}) as Record<string, any>;
        
        const toolResult = await executeVOSTool(name, args);
        executedToolsLog.push({ name, args, result: toolResult });

        if (toolResult.navigatedTo) {
          finalNavigatedTo = toolResult.navigatedTo;
        }

        if (toolResult.citations && Array.isArray(toolResult.citations)) {
          allCitations = [...allCitations, ...toolResult.citations];
        }

        functionResponses.push({
          functionResponse: {
            name,
            response: toolResult as Record<string, any>,
          },
        });
      }

      // Send tool outputs back to model in next loop iteration
      res = await chat.sendMessage({ message: functionResponses as any });
    }

    const finalText = res.text || "I have executed the requested actions.";

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
