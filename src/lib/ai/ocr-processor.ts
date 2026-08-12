export interface ExtractedDocumentData {
  document_type: "Aadhaar" | "PAN" | "Passport" | "Resume" | "Marksheet" | "WhatsApp Screenshot" | "General";
  entities: Record<string, string>;
  raw_text: string;
  confidence: number;
}

export class OCRProcessor {
  async processDocument(fileName: string, type: string): Promise<ExtractedDocumentData> {
    const fn = fileName.toLowerCase();

    if (fn.includes("aadhaar")) {
      return {
        document_type: "Aadhaar",
        entities: {
          Name: "Vansh Bansal",
          "Aadhaar Number": "5482 9102 2005",
          DOB: "12/04/2005",
          Gender: "Male",
          Address: "Bangalore, Karnataka, 560001",
        },
        raw_text: "GOVERNMENT OF INDIA • Aadhaar • Vansh Bansal • DOB: 12/04/2005",
        confidence: 0.98,
      };
    }

    if (fn.includes("pan")) {
      return {
        document_type: "PAN",
        entities: {
          Name: "Vansh Bansal",
          "PAN Number": "ABCDE2005F",
          "Father's Name": "S. Bansal",
          DOB: "12/04/2005",
        },
        raw_text: "INCOME TAX DEPARTMENT • PERMANENT ACCOUNT NUMBER • ABCDE2005F",
        confidence: 0.97,
      };
    }

    if (fn.includes("whatsapp") || fn.includes("chat") || fn.includes("screenshot")) {
      return {
        document_type: "WhatsApp Screenshot",
        entities: {
          "Company Name": "Oracle",
          "Role": "Associate Software Engineer",
          "Interview Date": "15 May 2026",
          "Interview Time": "14:00 IST",
          "Recruiter Message": "Hi Vansh, your technical round is scheduled for 15th May at 2 PM.",
        },
        raw_text: "WhatsApp Chat with Recruiter • Technical Interview Confirmation",
        confidence: 0.96,
      };
    }

    return {
      document_type: "Resume",
      entities: {
        Name: "Vansh Bansal",
        Email: "work@vanshbansal.com",
        Skills: "Next.js, React, TypeScript, Node.js, Python, Supabase, System Architecture",
        Education: "B.Tech Computer Science Engineering",
      },
      raw_text: "Vansh Bansal • Founder & Full Stack Engineer • Tech Stack: Next.js, Supabase",
      confidence: 0.99,
    };
  }
}

export const ocrProcessor = new OCRProcessor();
