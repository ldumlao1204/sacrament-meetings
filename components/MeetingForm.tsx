import Link from 'next/link';
import type { Hymn, SacramentMeeting, SpeakerItem } from '@/lib/types';
import { meetingTypeLabels } from '@/lib/format';

// Shared Tailwind classes, so every field looks the same
const labelClass = 'block font-semibold text-gray-800';
const inputClass =
    'mt-1 block w-full rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900 ' +
    'focus:outline-2 focus:outline-offset-2 focus:outline-primary';
const hintClass = 'mt-1 text-sm text-gray-600';
const fieldsetClass = 'space-y-4 rounded-lg border border-gray-300 p-4';
const legendClass = 'px-2 text-lg font-bold text-primary font-serif';

// ---------- Small building blocks ----------

interface TextFieldProps {
    id: string;
    label: string;
    defaultValue?: string;
}

function TextField({ id, label, defaultValue }: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <input id={id} name={id} type="text" defaultValue={defaultValue} required className={inputClass} />
        </div>
    );
}

interface TextAreaFieldProps {
    id: string;
    label: string;
    hint: string;
    defaultValue?: string;
}

function TextAreaField({ id, label, hint, defaultValue }: TextAreaFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <p id={`${id}-hint`} className={hintClass}>
                {hint}
            </p>
            <textarea
                id={id}
                name={id}
                rows={4}
                defaultValue={defaultValue}
                aria-describedby={`${id}-hint`}
                className={inputClass}
            />
        </div>
    );
}

interface HymnFieldsProps {
    prefix: 'opening' | 'sacrament' | 'closing';
    label: string;
    hymn?: Hymn;
}

function HymnFields({ prefix, label, hymn }: HymnFieldsProps) {
    const numberId = `${prefix}HymnNumber`;
    const titleId = `${prefix}HymnTitle`;

    return (
        <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
            <div>
                <label htmlFor={numberId} className={labelClass}>
                    {label} hymn #
                </label>
                <input
                    id={numberId}
                    name={numberId}
                    type="number"
                    min={0}
                    max={9999}
                    defaultValue={hymn?.number || ''}
                    aria-describedby="hymn-number-hint"
                    className={inputClass}
                />
            </div>
            <TextField id={titleId} label={`${label} hymn title`} defaultValue={hymn?.title} />
        </div>
    );
}

// Speakers back to the text format the form uses: "Name | Topic" or "Music: Name | Topic"
function speakersToText(speakers: SpeakerItem[]): string {
    return speakers
        .map((item) => `${item.type === 'musical-number' ? 'Music: ' : ''}${item.name} | ${item.topic}`)
        .join('\n');
}

// ---------- The form ----------

interface MeetingFormProps {
    action: (formData: FormData) => Promise<void>;
    meeting?: SacramentMeeting; // only the edit page passes a meeting
    submitLabel: string;
}

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
    return (
        <form action={action} className="space-y-6">
            <p id="hymn-number-hint" className={hintClass}>
                Leave a hymn number blank (or 0) when the hymn has no number.
            </p>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Meeting details</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="date" className={labelClass}>
                            Date
                        </label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            defaultValue={meeting?.date}
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="meetingType" className={labelClass}>
                            Meeting type
                        </label>
                        <select
                            id="meetingType"
                            name="meetingType"
                            defaultValue={meeting?.meetingType ?? 'regular'}
                            className={inputClass}
                        >
                            {Object.entries(meetingTypeLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <TextField id="presiding" label="Presiding" defaultValue={meeting?.presiding} />
                    <TextField id="conducting" label="Conducting" defaultValue={meeting?.conducting} />
                </div>
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Opening</legend>
                <TextAreaField
                    id="announcements"
                    label="Announcements"
                    hint="One announcement per line."
                    defaultValue={meeting?.announcements?.join('\n')}
                />
                <HymnFields prefix="opening" label="Opening" hymn={meeting?.openingHymn} />
                <TextField id="openingPrayer" label="Opening prayer" defaultValue={meeting?.openingPrayer} />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Business and sacrament</legend>
                <TextAreaField
                    id="wardBusiness"
                    label="Ward business"
                    hint="One item per line, for example: Sustaining of Sister Flores as Primary president."
                    defaultValue={meeting?.wardBusiness.map((item) => item.description).join('\n')}
                />
                <div className="flex items-center gap-3">
                    <input
                        id="stakeBusiness"
                        name="stakeBusiness"
                        type="checkbox"
                        defaultChecked={meeting?.stakeBusiness}
                        className="h-5 w-5 accent-primary"
                    />
                    <label htmlFor="stakeBusiness" className="font-semibold text-gray-800">
                        Stake business will be presented
                    </label>
                </div>
                <HymnFields prefix="sacrament" label="Sacrament" hymn={meeting?.sacramentHymn} />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Speakers and music</legend>
                <TextAreaField
                    id="speakers"
                    label="Program"
                    hint='One per line, in order. Speaker: "Sister Navarro | Faith in Jesus Christ". Musical number: "Music: Youth Choir | I Need Thee Every Hour".'
                    defaultValue={meeting ? speakersToText(meeting.speakers) : undefined}
                />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Closing</legend>
                <HymnFields prefix="closing" label="Closing" hymn={meeting?.closingHymn} />
                <TextField id="closingPrayer" label="Closing prayer" defaultValue={meeting?.closingPrayer} />
            </fieldset>

            <div className="flex flex-wrap gap-4">
                <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
                >
                    {submitLabel}
                </button>
                <Link
                    href="/meetings"
                    className="px-5 py-2 rounded-md border-2 border-primary text-primary font-semibold hover:bg-primary-light"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}