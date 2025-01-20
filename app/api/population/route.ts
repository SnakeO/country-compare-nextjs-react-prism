import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Retrieve the newest population data for all countries
    const data = await prisma.data.findMany({
      where: {
        indicator_id: "SP.POP.TOTL", // Filter by population indicator
      },
      select: {
        country_id: true, // Select `country_id` from the `data` table
        value: true, // Select `value` from the `data` table
        Country: {
          select: {
            name: true, // Select `name` from the `Country` table
            iso_code: true, // Select `iso_code` from the `Country` table
          },
        },
      },
    });

    // Transform the data to flatten out the response
    const filteredData = data.map((entry) => ({
      country_id: entry.country_id,
      population: entry.value,
      name: entry.Country?.name || null, // Use null safety for name
      iso_code: entry.Country?.iso_code || null, // Use null safety for iso_code
    }));

    if (filteredData.length > 0) {
      // Return the filtered population data
      return NextResponse.json(filteredData);
    } else {
      return NextResponse.json(
        { message: "No population data available." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching newest population data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}