import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="pb-4 border-b border-gray-200">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                    Leader Tools
                </p>
                <p className="text-sm text-gray-600">
                    Sign-in for ward leaders will be added in Week 05.
                </p>
            </div>
            {children}
        </div>
    );
}
