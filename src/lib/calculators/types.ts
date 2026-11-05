export type FieldType = "number" | "select" | "date";
export type CalculatorField = { name:string; label:string; type:FieldType; defaultValue:string; min?:number; max?:number; step?:number; unit?:string; options?:{label:string;value:string}[]; help?:string };
export type ChartPoint = { label:string; value:number; principal?:number; interest?:number };
export type CalculationResult = { headline:string; value:string; description:string; metrics:{label:string;value:string}[]; chart?:ChartPoint[]; chartTitle?:string; chartKind?: "line" | "bar" | "pie" | "area"; breakdown?:{label:string;value:number}[]; note?:string };
export type CalculatorDefinition = { slug:string; name:string; category:string; description:string; icon:string; featured?:boolean; fields:CalculatorField[]; calculate:(values:Record<string,string>)=>CalculationResult };
