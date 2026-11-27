import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Json } from "../integrations/supabase/types";
type DirectoryDatabase = {public:{Tables:Record<string,never>;Views:Record<string,never>;Enums:Record<string,never>;CompositeTypes:Record<string,never>;Functions:Record<string,{Args:Record<string,Json|undefined>;Returns:Json}>}};
import type { Listing } from "./directory";
let client: SupabaseClient<DirectoryDatabase> | undefined;
export async function directoryBackend(): Promise<SupabaseClient<DirectoryDatabase> | null> {
  // Hostinger MySQL deployments must not accidentally initialize the legacy Supabase admin/submission/payment client.
  if (import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql") return null;
  if (import.meta.env.VITE_DIRECTORY_BACKEND_ENABLED !== "true") return null;
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  let publicKey=key?.startsWith("sb_publishable_")??false;
  if(key?.split(".").length===3){try{publicKey=JSON.parse(atob(key.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))).role==="anon";}catch{publicKey=false;}}
  if (!url || !key || !publicKey) throw new Error("Directory staging connection is not configured with a public key.");
  if (client) return client;
  const { createClient } = await import("@supabase/supabase-js");
  return client ??= createClient<DirectoryDatabase>(url, key);
}
const listingSchema = z.array(z.object({
    slug:z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),name:z.string(),categorySlug:z.string(),citySlug:z.literal("kochi"),
    locality:z.string(),district:z.string().optional(),address:z.string(),phone:z.string().nullish().transform(v=>v??undefined),
    whatsapp:z.string().regex(/^\+91[6-9][0-9]{9}$/).nullish().transform(v=>v??undefined),
    website:z.string().url().refine(v=>v.startsWith("https://")).nullish().transform(v=>v??undefined),
    description:z.string(),services:z.array(z.string()),hours:z.array(z.object({days:z.string(),opens:z.string(),closes:z.string()})),
    photos:z.array(z.string().url().refine(v=>v.startsWith("https://"))),verified:z.boolean(),verifiedAt:z.string().nullish().transform(v=>v??undefined),status:z.literal("approved"),updatedAt:z.string().optional()
  }));
export async function readPublishedListings(): Promise<Listing[]> {
  let data: unknown;
  if (import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql") {
    const response = await fetch("/api/v1/directory", {headers:{Accept:"application/json"},cache:"no-store"});
    if (!response.ok) throw new Error("Listings could not be loaded. Please try again.");
    data = await response.json();
  } else {
    const backend = await directoryBackend();
    if (!backend) return [];
    const result = await backend.rpc("kdial_public_listings");
    if (result.error) throw new Error("Listings could not be loaded. Please try again.");
    data = result.data;
  }
  return listingSchema.parse(data ?? []) as Listing[];
}
