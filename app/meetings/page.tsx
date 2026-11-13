import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';

export default function MeetingsPage() {
    const meetings = getMeetings();

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
