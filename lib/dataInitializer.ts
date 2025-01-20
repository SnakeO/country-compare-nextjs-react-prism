// import { PrismaClient } from "@prisma/client";
import { fetchPopulationData } from "./fetchers/populationFetcher";
import writePopulationData from "./writers/populationWriter";
import { fetchGDPData } from "./fetchers/gdpFetcher";
import writeGDPData from "./writers/gdpWriter";

export async function initializePopulationData() {
  try {
    console.log("Fetching population data...");
    const data = await fetchPopulationData();

    console.log("Writing population data to the database...");
    await writePopulationData(data);

    console.log("Population data initialized successfully.");
  } catch (error) {
    console.error("Error initializing population data:", error);
  }
}

export async function initializeGDPData() {
  try {
    console.log("Fetching GDP data...");
    const data = await fetchGDPData();

    console.log("Writing GDP data to the database...");
    await writeGDPData(data);

    console.log("GDP data initialized successfully.");
  } catch (error) {
    console.error("Error initializing GDP data:", error);
  }
}