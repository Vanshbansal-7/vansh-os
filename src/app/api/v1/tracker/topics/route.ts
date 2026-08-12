import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { trackerRepository } from "@/repositories/tracker.repository";
import { createTopicSchema } from "@/lib/validations/tracker.schema";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/tracker/topics", { requestId });

  try {
    const body = await req.json();
    const validated = createTopicSchema.parse(body);

    const newTopic = await trackerRepository.createTopic(validated);
    return NextResponse.json({
      success: true,
      data: newTopic,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("POST /api/v1/tracker/topics failed", { requestId, err });
    const errorMessage = err?.errors?.[0]?.message || err?.message || "Database insert failed";
    return NextResponse.json(
      { success: false, error: { message: errorMessage, code: "DATABASE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling PATCH /api/v1/tracker/topics", { requestId });

  try {
    const body = await req.json();
    const { topic_id, milestone, value, name } = body;

    if (name) {
      await trackerRepository.renameTopic(topic_id, name.trim());
      return NextResponse.json({
        success: true,
        data: { topic_id, name: name.trim() },
        meta: { generated_at: new Date().toISOString() },
      });
    }

    if (milestone) {
      await trackerRepository.updateTopicMilestone(topic_id, milestone, value);
      return NextResponse.json({
        success: true,
        data: { topic_id, milestone, value },
        meta: { generated_at: new Date().toISOString() },
      });
    }

    return NextResponse.json(
      { success: false, error: { message: "Either name or milestone is required", code: "VALIDATION_ERROR" } },
      { status: 400 }
    );
  } catch (err: any) {
    logger.error("PATCH /api/v1/tracker/topics failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to update topic", code: "UPDATE_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling DELETE /api/v1/tracker/topics", { requestId });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: { message: "id parameter is required", code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    await trackerRepository.deleteTopic(id);

    return NextResponse.json({
      success: true,
      data: { id },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error("DELETE /api/v1/tracker/topics failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || "Failed to delete topic", code: "DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
