-- CreateTable
CREATE TABLE "Metric" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metricTimeStamp" TEXT,
    "unit" TEXT,
    "name" TEXT,
    "qty" DOUBLE PRECISION,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("id")
);
