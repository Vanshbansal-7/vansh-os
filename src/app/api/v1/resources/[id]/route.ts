import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { resourcesRepository } from "@/repositories/resources.repository";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = crypto.randomUUID();
  const { id } = await params;

  logger.info("Handling DELETE /api/v1/resources/[id]", { requestId, id });

  try {
    await resourcesRepository.delete(id);
    return NextResponse.json({
      success: true,
      data: { id },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("DELETE /api/v1/resources/[id] failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: "Failed to delete resource", code: "RESOURCE_DELETE_ERROR" } },
      { status: 500 }
    );
  }
}
