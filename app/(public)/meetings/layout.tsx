import MeetingsNav from '@/components/MeetingsNav';

export default function MeetingsLayout({ children }: LayoutProps<'/meetings'>) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 pb-4 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                    Ward Meetings
                </p>
                <MeetingsNav />
            </div>
            {children}
        </div>
    );
}

