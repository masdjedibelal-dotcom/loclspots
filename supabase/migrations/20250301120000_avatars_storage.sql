-- Avatars Storage Bucket (öffentlich, da Profilbilder öffentlich sichtbar sind)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Nutzer dürfen nur ihre eigene Datei hochladen/überschreiben (userId.jpg)
create policy "Users can upload own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  name = (auth.uid()::text || '.jpg')
);

create policy "Users can update own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  name = (auth.uid()::text || '.jpg')
);

-- Öffentlicher Lesezugriff für alle Avatare (bucket public, für Upsert nötig)
create policy "Avatar images are publicly accessible"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'avatars');
