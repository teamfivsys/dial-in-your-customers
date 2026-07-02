CREATE TABLE public.ab_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant text NOT NULL CHECK (variant IN ('A','B')),
  event text NOT NULL CHECK (event IN ('impression','whatsapp_click')),
  session_id text NOT NULL,
  path text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.ab_events TO anon, authenticated;
GRANT ALL ON public.ab_events TO service_role;
ALTER TABLE public.ab_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log ab events" ON public.ab_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX ab_events_variant_event_idx ON public.ab_events(variant, event, created_at DESC);