-- Keep anonymous analytics aligned with the event names emitted by the client.
-- Forward-only repair: do not rewrite the already-applied migration history.
DROP POLICY IF EXISTS "Anyone can log valid ab events" ON public.ab_events;

CREATE POLICY "Anyone can log valid ab events"
ON public.ab_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  variant IN ('A', 'B')
  AND event IN ('impression', 'whatsapp_click')
  AND length(session_id) BETWEEN 1 AND 100
  AND (path IS NULL OR length(path) <= 300)
  AND (user_agent IS NULL OR length(user_agent) <= 500)
);
