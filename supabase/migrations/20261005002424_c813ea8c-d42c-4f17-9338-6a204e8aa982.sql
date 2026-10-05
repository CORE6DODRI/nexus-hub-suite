ALTER TABLE public.company
  ADD COLUMN IF NOT EXISTS login_logo_url text,
  ADD COLUMN IF NOT EXISTS login_logo_size integer NOT NULL DEFAULT 120 CHECK (login_logo_size BETWEEN 48 AND 320),
  ADD COLUMN IF NOT EXISTS core_logo_large_url text,
  ADD COLUMN IF NOT EXISTS core_logo_large_size integer NOT NULL DEFAULT 150 CHECK (core_logo_large_size BETWEEN 72 AND 320),
  ADD COLUMN IF NOT EXISTS core_logo_small_url text,
  ADD COLUMN IF NOT EXISTS core_logo_small_size integer NOT NULL DEFAULT 36 CHECK (core_logo_small_size BETWEEN 24 AND 96);