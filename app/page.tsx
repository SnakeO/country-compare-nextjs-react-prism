"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { SearchBar } from "@/app/components/SearchBar";
import { SearchResult } from "@/app/components/SearchResult";
import { Map } from "@/app/components/Map";
import { Chart } from "@/app/components/Chart";

interface PopulationItem {
  country_id: string;
  name: string;
  iso_code: string;
  population: number;
}

interface GdpItem {
  country_id: string;
  name: string;
  iso_code: string;
  gdp: number;
}

interface MergedItem {
  country_id: string;
  name: string;
  iso_code: string;
  population: number;
  gdp: number;
  group: number; // Default group value
}

export default function Home() {
  const [mergedData, setMergedData] = useState<MergedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Tracks search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from both APIs simultaneously
        const [populationResponse, gdpResponse] = await Promise.all([
          axios.get("/api/population"),
          axios.get("/api/gdp")
        ]);

        const populationData = populationResponse.data;
        const gdpData = gdpResponse.data;

        // Merge the datasets based on a shared key (country_id)
        const merged = populationData.map((populationItem: PopulationItem) => {
          const gdpItem = gdpData.find(
            (item: GdpItem) => item.country_id === populationItem.country_id
          );

          return {
            country_id: populationItem.country_id,
            name: populationItem.name,
            iso_code: populationItem.iso_code,
            population: populationItem.population,
            gdp: gdpItem.gdp,
            group: 0 // Default group value
          } as MergedItem;
        });
        setMergedData(merged);
      } catch (error) {
        console.error("Error fetching or merging data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to toggle the group value for a country (when clicked)
  const changeCountryGroup = (countryId: string) => {
    const updatedCountries = mergedData.map((country) =>
      country.country_id === countryId
        ? { ...country, group: (country.group + 1) % 3 } // Cycle group: 0 → 1 → 2 → 0
        : country
    );

    setMergedData(updatedCountries); // Update the state
  };

  // Filter mergedData based on searchTerm input
  const searchResults = searchTerm
    ? mergedData.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Main Area: Map and Chart */}
      <div className="flex flex-col md:w-1/2">
        {/* Map Section */}
        <div className="flex-1 h-full">
          <Map countries={mergedData} onCountryClick={changeCountryGroup} />
        </div>
        {/* Chart Section */}
        <div className="h-1/3 md:h-1/2 overflow-auto">
          <Chart countries={mergedData} />
        </div>
      </div>

      {/* Sidebar: Search Bar and Results */}
      <div className="w-full md:w-1/2 flex flex-col p-4 overflow-auto border-l border-gray-200">
        {/* Search Bar */}
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <br />
        {/* Search Results */}
        <div className="overflow-auto max-h-full flex flex-wrap gap-2">
          {searchResults.map((country, index) => (
            <SearchResult
              key={country.country_id}
              country={country}
              onClick={changeCountryGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
}