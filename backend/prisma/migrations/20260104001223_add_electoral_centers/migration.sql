-- CreateTable
CREATE TABLE "ElectoralCenter" (
    "id" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "addressAr" TEXT,
    "addressEn" TEXT,
    "addressFr" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectoralCenter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ElectoralCenter_districtId_idx" ON "ElectoralCenter"("districtId");

-- CreateIndex
CREATE INDEX "ElectoralCenter_latitude_longitude_idx" ON "ElectoralCenter"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "ElectoralCenter" ADD CONSTRAINT "ElectoralCenter_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

