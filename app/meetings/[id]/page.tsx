import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import { getBaseUrl } from '@/lib/api';
import { formatMeetingDate } from '@/lib/format';
import { getMeetingById, getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export function generateStaticParams() {
    return getMeetings().map((meeting) => ({ id: String(meeting.id) }));
}

export async function generateMetadata({ params }: PageProps<'/meetings/[id]'>): Promise<Metadata> {
    const { id } = await params;
    const meeting = /^\d+$/.test(id) ? getMeetingById(Number(id)) : null;

    return {
        title: meeting ? formatMeetingDate(meeting.date) : 'Meeting Not Found',
    };
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
