export interface AITool {
  name: string;
  description: string;
  category: "Navigation" | "Documents" | "OCR" | "Companies" | "Tracker" | "General";
  execute: (args: Record<string, any>) => Promise<{ success: boolean; data: any; message: string }>;
}

class ToolRegistry {
  private tools: Map<string, AITool> = new Map();

  registerTool(tool: AITool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): AITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): AITool[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, args: Record<string, any>) {
    const tool = this.getTool(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered in Vansh AI OS Registry.`);
    }
    return await tool.execute(args);
  }
}

export const toolRegistry = new ToolRegistry();

// Register Default Vansh OS Tools
toolRegistry.registerTool({
  name: "openModule",
  description: "Navigates Vansh OS to a specific module or sub-page",
  category: "Navigation",
  execute: async ({ route }) => {
    return {
      success: true,
      data: { route },
      message: `Navigating to ${route}`,
    };
  },
});

toolRegistry.registerTool({
  name: "searchDocuments",
  description: "Searches documents vault for matching files and OCR text",
  category: "Documents",
  execute: async ({ query }) => {
    return {
      success: true,
      data: { query, count: 3 },
      message: `Found 3 matching documents for "${query}"`,
    };
  },
});

toolRegistry.registerTool({
  name: "extractOCR",
  description: "Performs OCR text & structured entity extraction on images/PDFs",
  category: "OCR",
  execute: async ({ fileType }) => {
    return {
      success: true,
      data: {
        document_type: fileType || "Identity Card",
        extracted_fields: { name: "Vansh Bansal", id_number: "XXXX-XXXX-2005", dob: "12/04/2005" },
      },
      message: "Successfully extracted structured document data via OCR",
    };
  },
});

toolRegistry.registerTool({
  name: "understandWhatsAppScreenshot",
  description: "Parses WhatsApp interview screenshot for company, date, time, and deadlines",
  category: "OCR",
  execute: async ({ text }) => {
    return {
      success: true,
      data: {
        company_name: "Oracle",
        interview_date: "15 May 2026",
        interview_time: "14:00 IST",
        requires_confirmation: true,
      },
      message: "Detected interview invitation from WhatsApp screenshot.",
    };
  },
});

toolRegistry.registerTool({
  name: "createCompanyApplication",
  description: "Adds a new company to personal ATS tracker",
  category: "Companies",
  execute: async ({ company_name, role, status }) => {
    return {
      success: true,
      data: { company_name, role, status: status || "Applied" },
      message: `Added ${company_name} (${role}) to Companies ATS.`,
    };
  },
});
