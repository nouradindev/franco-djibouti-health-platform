
-- Create public bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Allow authenticated admins to upload files
CREATE POLICY "Admins can upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' AND public.is_admin(auth.uid())
);

-- Allow authenticated admins to update files
CREATE POLICY "Admins can update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media' AND public.is_admin(auth.uid())
);

-- Allow authenticated admins to delete files
CREATE POLICY "Admins can delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND public.is_admin(auth.uid())
);

-- Allow public read access
CREATE POLICY "Public can read media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');
