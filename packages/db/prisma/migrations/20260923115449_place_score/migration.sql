-- AlterTable
ALTER TABLE "place" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "scoreSource" TEXT NOT NULL DEFAULT 'osm';

-- CreateIndex
CREATE INDEX "place_cityId_category_score_idx" ON "place"("cityId", "category", "score");
