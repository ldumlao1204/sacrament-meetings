import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import { getFilteredMeetings } from '@/lib/meetings-db';

export const metadata: Metadata = {
    title: 'All Meetings',
};

export default async function MeetingsPage(props: PageProps<'/meetings'>) {
    const searchParams = await props.searchParams;

    // The URL can contain anything, so validate it before querying.
    const query = typeof searchParams.query === 'string' ? searchParams.query.trim().slice(0, 100) : '';
    const pageNumber = Number(searchParams.page);
    const currentPage = Number.isInteger(pageNumber) && pageNumber >= 1 ? pageNumber : 1;

    const meetings = await getFilteredMeetings(query, currentPage);

    return (
        <section className="space-y-6">
            <h1 className="text-3xl font-bold text-primary">All Meetings</h1>
            <MeetingSearch />
            {meetings.length === 0 ? (
                <p className="text-gray-700">
                    {query ? `No meetings match "${query}".` : 'No meetings have been planned yet.'}
                </p>
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

