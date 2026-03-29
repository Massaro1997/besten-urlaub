/*
  Warnings:

  - You are about to drop the column `departureAirport` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `departureDate` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `hotelName` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `hotelStars` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `mealPlan` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `originalPrice` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `returnDate` on the `Offer` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "priceFrom" REAL,
    "affiliateLink" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "usedInVideo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Offer" ("affiliateLink", "createdAt", "destinationId", "id", "notes", "title", "updatedAt", "usedInVideo") SELECT "affiliateLink", "createdAt", "destinationId", "id", "notes", "title", "updatedAt", "usedInVideo" FROM "Offer";
DROP TABLE "Offer";
ALTER TABLE "new_Offer" RENAME TO "Offer";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
