import { categories } from "./definitions";
export function categorySlug(name: string) {
  return name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
}
export function getCategoryBySlug(slug: string) {
  return categories.find((category) => categorySlug(category.name) === slug);
}
