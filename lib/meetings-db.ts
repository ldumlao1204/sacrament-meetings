import type { SacramentMeeting } from './types';

const meetings: SacramentMeeting[] = [
    {
        id: 1,
        date: '2026-10-04',
        meetingType: 'general',
        presiding: 'First Presidency',
        conducting: 'General Conference broadcast',
        openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
        openingPrayer: 'Assigned by Church leaders',
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: { number: 0, title: 'No sacrament (General Conference)' },
        speakers: [
            { name: 'General Conference speakers', topic: 'Messages from Church leaders', type: 'speaker' }
        ],
        closingHymn: { number: 85, title: 'How Firm a Foundation' },
        closingPrayer: 'Assigned by Church leaders',
        announcements: ['Watch General Conference at the meetinghouse or at home']
    },
    {
        id: 2,
        date: '2026-10-18',
        meetingType: 'stake',
        presiding: 'President Garcia',
        conducting: 'President Lim',
        openingHymn: { number: 2, title: 'The Spirit of God' },
        openingPrayer: 'Sister Cruz',
        wardBusiness: [],
        stakeBusiness: true,
        sacramentHymn: { number: 0, title: 'No sacrament (Stake Conference)' },
        speakers: [
            { name: 'President Garcia', topic: 'Gathering Israel', type: 'speaker' },
            { name: 'Stake Choir', topic: 'Come, Follow Me', type: 'musical-number' },
            { name: 'Elder Tan', topic: 'Strengthening Families', type: 'speaker' }
        ],
        closingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
        closingPrayer: 'Brother Ramos'
    },
    {
        id: 3,
        date: '2026-11-01',
        meetingType: 'testimony',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Santos',
        openingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
        openingPrayer: 'Sister Dela Cruz',
        wardBusiness: [{ description: 'Release of Brother Villanueva as Sunday School teacher' }],
        stakeBusiness: false,
        sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
        speakers: [],
        closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
        closingPrayer: 'Brother Mendoza',
        announcements: ['Fast offerings can be given to the bishopric']
    },
    {
        id: 4,
        date: '2026-11-08',
        meetingType: 'regular',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Aquino',
        openingHymn: { number: 26, title: "Joseph Smith's First Prayer" },
        openingPrayer: 'Sister Bautista',
        wardBusiness: [{ description: 'Sustaining of Sister Flores as Primary president' }],
        stakeBusiness: false,
        sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
        speakers: [
            { name: 'Sister Navarro', topic: 'Faith in Jesus Christ', type: 'speaker' },
            { name: 'Youth Choir', topic: 'I Need Thee Every Hour', type: 'musical-number' },
            { name: 'Brother Castillo', topic: 'The Power of Prayer', type: 'speaker' }
        ],
        closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
        closingPrayer: 'Brother Gomez',
        announcements: ['Ward temple night: November 20']
    },
    {
        id: 5,
        date: '2026-11-15',
        meetingType: 'regular',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Santos',
        openingHymn: { number: 241, title: 'Count Your Blessings' },
        openingPrayer: 'Sister Torres',
        wardBusiness: [
            { description: 'Sustaining of Brother Lopez as elders quorum secretary' },
            { description: 'Ordination of Juan Rivera to the office of deacon' }
        ],
        stakeBusiness: false,
        sacramentHymn: { number: 183, title: 'In Remembrance of Thy Suffering' },
        speakers: [
            { name: 'Sister Ocampo', topic: 'Gratitude', type: 'speaker' },
            { name: 'Primary children', topic: 'I Am a Child of God', type: 'musical-number' },
            { name: 'Bishop Reyes', topic: 'Ministering Like the Savior', type: 'speaker' }
        ],
        closingHymn: { number: 166, title: 'Abide with Me!' },
        closingPrayer: 'Sister Salazar',
        announcements: ['Ward Christmas party: December 12', 'Youth activity on Wednesday at 6:00 PM']
    },
    {
        id: 6,
        date: '2026-11-22',
        meetingType: 'regular',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Aquino',
        openingHymn: { number: 2, title: 'The Spirit of God' },
        openingPrayer: 'Sister Ramos',
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
        speakers: [
            { name: 'Sister Pascual', topic: 'Following the Prophet', type: 'speaker' },
            { name: 'Brother Lim', topic: 'Serving Others', type: 'speaker' }
        ],
        closingHymn: { number: 85, title: 'How Firm a Foundation' },
        closingPrayer: 'Brother Garcia'
    },
    {
        id: 7,
        date: '2026-11-29',
        meetingType: 'regular',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Santos',
        openingHymn: { number: 27, title: 'Praise to the Man' },
        openingPrayer: 'Brother Villanueva',
        wardBusiness: [{ description: 'Sustaining of Sister Ramos as ward music coordinator' }],
        stakeBusiness: false,
        sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
        speakers: [
            { name: 'Sister Garcia', topic: 'Christ-Centered Christmas', type: 'speaker' },
            { name: 'Ward Choir', topic: 'I Believe in Christ', type: 'musical-number' },
            { name: 'Brother Pascual', topic: 'The Blessings of Tithing', type: 'speaker' }
        ],
        closingHymn: { number: 134, title: 'I Believe in Christ' },
        closingPrayer: 'Sister Lim',
        announcements: ['Tithing declaration appointments are open']
    },
    {
        id: 8,
        date: '2026-12-06',
        meetingType: 'testimony',
        presiding: 'Bishop Reyes',
        conducting: 'Brother Aquino',
        openingHymn: { number: 201, title: 'Joy to the World' },
        openingPrayer: 'Sister Flores',
        wardBusiness: [],
        stakeBusiness: false,
        sacramentHymn: { number: 194, title: 'There Is a Green Hill Far Away' },
        speakers: [],
        closingHymn: { number: 208, title: 'O Little Town of Bethlehem' },
        closingPrayer: 'Brother Rivera',
        announcements: ['Fast offerings can be given to the bishopric', 'Ward Christmas party: December 12']
    }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
    if (date) return meetings.filter(m => m.date === date);
    return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
    return meetings.find(m => m.id === id) ?? null;
}
