"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { joinEvent, leaveEvent } from "@/app/(app)/events/actions";
import type { Event } from "@/lib/types";

interface EventDetailClientProps {
  event: Event;
  currentUserId: string;
  isParticipating: boolean;
  participantCount: number;
}

export function EventDetailClient({
  event,
  isParticipating,
  participantCount,
}: EventDetailClientProps) {
  const router = useRouter();
  const [participating, setParticipating] = useState(isParticipating);
  const [count, setCount] = useState(participantCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const wasParticipating = participating;
    setParticipating(!participating);
    setCount((c) => (wasParticipating ? c - 1 : c + 1));

    const result = wasParticipating
      ? await leaveEvent(event.id)
      : await joinEvent(event.id);

    if (result?.error) {
      setParticipating(wasParticipating);
      setCount((c) => (wasParticipating ? c + 1 : c - 1));
    } else {
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-6">
      <Button
        size="lg"
        variant={participating ? "outline" : "primary"}
        onClick={handleToggle}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {participating ? "Abmelden" : "Teilnehmen"}
      </Button>
    </div>
  );
}
