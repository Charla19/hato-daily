import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { formatPseudo } from "@/lib/pseudo";

export async function getVisitorPseudo(ipHash: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("visitor_profiles")
    .select("pseudo")
    .eq("ip_hash", ipHash)
    .maybeSingle();

  if (error) throw error;
  return data?.pseudo ?? null;
}

export async function saveVisitorPseudo(
  ipHash: string,
  rawPseudo: string,
): Promise<string> {
  const pseudo = formatPseudo(rawPseudo);

  if (!pseudo || pseudo === "@") {
    throw new Error("Pseudo is required.");
  }

  if (pseudo.length > 32) {
    throw new Error("Pseudo must be 32 characters or less.");
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("visitor_profiles").upsert(
    {
      ip_hash: ipHash,
      pseudo,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "ip_hash" },
  );

  if (error) throw error;
  return pseudo;
}
