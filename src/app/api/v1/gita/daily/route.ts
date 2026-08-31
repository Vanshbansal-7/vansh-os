import { NextRequest, NextResponse } from 'next/server';
import { gitaService } from '@/services/gita.service';
import { DailyGitaVerseResponseSchema } from '@/schemas/gita.schema';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date') || undefined;

  try {
    logger.info('Handling GET /api/v1/gita/daily', { requestId, date: dateParam });
    
    const result = await gitaService.getTodayVerse(dateParam);
    
    // Strict runtime validation with Zod
    const validated = DailyGitaVerseResponseSchema.parse(result);

    const duration = Date.now() - startTime;
    logger.info('Completed GET /api/v1/gita/daily', { requestId, durationMs: duration, chapter: validated.verse.chapter, verse: validated.verse.verse });

    return NextResponse.json(
      {
        success: true,
        data: validated,
        meta: {
          requestId,
          durationMs: duration,
          timestamp: new Date().toISOString(),
        }
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'X-Request-Id': requestId,
        },
      }
    );
  } catch (error) {
    logger.error('Failed to get daily gita verse', error, { requestId, date: dateParam });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GITA_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Internal server error while fetching daily verse',
        },
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    );
  }
}
