'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLink {
    href: string;
    label: string;
}

const links: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/meetings', label: 'All Meetings' },
    { href: '/meetings/current', label: 'This Sunday' },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav aria-label="Main">
            <ul className="flex flex-wrap gap-6">
                {links.map((link) => {
                    const isActive =
                        link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`underline-offset-4 hover:underline hover:text-gray-200 ${isActive ? 'underline decoration-2 font-semibold' : ''
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
