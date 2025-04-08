"use server"
import { TRADING_API_KEY } from "@/utils/serverEnv";

export async function getSwedenData() {


  try {
    const response = await fetch(
      `https://api.tradingeconomics.com/country/sweden?c=${TRADING_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error fetching country data:", error);
    return { error: "Error fetching data" };
  }
}
