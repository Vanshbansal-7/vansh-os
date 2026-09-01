export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VOSNotification } from '@/types/notification';
import { logger } from '@/lib/logger';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk'
  );
}

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

function getISTDateAndHour(): { todayStr: string; dayOfWeek: number; timeStr: string; currentHour: number } {
  const nowIST = new Date(Date.now() + IST_OFFSET_MS);
  const todayStr = nowIST.toISOString().split('T')[0];
  const dayOfWeek = nowIST.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hours = nowIST.getUTCHours().toString().padStart(2, '0');
  const mins = nowIST.getUTCMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${mins}`;
  const currentHour = nowIST.getUTCHours();
  return { todayStr, dayOfWeek, timeStr, currentHour };
}

export async function GET() {
  try {
    const supabase = getSupabase();
    const { todayStr, dayOfWeek, timeStr } = getISTDateAndHour();
    const notifications: VOSNotification[] = [];

    // Parallel fetch system metrics
    const [streakRes, checkinRes, tasksRes, timetableRes, topicsRes] = await Promise.allSettled([
      supabase.from('streaks').select('*').limit(1).maybeSingle(),
      supabase.from('daily_checkins').select('*').eq('date', todayStr).maybeSingle(),
      supabase.from('daily_tasks').select('*').eq('is_active', true).eq('completed', false).limit(10),
      supabase.from('daily_timetable').select('*').eq('is_active', true).contains('day_of_week', [dayOfWeek]).order('start_time', { ascending: true }),
      supabase.from('topics').select('id, is_learned, is_mastered').limit(600),
    ]);

    // 1. STREAK & CHECKIN NOTIFICATION
    const streakRow = streakRes.status === 'fulfilled' ? streakRes.value.data : null;
    const todayCheckin = checkinRes.status === 'fulfilled' ? checkinRes.value.data : null;
    const currentStreak = streakRow?.current_streak || 0;
    const isCheckedIn = todayCheckin?.completed === true;

    if (!isCheckedIn) {
      notifications.push({
        id: `notif-streak-pending-${todayStr}`,
        type: 'STREAK',
        title: '🔥 Daily Check-in Alert',
        message: currentStreak > 0
          ? `Keep your ${currentStreak}-day consistency streak alive! Check in before 23:59 IST today.`
          : `Start your consistency journey! Record today's check-in to ignite your daily streak.`,
        priority: 'HIGH',
        timestamp: new Date().toISOString(),
        read: false,
        linkUrl: '/streak',
        tag: currentStreak > 0 ? `${currentStreak}d Streak` : 'Daily Check-in',
      });
    } else {
      notifications.push({
        id: `notif-streak-done-${todayStr}`,
        type: 'STREAK',
        title: `🔥 ${currentStreak}-Day Streak Active`,
        message: `Today's check-in is complete! Consistency is locked in for today.`,
        priority: 'INFO',
        timestamp: todayCheckin?.created_at || new Date().toISOString(),
        read: false,
        linkUrl: '/streak',
        tag: `${currentStreak}d Streak`,
      });
    }

    // 2. TODAY'S PRIORITY ITEMS (< 24 HR DEADLINE)
    if (tasksRes.status === 'fulfilled' && tasksRes.value.data) {
      const pendingTasks = tasksRes.value.data;
      const highPriorityTasks = pendingTasks.filter((t: any) => t.priority_level === 'HIGH' || t.due_date === todayStr);

      highPriorityTasks.slice(0, 3).forEach((task: any) => {
        notifications.push({
          id: `notif-task-${task.id}`,
          type: 'PRIORITY',
          title: `⚠️ Priority Deadline: ${task.title}`,
          message: `${task.subtitle || task.category || 'Core Priority'} • Due within 24 hours. Tap to view dashboard.`,
          priority: 'CRITICAL',
          timestamp: task.created_at || new Date().toISOString(),
          read: false,
          linkUrl: '/',
          tag: `${task.priority_level} Priority`,
        });
      });
    }

    // 3. TODAY'S TIMETABLE / IMPORTANT EVENTS
    if (dayOfWeek === 1 || dayOfWeek === 2) {
      // College Days
      notifications.push({
        id: `notif-college-${todayStr}`,
        type: 'TIMETABLE',
        title: '🎓 College Day Scheduled',
        message: 'Lectures and labs active today. Fixed Alpha Batch study routine resumes on Wednesday.',
        priority: 'INFO',
        timestamp: new Date().toISOString(),
        read: false,
        linkUrl: '/calendar',
        tag: 'College Day',
      });
    } else if (dayOfWeek === 0) {
      // Sunday Revision Day
      notifications.push({
        id: `notif-sunday-${todayStr}`,
        type: 'TIMETABLE',
        title: '🎯 Sunday DSA Test & Revision Day',
        message: 'Weekly DSA Revision, Test & Mistake Analysis scheduled today. Next week planning at 9:00 PM.',
        priority: 'HIGH',
        timestamp: new Date().toISOString(),
        read: false,
        linkUrl: '/calendar',
        tag: 'Revision + Test',
      });
    } else {
      // Wed, Thu, Fri, Sat
      if (timetableRes.status === 'fulfilled' && timetableRes.value.data) {
        const blocks = timetableRes.value.data;
        // Find current or next upcoming block
        const activeBlock = blocks.find((b: any) => timeStr >= b.start_time.slice(0, 5) && timeStr < b.end_time.slice(0, 5))
          || blocks.find((b: any) => b.start_time.slice(0, 5) > timeStr);

        if (activeBlock) {
          notifications.push({
            id: `notif-block-${activeBlock.id}-${todayStr}`,
            type: 'TIMETABLE',
            title: `⏰ ${activeBlock.title}`,
            message: `Timeblock: ${activeBlock.start_time.slice(0, 5)} – ${activeBlock.end_time.slice(0, 5)} (${activeBlock.category})`,
            priority: 'MEDIUM',
            timestamp: new Date().toISOString(),
            read: false,
            linkUrl: '/calendar',
            tag: activeBlock.category,
          });
        }
      }
    }

    // 4. PLACEMENT ROADMAP CURRICULUM STATS
    if (topicsRes.status === 'fulfilled' && topicsRes.value.data) {
      const allTopics = topicsRes.value.data;
      const total = allTopics.length;
      const completed = allTopics.filter((t: any) => t.is_mastered).length;
      const learned = allTopics.filter((t: any) => t.is_learned).length;

      if (total > 0) {
        const pct = Math.round((learned / total) * 100);
        notifications.push({
          id: `notif-placement-curriculum`,
          type: 'PLACEMENT',
          title: '🚀 DSA Alpha 5.0 Roadmap',
          message: `${learned} of ${total} curriculum videos learned (${pct}%). Tap to resume tracking.`,
          priority: 'INFO',
          timestamp: new Date().toISOString(),
          read: false,
          linkUrl: '/modules/placement',
          tag: '518 Videos',
        });
      }
    }

    // 5. WISDOM
    notifications.push({
      id: `notif-wisdom-${todayStr}`,
      type: 'SYSTEM',
      title: '🕉️ Bhagavad Gita 24-Hr Shlok Active',
      message: 'Daily shlok rotated on your Vijaypath dashboard. Cultivate mindful focus for today.',
      priority: 'INFO',
      timestamp: new Date().toISOString(),
      read: false,
      linkUrl: '/',
      tag: 'Gita Wisdom',
    });

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: { count: notifications.length, generated_at: new Date().toISOString() },
    });
  } catch (err: any) {
    logger.error('GET /api/v1/notifications error', { err });
    return NextResponse.json(
      { success: false, error: { message: err?.message || 'Failed to fetch notifications' } },
      { status: 500 }
    );
  }
}
