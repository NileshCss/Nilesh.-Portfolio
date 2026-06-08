import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Verify session via cookie-based client
    const serverSupabase = await createServerSupabaseClient();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Ensure the 'resumes' bucket exists
    const { data: buckets, error: listError } = await adminSupabase.storage.listBuckets();
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const resumesBucketExists = buckets.some(b => b.id === "resumes");
    if (!resumesBucketExists) {
      const { error: createBucketError } = await adminSupabase.storage.createBucket("resumes", {
        public: true,
        allowedMimeTypes: ["application/pdf"],
        fileSizeLimit: 5242880 // 5MB limit
      });
      if (createBucketError) {
        return NextResponse.json({ error: "Failed to create storage bucket: " + createBucketError.message }, { status: 500 });
      }
    }

    // 2. Upload file to 'resumes' bucket
    const fileName = `resume_${Date.now()}.pdf`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from("resumes")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
    }

    // 3. Get Public URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    // 4. Update personal_info
    const { data: personalData, error: fetchError } = await adminSupabase
      .from("personal_info")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !personalData) {
      return NextResponse.json({ error: "Failed to fetch personal_info row to update" }, { status: 500 });
    }

    const { error: updateError } = await adminSupabase
      .from("personal_info")
      .update({ resume_url: publicUrl })
      .eq("id", personalData.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update database: " + updateError.message }, { status: 500 });
    }

    // 5. Insert new version record into resume_versions
    try {
      const { count } = await adminSupabase
        .from("resume_versions")
        .select("*", { count: "exact", head: true });

      const versionCount = count ?? 0;
      const versionLabel = `v1.${versionCount + 1}`;
      const kb = Math.round(file.size / 1024);
      const sizeStr = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;

      await adminSupabase.from("resume_versions").insert({
        file_name: file.name,
        file_url: publicUrl,
        file_size: sizeStr,
        version_label: versionLabel,
      });
    } catch (dbErr) {
      console.warn("Failed to insert version history record:", dbErr);
    }

    return NextResponse.json({ success: true, url: publicUrl, fileName: file.name, size: file.size });
  } catch (error: any) {
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Verify session via cookie-based client
    const serverSupabase = await createServerSupabaseClient();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    // Fetch personal_info ID
    const { data: personalData, error: fetchError } = await adminSupabase
      .from("personal_info")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !personalData) {
      return NextResponse.json({ error: "Failed to fetch personal_info" }, { status: 500 });
    }

    // Set resume_url to empty string
    const { error: updateError } = await adminSupabase
      .from("personal_info")
      .update({ resume_url: "" })
      .eq("id", personalData.id);

    if (updateError) {
      return NextResponse.json({ error: "Failed to delete resume: " + updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
