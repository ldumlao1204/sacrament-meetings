import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getTodayISO } from '@/lib/format';
import { getMeetings } from '@/lib/meetings-db';

function getMostRecentSunday(): string {
    const today = new Date(`${getTodayISO()}T00:00:00Z`);
    const sunday = new Date(today);
    sunday.setUTCDate(today.getUTCDate() - today.getUTCDay());

    return sunday.toISOString().slice(0, 10);
}

export default async function CurrentMeetingPage() {
    await connection();

    const sundayDate = getMostRecentSunday();
    const meetings = await getMeetings(sundayDate);

    if (meetings.length === 0) {
        redirect('/meetings');
    }

    redirect(`/meetings/${meetings[0].id}`);
}
