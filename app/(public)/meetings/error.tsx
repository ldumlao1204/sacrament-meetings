'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MeetingsErrorProps {
    error: unknown;
    retry: () => void;
}

export default function MeetingsError({ error, retry }: MeetingsErrorProps) {
    useEffect(() => {
        // In production, server errors arrive as a generic message + a digest id (details stay in the server logs)
        console.error('Meetings error:', error);
    }, [error]);

    return (
        <section role="alert" className="py-8 text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">Something went wrong</h1>
            <p className="text-gray-700">
                We couldn&apos;t load or update the meetings. Please try again.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    type="button"
                    onClick={() => retry()}
                    className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90"
                >
                    Try again
                </button>
                <Link
                    href="/meetings"
                    className="px-5 py-2 rounded-md border-2 border-primary text-primary font-semibold hover:bg-primary-light"
                >
                    Back to all meetings
                </Link>
            </div>
        </section>
    );
}