import { NextResponse, NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { vanshAIEngine } from "@/lib/ai/vansh-ai-engine";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  logger.info("Handling POST /api/v1/ai/intent", { requestId });

  try {
    const body = await req.json();
    const { query, attachment } = body;

    const result = await vanshAIEngine.processCommand(query || "", attachment);

    return NextResponse.json({
      success: true,
      data: result,
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error("POST /api/v1/ai/intent failed", { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: "Failed to process AI intent", code: "AI_INTENT_ERROR" } },
      { status: 500 }
    );
  }
}
