import { notFound } from "next/navigation";
import Link from "next/link";
import { getCollabWithItems } from "@/lib/collabs";
import { Badge } from "@/components/ui/Badge";
import { CollabPlacesList } from "@/components/collabs/CollabPlacesList";
import { CollabActions } from "./CollabActions";
import { CollabPageHeader } from "./CollabPageHeader";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getCollabWithItems(id);
  if (!data) return { title: "Collab nicht gefunden" };

  const title = `${data.collab.title} | LoclSpots München`;
  const description =
    (data.collab.description ?? data.collab.title).slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title: data.collab.title,
      description,
      type: "article",
    },
  };
}

export default async function CollabEditorialPage({ params }: Props) {
  const { id } = await params;
  const data = await getCollabWithItems(id);

  if (!data) notFound();

  const { collab, items, chatroom, relatedCollabs } = data;
  const collabRow = collab as unknown as Record<string, unknown>;
  const coverEmoji =
    (collabRow.cover_emoji as string) ??
    (Array.isArray(collabRow.cover_media_urls)
      ? (collabRow.cover_media_urls as string[])[0]
      : null) ??
    "📋";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <CollabPageHeader />

      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-12">
        <section className="mb-20 text-center">
          {collabRow.category ? (
            <Badge variant="green" className="mb-6">
              {String(collabRow.category)}
            </Badge>
          ) : null}
          <div
            className="mb-6 text-[5rem] leading-none sm:text-[6rem]"
            role="img"
            aria-hidden
          >
            {coverEmoji}
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-forest sm:text-5xl">
            {collab.title}
          </h1>
          {collab.description && (
            <p className="mx-auto mt-6 max-w-[600px] text-xl leading-relaxed text-muted">
              {collab.description}
            </p>
          )}
          <div className="mt-8 flex items-center justify-center">
            <CollabActions
              collabId={collab.id}
              creatorId={collab.creator_id}
              likesCount={collab.likes_count ?? 0}
              chatroom={chatroom}
            />
          </div>
        </section>

        <div className="h-px bg-sage/20" aria-hidden />

        <section className="py-16">
          <CollabPlacesList items={items} />
        </section>

        {relatedCollabs.length > 0 && (
          <section className="border-t border-sage/20 py-16">
            <h2 className="mb-8 font-serif text-2xl font-bold text-forest">
              Weitere Empfehlungen
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedCollabs.map((r) => (
                <Link
                  key={r.id}
                  href={`/collabs/${r.id}`}
                  className="group rounded-xl border border-sage/12 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-mint hover:shadow-lg"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-warm text-2xl">
                    {r.cover_emoji ?? "📋"}
                  </div>
                  <h3 className="font-semibold text-forest line-clamp-2 group-hover:text-sage">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-2xl bg-forest px-8 py-12 text-center text-white">
          <h2 className="font-serif text-2xl font-bold text-mint">
            Entdecke mehr in der LoclSpots Community
          </h2>
          <p className="mt-2 text-white/90">
            Collabs, Chatrooms und Events — für Menschen, die echten
            Austausch suchen.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-full bg-peach px-8 py-3 font-semibold text-white transition-colors hover:bg-peach/90"
          >
            Kostenlos registrieren
          </Link>
        </section>
      </main>
    </div>
  );
}
