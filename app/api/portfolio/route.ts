import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/supabase/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch portfolio data" }, { status: 500 });
  }
}
