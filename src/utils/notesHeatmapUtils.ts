import type { CollectionEntry } from 'astro:content';
import { getPostUrl } from './getPostPaths';

export type HeatmapPost = {
  title: string;
  href: string;
  date: Date;
};

export type HeatmapDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  posts: HeatmapPost[];
  isFuture: boolean;
};

export type HeatmapData = {
  days: HeatmapDay[];
  totalPosts: number;
  activeDays: number;
  latestPosts: HeatmapPost[];
  weeks: number;
  startDate: string;
};

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function getSundayOfWeek(date: Date): Date {
  const d = getMondayOfWeek(date);
  d.setUTCDate(d.getUTCDate() + 6);
  return d;
}

export function createNotesHeatmap(
  posts: CollectionEntry<'blog'>[],
  weeks = 24,
  latestCount = 1,
  startDateInput?: Date | string | null
): HeatmapData {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const todayStr = toDateString(today);

  const endSunday = getSundayOfWeek(today);

  let startMonday: Date;
  if (startDateInput) {
    const sd = new Date(startDateInput);
    sd.setUTCHours(0, 0, 0, 0);
    startMonday = getMondayOfWeek(sd);
  } else {
    const weeksAgoDate = new Date(endSunday);
    weeksAgoDate.setUTCDate(endSunday.getUTCDate() - weeks * 7 + 1);
    startMonday = getMondayOfWeek(weeksAgoDate);
  }

  // Build post map: ISO date string → posts[]
  const postsByDate = new Map<string, HeatmapPost[]>();
  let totalPosts = 0;

  for (const post of posts) {
    const dateStr = post.data.pubDatetime.toISOString().slice(0, 10);
    if (!postsByDate.has(dateStr)) postsByDate.set(dateStr, []);
    postsByDate.get(dateStr)!.push({
      title: post.data.title,
      href: getPostUrl(post.id, (post as any).filePath as string | undefined),
      date: post.data.pubDatetime,
    });
    totalPosts++;
  }

  // Build days array from startMonday through endSunday
  const days: HeatmapDay[] = [];
  const cursor = new Date(startMonday);

  while (cursor <= endSunday) {
    const dateStr = toDateString(cursor);
    const isFuture = dateStr > todayStr;
    const dayPosts = postsByDate.get(dateStr) ?? [];
    const count = dayPosts.length;
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (!isFuture && count > 0) {
      level = (count >= 4 ? 4 : count) as 1 | 2 | 3 | 4;
    }
    days.push({ date: dateStr, count, level, posts: dayPosts, isFuture });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  // Active days: any past day with at least one post
  const activeDays = days.filter(d => !d.isFuture && d.count > 0).length;

  // Latest posts sorted by date descending
  const latestPosts = [...posts]
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
    .slice(0, latestCount)
    .map(p => ({
      title: p.data.title,
      href: getPostUrl(p.id, (p as any).filePath as string | undefined),
      date: p.data.pubDatetime,
    }));

  return {
    days,
    totalPosts,
    activeDays,
    latestPosts,
    weeks: Math.ceil(days.length / 7),
    startDate: toDateString(startMonday),
  };
}
