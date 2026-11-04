import type { Listing } from "../lib/directory";
// Fictional fixtures: never returned from public routes, API, sitemap or production seed.
const base = { citySlug: "kochi", status: "approved" as const, verified: false, updatedAt: "2026-10-19", phone: "", demo: true };
export const demoBusinesses: Listing[] = [
  {...base, slug:"demo-harbour-cafe", name:"Demo Harbour Café", categorySlug:"cafes", locality:"Fort Kochi", address:"Fictional café address · Fort Kochi", description:"A fictional neighbourhood café for testing KDial. No real business, offers or contact details.", services:["Coffee", "Breakfast", "Takeaway"], hours:[{days:"Monday–Saturday",opens:"09:00",closes:"18:00"}], photos:["/demo-cafe.svg"]},
  {...base, slug:"demo-city-electrical", name:"Demo City Electrical", categorySlug:"electrician", locality:"Kaloor", address:"Fictional service address · Kaloor", description:"A fictional electrical-service profile. Use it to test category, locality and service search.", services:["Wiring", "Lighting", "Electrical repairs"], hours:[{days:"Monday–Friday",opens:"09:00",closes:"17:00"}], photos:["/demo-electrical.svg"]},
  {...base, slug:"demo-garden-table", name:"Demo Garden Table", categorySlug:"restaurants", locality:"Edappally", address:"Fictional restaurant address · Edappally", description:"A fictional restaurant created only for this development preview. No orders or reservations are accepted.", services:["Lunch", "Dinner", "Takeaway"], photos:["/demo-table.svg"]},
];
