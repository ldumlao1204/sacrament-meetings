export default function Loading() {
    return (
        <div role="status" className="space-y-4">
            <span className="sr-only">Loading meetings…</span>
            {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-lg bg-gray-200 animate-pulse" />
            ))}
        </div>
    );
}
