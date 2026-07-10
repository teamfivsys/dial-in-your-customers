import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WhatsAppCTA from "./WhatsAppCTA";

const KEY = "kdial_exit_seen";

const ExitIntentModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // desktop only — skip touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        try { sessionStorage.setItem(KEY, "1"); } catch { /* noop */ }
        setOpen(true);
        document.removeEventListener("mouseleave", onLeave);
      }
    };
    document.addEventListener("mouseleave", onLeave);
    return () => document.removeEventListener("mouseleave", onLeave);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-[#0A1730]">
            Before you go — lock the ₹501 founder rate
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            The first 100 businesses in Kerala get a full year premium listing for ₹501. After
            that, the price resets to ₹2,999.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <WhatsAppCTA
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1730] text-[#F5F1E8] hover:bg-[#FF6B1A] transition-colors px-6 py-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B1A] focus-visible:ring-offset-2"
            ariaLabel="Register on WhatsApp"
          >
            Register on WhatsApp →
          </WhatsAppCTA>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;