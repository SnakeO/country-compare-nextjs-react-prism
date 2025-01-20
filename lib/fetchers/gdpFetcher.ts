import axios from "axios";
import { transformGDPData, TransformedGDPData } from "../transformers/gdpTransformer";
import { countries } from "../../constants/countries";

// Define the type for a single country's GDP data
export interface GDPData {
  indicator: {
    id: string; // e.g., "NY.GDP.MKTP.CD"
    value: string; // e.g., "GDP (current US$)"
  };
  country: {
    id: string; // e.g., "CH"
    value: string; // e.g., "Switzerland"
  };
  countryiso3code: string; // e.g., "CHE"
  date: string; // e.g., "2023"
  value: number | null; // GDP value (can be a number or null)
  unit: string; // Unit of the value (appears empty in the sample)
  obs_status: string; // Observation status (appears empty in the sample)
  decimal: number; // Number of decimals in the value
}

// Metadata for the API response at response.data[0]
interface GDPResponseMetadata {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  sourceid: string;
  lastupdated: string;
}

// Full API response type
type GDPApiResponse = [GDPResponseMetadata, GDPData[]];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchGDPData(): Promise<TransformedGDPData[]> {
  const baseUrl =
    "https://api.worldbank.org/v2/country/{COUNTRY}/indicator/NY.GDP.MKTP.CD?format=json&per_page=1000";
  const combinedData: TransformedGDPData[] = [];

  for (const country of countries) {
    const url = baseUrl.replace("{COUNTRY}", country);

    try {
      // Use newly created types for the API response
      const response = await axios.get<GDPApiResponse>(url);

      if (response.data && response.data[1]) {
        // Transform the fetched data
        const transformedData = transformGDPData(response.data[1]);
        combinedData.push(...transformedData);
      } else {
        console.warn(`No valid GDP data available for ${country}. Response: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching GDP data for ${country}:`, error.message);
      } else {
        console.error(`Unknown error fetching GDP data for ${country}:`, error);
      }
    }

    // Delay to prevent rate limiting
    await delay(200); // Adjust delay as needed
  }

  if (combinedData.length === 0) {
    console.warn("No GDP data fetched for any country. Returning empty array.");
  }

  return combinedData;
}