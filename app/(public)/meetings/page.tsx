import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/api';
import type { SacramentMeeting } from '@/lib/types';

export const metadata: Metadata = {
    title: 'All Meetings',
};

export default async function MeetingsPage() {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/meetings`);

    if (!response.ok) {
        throw new Error('Failed to load meetings');
    }

    const meetings: SacramentMeeting[] = await response.json();

    return (
        <section>
            <h1 className="text-3xl font-bold text-primary mb-6">All Meetings</h1>
            {meetings.length === 0 ? (
                <p className="text-gray-700">No meetings have been planned yet.</p>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2">
                    {meetings.map((meeting) => (
                        <li key={meeting.id}>
                            <MeetingCard meeting={meeting} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
