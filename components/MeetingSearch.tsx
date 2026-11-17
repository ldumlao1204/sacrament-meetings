'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1'); // a new search always starts on page 1
        if (term.trim()) {
            params.set('query', term.trim());
        } else {
            params.delete('query');
        }
        push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <input
            type="search"
            placeholder="Search by speaker, leader, or meeting type..."
            defaultValue={searchParams.get('query') ?? ''}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search meetings"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    );
}
