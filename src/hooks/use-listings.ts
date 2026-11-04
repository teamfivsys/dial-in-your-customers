import { useEffect, useState } from "react";
import { DEMO_ENABLED, type Listing } from "../lib/directory";
import { readPublishedListings } from "../lib/directoryClient";
export function useListings(demo: boolean) {
  const [records, setRecords] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    const result = demo && DEMO_ENABLED
      ? import("../data/demoBusinesses").then(m => m.demoBusinesses)
      : demo ? Promise.resolve([]) : readPublishedListings();
    result.then(value => {if (active) setRecords(value);})
      .catch(e => {if (active) {setRecords([]); setError(e instanceof Error ? e.message : "Listings could not be loaded.");}})
      .finally(() => {if(active) setLoading(false);});
    return () => {active = false;};
  }, [demo, retry]);
  return {records, loading, error, retry: () => setRetry(n => n + 1)};
}
