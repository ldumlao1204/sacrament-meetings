import type { Metadata } from 'next';
import { getMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
    title: 'Edit Meeting',
};

// Tell the build which ids exist, so each edit URL is known ahead of time.
export async function generateStaticParams() {
    const meetings = await getMeetings();
    return meetings.map((meeting) => ({ id: String(meeting.id) }));
}

export default function EditMeetingPage() {
    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">Edit Meeting — Coming in Week 04</h1>
            <p className="text-gray-700">The form to edit this meeting will be added here.</p>
        </section>
    );
}
