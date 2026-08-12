import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { profileService } from '@/services/profile.service';
import { companiesRepository } from '@/repositories/companies.repository';
import { documentsRepository } from '@/repositories/documents.repository';
import { examsRepository } from '@/repositories/exams.repository';
import { trackerRepository } from '@/repositories/tracker.repository';
import { youtubeRepository } from '@/repositories/youtube.repository';

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function getGreeting(): string {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const hour = nowIST.getUTCHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getCurrentDateFormatted(): string {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  return nowIST.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function GET() {
  const requestId = crypto.randomUUID();
  logger.info('Handling GET /api/v1/dashboard', { requestId });

  try {
    const greeting = getGreeting();
    const currentDateFormatted = getCurrentDateFormatted();

    let userName = 'Vansh';
    try {
      const profile = await profileService.getFounderProfile();
      if (profile?.display_name) {
        userName = profile.display_name.split(' ')[0];
      }
    } catch (err) {
      logger.warn("Failed to load founder display name, falling back to Vansh", { err });
    }

    // Fetch real metrics from all modules in parallel
    const [companies, documents, exams, placementSubjects, videoTasks] = await Promise.all([
      companiesRepository.getCompanies(),
      documentsRepository.getDocuments(),
      examsRepository.getExams(),
      trackerRepository.findSubjectsByModule('PLACEMENT'),
      youtubeRepository.getVideoTasks(),
    ]);

    // Compute Placement Progress
    let totalPlacementTopics = 0;
    let completedPlacementTopics = 0;
    placementSubjects.forEach((subj) => {
      subj.topics?.forEach((t) => {
        totalPlacementTopics++;
        if (t.is_mastered) completedPlacementTopics++;
      });
    });
    const placementProgress = totalPlacementTopics > 0
      ? Math.round((completedPlacementTopics / totalPlacementTopics) * 100)
      : 0;

    // Compute YouTube Pipeline Progress
    const totalVideoTasks = videoTasks.length;
    const publishedVideoTasks = videoTasks.filter((v) => v.is_published).length;
    const youtubeProgress = totalVideoTasks > 0
      ? Math.round((publishedVideoTasks / totalVideoTasks) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        greeting,
        user_name: userName,
        current_date_formatted: currentDateFormatted,
        timezone: 'Asia/Kolkata',
        telemetry: {
          companies: {
            total: companies.length,
            interviews: companies.filter((c) => c.status === 'Interview').length,
            offers: companies.filter((c) => c.status === 'Offer Received' || c.status === 'Selected').length,
          },
          documents: {
            total: documents.length,
            recent: documents.slice(0, 3),
          },
          exams: {
            total: exams.length,
            active: exams.filter((e) => e.is_active).length,
          },
          placement: {
            total_topics: totalPlacementTopics,
            completed_topics: completedPlacementTopics,
            progress: placementProgress,
          },
          youtube: {
            total_tasks: totalVideoTasks,
            published_tasks: publishedVideoTasks,
            progress: youtubeProgress,
          },
        },
      },
      meta: { generated_at: new Date().toISOString() },
    });
  } catch (err) {
    logger.error('GET /api/v1/dashboard failed', { requestId, err });
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch dashboard summary', code: 'DASHBOARD_ERROR' } },
      { status: 500 }
    );
  }
}
