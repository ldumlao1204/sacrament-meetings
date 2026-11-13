import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';

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
