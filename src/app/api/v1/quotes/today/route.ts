import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { quotesService } from '@/services/quotes.service';

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/quotes/today', { requestId });

  try {
    const quote = await quotesService.getDailyQuote();
    const dateStr = quotesService.getISTDateStr();

    return NextResponse.json(
      {
        success: true,
        data: { quote, date: dateStr },
        meta: { generated_at: new Date().toISOString() },
      },
      {
        headers: {
          // Cache for 1 hour — same quote all day
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err) {
    logger.error('GET /api/v1/quotes/today failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch quote', code: 'QUOTE_ERROR' } },
      { status: 500 }
    );
  }
}
