import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Meeting',
};

export default function NewMeetingPage() {
    return (
        <section className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">Create Meeting — Coming in Week 04</h1>
            <p className="text-gray-700">The form to plan a new sacrament meeting will be added here.</p>
        </section>
    );
}
