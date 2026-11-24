import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabels } from '@/lib/format';
import { deleteMeeting } from '@/lib/actions';

interface MeetingCardProps {
    meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
    const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;
    const meetingDate = formatMeetingDate(meeting.date);

    // Pre-fill the id; the small delete form below calls it
    const deleteMeetingWithId = deleteMeeting.bind(null, meeting.id);

    return (
        <article className="p-5 bg-white border border-gray-200 border-l-4 border-l-primary rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                {meetingTypeLabels[meeting.meetingType]}
            </p>
            <h2 className="text-xl font-bold text-primary mt-1">
                <Link href={`/meetings/${meeting.id}`} className="hover:underline underline-offset-4">
                    {meetingDate}
                </Link>
            </h2>
            <dl className="mt-3 space-y-1 text-sm text-gray-700">
                <div>
                    <dt className="inline font-semibold">Presiding: </dt>
                    <dd className="inline">{meeting.presiding}</dd>
                </div>
                <div>
                    <dt className="inline font-semibold">Conducting: </dt>
                    <dd className="inline">{meeting.conducting}</dd>
                </div>
                <div>
                    <dt className="inline font-semibold">Speakers: </dt>
                    <dd className="inline">{speakerCount}</dd>
                </div>
            </dl>
            <div className="mt-4 flex gap-3 pt-3 border-t border-gray-200">
                <Link
                    href={`/meetings/${meeting.id}/edit`}
                    className="px-3 py-1 rounded-md border-2 border-primary text-sm font-semibold text-primary hover:bg-primary-light"
                >
                    Edit<span className="sr-only"> meeting on {meetingDate}</span>
                </Link>
                <form action={deleteMeetingWithId}>
                    <button
                        type="submit"
                        className="px-3 py-1 rounded-md border-2 border-accent text-sm font-semibold text-accent hover:bg-orange-50"
                    >
                        Delete<span className="sr-only"> meeting on {meetingDate}</span>
                    </button>
                </form>
            </div>
        </article>
    );
}