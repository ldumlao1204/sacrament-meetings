'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MeetingsLink {
    href: string;
    label: string;
}

const links: MeetingsLink[] = [
    { href: '/meetings', label: 'All Meetings' },
    { href: '/meetings/current', label: "This Sunday's Program" },
];

export default function MeetingsNav() {
    const pathname = usePathname();

    return (
        <nav aria-label="Meetings">
            <ul className="flex flex-wrap gap-2">
                {links.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border-2 border-primary ${isActive ? 'bg-primary text-white' : 'text-primary hover:bg-primary-light'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
