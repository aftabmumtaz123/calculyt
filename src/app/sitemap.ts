import type { MetadataRoute } from "next";
import { calculators,categories } from "@/lib/calculators/definitions";
import { categorySlug } from "@/lib/calculators/catalog-utils";
export default function sitemap():MetadataRoute.Sitemap{
 const base=(process.env.NEXT_PUBLIC_SITE_URL??"https://calculyt.vercel.app").replace(/\/$/,"");
 const now=new Date();
 return [
  {url:base,lastModified:now,changeFrequency:"weekly",priority:1},
  ...categories.map(c=>({url:`${base}/categories/${categorySlug(c.name)}`,lastModified:now,changeFrequency:"weekly" as const,priority:.8})),
  ...calculators.map(c=>({url:`${base}/calculators/${c.slug}`,lastModified:now,changeFrequency:"monthly" as const,priority:.7}))
 ];
}
