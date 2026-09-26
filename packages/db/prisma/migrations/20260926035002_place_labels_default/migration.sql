-- AlterTable
ALTER TABLE "place" ALTER COLUMN "labels" SET DEFAULT ARRAY[]::"PlaceLabel"[];

-- Rows created before the default have NULL labels
UPDATE "place" SET "labels" = '{}' WHERE "labels" IS NULL;