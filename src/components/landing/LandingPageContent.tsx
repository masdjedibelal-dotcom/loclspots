"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ChatMockup } from "@/components/layout/ChatMockup";
import { ChatroomCTA } from "@/components/cta/ChatroomCTA";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { BlogPreviewSection } from "@/components/landing/BlogPreviewSection";
import { DiscoverMunichSection } from "@/components/landing/DiscoverMunichSection";
import { HighlightsCarousel } from "@/components/home/HighlightsCarousel";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/types";
import type { PublicCollab, PublicEvent } from "@/lib/supabase";

const chatrooms = [
  {
    emoji: "🎭",
    name: "Kultur & Stadtleben",
    desc: "Ausstellungen, Konzerte, Museen, Stadtführungen — für alle, die ihre Stadt wirklich kennenlernen wollen.",
    active: 24,
    members: 142,
  },
  {
    emoji: "🥾",
    name: "Outdoor & Natur",
    desc: "Wanderrouten, Radtouren, Kletterparks — für alle, die draußen lieber zu zweit als alleine sind.",
    active: 18,
    members: 98,
  },
  {
    emoji: "♟️",
    name: "Brettspiele & Spiele",
    desc: "Wer spielt noch mit? Strategie, Kooperation, Partyspiele. Finde Mitspieler in deiner Nähe.",
    active: 11,
    members: 67,
  },
  {
    emoji: "🏙️",
    name: "Neu in der Stadt",
    desc: "Zugezogen und noch nicht angekommen? Hier findest du Menschen, die das kennen.",
    active: 9,
    members: 54,
  },
  {
    emoji: "💃",
    name: "Tanzen & Bewegung",
    desc: "Salsa, Swing, Lindy Hop — oder einfach Lust auf Bewegung mit Musik. Alle Level willkommen.",
    active: 15,
    members: 83,
  },
  {
    emoji: "📌",
    name: "Schwarzes Brett",
    desc: "Mitstreiter gesucht, Fragen ans Plenum, spontane Ideen. Der offene Raum für alles andere.",
    active: 31,
    members: 201,
  },
];

const collabPreviews = [
  { emoji: "🥾", category: "Outdoor & Natur", title: "Schönste Wanderwege rund um München", meta: "von Karin · 12 Orte · 78 Likes", cover: "cover-green" },
  { emoji: "🎭", category: "Kultur & Stadtleben", title: "Kulturorte für gute Gespräche", meta: "von Sandra · 8 Orte · 34 Likes", cover: "cover-peach" },
  { emoji: "☕", category: "After Work", title: "Entspannte After-Work Spots", meta: "von Thomas · 6 Orte · 52 Likes", cover: "cover-blue" },
  { emoji: "🎲", category: "Brettspiele", title: "Cafés mit Spieleecke – München", meta: "von Jan · 5 Orte · 29 Likes", cover: "cover-gold" },
];

const personas = [
  { quote: "Ich bin seit zwei Jahren in München und kenne hauptsächlich Kollegen. Im Outdoor-Chatroom habe ich Menschen gefunden, mit denen ich wirklich reden kann — nicht nur Small Talk.", name: "Anna", age: 34, role: "Neu in München · Outdoor-Enthusiastin", avatar: "A", bg: "bg-sage" },
  { quote: "Ich wollte nie auf eine Dating-App, aber ich wollte auch nicht alleine ins Konzert. LoclSpots ist genau das Richtige — Menschen mit den gleichen Interessen, ohne komischen Beigeschmack.", name: "Michael", age: 48, role: "Kultur-Fan · Brettspiel-Liebhaber", avatar: "M", bg: "bg-peach" },
  { quote: "Mit 52 ist es nicht einfach, neue Hobbys mit anderen zu teilen. Hier fühle ich mich weder zu alt noch fehl am Platz. Ich habe sogar meine eigene Collab für Münchner Kulturorte erstellt.", name: "Barbara", age: 52, role: "Stadtentdeckerin · Collab-Erstellerin", avatar: "B", bg: "bg-gold" },
];

interface LandingPageContentProps {
  articles: Article[];
  collabs: PublicCollab[];
  events: PublicEvent[];
}

export function LandingPageContent({ articles, collabs, events }: LandingPageContentProps) {
  const { isLoggedIn } = useAuth();
  const scrollToChatrooms = () => {
    document.getElementById("chatrooms")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-light">
      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-sage/15 bg-cream/92 px-6 py-4 backdrop-blur-xl sm:px-12">
        <Link href="/" className="font-serif text-[22px] font-bold tracking-tight text-forest">
          Locl<span className="text-peach">Spots</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/artikel"
            className="text-[15px] font-medium text-sage hover:text-forest"
          >
            Artikel
          </Link>
          {isLoggedIn && (
            <Link
              href="/chatrooms"
              className="text-[15px] font-medium text-sage hover:text-forest"
            >
              Chatrooms
            </Link>
          )}
          <Link
            href="/login"
            className="rounded-full border-2 border-sage px-6 py-2.5 text-[15px] font-medium text-sage transition-colors hover:bg-sage hover:text-white"
          >
            Einloggen
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-forest px-6 py-2.5 text-[15px] font-semibold text-white transition-all hover:bg-peach hover:-translate-y-0.5"
          >
            Registrieren
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative grid min-h-screen grid-cols-1 items-center gap-12 overflow-hidden bg-cream px-6 pt-28 pb-16 sm:px-12 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:pt-32 lg:pb-20">
        <div
          className="pointer-events-none absolute -right-52 -top-52 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(143,184,168,0.18)_0%,transparent_70%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,132,90,0.1)_0%,transparent_70%)]"
          aria-hidden
        />

        <div className="relative z-10">
          <ScrollReveal>
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-sage/30 bg-white px-4 py-1.5 text-[13px] font-medium tracking-wide text-sage">
              <span className="text-[8px] text-peach">●</span>
              Die Community-Plattform für München · Für Menschen ab 30
            </span>
          </ScrollReveal>
          <ScrollReveal>
            <h1 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight text-forest sm:text-5xl lg:text-[58px]">
              Neue Leute kennenlernen in München —<br />
              ohne Dating-App-Vibe.
            </h1>
          </ScrollReveal>
          <ScrollReveal>
            <p className="mt-5 max-w-[480px] text-[19px] font-light leading-relaxed text-muted">
              LoclSpots verbindet Menschen ab 30 in München über das, was sie wirklich interessiert.
              Thematische Chatrooms, kuratierte Orte, echte Gespräche —
              ohne Feed, ohne Follower, ohne Algorithmus.
            </p>
          </ScrollReveal>
          <ScrollReveal className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-forest px-9 py-4 text-[17px] font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-peach hover:shadow-peach/30"
            >
              Kostenlos mitmachen
            </Link>
            <ChatroomCTA />
          </ScrollReveal>
          <ScrollReveal>
            <p className="mt-6 text-[14px] text-sage">
              Bereits über 2.400 Menschen in München dabei · Kostenlos & ohne Verpflichtung
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal className="relative z-10 mt-8 hidden lg:block lg:mt-0">
          <div className="relative p-5">
            <div className="absolute -right-2 top-0 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-lg">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4CAF50]" />
              <span className="text-xs text-text">24 Personen gerade aktiv</span>
            </div>
            <ChatMockup />
            <div className="absolute -bottom-2 left-5 flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 shadow-lg">
              <span>🗺️</span>
              <span className="text-xs text-text">Neue Collab geteilt</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* TRUST BAR */}
      <div className="flex flex-wrap items-center justify-center gap-8 bg-forest px-6 py-5 sm:gap-12 sm:px-12">
        <div className="flex items-center gap-2.5 text-[14px] text-white">
          <span className="font-serif text-[22px] font-bold text-mint">38</span>
          aktive Chatrooms
        </div>
        <div className="flex items-center gap-2.5 text-[14px] text-white">
          <span className="font-serif text-[22px] font-bold text-mint">1.200+</span>
          kuratierte Orte in München
        </div>
        <div className="flex items-center gap-2.5 text-[14px] text-white">
          <span className="font-serif text-[22px] font-bold text-mint">30+</span>
          ist hier der Standard
        </div>
        <div className="flex items-center gap-2.5 text-[14px] text-white">
          <span className="font-serif text-[22px] font-bold text-mint">0</span>
          Algorithmus-Druck
        </div>
      </div>

      {/* WARUM LOCLSPOTS */}
      <section className="bg-forest py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-12 text-white">
          <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[1.5px] text-mint">
            Warum LoclSpots?
          </span>
          <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
            Neue Freunde finden in München ab 30 —<br />
            warum es so schwer ist und wie es trotzdem klappt.
          </h2>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-center">
            <ScrollReveal className="space-y-5">
              <p className="text-[18px] font-light leading-relaxed text-white">
                Als Kind gibt es die Schule, als Student den Campus, als Berufseinsteiger das Büro.
                Ab 30 fehlen diese natürlichen Orte — die Stellen, an denen man einfach so Menschen trifft,
                die ähnlich denken und ähnlich leben.
              </p>
              <p className="text-[18px] font-light leading-relaxed text-white">
                Bestehende Plattformen lösen das Problem nicht: Instagram ist performativ, Dating-Apps haben
                einen eindeutigen Vibe, Facebook-Gruppen sind oft tot.
                <strong className="font-semibold text-mint"> LoclSpots ist keines davon.</strong>
              </p>
              <p className="text-[18px] font-light leading-relaxed text-white">
                Hier steht das Thema im Mittelpunkt — nicht dein Gesicht, nicht dein Status, nicht dein Follower-Count.
                Nur das, was dich wirklich interessiert.
              </p>
            </ScrollReveal>
            <ScrollReveal className="flex flex-col gap-4">
              {[
                { icon: "💬", title: "Kein Dating-App-Vibe", desc: "Thematische Räume statt Profil-Swipes. Menschen in München begegnen sich über Interessen — nicht über Fotos." },
                { icon: "🌿", title: "Kein Social-Media-Stress", desc: "Kein Feed, kein Algorithmus, kein Likes-Zählen. Nur echter Austausch in Chatrooms — dauerhaft, ohne Ablaufdatum." },
                { icon: "🤝", title: "Eine Community auf Augenhöhe", desc: "Alle ab 30. Kein Gefühl, zu alt für diese Plattform zu sein — weil alle hier im gleichen Lebensabschnitt sind." },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex gap-4 rounded-2xl border border-white/12 bg-white/[0.07] p-5"
                >
                  <span className="text-2xl shrink-0">{card.icon}</span>
                  <div>
                    <h4 className="font-semibold text-mint">{card.title}</h4>
                    <p className="mt-1 text-[14px] leading-relaxed text-white/90">{card.desc}</p>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CHATROOMS */}
      <section id="chatrooms" className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
          <div className="mb-14 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
                Thematische Chatrooms —<br />
                der Treffpunkt für Münchner ab 30.
              </h2>
            </div>
            <p className="text-[18px] font-light leading-relaxed text-muted">
              Wähle ein Thema, das dich interessiert — und bist sofort mittendrin.
              Kein Event, das endet. Kein Thread, der verschwindet. Einfach eine Gemeinschaft, die dauerhaft da ist.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chatrooms.map((room) => (
              <ScrollReveal key={room.name}>
                <div
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-[18px] border border-sage/12 bg-white p-6 transition-all duration-300",
                    "hover:-translate-y-1 hover:border-mint hover:shadow-xl hover:shadow-forest/10",
                    "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-sage before:transition-transform before:duration-300 group-hover:before:scale-x-100"
                  )}
                >
                  <div className="mb-2.5 text-[28px]">{room.emoji}</div>
                  <h3 className="font-semibold text-forest">{room.name}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{room.desc}</p>
                  <div className="mt-3.5 flex items-center justify-between text-[12px] text-mint">
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
                      {room.active} aktiv
                    </span>
                    <span>{room.members} Mitglieder</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WIE ES FUNKTIONIERT */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
          <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
            In drei Schritten neue Leute kennenlernen in München.
          </h2>

          <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
            <div
              className="absolute left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] top-9 hidden h-0.5 sm:block"
              aria-hidden
              style={{ background: "linear-gradient(90deg, #8FB8A8, #D4845A)" }}
            />
            {[
              { num: 1, title: "Thema wählen", desc: "Such dir Chatrooms zu Themen, die dich wirklich interessieren — Outdoor, Kultur, Sport, Essen, Spieleabende und mehr.", circleClass: "bg-cream text-forest border-2.5 border-sage" },
              { num: 2, title: "Gespräch beginnen", desc: "Schreib, stell Fragen, antworte. Die Community ist da — dauerhaft, ohne Druck, ohne Ablaufdatum.", circleClass: "bg-sage text-white border-2.5 border-sage" },
              { num: 3, title: "Echtes Treffen", desc: "Aus dem Chat wird ein Kaffee. Aus Gleichgesinnten werden Freunde. So einfach kann Neues kennenlernen in München sein.", circleClass: "bg-forest text-white border-2.5 border-forest" },
            ].map((step) => (
              <ScrollReveal key={step.num} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={cn(
                    "mb-5 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full font-serif text-2xl font-bold",
                    step.circleClass
                  )}
                >
                  {step.num}
                </div>
                <h3 className="font-serif text-lg font-semibold text-forest">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ENTDECKE MÜNCHEN - Öffentliche Collabs */}
      <DiscoverMunichSection collabs={collabs} />

      {/* HIGHLIGHT EVENTS */}
      {events.length > 0 && (
        <section className="bg-cream py-20 sm:py-24">
          <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
                  Nicht verpassen — Events in München
                </h2>
                <p className="mt-2 text-[18px] font-light leading-relaxed text-muted">
                  Die besten Veranstaltungen in München gerade jetzt.
                </p>
              </div>
              <Link
                href="/events"
                className="text-[15px] font-medium text-forest transition-colors hover:text-sage"
              >
                Alle Events in München →
              </Link>
            </div>
            <HighlightsCarousel events={events} limit={5} />
          </div>
        </section>
      )}

      {/* COLLAB FEATURE */}
      <section className="bg-warm py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
          <div className="mb-12 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
                Collabs — kuratierte Listen,<br />
                die Gespräche starten.
              </h2>
              <p className="mt-4 text-[18px] font-light leading-relaxed text-muted">
                Ob die besten Biergärten in München, Programmkinos, Wanderrouten oder After-Work-Spots — Collabs bündeln lokales Wissen und machen es für alle zugänglich. Entdecken und direkt im Chatroom diskutieren.
              </p>
              <p className="mt-4 font-semibold text-forest">
                Collabs inspirieren. Chatrooms verbinden.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {collabPreviews.map((c) => (
                <ScrollReveal key={c.title}>
                  <div className="flex cursor-pointer items-center gap-4 rounded-xl border border-sage/10 bg-white p-4 transition-all hover:translate-x-1 hover:shadow-lg hover:shadow-forest/10">
                    <div
                      className={cn(
                        "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[10px] text-2xl",
                        c.cover === "cover-green" && "bg-cream",
                        c.cover === "cover-peach" && "bg-[#FDF0E8]",
                        c.cover === "cover-blue" && "bg-[#EBF3F9]",
                        c.cover === "cover-gold" && "bg-[#FDF8EC]"
                      )}
                    >
                      {c.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-peach">
                        {c.category}
                      </div>
                      <div className="mt-0.5 font-semibold text-forest">{c.title}</div>
                      <div className="text-[12px] text-muted">{c.meta}</div>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-0.5 rounded-lg bg-cream px-3 py-2 text-[11px] font-medium text-sage transition-colors hover:bg-mint hover:text-white">
                      <span className="text-base">💬</span>
                      <span>Chat</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BLOG PREVIEW - Aus dem Blog / Tipps & Stories */}
      <BlogPreviewSection articles={articles} />

      {/* PERSONAS */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-12">
          <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[1.5px] text-peach">
            Für Menschen wie diese
          </span>
          <h2 className="font-serif text-3xl font-bold leading-tight text-forest sm:text-4xl">
            Wer ist bei LoclSpots?
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {personas.map((p) => (
              <ScrollReveal key={p.name}>
                <div className="relative rounded-[20px] border border-sage/10 bg-white p-8">
                  <span className="block font-serif text-[60px] leading-none text-mint/50" aria-hidden>
                    „
                  </span>
                  <p className="relative -mt-2 mb-5 text-[15px] italic leading-relaxed text-text">
                    {p.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-lg font-bold text-white",
                        p.bg
                      )}
                    >
                      {p.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-forest">{p.name}, {p.age}</div>
                      <div className="text-[12px] text-muted">{p.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="relative overflow-hidden bg-forest py-28 sm:py-32 text-white">
        <div
          className="pointer-events-none absolute left-1/2 top-[-150px] h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(143,184,168,0.12)_0%,transparent_70%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center sm:px-12">
          <h2 className="font-serif text-4xl font-bold text-mint sm:text-5xl">
            Bereit? Fang heute an.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[18px] font-light leading-relaxed text-white">
            Keine Kreditkarte. Kein Algorithmus. Kein Scroll-Feed.
            Nur echte Menschen und echte Gespräche in München —
            über das, was dich wirklich interessiert.
          </p>
          <Link
            href="/register"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-peach px-12 py-4 text-[18px] font-semibold text-white ring-2 ring-white/20 transition-all hover:bg-peach/90 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-peach/30"
          >
            Kostenlos registrieren
          </Link>
          <p className="mt-5 text-[13px] text-white/70">
            Bereits über 2.400 Menschen in München dabei · Kostenlos & ohne Verpflichtung
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-wrap items-center justify-between gap-5 bg-[#1E3028] px-6 py-10 sm:px-12 text-white">
        <Link href="/" className="font-serif text-lg font-semibold text-mint">
          Locl<span className="text-peach">Spots</span>
        </Link>
        <div className="flex gap-7">
          <Link href="/impressum" className="text-[13px] text-white/40 transition-colors hover:text-mint">
            Impressum
          </Link>
          <Link href="/datenschutz" className="text-[13px] text-white/40 transition-colors hover:text-mint">
            Datenschutz
          </Link>
          <Link href="/kontakt" className="text-[13px] text-white/40 transition-colors hover:text-mint">
            Kontakt
          </Link>
        </div>
        <div className="text-[12px] text-white/25">© 2026 LoclSpots</div>
      </footer>
    </div>
  );
}
