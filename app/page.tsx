import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-6">
      <Image
        src="/hero.png"
        alt="A young woman partaking of the sacrament water during sacrament meeting"
        width={1198}
        height={675}
        preload
        sizes="(min-width: 896px) 864px, 100vw"
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Sacrament Meeting Planner</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Plan agendas, review past meetings, and print programs for each Sunday.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/meetings/current"
            className="px-5 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90"
          >
            View This Sunday&apos;s Program
          </Link>
          <Link
            href="/meetings"
            className="px-5 py-2 rounded-md border-2 border-primary text-primary font-semibold hover:bg-primary-light"
          >
            All Meetings
          </Link>
        </div>
      </div>
    </section>
  );
}
