import { NextResponse } from "next/server";
import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { NotesRepository } from "@/repositories/notes.repository";
import { trackerRepository } from "@/repositories/tracker.repository";
import { companiesRepository } from "@/repositories/companies.repository";
import { youtubeRepository } from "@/repositories/youtube.repository";
import { logger } from "@/lib/logger";

const SYSTEM_INSTRUCTION = `
You are Vansh AI, the hyper-intelligent agent built directly into Vansh OS.
Your core directive is to act as an autonomous agent that can read, navigate, and modify the user's operating system.
You have access to tools that allow you to execute CRUD operations. 

When the user asks you to do something, you should immediately use the appropriate tool.
DO NOT tell the user "I can do this for you", JUST DO IT by calling the tool.

Available Actions:
- Create Notes (General, Exams, YouTube, CGL, Placement)
- Create Tracker Topics (Placement, Exams)
- Add Company Applications (ATS)
- Add YouTube Video Tasks
- Navigate to specific routes in the OS

Always be concise, confident, and professional. 
If you execute a tool, summarize what you did in a brief sentence.
`;

const functionDeclarations: FunctionDeclaration[] = [
  {
    name: "navigateToRoute",
    description: "Navigates the user's screen to a specific application route.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        route: { type: SchemaType.STRING, description: "The route path, e.g. /modules/placement, /companies, /documents, /modules/exams" }
      },
      required: ["route"]
    }
  },
  {
    name: "createNote",
    description: "Creates a new rich-text note in the database.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING, description: "The title of the note" },
        content: { type: SchemaType.STRING, description: "The body content of the note" },
        module: { type: SchemaType.STRING, description: "The module it belongs to: GENERAL, EXAMS, YOUTUBE, CGL, or PLACEMENT" }
      },
      required: ["title", "content", "module"]
    }
  },
  {
    name: "addCompanyApplication",
    description: "Adds a new company application to the ATS tracker.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        company_name: { type: SchemaType.STRING },
        role: { type: SchemaType.STRING },
        status: { type: SchemaType.STRING, description: "One of: Saved, Applied, Interview, Offer, Rejected" }
      },
      required: ["company_name", "role", "status"]
    }
  },
  {
    name: "createTrackerTopic",
    description: "Creates a new topic in a module's progress tracker. NOTE: You must provide a valid subject_id.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        subject_id: { type: SchemaType.STRING },
        name: { type: SchemaType.STRING }
      },
      required: ["subject_id", "name"]
    }
  }
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        message: "⚠️ **Gemini API Key Missing**\n\nPlease add `GEMINI_API_KEY` to your `.env.local` file.",
        executedTools: []
      });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations }],
    });

    // Format history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: m.parts || [{ text: m.content }]
    }));
    
    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });

    let result = await chat.sendMessage(latestMessage);
    const response = result.response;
    const executedToolsLog: { name: string, args: any, result: any }[] = [];
    
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const functionResponses = [];

      for (const call of functionCalls) {
        const name = call.name;
        const args = call.args;
        let toolResult: any = { success: false };

        try {
          if (name === "navigateToRoute") {
            toolResult = { success: true, navigatedTo: (args as any).route };
          } 
          else if (name === "createNote") {
            const note = await NotesRepository.create({
              title: (args as any).title,
              content: (args as any).content,
              module: (args as any).module as any
            });
            toolResult = { success: true, id: note.id };
          }
          else if (name === "addCompanyApplication") {
            const comp = await companiesRepository.createCompany({
              company_name: (args as any).company_name,
              role: (args as any).role,
              status: (args as any).status as any,
              applied_date: new Date().toISOString(),
              logo_url: "default",
              application_mode: "careers_page",
              location: "Remote"
            } as any);
            toolResult = { success: true, id: comp.id };
          }
          else {
            toolResult = { success: false, error: "Tool not implemented on server yet." };
          }
        } catch (e: any) {
          logger.error(`Tool execution failed for ${name}`, e);
          toolResult = { success: false, error: e.message };
        }

        executedToolsLog.push({ name, args, result: toolResult });
        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: toolResult
          }
        });
      }

      // Send the tool output back to the model
      result = await chat.sendMessage(functionResponses);
    }

    return NextResponse.json({
      success: true,
      message: result.response.text() || "I executed the command.",
      executedTools: executedToolsLog
    });

  } catch (error: any) {
    logger.error("Error in AI Chat Route", error);
    return NextResponse.json({ 
      success: false, 
      message: `Failed to process AI request: ${error.message}`,
      executedTools: []
    }, { status: 500 });
  }
}
