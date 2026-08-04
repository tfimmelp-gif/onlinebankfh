-- Optional synthetic customer profile photo stored in private object storage.
ALTER TABLE customer_profiles
  ADD COLUMN profile_photo_object_key TEXT,
  ADD COLUMN profile_photo_media_type VARCHAR(100),
  ADD COLUMN profile_photo_sha256 BYTEA,
  ADD CONSTRAINT customer_profile_photo_complete CHECK (
    (profile_photo_object_key IS NULL
      AND profile_photo_media_type IS NULL
      AND profile_photo_sha256 IS NULL)
    OR
    (profile_photo_object_key IS NOT NULL
      AND profile_photo_media_type IN ('image/jpeg', 'image/png', 'image/webp')
      AND profile_photo_sha256 IS NOT NULL)
  );
