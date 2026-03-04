import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center">
          <h1 className="font-serif text-3xl tracking-tight">
            <span className="text-forest">Locl</span>
            <span className="text-peach">Spots</span>
          </h1>
        </Link>
        <p className="mt-2 text-center text-sm text-sage">
          Die Community für Menschen 30+
        </p>

        <div className="mt-8 rounded-2xl border border-warm bg-cream/80 p-6 shadow-sm backdrop-blur sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
