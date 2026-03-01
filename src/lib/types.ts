export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  interests: string[];
  avatar_url: string | null;
  created_at: string;
}

export interface Chatroom {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: string;
  member_count?: number;
  created_at: string;
}

export interface Message {
  id: string;
  chatroom_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

/** Bestehende places-Tabelle */
export interface Place {
  id: string;
  kind: string;
  name: string;
  place_url: string | null;
  category: string | null;
  rating: string | null;
  review_count: string | null;
  price: string | null;
  address: string | null;
  website: string | null;
  phone: string | null;
  status: string | null;
  img_url: string | null;
  lat: string | null;
  lng: string | null;
  instagram_url: string | null;
  opening_hours_json: Record<string, string> | null;
}

/** Bestehende collabs-Tabelle */
export interface Collab {
  id: string;
  owner_id?: string;
  creator_id: string;
  title: string;
  description: string | null;
  category?: string | null;
  is_public?: boolean;
  cover_emoji?: string | null;
  cover_media_urls?: string[];
  created_at: string;
  updated_at?: string;
  likes_count?: number;
  chatroom_id?: string | null;
  profile?: Profile;
  items?: CollabItem[];
}

/** Bestehende collab_items-Tabelle */
export interface CollabItem {
  id: string;
  collab_id: string;
  place_id: string;
  position: number;
  name?: string;
  maps_url?: string;
  description: string | null;
  created_at: string;
  place?: Place;
}

/** Bestehende events-Tabelle (exakte Spaltenabbildung) */
export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  date?: string | null;
  start_date: string | null;
  start_time: string | null;
  start_datetime: string | null;
  end_date: string | null;
  end_time: string | null;
  end_datetime: string | null;
  venue_name: string | null;
  venue_id: string | null;
  category: string | null;
  tags: string[] | null;
  source: string | null;
  source_url: string | null;
  is_public: boolean;
  is_cancelled: boolean;
  cover_image_url: string | null;
  lat: string | null;
  lng: string | null;
  created_at: string;
  updated_at: string;
  highlights: boolean;
}

/** Event mit joined-Feldern (participant_count, is_participating) */
export interface Event extends EventRow {
  participant_count?: number;
  is_participating?: boolean;
}

/** articles-Tabelle */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tags: string[];
  author_id: string;
  is_published: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
