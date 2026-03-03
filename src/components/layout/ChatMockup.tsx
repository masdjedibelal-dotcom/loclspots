"use client";

export function ChatMockup() {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(45,74,62,0.14),0_4px_16px_rgba(0,0,0,0.06)] animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 bg-forest px-5 py-4">
        <span className="cursor-pointer text-[13px] text-white/60">←</span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-white">🎭 Kultur & Stadtleben</div>
          <div className="text-[12px] text-white/55">142 Mitglieder · München</div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white/80">
          👥 142
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3.5 p-5">
        <div className="flex gap-2.5 items-start">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-sage text-[14px] font-semibold text-white">
            M
          </div>
          <div>
            <div className="rounded-2xl rounded-tl-sm bg-warm px-3.5 py-2.5 max-w-[240px]">
              <div className="text-[11px] font-semibold text-sage mb-0.5">Monika, 47</div>
              <div className="text-[14px] leading-[1.45] text-text">
                Hat jemand die neue Ausstellung im Kunsthaus schon gesehen?
              </div>
              <div className="mt-1 text-right text-[10px] text-muted">14:32</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 items-start">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gold text-[14px] font-semibold text-white">
            R
          </div>
          <div>
            <div className="rounded-2xl rounded-tl-sm bg-warm px-3.5 py-2.5 max-w-[240px]">
              <div className="text-[11px] font-semibold text-sage mb-0.5">Ralf, 52</div>
              <div className="text-[14px] leading-[1.45] text-text">
                Ja! Sehr beeindruckend. Würde die gerne nochmal mit jemandem besuchen 🙂
              </div>
              <div className="mt-1 text-right text-[10px] text-muted">14:35</div>
            </div>
          </div>
        </div>

        {/* Collab Card */}
        <div className="rounded-xl border-l-4 border-peach bg-cream px-3.5 py-3 mt-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-peach">
            📋 Collab-Tipp
          </div>
          <div className="mt-0.5 font-semibold text-[13px] text-forest">
            Kulturorte für gute Gespräche – München
          </div>
          <div className="text-[12px] text-muted">von Sandra · 8 Orte · 34 Likes</div>
        </div>

        {/* Own message */}
        <div className="flex gap-2.5 items-start justify-end">
          <div className="flex flex-col items-end">
            <div className="rounded-2xl rounded-tr-sm bg-forest px-3.5 py-2.5 max-w-[240px] text-white/92">
              <div className="text-[14px] leading-[1.45]">
                Ich kenne mich da gut aus! Wann hättet ihr Zeit? ☕
              </div>
              <div className="mt-1 text-right text-[10px] text-white/50">14:38</div>
            </div>
          </div>
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-forest text-[14px] font-semibold text-white">
            S
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2.5 items-center border-t border-warm px-4 py-3">
        <input
          type="text"
          placeholder="Schreib etwas…"
          readOnly
          className="flex-1 rounded-full border-none bg-warm px-4 py-2 text-[13px] text-muted placeholder:text-muted outline-none"
        />
        <button
          type="button"
          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-forest text-white"
          aria-label="Senden"
        >
          →
        </button>
      </div>
    </div>
  );
}
