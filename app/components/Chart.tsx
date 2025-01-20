"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts"; // Import ApexOptions for proper typing

// Dynamically import ApexCharts for SSR compatibility
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SeriesData {
  name: string;
  data: number[]; // Array of numbers for population and GDP
}

interface ChartState {
  series: SeriesData[];
  options: ApexOptions; // Use the correct typing for ApexCharts options
}

interface ChartProps {
  countries: {
    name: string;
    population: number;
    gdp: number;
    group: number;
  }[];
}

export const Chart = ({ countries }: ChartProps) => {
  // Explicitly define the type for useState
  const [state, setState] = useState<ChartState>({
    series: [], // Initial empty series
    options: {
      chart: {
        type: "bar", // Correctly typed as "bar"
        height: 350,
        stacked: true,
        stackType: "100%"
      },
      plotOptions: {
        bar: {
          horizontal: true // Horizontal stacked bar chart
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"] // Stroke color
      },
      title: {
        text: "Country Compare"
      },
      xaxis: {
        categories: ["Total POP", "Total GDP", "Population", "GDP"] // Categories for population and GDP
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}K` // Formatting tooltip for numbers
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      },
      colors: ["#bdbdbd", "#003a94", "#e50e0e"]
    }
  });

  useEffect(() => {
    if (!countries?.length) {
      return
    }

    // Step 1: Calculate totals for each group (group 0, 1, 2)
    const groupTotals = [0, 1, 2].map((group) => {
      const groupData = countries.filter((country) => country.group === group);
      const totalPopulation = groupData.reduce(
        (sum, country) => sum + (country.population || 0),
        0
      );
      const totalGDP = groupData.reduce(
        (sum, country) => sum + (country.gdp || 0),
        0
      );
      return { totalPopulation, totalGDP };
    });

    // Step 2: Format data for ApexCharts series
    const seriesData: SeriesData[] = [
      {
        name: "Total", // Group 0
        data: [groupTotals[0].totalPopulation, groupTotals[0].totalGDP, 0, 0] // include the gray countries in the first 2 rows of the chart, but not the last 2
      },
      {
        name: "Blue Team", // Group 1
        data: [groupTotals[1].totalPopulation, groupTotals[1].totalGDP, groupTotals[1].totalPopulation, groupTotals[1].totalGDP]
      },
      {
        name: "Red Team", // Group 2
        data: [groupTotals[2].totalPopulation, groupTotals[2].totalGDP, groupTotals[2].totalPopulation, groupTotals[2].totalGDP]
      }
    ];

    // Step 3: Update the state with the calculated series
    setState((prevState) => ({
      ...prevState,
      series: seriesData
    }));
  }, [countries]); // Recompute series whenever countries data changes

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options} // Chart options
          series={state.series} // Dynamically set series
          type="bar"
          height={270}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};