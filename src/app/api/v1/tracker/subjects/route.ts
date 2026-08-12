import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { trackerRepository } from "@/repositories/tracker.repository";
import { createSubjectSchema } from "@/lib/validations/tracker.schema";

export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const searchParams = req.nextUrl.searchParams;
  const rawModule = searchParams.get("module") || "PLACEMENT";
  const examId = searchParams.get("exam_id") || undefined;
  
  const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'];
  const moduleName = allowedModules.includes(rawModule.toUpperCase()) ? rawModule.toUpperCase() : "EXAMS";

  logger.info("Handling GET /api/v1/tracker/subjects", { requestId, moduleName, examId });

  try {
    const subjects = await trackerRepository.findSubjectsByModule(moduleName, examId);
    return NextResponse.json({
      success: true,
      data: subjects,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("GET /api/v1/tracker/subjects failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to fetch subjects", code: "SUBJECTS_FETCH_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/tracker/subjects", { requestId });

  try {
    const body = await req.json();
    const validated = createSubjectSchema.parse(body);

    const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE'];
    if (!allowedModules.includes(validated.module.toUpperCase())) {
      validated.module = "EXAMS";
    }

    const newSubject = await trackerRepository.createSubject(validated);
    return NextResponse.json({
      success: true,
      data: newSubject,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("POST /api/v1/tracker/subjects failed", { requestId, err });
    const errorMessage = err?.errors?.[0]?.message || err?.message || "Validation failed";
    return NextResponse.json(
      { success: false, error: { message: errorMessage, code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling PATCH /api/v1/tracker/subjects", { requestId });

  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        { success: false, error: { message: "id and name are required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await trackerRepository.renameSubject(id, name.trim());

    return NextResponse.json({
      success: true,
      data: { id, name: name.trim() },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("PATCH /api/v1/tracker/subjects failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to rename subject", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/tracker/subjects", { requestId });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id parameter is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await trackerRepository.deleteSubject(id);

    return NextResponse.json({
      success: true,
      data: { id },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("DELETE /api/v1/tracker/subjects failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to delete subject", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
