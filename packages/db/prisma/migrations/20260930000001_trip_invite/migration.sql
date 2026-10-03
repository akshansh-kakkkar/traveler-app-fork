-- Baseline: trip_invite was added to the shared DB with `db:push` (no migration
-- existed). Marked as already applied there; on a fresh database it is created.
CREATE TABLE "trip_invite" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_invite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "trip_invite_token_key" ON "trip_invite"("token");
CREATE INDEX "trip_invite_tripId_idx" ON "trip_invite"("tripId");
CREATE INDEX "trip_invite_createdById_idx" ON "trip_invite"("createdById");

ALTER TABLE "trip_invite" ADD CONSTRAINT "trip_invite_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "trip_invite" ADD CONSTRAINT "trip_invite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
