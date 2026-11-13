import type { MeetingType } from './types';

export const meetingTypeLabels: Record<MeetingType, string> = {
    testimony: 'Fast and Testimony Meeting',
    regular: 'Sacrament Meeting',
    stake: 'Stake Conference',
    general: 'General Conference',
};

export function formatMeetingDate(date: string): string {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}
