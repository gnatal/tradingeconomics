// File: app/api/country/[country]/route.ts
import { TRADING_API_KEY } from "@/utils/serverEnv";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  const { country } = params;

  if (!country) {
    return NextResponse.json({ error: "Country is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.tradingeconomics.com/country/${country}?c=${TRADING_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching country data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
