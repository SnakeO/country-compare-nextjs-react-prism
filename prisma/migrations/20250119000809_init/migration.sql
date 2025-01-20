-- CreateTable
CREATE TABLE "Country" (
    "country_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "iso_code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Indicator" (
    "indicator_id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Data" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country_id" TEXT NOT NULL,
    "indicator_id" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "year" INTEGER NOT NULL,
    CONSTRAINT "Data_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Country" ("country_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Data_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "Indicator" ("indicator_id") ON DELETE CASCADE ON UPDATE CASCADE
);
