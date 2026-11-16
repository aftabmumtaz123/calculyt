"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Directory=dynamic(()=>import("./CalculatorDirectoryContent"),{ssr:false,loading:()=><div className="rounded-2xl bg-white p-8 text-sm text-muted">Loading calculator directory…</div>});
export function LazyCalculatorDirectory(){const ref=useRef<HTMLDivElement>(null),[visible,setVisible]=useState(false);useEffect(()=>{const node=ref.current;if(!node)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:"400px"});observer.observe(node);return()=>observer.disconnect();},[]);return <div ref={ref}>{visible?<Directory/>:<div className="rounded-2xl border border-dashed border-[#ddd7e9] bg-white p-8 text-sm text-muted">Calculator directory loads when you reach this section.</div>}</div>}
