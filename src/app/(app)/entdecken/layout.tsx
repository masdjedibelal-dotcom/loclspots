import { EntdeckenTabs } from "./EntdeckenTabs";

export default function EntdeckenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-forest sm:text-3xl">
          Entdecken
        </h1>
        <p className="mt-1 text-sage">
          Collabs und Artikel – kuratierte Inhalte von der Community.
        </p>
      </div>
      <EntdeckenTabs />
      {children}
    </div>
  );
}
