import type { ReactNode } from 'react';
import type { Hymn, SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabels } from '@/lib/format';

interface MeetingDetailProps {
    meeting: SacramentMeeting;
}

interface AgendaRowProps {
    label: string;
    children: ReactNode;
}

function AgendaRow({ label, children }: AgendaRowProps) {
    return (
        <div className="grid grid-cols-1 gap-1 py-3 border-b border-gray-200 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt className="font-semibold text-gray-700">{label}</dt>
            <dd>{children}</dd>
        </div>
    );
}

function formatHymn(hymn: Hymn): string {
    return hymn.number > 0 ? `#${hymn.number} ${hymn.title}` : hymn.title;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
    return (
        <article>
            <header className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                    {meetingTypeLabels[meeting.meetingType]}
                </p>
                <h1 className="text-3xl font-bold text-primary mt-1">
                    {formatMeetingDate(meeting.date)}
                </h1>
            </header>

            <dl>
                <AgendaRow label="Presiding">{meeting.presiding}</AgendaRow>
                <AgendaRow label="Conducting">{meeting.conducting}</AgendaRow>

                <AgendaRow label="Announcements">
                    {meeting.announcements && meeting.announcements.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {meeting.announcements.map((announcement) => (
                                <li key={announcement}>{announcement}</li>
                            ))}
                        </ul>
                    ) : (
                        'None'
                    )}
                </AgendaRow>

                <AgendaRow label="Opening Hymn">{formatHymn(meeting.openingHymn)}</AgendaRow>
                <AgendaRow label="Opening Prayer">{meeting.openingPrayer}</AgendaRow>

                <AgendaRow label="Ward Business">
                    {meeting.wardBusiness.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {meeting.wardBusiness.map((item) => (
                                <li key={item.description}>{item.description}</li>
                            ))}
                        </ul>
                    ) : (
                        'None'
                    )}
                </AgendaRow>

                <AgendaRow label="Stake Business">{meeting.stakeBusiness ? 'Yes' : 'No'}</AgendaRow>
                <AgendaRow label="Sacrament Hymn">{formatHymn(meeting.sacramentHymn)}</AgendaRow>

                <AgendaRow label="Speakers and Music">
                    {meeting.speakers.length > 0 ? (
                        <ol className="space-y-1">
                            {meeting.speakers.map((item, index) => (
                                <li key={`${item.name}-${index}`}>
                                    {item.type === 'speaker' ? (
                                        <>
                                            <span className="font-semibold">{item.name}</span>
                                            {item.topic && ` — ${item.topic}`}
                                        </>
                                    ) : (
                                        <>
                                            <span className="italic">Musical number:</span> {item.topic} — {item.name}
                                        </>
                                    )}
                                </li>
                            ))}
                        </ol>
                    ) : meeting.meetingType === 'testimony' ? (
                        'Testimonies from the congregation'
                    ) : (
                        'None'
                    )}
                </AgendaRow>

                <AgendaRow label="Closing Hymn">{formatHymn(meeting.closingHymn)}</AgendaRow>
                <AgendaRow label="Closing Prayer">{meeting.closingPrayer}</AgendaRow>
            </dl>
        </article>
    );
}
