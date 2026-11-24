'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { MeetingFormState, MeetingFormValues } from '@/lib/actions';
import type { SacramentMeeting, SpeakerItem } from '@/lib/types';
import { meetingTypeLabels } from '@/lib/format';

type FieldErrors = NonNullable<MeetingFormState['errors']>;

// Shared Tailwind classes, so every field looks the same
const labelClass = 'block font-semibold text-gray-800';
const inputClass =
    'mt-1 block w-full rounded-md border border-gray-500 bg-white px-3 py-2 text-gray-900 ' +
    'focus:outline-2 focus:outline-offset-2 focus:outline-primary ' +
    'aria-[invalid=true]:border-2 aria-[invalid=true]:border-red-700';
const hintClass = 'mt-1 text-sm text-gray-600';
const fieldsetClass = 'space-y-4 rounded-lg border border-gray-300 p-4';
const legendClass = 'px-2 text-lg font-bold text-primary font-serif';

// ---------- Turning a saved meeting into form text ----------

// Speakers back to the text format the form uses: "Name | Topic" or "Music: Name | Topic"
function speakersToText(speakers: SpeakerItem[]): string {
    return speakers
        .map((item) => `${item.type === 'musical-number' ? 'Music: ' : ''}${item.name} | ${item.topic}`)
        .join('\n');
}

// 0 (no number) shows as an empty box
function hymnNumberText(number?: number): string {
    return number ? String(number) : '';
}

// The text each field starts with: from the saved meeting (edit) or empty (create)
function meetingToValues(meeting?: SacramentMeeting): MeetingFormValues {
    return {
        date: meeting?.date ?? '',
        meetingType: meeting?.meetingType ?? 'regular',
        presiding: meeting?.presiding ?? '',
        conducting: meeting?.conducting ?? '',
        openingHymnNumber: hymnNumberText(meeting?.openingHymn.number),
        openingHymnTitle: meeting?.openingHymn.title ?? '',
        openingPrayer: meeting?.openingPrayer ?? '',
        sacramentHymnNumber: hymnNumberText(meeting?.sacramentHymn.number),
        sacramentHymnTitle: meeting?.sacramentHymn.title ?? '',
        closingHymnNumber: hymnNumberText(meeting?.closingHymn.number),
        closingHymnTitle: meeting?.closingHymn.title ?? '',
        closingPrayer: meeting?.closingPrayer ?? '',
        stakeBusiness: meeting?.stakeBusiness ?? false,
        announcements: meeting?.announcements?.join('\n') ?? '',
        wardBusiness: meeting?.wardBusiness.map((item) => item.description).join('\n') ?? '',
        speakers: meeting ? speakersToText(meeting.speakers) : '',
    };
}

// ---------- Small building blocks ----------

// One error area per field: always in the page, so screen readers notice when messages appear
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
    // new Set(...) removes repeats (two bad speaker lines give the same message twice)
    const messages = [...new Set(errors ?? [])];

    return (
        <div id={id} aria-live="polite" aria-atomic="true">
            {messages.map((message) => (
                <p key={message} className="mt-1 text-sm font-semibold text-red-700">
                    {message}
                </p>
            ))}
        </div>
    );
}

interface TextFieldProps {
    id: keyof FieldErrors;
    label: string;
    defaultValue: string;
    errors?: string[];
}

function TextField({ id, label, defaultValue, errors }: TextFieldProps) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type="text"
                defaultValue={defaultValue}
                required
                aria-describedby={`${id}-error`}
                aria-invalid={errors ? true : undefined}
                className={inputClass}
            />
            <FieldError id={`${id}-error`} errors={errors} />
        </div>
    );
}

interface TextAreaFieldProps {
    id: keyof FieldErrors;
    label: string;
    hint: string;
    defaultValue: string;
    errors?: string[];
}

function TextAreaField({ id, label, hint, defaultValue, errors }: TextAreaFieldProps) {
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
                aria-describedby={`${id}-hint ${id}-error`}
                aria-invalid={errors ? true : undefined}
                className={inputClass}
            />
            <FieldError id={`${id}-error`} errors={errors} />
        </div>
    );
}

interface HymnFieldsProps {
    prefix: 'opening' | 'sacrament' | 'closing';
    label: string;
    values: MeetingFormValues;
    errors: FieldErrors;
}

function HymnFields({ prefix, label, values, errors }: HymnFieldsProps) {
    const numberId = `${prefix}HymnNumber` as const;
    const titleId = `${prefix}HymnTitle` as const;

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
                    defaultValue={values[numberId]}
                    aria-describedby={`hymn-number-hint ${numberId}-error`}
                    aria-invalid={errors[numberId] ? true : undefined}
                    className={inputClass}
                />
                <FieldError id={`${numberId}-error`} errors={errors[numberId]} />
            </div>
            <TextField
                id={titleId}
                label={`${label} hymn title`}
                defaultValue={values[titleId]}
                errors={errors[titleId]}
            />
        </div>
    );
}

// ---------- The form ----------

type MeetingFormAction = (prevState: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;

interface MeetingFormProps {
    action: MeetingFormAction;
    meeting?: SacramentMeeting; // only the edit page passes a meeting
    submitLabel: string;
}

const initialState: MeetingFormState = { message: null, errors: {} };

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState);

    // After a failed submit, show what the user typed; otherwise the saved meeting (or empty)
    const values = state.values ?? meetingToValues(meeting);
    const errors = state.errors ?? {};

    return (
        <form action={formAction} className="space-y-6">
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
                            defaultValue={values.date}
                            required
                            aria-describedby="date-error"
                            aria-invalid={errors.date ? true : undefined}
                            className={inputClass}
                        />
                        <FieldError id="date-error" errors={errors.date} />
                    </div>
                    <div>
                        <label htmlFor="meetingType" className={labelClass}>
                            Meeting type
                        </label>
                        <select
                            key={values.meetingType}
                            id="meetingType"
                            name="meetingType"
                            defaultValue={values.meetingType}
                            aria-describedby="meetingType-error"
                            aria-invalid={errors.meetingType ? true : undefined}
                            className={inputClass}
                        >
                            {Object.entries(meetingTypeLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        <FieldError id="meetingType-error" errors={errors.meetingType} />
                    </div>
                    <TextField id="presiding" label="Presiding" defaultValue={values.presiding} errors={errors.presiding} />
                    <TextField id="conducting" label="Conducting" defaultValue={values.conducting} errors={errors.conducting} />
                </div>
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Opening</legend>
                <TextAreaField
                    id="announcements"
                    label="Announcements"
                    hint="One announcement per line."
                    defaultValue={values.announcements}
                    errors={errors.announcements}
                />
                <HymnFields prefix="opening" label="Opening" values={values} errors={errors} />
                <TextField
                    id="openingPrayer"
                    label="Opening prayer"
                    defaultValue={values.openingPrayer}
                    errors={errors.openingPrayer}
                />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Business and sacrament</legend>
                <TextAreaField
                    id="wardBusiness"
                    label="Ward business"
                    hint="One item per line, for example: Sustaining of Sister Flores as Primary president."
                    defaultValue={values.wardBusiness}
                    errors={errors.wardBusiness}
                />
                <div className="flex items-center gap-3">
                    <input
                        id="stakeBusiness"
                        name="stakeBusiness"
                        type="checkbox"
                        defaultChecked={values.stakeBusiness}
                        className="h-5 w-5 accent-primary"
                    />
                    <label htmlFor="stakeBusiness" className="font-semibold text-gray-800">
                        Stake business will be presented
                    </label>
                </div>
                <HymnFields prefix="sacrament" label="Sacrament" values={values} errors={errors} />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Speakers and music</legend>
                <TextAreaField
                    id="speakers"
                    label="Program"
                    hint='One per line, in order. Speaker: "Sister Navarro | Faith in Jesus Christ". Musical number: "Music: Youth Choir | I Need Thee Every Hour".'
                    defaultValue={values.speakers}
                    errors={errors.speakers}
                />
            </fieldset>

            <fieldset className={fieldsetClass}>
                <legend className={legendClass}>Closing</legend>
                <HymnFields prefix="closing" label="Closing" values={values} errors={errors} />
                <TextField
                    id="closingPrayer"
                    label="Closing prayer"
                    defaultValue={values.closingPrayer}
                    errors={errors.closingPrayer}
                />
            </fieldset>

            <div id="form-message" aria-live="polite" aria-atomic="true">
                {state.message && (
                    <p className="rounded-md border-2 border-red-700 bg-red-50 px-4 py-3 font-semibold text-red-800">
                        {state.message}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-2 focus:outline-offset-2 focus:outline-primary disabled:opacity-60 disabled:cursor-wait"
                >
                    {isPending ? 'Saving…' : submitLabel}
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