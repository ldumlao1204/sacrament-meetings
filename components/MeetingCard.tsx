import Link from 'next/link';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabels } from '@/lib/format';

interface MeetingCardProps {
    meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
    const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;

    return (
        <article className="p-5 bg-white border border-gray-200 border-l-4 border-l-primary rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                {meetingTypeLabels[meeting.meetingType]}
            </p>
            <h2 className="text-xl font-bold text-primary mt-1">
                <Link href={`/meetings/${meeting.id}`} className="hover:underline underline-offset-4">
                    {formatMeetingDate(meeting.date)}
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
        </article>
    );
}
