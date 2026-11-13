import { getMeetings } from '@/lib/meetings-db';

// GET /api/meetings
// GET /api/meetings?date=2026-11-08
export async function GET(request: Request) {
    const date = new URL(request.url).searchParams.get('date');
    const meetings = getMeetings(date);
    return Response.json(meetings);
}
