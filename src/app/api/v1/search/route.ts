import { NextResponse } from "next/server";
import { searchRepository } from "@/repositories/search.repository";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const results = await searchRepository.globalSearch(query);
    return NextResponse.json(results);
  } catch (error) {
    logger.error("Error in /api/v1/search GET:", error);
    return NextResponse.json({ error: "Failed to perform global search" }, { status: 500 });
  }
}
