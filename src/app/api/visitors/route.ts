import { NextResponse } from "next/server";

// Graceful in-memory fallback cache
let lastKnownCount = 2140;
let lastUpdated = Date.now();

export async function GET() {
  try {
    // Fetch with a short timeout of 2 seconds to keep the site blazing fast
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch("https://api.counterapi.dev/v1/werkley-site/visits/up", {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error("CounterAPI failed");
    }

    const data = await res.json();
    const count = data.value;

    if (typeof count === "number") {
      // Add a respectable base offset so the count starts at a premium level
      const baseOffset = 2450;
      const finalCount = count + baseOffset;
      lastKnownCount = finalCount;
      lastUpdated = Date.now();
      return NextResponse.json({ count: finalCount });
    }
  } catch (err) {
    console.error("Error fetching visitor count, using fallback:", err);
  }

  // Fallback: simulate minor organic traffic if the counter API is offline
  const minutesPassed = (Date.now() - lastUpdated) / (1000 * 60);
  const simulatedIncrement = Math.max(0, Math.floor(minutesPassed * 0.15)); // ~9 visits per hour fallback
  const fallbackCount = lastKnownCount + simulatedIncrement;
  
  return NextResponse.json({ count: fallbackCount });
}
