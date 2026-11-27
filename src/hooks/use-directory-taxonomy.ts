import { useEffect, useState } from "react";
import { businessCategories } from "../data/categories";
import { directoryBackend } from "../lib/directoryClient";
export function useDirectoryTaxonomy(demo: boolean) {
 const [localities,setLocalities]=useState<{slug:string;label:string;district?:string}[]>(demo?[{slug:"fort-kochi",label:"Fort Kochi"},{slug:"kaloor",label:"Kaloor"},{slug:"edappally",label:"Edappally"}]:[]);
 const [categories,setCategories]=useState(demo?businessCategories.map(c=>({slug:c.slug,label:c.name})):[]);
 useEffect(()=>{if(demo)return;let active=true;
  if(import.meta.env.VITE_DIRECTORY_API_MODE === "hostinger-mysql") {
   fetch("/api/v1/taxonomy",{headers:{Accept:"application/json"},cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("taxonomy unavailable");return r.json();}).then((t:{categories:{slug:string;label:string}[];localities:{slug:string;label:string;district?:string}[]})=>{if(active){setCategories(t.categories);setLocalities(t.localities);}}).catch(()=>{});
  } else { void directoryBackend().then(backend=>backend?.rpc("kdial_public_taxonomy")).then(result=>{if(active&&result&&!result.error&&result.data){const t=result.data as {categories:{slug:string;label:string}[];localities:{slug:string;label:string;district?:string}[]};setCategories(t.categories);setLocalities(t.localities);}}).catch(()=>{/* The main listing request shows connection errors. */}); }
  return()=>{active=false;};},[demo]);
 return {categories,localities};
}
