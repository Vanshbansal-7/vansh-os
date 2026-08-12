import { NextResponse } from 'next/server';
import { NAVIGATION_CONFIG } from '@/config/navigation';

export async function GET() {
  const enabledItems = NAVIGATION_CONFIG.filter((item) => item.enabled).sort(
    (a, b) => a.order - b.order
  );

  return NextResponse.json({
    success: true,
    data: enabledItems,
    meta: {
      total: enabledItems.length,
      timestamp: new Date().toISOString(),
    },
  });
}
