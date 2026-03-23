
CREATE TABLE public.testimonial_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonial_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published testimonial videos"
  ON public.testimonial_videos FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins full access testimonial videos"
  ON public.testimonial_videos FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE TRIGGER update_testimonial_videos_updated_at
  BEFORE UPDATE ON public.testimonial_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
