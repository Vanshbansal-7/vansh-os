import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { resourcesRepository } from "@/repositories/resources.repository";
import { createResourceSchema } from "@/lib/validations/resource.schema";

export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const searchParams = req.nextUrl.searchParams;
  const rawModule = searchParams.get("module") || "PLACEMENT";
  const examId = searchParams.get("exam_id") || undefined;
  
  const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE', 'VAULT'];
  const moduleName = allowedModules.includes(rawModule.toUpperCase()) ? rawModule.toUpperCase() : "EXAMS";

  logger.info("Handling GET /api/v1/resources", { requestId, moduleName, examId });

  try {
    const resources = await resourcesRepository.findByModule(moduleName, examId);
    return NextResponse.json({
      success: true,
      data: resources,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("GET /api/v1/resources failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: "Failed to fetch resources", code: "RESOURCES_FETCH_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/resources", { requestId });

  try {
    const body = await req.json();
    const validated = createResourceSchema.parse(body);

    const allowedModules = ['PLACEMENT', 'CGL', 'EXAMS', 'YOUTUBE', 'VAULT'];
    if (!allowedModules.includes(validated.module.toUpperCase())) {
      validated.module = "EXAMS";
    }

    const newResource = await resourcesRepository.create(validated);
    return NextResponse.json({
      success: true,
      data: newResource,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("POST /api/v1/resources failed", { requestId, err });
    const errorMessage = err?.errors?.[0]?.message || err?.message || "Validation failed";
    return NextResponse.json(
      { success: false, error: { message: errorMessage, code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  }
}
