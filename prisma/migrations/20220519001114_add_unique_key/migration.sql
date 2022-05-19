/*
  Warnings:

  - A unique constraint covering the columns `[uniqueKey]` on the table `Metric` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueKey` to the `Metric` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metric" ADD COLUMN     "uniqueKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Metric_uniqueKey_key" ON "Metric"("uniqueKey");
