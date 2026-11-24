import { neon } from '@neondatabase/serverless';
import type { MeetingInput, SacramentMeeting } from './types';

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

// An id outside the INTEGER range can't exist, and Postgres would throw an error.
function isValidId(id: number): boolean {
    return Number.isInteger(id) && id >= 1 && id <= MAX_ID;
}

export async function getMeetingById(id: number): Promise<SacramentMeeting | null> {
    if (!isValidId(id)) {
        return null;
    }

    const rows = await sql`
        SELECT ${meetingColumns} FROM meetings
        WHERE id = ${id}
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// ---------- Mutations (Week 04) ----------
// JSONB columns get JSON.stringify: the driver can't send an array of objects as JSON by itself.

// Insert a new meeting and return it, including the id the database created.
export async function addMeeting(data: MeetingInput): Promise<SacramentMeeting> {
    const rows = await sql`
        INSERT INTO meetings (
            date, meeting_type, presiding, conducting, announcements,
            opening_hymn, opening_prayer, ward_business, stake_business,
            sacrament_hymn, speakers, closing_hymn, closing_prayer
        )
        VALUES (
            ${data.date}, ${data.meetingType}, ${data.presiding}, ${data.conducting},
            ${data.announcements ?? []},
            ${JSON.stringify(data.openingHymn)}, ${data.openingPrayer},
            ${JSON.stringify(data.wardBusiness)}, ${data.stakeBusiness},
            ${JSON.stringify(data.sacramentHymn)}, ${JSON.stringify(data.speakers)},
            ${JSON.stringify(data.closingHymn)}, ${data.closingPrayer}
        )
        RETURNING ${meetingColumns}
    `;
    return rows[0] as unknown as SacramentMeeting;
}

// Replace every field of one meeting. Returns null if no meeting has that id.
export async function updateMeeting(
    id: number,
    data: MeetingInput
): Promise<SacramentMeeting | null> {
    if (!isValidId(id)) {
        return null;
    }

    const rows = await sql`
        UPDATE meetings
        SET date           = ${data.date},
            meeting_type   = ${data.meetingType},
            presiding      = ${data.presiding},
            conducting     = ${data.conducting},
            announcements  = ${data.announcements ?? []},
            opening_hymn   = ${JSON.stringify(data.openingHymn)},
            opening_prayer = ${data.openingPrayer},
            ward_business  = ${JSON.stringify(data.wardBusiness)},
            stake_business = ${data.stakeBusiness},
            sacrament_hymn = ${JSON.stringify(data.sacramentHymn)},
            speakers       = ${JSON.stringify(data.speakers)},
            closing_hymn   = ${JSON.stringify(data.closingHymn)},
            closing_prayer = ${data.closingPrayer}
        WHERE id = ${id}
        RETURNING ${meetingColumns}
    `;
    return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Delete one meeting. Returns true if a row was deleted, false if the id didn't exist.
export async function deleteMeeting(id: number): Promise<boolean> {
    if (!isValidId(id)) {
        return false;
    }

    const rows = await sql`
        DELETE FROM meetings
        WHERE id = ${id}
        RETURNING id
    `;
    return rows.length > 0;
}