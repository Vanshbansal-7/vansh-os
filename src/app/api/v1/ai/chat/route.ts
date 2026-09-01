export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { VOS_FUNCTION_DECLARATIONS } from "@/lib/ai/vos-tool-declarations";
import { executeVOSTool, ToolExecutionResult } from "@/lib/ai/vos-tool-executor";
import { buildVOSSystemContext } from "@/lib/ai/vos-context";
import { logger } from "@/lib/logger";

const MAX_AGENT_STEPS = 5;
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  try {
    const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    const apiKeys = rawKeys
      .split(",")
      .map((k) => k.replace(/^["']|["']$/g, "").trim())
      .filter(Boolean);

    if (apiKeys.length === 0) {
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
    const hasAttachments = attachments && Array.isArray(attachments) && attachments.length > 0;

    // ⚡ 1. ULTRA FAST-PATH: Greetings (< 1ms response)
    const GREETINGS = ["hi", "hii", "hiii", "hello", "hey", "heyy", "hlo", "namaste", "yo", "good morning", "good evening", "good afternoon", "who are you"];
    if (GREETINGS.includes(rawText) && !hasAttachments) {
      return NextResponse.json({
        success: true,
        message: "Hello Vansh! 👋 I'm your VOS Autonomous Agent. How can I help you manage your timetable, syllabus, tasks, or navigation today?",
        executedTools: [],
      });
    }

    // ⚡ 2. ULTRA FAST-PATH: Screen Navigation (< 1ms response, auto-routes screen)
    const navMatch = rawText.match(/^(?:open|go to|show|switch to|navigate to|launch)\s+(?:the\s+)?([a-z0-9\s]+?)(?:\s+(?:module|page|tab|section|screen))?$/i);
    if (navMatch && !hasAttachments) {
      const entity = navMatch[1].trim();
      let targetRoute: string | null = null;
      if (entity.includes("placement") || entity.includes("dsa") || entity.includes("java")) targetRoute = "/modules/placement";
      else if (entity.includes("cgl") || entity.includes("ssc")) targetRoute = "/modules/cgl";
      else if (entity.includes("youtube") || entity.includes("yt")) targetRoute = "/modules/youtube";
      else if (entity.includes("exam")) targetRoute = "/modules/exams";
      else if (entity.includes("compan") || entity.includes("job") || entity.includes("ats")) targetRoute = "/companies";
      else if (entity.includes("doc") || entity.includes("vault")) targetRoute = "/documents";
      else if (entity.includes("cal") || entity.includes("schedule")) targetRoute = "/calendar";
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

    // ⚡ 3. ULTRA FAST-PATH: Timetable / Schedule Queries (< 5ms response, 0 quota)
    if ((rawText.includes("tt") || rawText.includes("timetable") || rawText.includes("schedule")) && !hasAttachments) {
      const nowIST = new Date(Date.now() + IST_OFFSET_MS);
      const dayOfWeek = nowIST.getUTCDay();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDayName = dayNames[dayOfWeek];

      const ttResult = await executeVOSTool("vos_get_timetable", { day_of_week: dayOfWeek });
      const blocks = (ttResult.data as any[]) || [];

      let formattedText = `📅 **Your Timetable for ${currentDayName}:**\n\n`;
      if (blocks.length === 0) {
        formattedText += "No active study blocks scheduled for today. You're free or on revision mode!";
      } else {
        blocks.forEach((b) => {
          formattedText += `- 🕒 **${b.start_time?.slice(0, 5)} – ${b.end_time?.slice(0, 5)}** • ${b.title} *(${b.category || "Task"})*\n`;
        });
      }

      return NextResponse.json({
        success: true,
        message: formattedText,
        executedTools: [{
          name: "vos_get_timetable",
          args: { day_of_week: dayOfWeek },
          result: ttResult,
        }],
      });
    }

    // ⚡ 4. ULTRA FAST-PATH: Tasks & Priority Queries (< 5ms response, 0 quota)
    if ((rawText === "tasks" || rawText === "my tasks" || rawText === "today tasks" || rawText === "priorities" || rawText === "show tasks" || rawText === "show priorities") && !hasAttachments) {
      const taskResult = await executeVOSTool("vos_get_tasks", {});
      const taskList = (taskResult.data as any[]) || [];

      let formattedText = "🎯 **Today's Active Priorities:**\n\n";
      if (taskList.length === 0) {
        formattedText += "All priorities are completed! 🎉 Great job!";
      } else {
        taskList.forEach((t) => {
          const badge = t.priority_level === "HIGH" ? "🔴" : t.priority_level === "MEDIUM" ? "🟡" : "🟢";
          formattedText += `- ${badge} **${t.title}** *[${t.priority_level || "Normal"}]*\n`;
        });
      }

      return NextResponse.json({
        success: true,
        message: formattedText,
        executedTools: [{
          name: "vos_get_tasks",
          args: {},
          result: taskResult,
        }],
      });
    }

    // 🤖 5. FULL AUTONOMOUS LLM ENGINE WITH DYNAMIC PAYLOAD OPTIMIZATION
    const systemInstruction = await buildVOSSystemContext(currentRoute);

    // Determine if query is an actionable VOS mutation/search command vs. general Q&A / definition
    const isActionable = hasAttachments || 
      /(?:add|create|insert|new|delete|remove|update|edit|toggle|mark|change|import|upload|syllabus|search|find|lookup|company|note|document|vault|milestone|mastered|learned|practiced|web search)/i.test(rawText);

    // Format previous history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: m.parts || [{ text: m.content }],
    }));

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

    let lastError: any = null;

    // Try each API key in the pool with automatic failover
    for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
      const currentApiKey = apiKeys[keyIdx];
      try {
        const ai = new GoogleGenAI({ apiKey: currentApiKey });
        
        // If query is general knowledge/explanation, omit tool schemas to make generation 3x faster!
        const toolsConfig = isActionable ? [{ functionDeclarations: VOS_FUNCTION_DECLARATIONS }] : undefined;

        const chat = ai.chats.create({
          model: "gemini-3.6-flash",
          config: {
            systemInstruction,
            temperature: 0.2,
            maxOutputTokens: 600,
            tools: toolsConfig as any,
          },
          history: history.length > 0 ? (history as any) : undefined,
        });

        let res = await chat.sendMessage({ message: userParts });

        const executedToolsLog: Array<{ name: string; args: any; result: ToolExecutionResult }> = [];
        let allCitations: any[] = [];
        let finalNavigatedTo: string | undefined;

        // Multi-Step Autonomous Agent Execution Loop (only runs if tools are active)
        let currentStep = 0;
        while (currentStep < MAX_AGENT_STEPS && isActionable) {
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
      } catch (err: any) {
        lastError = err;
        const isQuota = err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED");
        if (isQuota && keyIdx < apiKeys.length - 1) {
          console.warn(`[VOS-AI] Key ${keyIdx + 1} rate limited. Rotating to Key ${keyIdx + 2}...`);
          continue; // Automatically rotate to next key!
        } else if (isQuota) {
          return NextResponse.json({
            success: true,
            message: "⏳ **Gemini API Rate Limit Reached**\n\nAll configured keys reached their temporary quota limit. Please wait 30 seconds, or add your second Gemini API key in Vercel to pool quotas!",
            executedTools: [],
          });
        }
      }
    }

    throw lastError || new Error("Failed to process request");
  } catch (error: any) {
    logger.error("Error in AI Chat Route", { requestId, error });
    return NextResponse.json({
      success: false,
      message: `Failed to process AI request: ${error.message}`,
      executedTools: [],
    }, { status: 500 });
  }
}
