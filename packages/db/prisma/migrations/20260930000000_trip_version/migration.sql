-- Baseline: added to the shared DB with `db:push` (no migration existed).
-- Marked as already applied there; on a fresh database it creates the column.
ALTER TABLE "trip" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
