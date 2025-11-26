"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative z-10">
      <Navbar onNewProject={() => window.location.href = "/"} />
      
      <main className="relative min-h-screen overflow-hidden pt-20">
        <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black z-50 pointer-events-none" />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
