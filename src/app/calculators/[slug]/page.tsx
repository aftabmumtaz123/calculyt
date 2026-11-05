import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { calculators,getCalculator } from "@/lib/calculators/definitions";
import { CalculatorClient } from "@/components/CalculatorClient";
export function generateStaticParams(){return calculators.map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const c=getCalculator(slug);if(!c)return{};return{title:c.name,description:c.description,alternates:{canonical:`/calculators/${slug}`},openGraph:{title:c.name,description:c.description,type:"website"}};}
export default async function CalculatorPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!getCalculator(slug))notFound();return <CalculatorClient slug={slug}/>;}
