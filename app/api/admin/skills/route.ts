import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const { data: categories, error: catError } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order");

  if (catError) return NextResponse.json({ error: catError.message }, { status: 500 });

  const { data: skills, error: skillError } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order");

  if (skillError) return NextResponse.json({ error: skillError.message }, { status: 500 });

  return NextResponse.json({ categories, skills });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { type, ...payload } = body;

    if (type === "category") {
      const { data, error } = await supabase.from("skill_categories").insert(payload).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    } else {
      const { data, error } = await supabase.from("skills").insert(payload).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data, { status: 201 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
