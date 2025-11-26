"use client";

import React, { useState } from "react";
import { generatePDF } from "./utils/pdfGenerator";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { StackSelection } from "@/components/steps/StackSelection";
import { BuildSpecification } from "@/components/steps/BuildSpecification";
import { StackKey, StackMap, Step3Data } from "@/types";
import type { Variant } from "@/types/ai";

export default function HomePage() {
  
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [idea, setIdea] = useState("");
  const [tech, setTech] = useState("");
  const [complexity, setComplexity] = useState("Intermediate");
  const [scale, setScale] = useState("Medium");

  const [stacks, setStacks] = useState<StackMap | null>(null);
  const [selectedKey, setSelectedKey] = useState<StackKey | null>(null);
  const [detail, setDetail] = useState<Step3Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleGenerateStacks = async () => {
    if (!idea) return alert("Please describe your project idea.");
    setLoading(true);
    try {
      const res = await fetch("/api/stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectIdea: idea,
          knownTechnologies: tech ? tech.split(",").map(s => s.trim()) : [],
          scalability: scale,
          complexity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error generating stacks: " + JSON.stringify(data));
        return;
      }

      setStacks(normalizeStacks(data));
      setStep(2);

    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseStack = async (key: StackKey) => {
    if (!stacks) return;
    setSelectedKey(key);
    setLoading(true);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectIdea: idea,
          stackType: key,
          technologies: {
            frontend: stacks[key].frontend,
            backend: stacks[key].backend,
            database: stacks[key].database,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Error generating details: " + JSON.stringify(data));
        return;
      }

      setDetail(data);
      setStep(3);

    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!detail || !selectedKey) return;
    setIsExporting(true);
    try {
      await generatePDF(idea, selectedKey, detail);
    } catch (e) {
      console.error("Export failed", e);
      alert("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  function normalizeStacks(raw: any): StackMap {
    const out: Partial<StackMap> = {};
    const keys: StackKey[] = ["beginner", "mvp", "enterprise", "budget"];

    for (const key of keys) {
      const v = raw?.[key] ?? {};
      out[key] = {
        frontend: v.frontend ?? v.technologies?.frontend ?? [],
        backend: v.backend ?? v.technologies?.backend ?? [],
        database: v.database ?? v.technologies?.database ?? [],
        why: v.why ?? "",
        pros: v.pros ?? [],
        cons: v.cons ?? [],
      };
    }
    return out as StackMap;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative z-10">

      <Navbar onNewProject={() => { setStep(1); setStacks(null); setDetail(null); }} />

      <main className="relative min-h-screen overflow-hidden">
        
        <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black z-50 pointer-events-none" />
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] z-40 pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] z-40 pointer-events-none" />

        {step === 1 && (
          <>
            <Hero 
              idea={idea} 
              setIdea={setIdea} 
              tech={tech} 
              setTech={setTech} 
              complexity={complexity} 
              setComplexity={setComplexity} 
              scale={scale} 
              setScale={setScale} 
              loading={loading} 
              onGenerate={handleGenerateStacks} 
            />
          </>
        )}

        {step === 2 && (
          <StackSelection 
            stacks={stacks} 
            selectedKey={selectedKey} 
            loading={loading} 
            onSelectStack={handleChooseStack} 
            onBack={() => setStep(1)} 
          />
        )}

        {step === 3 && detail && selectedKey && (
          <BuildSpecification 
            detail={detail} 
            selectedKey={selectedKey} 
            isExporting={isExporting} 
            onExport={handleExport} 
            onChangeStack={() => setStep(2)} 
          />
        )}

        <Footer />

      </main>
    </div>
  );
}
