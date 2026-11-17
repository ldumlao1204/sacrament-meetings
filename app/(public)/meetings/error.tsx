'use client';

import { useEffect } from 'react';

interface MeetingsErrorProps {
    error: unknown;
    retry: () => void;
}

export default function MeetingsError({ error, retry }: MeetingsErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <section role="alert" className="py-8 text-center space-y-4">
            <h1 className="text-3xl font-bold text-primary">Something went wrong</h1>
            <p className="text-gray-700">We couldn&apos;t load the meetings. Please try again.</p>
            <button
                type="button"
                onClick={() => retry()}
                className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90"
            >
                Try again
            </button>
        </section>
    );
}
