import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getFilteredMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

export const metadata: Metadata = {
    title: 'All Meetings',
};

export default async function MeetingsPage(props: PageProps<'/meetings'>) {
    const searchParams = await props.searchParams;

    // The URL can contain anything, so validate it before querying.
    const query = typeof searchParams.query === 'string' ? searchParams.query.trim().slice(0, 100) : '';
    const pageNumber = Number(searchParams.page);
    const currentPage = Number.isSafeInteger(pageNumber) && pageNumber >= 1 ? pageNumber : 1;

    // Run both queries at the same time.
    const [meetings, totalPages] = await Promise.all([
        getFilteredMeetings(query, currentPage),
        getMeetingsTotalPages(query),
    ]);

    // A page past the end (e.g. ?page=99) goes to the last page instead.
    if (currentPage > totalPages && totalPages > 0) {
        const params = new URLSearchParams({ page: String(totalPages) });
        if (query) params.set('query', query);
        redirect(`/meetings?${params.toString()}`);
    }

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
            <Pagination currentPage={currentPage} totalPages={totalPages} />
        </section>
    );
}
