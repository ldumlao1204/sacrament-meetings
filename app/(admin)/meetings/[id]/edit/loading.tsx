export default function Loading() {
    return (
        <div role="status" className="space-y-4">
            <span className="sr-only">Loading meeting…</span>
            <div className="h-10 w-2/3 rounded-md bg-gray-200 animate-pulse" />
            {[1, 2, 3].map((n) => (
                <div key={n} className="h-40 rounded-lg bg-gray-200 animate-pulse" />
            ))}
        </div>
    );
}