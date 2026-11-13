import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById, getMeetings } from '@/lib/meetings-db';

export function generateStaticParams() {
    return getMeetings().map((meeting) => ({ id: String(meeting.id) }));
}

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId)) {
        notFound();
    }

    const meeting = getMeetingById(meetingId);

    if (!meeting) {
        notFound();
    }

    return <MeetingDetail meeting={meeting} />;
}

