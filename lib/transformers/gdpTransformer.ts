import { GDPData } from "../fetchers/gdpFetcher"; // Assuming the type is exported from the fetcher
export interface TransformedGDPData {
  indicator_id: string;
  country_id: string;
  countryiso3code: string;
  name: string; // Country name
  year: number;
  value: number;
}

export function transformGDPData(rawData: GDPData[]): TransformedGDPData[] {
  // Find the maximum year in the dataset
  const newestYear = Math.max(...rawData.map((entry) => parseInt(entry.date, 10)));

  // Filter the raw data for only the latest year's data
  const newestData = rawData.filter((entry) => parseInt(entry.date, 10) === newestYear);

  // Transform the filtered data into the required format
  return newestData.map((entry) => ({
    indicator_id: entry.indicator.id,
    country_id: entry.country.id,
    countryiso3code: entry.countryiso3code,
    name: entry.country.value,
    year: newestYear,
    value: entry.value !== null ? entry.value : 0, // Handle null values
  }));
}