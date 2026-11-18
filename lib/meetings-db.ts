import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

// Connect to Neon Postgres. The URL comes from .env.local (local) or Vercel settings (deployed).
const sql = neon(process.env.DATABASE_URL!);

const ITEMS_PER_PAGE = 5;

// Columns to select, renamed from snake_case (database) to camelCase (TypeScript).
// Written once and reused in every query below.
const meetingColumns = sql`
    id,
    to_char(date, 'YYYY-MM-DD') AS "date",
    meeting_type                AS "meetingType",
    presiding,
    conducting,
    announcements,
    opening_hymn                AS "openingHymn",
    opening_prayer              AS "openingPrayer",
    ward_business               AS "wardBusiness",
    stake_business              AS "stakeBusiness",
    sacrament_hymn              AS "sacramentHymn",
    speakers,
    closing_hymn                AS "closingHymn",
    closing_prayer              AS "closingPrayer"
`;

// WHERE clause shared by the search list and the page count, so both always match.
// Speakers: only the names are searched, not the JSON keys or topics.
function searchFilter(query: string) {
    // Escape LIKE wildcards so "%" and "_" are searched as plain characters.
    const escaped = query.replace(/[\\%_]/g, (character) => '\\' + character);
    const searchTerm = `%${escaped}%`;

    return sql`
        WHERE presiding ILIKE ${searchTerm}
            OR conducting ILIKE ${searchTerm}
            OR meeting_type ILIKE ${searchTerm}
            OR jsonb_path_query_array(speakers, '$[*].name')::text ILIKE ${searchTerm}
    `;
}

// All meetings (oldest first), or only the meeting on one date.
// Used by GET /api/meetings (?date=), /meetings/current and generateStaticParams.
export async function getMeetings(date?: string | null): Promise<SacramentMeeting[]> {
    if (date) {
        const rows = await sql`
            SELECT ${meetingColumns} FROM meetings
            WHERE date::text = ${date}
        `;
        return rows as unknown as SacramentMeeting[];
    }

    const rows = await sql`
        SELECT ${meetingColumns} FROM meetings
        ORDER BY date
    `;
    return rows as unknown as SacramentMeeting[];
}

// One page of meetings that match the search (newest first). Used by the /meetings list.
export async function getFilteredMeetings(
    query: string = '',
    currentPage: number = 1
): Promise<SacramentMeeting[]> {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    const rows = await sql`
        SELECT ${meetingColumns} FROM meetings
        ${searchFilter(query)}
        ORDER BY date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return rows as unknown as SacramentMeeting[];
}

// How many pages the search results fill.
export async function getMeetingsTotalPages(query: string = ''): Promise<number> {
    const rows = await sql`
        SELECT COUNT(*) FROM meetings
        ${searchFilter(query)}
    `;
    return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

// Largest value a Postgres INTEGER (SERIAL) column can hold.
const MAX_ID = 2147483647;

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
    // An id outside the INTEGER range can't exist, and Postgres would throw an error.
    if (!Number.isInteger(id) || id < 1 || id > MAX_ID) {
        return null;
    }

    const rows = await sql`
        SELECT ${meetingColumns} FROM meetings
        WHERE id = ${id}
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Mutation stubs: will be wired to the database in Week 04.
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function addMeeting(
    data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
    throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
    id: number,
    updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
    throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
    throw new Error('deleteMeeting: database implementation coming in Week 04');
}
/* eslint-enable @typescript-eslint/no-unused-vars */
