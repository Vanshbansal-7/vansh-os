import { NextRequest, NextResponse } from 'next/server';
import { profileService } from '@/services/profile.service';
import { UpdateUserProfileSchema } from '@/schemas/profile.schema';
import { logger } from '@/lib/logger';

export async function GET() {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    logger.info('Handling GET /api/v1/profile', { requestId });
    const profile = await profileService.getFounderProfile();
    const duration = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        data: profile,
        meta: { requestId, durationMs: duration, timestamp: new Date().toISOString() },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          'X-Request-Id': requestId,
        },
      }
    );
  } catch (error) {
    logger.error('Failed to get founder profile', error, { requestId });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROFILE_FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Internal server error while fetching profile',
        },
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: 500, headers: { 'X-Request-Id': requestId } }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json();
    const validated = UpdateUserProfileSchema.parse(body);

    const current = await profileService.getFounderProfile();
    const updated = await profileService.updateProfile(current.id, validated);

    logger.info('Updated profile successfully', { requestId, userId: current.id });

    return NextResponse.json(
      {
        success: true,
        data: updated,
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: 200, headers: { 'X-Request-Id': requestId } }
    );
  } catch (error) {
    logger.error('Failed to update profile', error, { requestId });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Invalid profile payload',
        },
        meta: { requestId, timestamp: new Date().toISOString() },
      },
      { status: 400, headers: { 'X-Request-Id': requestId } }
    );
  }
}
