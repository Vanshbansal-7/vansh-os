import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const searchParams = req.nextUrl.searchParams;
  const q = searchParams.get("q") || "";

  logger.info("Handling GET /api/v1/search", { requestId, q });

  try {
    const pool = [
      { id: "s-1", title: "TCS Software Engineer Application", subtitle: "Companies ATS • Applied 04 May 2025", category: "Company", url: "/companies" },
      { id: "s-2", title: "Infosys Systems Engineer", subtitle: "Companies ATS • Assessment Phase", category: "Company", url: "/companies" },
      { id: "s-3", title: "Wipro Project Engineer", subtitle: "Companies ATS • Interview Phase", category: "Company", url: "/companies" },
      { id: "s-4", title: "AFCAT 02/2026 Exam Hub", subtitle: "Exams Command Center • Flying Branch", category: "Exam", url: "/modules/exams/afcat" },
      { id: "s-5", title: "CDS 02/2026 Strategy", subtitle: "Exams Command Center • IMA / INA", category: "Exam", url: "/modules/exams/cds" },
      { id: "s-6", title: "Building Vansh OS Ep 04 - Auth & UI", subtitle: "YouTube Creator Module • Video Production", category: "YouTube", url: "/modules/youtube" },
      { id: "s-7", title: "Top 7 AI Tools for CS Students 2026", subtitle: "YouTube Creator Module • Published Video", category: "YouTube", url: "/modules/youtube" },
      { id: "s-8", title: "Complete DSA Roadmap for Placements", subtitle: "Placement Tracker • Data Structures", category: "Placement", url: "/modules/placement" },
      { id: "s-9", title: "DSA Roadmap.pdf", subtitle: "Documents Vault • /Study Materials/DSA", category: "Document", url: "/documents" },
      { id: "s-10", title: "Resume_Vansh_Bansal.docx", subtitle: "Documents Vault • /Placement/Resume", category: "Document", url: "/documents" },
    ];

    const results = q.trim()
      ? pool.filter(
          (item) =>
            item.title.toLowerCase().includes(q.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(q.toLowerCase()) ||
            item.category.toLowerCase().includes(q.toLowerCase())
        )
      : pool.slice(0, 5);

    return NextResponse.json({
      success: true,
      data: results,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("GET /api/v1/search failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: "Search failed", code: "SEARCH_ERROR" } },
      { status: 500 }
    );
  }
}
