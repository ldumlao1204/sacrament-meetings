'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // One page (or no results): nothing to page through.
    if (totalPages <= 1) return null;

    // Copy the current URL params and change only the page, so ?query= is kept.
    function createPageURL(page: number) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        return `${pathname}?${params.toString()}`;
    }

    const linkStyle =
        'rounded-md border-2 border-primary px-4 py-2 font-semibold text-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
    const disabledStyle =
        'rounded-md border-2 border-gray-500 px-4 py-2 font-semibold text-gray-500 cursor-not-allowed';

    return (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-4 pt-2">
            {currentPage > 1 ? (
                <Link href={createPageURL(currentPage - 1)} className={linkStyle}>
                    <span aria-hidden="true">←</span> Previous
                </Link>
            ) : (
                <span aria-disabled="true" className={disabledStyle}>
                    <span aria-hidden="true">←</span> Previous
                </span>
            )}

            <span className="text-gray-700">
                Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link href={createPageURL(currentPage + 1)} className={linkStyle}>
                    Next <span aria-hidden="true">→</span>
                </Link>
            ) : (
                <span aria-disabled="true" className={disabledStyle}>
                    Next <span aria-hidden="true">→</span>
                </span>
            )}
        </nav>
    );
}
