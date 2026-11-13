import { getMeetingById } from '@/lib/meetings-db';

// GET /api/meetings/4
export async function GET(_request: Request, ctx: RouteContext<'/api/meetings/[id]'>) {
    const { id } = await ctx.params;

    if (!/^\d+$/.test(id)) {
        return Response.json({ error: 'Invalid meeting id' }, { status: 400 });
    }

    const meeting = getMeetingById(Number(id));

    if (!meeting) {
        return Response.json({ error: 'Meeting not found' }, { status: 404 });
    }

    return Response.json(meeting);
}
