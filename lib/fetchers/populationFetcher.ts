import axios from "axios";
import { transformPopulationData, TransformedPopulationData } from "../transformers/populationTransformer";
import { countries } from "../../constants/countries";

// Define the type for a single country's population data
export interface PopulationData {
  indicator: {
    id: string; // e.g., "SP.POP.TOTL"
    value: string; // e.g., "Population, total"
  };
  country: {
    id: string; // e.g., "US"
    value: string; // e.g., "United States"
  };
  countryiso3code: string; // e.g., "USA"
  date: string; // e.g., "2023"
  value: number | null; // Population value (can be a number or null)
  unit: string; // Unit of the value (often empty)
  obs_status: string; // Observation status (often empty)
  decimal: number; // Number of decimals in the value
}

// Metadata for the API response at response.data[0]
interface PopulationResponseMetadata {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

// Full API response type
type PopulationApiResponse = [PopulationResponseMetadata, PopulationData[]];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchPopulationData(): Promise<TransformedPopulationData[]> {
  const baseUrl = "https://api.worldbank.org/v2/country/{COUNTRY}/indicator/SP.POP.TOTL?format=json&per_page=1000";
  const combinedData: TransformedPopulationData[] = [];

  for (const country of countries) {
    const url = baseUrl.replace("{COUNTRY}", country);

    try {
      // Use the newly created types for the API response
      const response = await axios.get<PopulationApiResponse>(url);

      // Check for validity of the response data
      if (response.data && response.data[1]) {
        // Transform the fetched data
        const transformedData = transformPopulationData(response.data[1]);
        combinedData.push(...transformedData);
      } else {
        console.warn(`No valid population data for ${country}. Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching population data for ${country}:`, error.message);
      } else {
        console.error(`Unknown error fetching population data for ${country}:`, error);
      }
    }

    // Delay to avoid rate limiting
    await delay(200);
  }

  // Log and handle empty data scenarios
  if (combinedData.length === 0) {
    console.warn("No population data was fetched for any country.");
  }

  return combinedData;
}