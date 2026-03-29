-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'mare',
    "imageUrl" TEXT,
    "description" TEXT,
    "popularity" INTEGER,
    "bestSeason" TEXT,
    "targetAudience" TEXT,
    "aiResearchNotes" TEXT,
    "aiResearchDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "departureDate" DATETIME NOT NULL,
    "returnDate" DATETIME NOT NULL,
    "departureAirport" TEXT NOT NULL,
    "hotelName" TEXT,
    "hotelStars" INTEGER,
    "mealPlan" TEXT,
    "affiliateLink" TEXT NOT NULL,
    "notes" TEXT,
    "usedInVideo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pianificato',
    "plannedDate" DATETIME,
    "publishedDate" DATETIME,
    "hashtags" TEXT,
    "tiktokUrl" TEXT,
    "canvaDesignId" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Video_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VideoOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    CONSTRAINT "VideoOffer_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VideoOffer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT,
    "designType" TEXT NOT NULL,
    "canvaDesignId" TEXT,
    "editUrl" TEXT,
    "exportUrl" TEXT,
    "thumbnailUrl" TEXT,
    "queryUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Creative_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoOffer_videoId_offerId_key" ON "VideoOffer"("videoId", "offerId");
