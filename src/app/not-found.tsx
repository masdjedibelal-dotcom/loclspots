import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 block text-7xl" role="img" aria-hidden>
        🔍
      </span>
      <h1 className="font-serif text-2xl text-forest sm:text-3xl">Seite nicht gefunden</h1>
      <p className="mt-2 text-sage">
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link
        href="/home"
        className="mt-6 inline-flex items-center justify-center rounded-lg border-2 border-sage px-4 py-2 text-sm font-medium text-forest transition-colors hover:bg-sage/10"
      >
        Zurück zum Dashboard
      </Link>
    </div>
  );
}
