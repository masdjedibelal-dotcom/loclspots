"use client";

import { CollabsClient } from "../collabs/CollabsClient";
import type { Collab } from "@/lib/types";

interface CollabWithItemCount extends Collab {
  itemCount: number;
}

interface EntdeckenClientProps {
  collabs: CollabWithItemCount[];
  articles: { id: string }[];
  currentUserId: string;
}

export function EntdeckenClient({ collabs }: EntdeckenClientProps) {
  return <CollabsClient collabs={collabs} embedded />;
}
