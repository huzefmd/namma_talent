import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  if (q.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const admin = createAdminClient();

  // Lightweight search: name/category/location contains the query (case-insensitive).
  // Assumes `talents` table has columns: id, name, category, location, portfolio_images (text[]).
  const { data, error } = await admin
    .from("talents")
    .select("id,name,category,location,portfolio_images")
    .or(`name.ilike.%${q}%,category.ilike.%${q}%,location.ilike.%${q}%`)
    .limit(8);

  if (error) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  return NextResponse.json({
    results: (data ?? []).map((t: any) => ({
      id: t.id as string,
      name: t.name as string,
      category: t.category as string,
      location: t.location as string,
      image: (Array.isArray(t.portfolio_images) ? t.portfolio_images[0] : null) as string | null,
    })),
  });
}

