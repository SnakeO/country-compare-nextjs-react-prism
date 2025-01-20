import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface TransformedPopulationData {
  country_id: string; // Two-letter country code (e.g., "US")
  countryiso3code: string; // Three-letter ISO code (e.g., "USA")
  name: string; // Country name
  indicator_id: string;
  year: number;
  value: number;
}

async function writePopulationData(data: TransformedPopulationData[]): Promise<void> {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("writePopulationData received an empty or invalid data array.");
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

      // Delete old population data for the same country, indicator, and year
      await prisma.data.deleteMany({
        where: {
          country_id: entry.country_id,
          indicator_id: entry.indicator_id,
          year: entry.year,
        },
      });

      // Insert the updated population data
      await prisma.data.create({
        data: {
          country_id: entry.country_id,
          indicator_id: entry.indicator_id,
          year: entry.year,
          value: entry.value,
        },
      });

    } catch (error) {
      console.error(`Error writing data for entry: ${JSON.stringify(entry)}`, error);
    }
  }
}

export default writePopulationData;