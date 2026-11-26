const safeNumber=(n:number)=>Number.isFinite(n)?n:0;
export const money=(n:number,currency="USD")=>{
 const value=safeNumber(n);
 return new Intl.NumberFormat("en-US",{style:"currency",currency,maximumFractionDigits:2,...(Math.abs(value)>=1e15?{notation:"scientific" as const}:{})}).format(value);
};
export const number=(n:number,digits=2)=>{
 const value=safeNumber(n);
 return new Intl.NumberFormat("en-US",{maximumFractionDigits:digits,...(Math.abs(value)>=1e15?{notation:"scientific" as const}:{})}).format(value);
};
export const val=(v:Record<string,string>,k:string)=>Number(v[k]??0);
export const pct=(n:number)=>`${number(n,2)}%`;
