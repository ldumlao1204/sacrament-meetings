export default async function Footer() {
    'use cache';

    return (
        <footer className="bg-gray-100 border-t border-gray-200 mt-12">
            <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-700">
                <p>&copy; {new Date().getFullYear()} Sacrament Meeting Planner</p>
            </div>
        </footer>
    );
}
