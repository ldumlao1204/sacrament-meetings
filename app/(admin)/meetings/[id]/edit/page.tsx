import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate } from '@/lib/format';
import { getMeetingById, getMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
    title: 'Edit Meeting',
};

// Tell the build which ids exist, so each edit URL is known ahead of time.
export async function generateStaticParams() {
    const meetings = await getMeetings();
    return meetings.map((meeting) => ({ id: String(meeting.id) }));
}

export default async function EditMeetingPage({ params }: PageProps<'/meetings/[id]/edit'>) {
    const { id } = await params;

    // "abc" or "5x" is not an id, so don't even ask the database
    const meeting = /^\d+$/.test(id) ? await getMeetingById(Number(id)) : null;

    if (!meeting) {
        notFound();
    }

    // Pre-fill the first argument (id); the form will supply formData
    const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">
                Edit Meeting: {formatMeetingDate(meeting.date)}
            </h1>
            <MeetingForm action={updateMeetingWithId} meeting={meeting} submitLabel="Save Changes" />
        </section>
    );
}