import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { youtubeService } from "@/services/youtube.service";
import { youtubeRepository } from "@/repositories/youtube.repository";

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info("Handling GET /api/v1/youtube", { requestId });

  try {
    const data = await youtubeService.getModuleData();
    const tasks = await youtubeRepository.getVideoTasks();

    return NextResponse.json({
      success: true,
      data: { ...data, tasks },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("GET /api/v1/youtube failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to fetch YouTube creator data", code: "YOUTUBE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/youtube", { requestId });

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "save_profile") {
      if (!body.profile) {
        return NextResponse.json(
          { success: false, error: { message: "Profile payload is required", code: "VALIDATION_ERROR" } },
          { status: 400 }
        );
      }
      const profile = await youtubeRepository.saveProfile(body.profile);
      return NextResponse.json({
        success: true,
        data: profile,
        meta: { generated_at: new Date().toISOString() },
      });
    }

    if (action === "create_task") {
      if (!body.title?.trim()) {
        return NextResponse.json(
          { success: false, error: { message: "Video title is required", code: "VALIDATION_ERROR" } },
          { status: 400 }
        );
      }
      const task = await youtubeRepository.createVideoTask(body.title.trim(), body.category || "Content");
      return NextResponse.json({
        success: true,
        data: task,
        meta: { generated_at: new Date().toISOString() },
      });
    }

    return NextResponse.json(
      { success: false, error: { message: "Invalid action", code: "INVALID_ACTION" } },
      { status: 400 }
    );
  } catch (err: any) {
    logger.error("POST /api/v1/youtube failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to process YouTube POST request", code: "POST_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling PATCH /api/v1/youtube", { requestId });

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await youtubeRepository.updateVideoTaskStage(id, updates);

    return NextResponse.json({
      success: true,
      data: { id, ...updates },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("PATCH /api/v1/youtube failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to update YouTube video task", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/youtube", { requestId });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await youtubeRepository.deleteVideoTask(id);

    return NextResponse.json({
      success: true,
      data: { id },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("DELETE /api/v1/youtube failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to delete YouTube video task", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
