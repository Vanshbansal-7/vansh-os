import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { examsService } from "@/services/exams.service";
import { examsRepository } from "@/repositories/exams.repository";

const ALLOWED_EXAM_CATEGORIES = ['Defense', 'SSC', 'Banking', 'UPSC', 'State PCS'];

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info("Handling GET /api/v1/exams", { requestId });

  try {
    const data = await examsService.getLauncherData();

    return NextResponse.json({
      success: true,
      data,
      meta: { count: data.exams.length, generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("GET /api/v1/exams failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to fetch exams data", code: "EXAMS_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/exams", { requestId });

  try {
    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "Exam name is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const category = ALLOWED_EXAM_CATEGORIES.includes(body.category)
      ? body.category
      : "Defense";

    const baseSlug = body.short_name
      ? body.short_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;

    const newExam = await examsRepository.createExam({
      slug,
      name: body.name.trim(),
      short_name: body.short_name?.trim() || body.name.substring(0, 8),
      category: category as any,
      conducting_body: body.conducting_body || "Official Body",
      official_website: body.official_website || "https://example.gov.in",
      description: body.description || "",
      logo_icon: "Award",
      prep_progress: 0,
      is_active: true,
    });

    return NextResponse.json({
      success: true,
      data: newExam,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("POST /api/v1/exams failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to register exam", code: "CREATE_ERROR" } },
      { status: 500 }
    );
  }
}
