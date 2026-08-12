import { toolRegistry } from "./tool-registry";
import { ocrProcessor, ExtractedDocumentData } from "./ocr-processor";

export interface AIResponsePayload {
  message: string;
  executed_tools: { name: string; args: any; result: any }[];
  requires_confirmation?: boolean;
  confirmation_data?: {
    action_type: string;
    payload: any;
  };
  ocr_result?: ExtractedDocumentData;
}

export class VanshAIEngine {
  async processCommand(query: string, attachment?: { name: string; type: string }): Promise<AIResponsePayload> {
    const q = query.toLowerCase();
    const executedTools = [];

    // Handle document upload or OCR request
    if (attachment) {
      const ocrResult = await ocrProcessor.processDocument(attachment.name, attachment.type);
      
      if (ocrResult.document_type === "WhatsApp Screenshot") {
        const toolResult = await toolRegistry.executeTool("understandWhatsAppScreenshot", {
          text: ocrResult.raw_text,
        });
        executedTools.push({ name: "understandWhatsAppScreenshot", args: { text: ocrResult.raw_text }, result: toolResult });

        return {
          message: `I analyzed the WhatsApp screenshot! Detected an interview invitation from **${ocrResult.entities["Company Name"]}** on **${ocrResult.entities["Interview Date"]}** at **${ocrResult.entities["Interview Time"]}**.`,
          executed_tools: executedTools,
          requires_confirmation: true,
          confirmation_data: {
            action_type: "ADD_COMPANY_APPLICATION",
            payload: {
              company_name: ocrResult.entities["Company Name"],
              role: ocrResult.entities["Role"],
              applied_date: ocrResult.entities["Interview Date"],
              status: "Interview",
            },
          },
          ocr_result: ocrResult,
        };
      }

      if (ocrResult.document_type === "Aadhaar" || ocrResult.document_type === "PAN") {
        return {
          message: `Extracted structured data from **${ocrResult.document_type}** for **${ocrResult.entities.Name}**.`,
          executed_tools: [
            { name: "extractOCR", args: { document: attachment.name }, result: { success: true } },
          ],
          requires_confirmation: false,
          ocr_result: ocrResult,
        };
      }
    }

    // Intent 1: Navigation Commands
    if (q.includes("open placement")) {
      const toolRes = await toolRegistry.executeTool("openModule", { route: "/modules/placement" });
      return {
        message: "Opening Placement Module workspace...",
        executed_tools: [{ name: "openModule", args: { route: "/modules/placement" }, result: toolRes }],
      };
    }

    if (q.includes("open exams") || q.includes("open afcat")) {
      const route = q.includes("afcat") ? "/modules/exams/afcat" : "/modules/exams";
      const toolRes = await toolRegistry.executeTool("openModule", { route });
      return {
        message: `Opening Exams Command Center workspace...`,
        executed_tools: [{ name: "openModule", args: { route }, result: toolRes }],
      };
    }

    if (q.includes("open companies") || q.includes("show companies")) {
      const toolRes = await toolRegistry.executeTool("openModule", { route: "/companies" });
      return {
        message: "Opening Companies ATS application tracker...",
        executed_tools: [{ name: "openModule", args: { route: "/companies" }, result: toolRes }],
      };
    }

    if (q.includes("open youtube")) {
      const toolRes = await toolRegistry.executeTool("openModule", { route: "/modules/youtube" });
      return {
        message: "Opening YouTube Creator workspace...",
        executed_tools: [{ name: "openModule", args: { route: "/modules/youtube" }, result: toolRes }],
      };
    }

    if (q.includes("open documents")) {
      const toolRes = await toolRegistry.executeTool("openModule", { route: "/documents" });
      return {
        message: "Opening Digital Documents Vault...",
        executed_tools: [{ name: "openModule", args: { route: "/documents" }, result: toolRes }],
      };
    }

    // Intent 2: Search Documents
    if (q.includes("search") || q.includes("find") || q.includes("resume") || q.includes("notes")) {
      const searchRes = await toolRegistry.executeTool("searchDocuments", { query });
      return {
        message: `Found 3 matching entries across Vansh OS documents for "${query}".`,
        executed_tools: [{ name: "searchDocuments", args: { query }, result: searchRes }],
      };
    }

    // Default Intelligence response
    return {
      message: `Vansh AI Intelligence Layer: Understood "${query}". Standing by to execute OS tools across Companies, Documents, Placement, Exams, and YouTube workspaces.`,
      executed_tools: [],
    };
  }
}

export const vanshAIEngine = new VanshAIEngine();
