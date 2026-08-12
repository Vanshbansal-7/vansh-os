import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { examsService } from "@/services/exams.service";
import { examsRepository } from "@/repositories/exams.repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const requestId = crypto.randomUUID();
  logger.info("Handling GET /api/v1/exams/[slug]", { requestId, slug });

  try {
    const data = await examsService.getExamWorkspace(slug);

    if (!data.exam) {
      return NextResponse.json(
        { success: false, error: { message: "Exam not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      meta: { slug, generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("GET /api/v1/exams/[slug] failed", { requestId, slug, err });
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch exam workspace", code: "EXAM_WORKSPACE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/exams/[slug]", { requestId, slug });

  try {
    await examsRepository.deleteExam(slug);

    return NextResponse.json({
      success: true,
      data: { slug },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("DELETE /api/v1/exams/[slug] failed", { requestId, slug, err });
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete exam", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
