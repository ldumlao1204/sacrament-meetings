import type { MeetingType } from './types';

export const WARD_TIME_ZONE = 'Asia/Manila';

export const meetingTypeLabels: Record<MeetingType, string> = {
    testimony: 'Fast and Testimony Meeting',
    regular: 'Sacrament Meeting',
    stake: 'Stake Conference',
    general: 'General Conference',
    special: 'Special Meeting',
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

export function getTodayISO(): string {
    return new Date().toLocaleDateString('en-CA', { timeZone: WARD_TIME_ZONE });
}
