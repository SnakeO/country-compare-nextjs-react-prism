import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TransformedGDPData {
  country_id: string;
  countryiso3code: string;
  name: string;
  indicator_id: string;
  year: number;
  value: number;
}

async function writeGDPData(data: TransformedGDPData[]): Promise<void> {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("writeGDPData received no valid data to write. Skipping...");
    return;
  }

  for (const entry of data) {
    try {
      // Ensure the Country exists
      await prisma.country.upsert({
        where: { country_id: entry.country_id },
        update: {},
        create: {
          country_id: entry.country_id,
          iso_code: entry.countryiso3code,
          name: entry.name,
        },
      });

      // Ensure the Indicator exists
      await prisma.indicator.upsert({
        where: { indicator_id: entry.indicator_id },
        update: {},
        create: {
          indicator_id: entry.indicator_id,
        },
      });

      // Delete old GDP data for the same country, indicator, and year
      await prisma.data.deleteMany({
        where: {
          country_id: entry.country_id,
          indicator_id: entry.indicator_id,
          year: entry.year,
        },
      });

      // Insert the updated GDP data
      await prisma.data.create({
        data: {
          country_id: entry.country_id,
          indicator_id: entry.indicator_id,
          year: entry.year,
          value: entry.value,
        },
      });

    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error writing data for entry: ${JSON.stringify(entry)}`, error.message);
      } else {
        console.error(`Unknown error writing data for entry: ${JSON.stringify(entry)}`, error);
      }
    }
  }
}

export default writeGDPData;