'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as db from '@/lib/meetings-db';
import type { MeetingInput, SacramentMeeting, SpeakerItem } from '@/lib/types';

// ---------- Helpers: turn textarea text into lists ----------

// " a \n\n b " → ["a", "b"] (blank lines are skipped)
function splitLines(text: string): string[] {
    return text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '');
}

// "Sister Navarro | Faith"                       → speaker
// "Music: Youth Choir | I Need Thee Every Hour"  → musical number
function parseSpeakerLine(line: string): SpeakerItem {
    const isMusic = /^music:/i.test(line);
    const text = isMusic ? line.slice('music:'.length) : line;
    const [name = '', topic = ''] = text.split('|').map((part) => part.trim());

    return { name, topic, type: isMusic ? 'musical-number' : 'speaker' };
}

// ---------- Zod schema ----------

// Hymn number: blank or 0 means "no number".
function hymnNumber(label: string) {
    return z.coerce
        .number(`${label} hymn number must be a number.`)
        .int(`${label} hymn number must be a whole number.`)
        .min(0, `${label} hymn number cannot be negative.`)
        .max(9999, `${label} hymn number is too large.`);
}

function hymnTitle(label: string) {
    return z.string().trim().min(1, `Enter the ${label.toLowerCase()} hymn title.`);
}

const SpeakerSchema = z.object({
    name: z.string().min(1, 'Each speaker line needs a name before the "|".'),
    topic: z.string().min(1, 'Each speaker line needs a topic after the "|".'),
    type: z.enum(['speaker', 'musical-number']),
});

// What valid form data looks like (used by create and update)
const MeetingFormSchema = z.object({
    date: z.iso.date('Choose a valid date.'),
    meetingType: z.enum(
        ['testimony', 'regular', 'stake', 'general', 'special'],
        'Choose a meeting type.'
    ),
    presiding: z.string().trim().min(2, 'Enter who is presiding.'),
    conducting: z.string().trim().min(2, 'Enter who is conducting.'),
    openingHymnNumber: hymnNumber('Opening'),
    openingHymnTitle: hymnTitle('Opening'),
    openingPrayer: z.string().trim().min(2, 'Enter who will give the opening prayer.'),
    sacramentHymnNumber: hymnNumber('Sacrament'),
    sacramentHymnTitle: hymnTitle('Sacrament'),
    closingHymnNumber: hymnNumber('Closing'),
    closingHymnTitle: hymnTitle('Closing'),
    closingPrayer: z.string().trim().min(2, 'Enter who will give the closing prayer.'),
    stakeBusiness: z.boolean(),
    announcements: z.string().transform(splitLines),
    wardBusiness: z.string().transform(splitLines),
    speakers: z
        .string()
        .transform((text) => splitLines(text).map(parseSpeakerLine))
        .pipe(z.array(SpeakerSchema)),
});

type MeetingFormData = z.infer<typeof MeetingFormSchema>;

// Collect the raw form values (create and edit use the same field names)
function readMeetingForm(formData: FormData) {
    return {
        date: formData.get('date'),
        meetingType: formData.get('meetingType'),
        presiding: formData.get('presiding'),
        conducting: formData.get('conducting'),
        openingHymnNumber: formData.get('openingHymnNumber'),
        openingHymnTitle: formData.get('openingHymnTitle'),
        openingPrayer: formData.get('openingPrayer'),
        sacramentHymnNumber: formData.get('sacramentHymnNumber'),
        sacramentHymnTitle: formData.get('sacramentHymnTitle'),
        closingHymnNumber: formData.get('closingHymnNumber'),
        closingHymnTitle: formData.get('closingHymnTitle'),
        closingPrayer: formData.get('closingPrayer'),
        stakeBusiness: formData.get('stakeBusiness') === 'on',
        announcements: formData.get('announcements'),
        wardBusiness: formData.get('wardBusiness'),
        speakers: formData.get('speakers'),
    };
}

// Flat form fields → the nested shape the database functions expect
function toMeetingInput(data: MeetingFormData): MeetingInput {
    return {
        date: data.date,
        meetingType: data.meetingType,
        presiding: data.presiding,
        conducting: data.conducting,
        announcements: data.announcements,
        openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
        openingPrayer: data.openingPrayer,
        wardBusiness: data.wardBusiness.map((description) => ({ description })),
        stakeBusiness: data.stakeBusiness,
        sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
        speakers: data.speakers,
        closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
        closingPrayer: data.closingPrayer,
    };
}

// ---------- Server Actions ----------

export async function createMeeting(formData: FormData) {
    // 1. Check the raw form values against the schema
    const parsed = MeetingFormSchema.safeParse(readMeetingForm(formData));
    if (!parsed.success) {
        throw new Error('Invalid meeting input.');
    }

    // 2. Save the new meeting (only the database call goes inside try)
    try {
        await db.addMeeting(toMeetingInput(parsed.data));
    } catch (error) {
        console.error('Database error in createMeeting:', error);
        throw new Error('Failed to create the meeting. Please try again later.');
    }

    // 3. Outside try: refresh every page under /meetings, then go back to the list
    revalidatePath('/meetings', 'layout');
    redirect('/meetings');
}

export async function updateMeeting(id: number, formData: FormData) {
    // 1. Check the raw form values against the schema
    const parsed = MeetingFormSchema.safeParse(readMeetingForm(formData));
    if (!parsed.success) {
        throw new Error('Invalid meeting input.');
    }

    // 2. Change ONLY this meeting (only the database call goes inside try)
    let updated: SacramentMeeting | null;
    try {
        updated = await db.updateMeeting(id, toMeetingInput(parsed.data));
    } catch (error) {
        console.error('Database error in updateMeeting:', error);
        throw new Error('Failed to update the meeting. Please try again later.');
    }

    // 3. No row changed: the meeting doesn't exist (maybe deleted in another tab)
    if (!updated) {
        throw new Error('Meeting not found.');
    }

    // 4. Outside try: refresh every page under /meetings, then go back to the list
    revalidatePath('/meetings', 'layout');
    redirect('/meetings');
}

export async function deleteMeeting(id: number) {
    // 1. Remove ONLY this meeting (only the database call goes inside try)
    try {
        await db.deleteMeeting(id);
    } catch (error) {
        console.error('Database error in deleteMeeting:', error);
        throw new Error('Failed to delete the meeting. Please try again later.');
    }

    // 2. Refresh the list; no redirect, because the user is already on /meetings
    revalidatePath('/meetings', 'layout');
}