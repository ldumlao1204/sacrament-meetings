import { cacheLife } from 'next/cache';
import NavLinks from '@/components/NavLinks';

const WARD_NAME = 'Burnham 2nd Ward';

export default async function Header() {
    'use cache';
    cacheLife('hours');

    const now = new Date();
    const today = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Manila',
    });

    return (
        <header className="bg-primary text-white">
            <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div>
                    <p className="text-xl font-bold">{WARD_NAME}</p>
                    <p className="text-sm text-gray-200">Sacrament Meeting Planner</p>
                </div>
                <time dateTime={now.toISOString().slice(0, 10)} className="text-sm">
                    {today}
                </time>
                <NavLinks />
            </div>
        </header>
    );
}
