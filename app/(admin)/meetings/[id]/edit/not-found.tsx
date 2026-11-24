import Link from 'next/link';

export default function MeetingNotFound() {
    return (
        <section className="py-8 text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">Meeting not found</h1>
            <p className="text-gray-700">
                We couldn&apos;t find that meeting. It may have been deleted, or the link may be wrong.
            </p>
            <Link
                href="/meetings"
                className="inline-block px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90"
            >
                Back to all meetings
            </Link>
        </section>
    );
}