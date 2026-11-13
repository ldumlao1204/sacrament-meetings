import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export function generateStaticParams() {
    return getMeetings().map((meeting) => ({ id: String(meeting.id) }));
}

export default async function MeetingPage({ params }: PageProps<'/meetings/[id]'>) {
    const { id } = await params;
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/meetings/${encodeURIComponent(id)}`);

    if (response.status === 400 || response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error(`Failed to load meeting ${id}`);
    }

    const meeting: SacramentMeeting = await response.json();

    return <MeetingDetail meeting={meeting} />;
}
