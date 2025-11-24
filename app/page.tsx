"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generatePDF } from "./utils/pdfGenerator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Layers,
  Code,
  List,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Server,
  Database,
  Globe,
  Cpu,
  BookOpen,
  Youtube,
  FileText,
  Network,
  HelpCircle,
  Info,
  Loader2,
  Zap,
  Shield
} from "lucide-react";

import mermaid from "mermaid";
import type { Variant } from "@/types/ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Stack Keys
type StackKey = "beginner" | "mvp" | "enterprise" | "budget";
type StackMap = Record<StackKey, Variant>;

// Constants for Dropdowns
const COMPLEXITY_OPTIONS = [
  {
    value: "Beginner",
    label: "Beginner",
    description: "Simple CRUD apps, Basic features, No advanced backend logic, Few screens/pages"
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    description: "Multi-feature applications, Authentication, APIs and databases, Some performance considerations, Real-time OR moderate integrations"
  },
  {
    value: "Advanced",
    label: "Advanced",
    description: "Complex logic, Multiple integrations, Heavy real-time features, AI or ML components, Microservices"
  },
  {
    value: "Enterprise",
    label: "Enterprise-Grade",
    description: "Multiple teams, Huge features, Compliance, analytics, governance, Multi-region, distributed systems"
  }
];

const SCALE_OPTIONS = [
  {
    value: "Low",
    label: "Low",
    description: "Small user base (0–5k), No real-time needs, Simple DB. Examples: Personal projects, MVP v1."
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Moderate traffic (5k–50k users), Needs optimization, Real-time or caching might be required. Examples: Growing SaaS tools, learning apps."
  },
  {
    value: "High",
    label: "High",
    description: "High traffic (50k–500k users), Needs: load balancing, caching, workers, queues, Data spikes. Examples: Social apps, delivery apps."
  },
  {
    value: "Very High",
    label: "Very High / Enterprise",
    description: "Massive (>500k users), Multi-region deployments, Auto-scaling infra, Analytics, observability. Examples: fintech, streaming, enterprise SaaS."
  }
];

// New Types for Step 3
interface Feature {
  name: string;
  description: string;
  complexity: "Low" | "Medium" | "High";
}

interface BuildStep {
  step: number;
  title: string;
  description: string;
  tasks: string[];
}

interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  requestBody?: any;
  responseBody?: any;
}

interface Resource {
  title: string;
  url: string;
}

interface Diagrams {
  highLevel: string;
  requestFlow: string;
  deployment: string;
  apiGateway: string;
  databaseErd: string;
}

interface Step3Data {
  featureList: Feature[];
  buildBreakdown: BuildStep[];
  apiEndpoints: ApiEndpoint[];
  resources: {
    youtube: Resource[];
    docs: Resource[];
  };
  diagrams: Diagrams;
}

// Fix JSX namespace error
// declare namespace JSX {
//   interface Element {}
// }

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

  // Mermaid Ref
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("highLevel");
  const [isExporting, setIsExporting] = useState(false);

  // Footer Form State
  const [contributeForm, setContributeForm] = useState({ name: "", email: "", message: "" });

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for reaching out, ${contributeForm.name}! We'll get back to you shortly.`);
    setContributeForm({ name: "", email: "", message: "" });
  };

  // -------------------- Fetch Stacks --------------------
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

  // -------------------- Choose stack & load details --------------------
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

  // -------------------- Normalize stacks for UI --------------------
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

  // -------------------- Render Mermaid --------------------
  useEffect(() => {
    if (step === 3 && detail?.diagrams && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      
      let code = detail.diagrams[activeTab as keyof Diagrams];
      
      if (code) {
        // Sanitize code: remove potential invalid chars from arrow labels
        code = code.replace(/-->\|(.*?)\|>/g, "-->|$1|"); // Fix -->|Text|> to -->|Text|
        
        mermaidRef.current.innerHTML = ""; // Clear previous
        mermaidRef.current.removeAttribute("data-processed"); // Reset mermaid processing
        
        try {
          mermaid.render(`mermaid-${Date.now()}`, code).then(({ svg }) => {
            if (mermaidRef.current) mermaidRef.current.innerHTML = svg;
          });
        } catch (e) {
          console.error("Mermaid render error", e);
          if (mermaidRef.current) mermaidRef.current.innerHTML = "<p class='text-red-400 text-sm p-4'>Error rendering diagram. Please try regenerating.</p>";
        }
      }
    }
  }, [step, detail, activeTab]);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative z-10">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
            <Layers className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">TechStack<span className="text-zinc-400">AI</span></span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">Features</button>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">How it Works</button>
        </nav>

        <Button
          onClick={() => { setStep(1); setStacks(null); setDetail(null); }}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.2)]"
        >
          New Project
        </Button>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative min-h-screen overflow-hidden">
        
        {/* Global SaaS Background Gradient */}
        <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black z-50 pointer-events-none" />
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] z-40 pointer-events-none" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] z-40 pointer-events-none" />

        {/* STEP 1 — HERO + FORM */}
        {step === 1 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center mt-20 px-6 pb-20 relative"
          >

            <div className="flex flex-col items-center gap-3 mb-8">
              <Badge variant="secondary" className="px-4 py-1.5 text-sm bg-zinc-900/80 text-zinc-300 border-zinc-800 backdrop-blur-md">
                AI-Powered Architecture Design
              </Badge>
              <Badge className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 text-black border-0 shadow-[0_0_15px_-3px_rgba(251,191,36,0.4)] animate-pulse">
                Version 1.0 is Live 🚀
              </Badge>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
              Architect your next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-300 to-zinc-600">
                big idea instantly.
              </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
              Stop wasting time on boilerplate. Get a complete tech stack, feature breakdown, and API specification in seconds.
            </p>

            <div className="max-w-2xl mx-auto bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-2xl relative overflow-hidden">
              {/* Subtle inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              
              <div className="space-y-6 text-left relative z-10">
                <div>
                  <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 block">Project Description</label>
                  <Textarea 
                    placeholder="e.g. A SaaS platform for managing freelance contracts with automated invoicing..."
                    value={idea} 
                    onChange={e => setIdea(e.target.value)}
                    className="bg-black/50 border-white/10 focus:border-white/30 min-h-[100px] text-lg resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 block">Preferred Tech (Optional)</label>
                  <Input 
                    placeholder="e.g. Next.js, Supabase, Stripe"
                    value={tech} 
                    onChange={e => setTech(e.target.value)}
                    className="bg-black/50 border-white/10 focus:border-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Complexity Dropdown */}
                  <div>
                    <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 flex items-center gap-2">
                      Complexity
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] bg-zinc-900 border-white/10 text-zinc-300 p-4">
                            <p className="font-semibold mb-2 text-white">Complexity Levels:</p>
                            <ul className="space-y-2 text-xs">
                              {COMPLEXITY_OPTIONS.map((opt) => (
                                <li key={opt.value}>
                                  <span className="text-white font-medium">{opt.label}:</span> {opt.description}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select value={complexity} onValueChange={setComplexity}>
                      <SelectTrigger className="bg-black/50 border-white/10 focus:ring-0 focus:border-white/30">
                        <SelectValue placeholder="Select complexity" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {COMPLEXITY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scale Dropdown */}
                  <div>
                    <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 flex items-center gap-2">
                      Scale
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-zinc-500 hover:text-zinc-300 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] bg-zinc-900 border-white/10 text-zinc-300 p-4">
                            <p className="font-semibold mb-2 text-white">Scale Levels:</p>
                            <ul className="space-y-2 text-xs">
                              {SCALE_OPTIONS.map((opt) => (
                                <li key={opt.value}>
                                  <span className="text-white font-medium">{opt.label}:</span> {opt.description}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Select value={scale} onValueChange={setScale}>
                      <SelectTrigger className="bg-black/50 border-white/10 focus:ring-0 focus:border-white/30">
                        <SelectValue placeholder="Select scale" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {SCALE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateStacks}
                  disabled={loading}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-12 text-lg font-semibold mt-2"
                >
                  {loading ? "Analyzing Requirements..." : "Generate Architecture"}
                </Button>
              </div>
            </div>
          </motion.section>
        )}

        {/* FEATURES SECTION */}
        {step === 1 && (
          <section id="features" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                  Everything you need to <br /> start building.
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                  From idea to full technical specification in seconds. Stop guessing and start coding with a solid foundation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Cpu className="h-6 w-6 text-purple-400" />,
                    title: "AI Architecture Analysis",
                    desc: "Our advanced AI analyzes your requirements to suggest the perfect tech stack, scalability options, and complexity estimates."
                  },
                  {
                    icon: <Layers className="h-6 w-6 text-blue-400" />,
                    title: "Multi-Stack Options",
                    desc: "Get 4 distinct architectural approaches: MVP for speed, Enterprise for scale, Beginner for learning, and Budget for cost-efficiency."
                  },
                  {
                    icon: <FileText className="h-6 w-6 text-green-400" />,
                    title: "Comprehensive Specs",
                    desc: "Detailed feature breakdowns, step-by-step build plans, API endpoint specifications, and curated learning resources."
                  },
                  {
                    icon: <Network className="h-6 w-6 text-orange-400" />,
                    title: "Visual Diagrams",
                    desc: "Automatically generated Mermaid diagrams for High-Level Architecture, Request Flow, Deployment, and Database Schema."
                  },
                  {
                    icon: <Zap className="h-6 w-6 text-yellow-400" />,
                    title: "Instant Export",
                    desc: "Download your entire specification as a professional PDF document to share with your team or stakeholders."
                  },
                  {
                    icon: <Shield className="h-6 w-6 text-red-400" />,
                    title: "Best Practices",
                    desc: "All recommendations follow modern industry standards for security, performance, and maintainability."
                  }
                ].map((feature, i) => (
                  <div key={i} className="group p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-white/5 transition-all hover:border-white/10 backdrop-blur-sm">
                    <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS SECTION */}
        {step === 1 && (
          <section id="how-it-works" className="py-32 relative border-t border-white/5 bg-black/20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                  From Idea to Spec in 3 Steps
                </h2>
                <p className="text-zinc-400 text-lg">
                  Streamlined process to get you coding faster.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0" />

                {[
                  {
                    step: "01",
                    title: "Describe Your Idea",
                    desc: "Input your project concept, preferred technologies, and desired scale."
                  },
                  {
                    step: "02",
                    title: "Choose Your Stack",
                    desc: "Review AI-curated stack options tailored to your specific needs."
                  },
                  {
                    step: "03",
                    title: "Get Your Roadmap",
                    desc: "Receive a complete build plan, architecture diagrams, and API specs."
                  }
                ].map((item, i) => (
                  <div key={i} className="relative text-center">
                    <div className="w-24 h-24 mx-auto bg-black border border-white/10 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-8 relative z-10 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-zinc-400 max-w-xs mx-auto">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP 2 — STACK OPTIONS */}
        {step === 2 && (
          <motion.section 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto mt-16 px-6 pb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Select Your Foundation</h2>
              <p className="text-zinc-400">We've analyzed your requirements and proposed 4 optimal stacks.</p>
            </div>

            {!stacks ? (
              <div className="text-center text-zinc-500">Loading stack options...</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {(Object.keys(stacks) as StackKey[]).map(key => {
                  const s = stacks[key];
                  return (
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      key={key}
                      className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-white/5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      
                      <div className="relative h-full bg-zinc-950 rounded-xl p-8 border border-white/5 overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-2xl font-bold capitalize mb-1">{key} Stack</h3>
                            <p className="text-sm text-zinc-500">Best for {key === 'mvp' ? 'Speed to Market' : key === 'enterprise' ? 'Scale & Security' : key === 'beginner' ? 'Learning' : 'Low Cost'}</p>
                          </div>
                          {selectedKey === key && <Badge className="bg-white text-black">Selected</Badge>}
                        </div>

                        <p className="text-zinc-300 mb-8 leading-relaxed h-16 line-clamp-3">{s.why}</p>

                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Frontend</div>
                              <div className="text-sm font-medium">{s.frontend.join(", ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-green-500/10 flex items-center justify-center text-green-400">
                              <Server className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Backend</div>
                              <div className="text-sm font-medium">{s.backend.join(", ")}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                              <Database className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Database</div>
                              <div className="text-sm font-medium">{s.database.join(", ")}</div>
                            </div>
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleChooseStack(key)}
                          disabled={loading}
                          className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                          {loading && selectedKey === key ? "Generating Plan..." : "Select & Continue"} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white transition-colors text-sm">
                ← Back to Requirements
              </button>
            </div>
          </motion.section>
        )}

        {/* STEP 3 — BUILD PLAN */}
        {step === 3 && detail && (
          <motion.section 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto mt-10 px-6 pb-20"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">Build Specification</h2>
                <p className="text-zinc-400 mt-1">
                  Comprehensive breakdown for your <span className="capitalize text-white font-medium">{selectedKey}</span> project.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all">
                  Change Stack
                </Button>
                <Button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)] border border-white/10"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    "Export Spec"
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50 border border-white/10 mb-8 p-1">
                <TabsTrigger value="features" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Features</TabsTrigger>
                <TabsTrigger value="build" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Build Plan</TabsTrigger>
                <TabsTrigger value="architecture" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Architecture</TabsTrigger>
                <TabsTrigger value="api" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">API Spec</TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Resources</TabsTrigger>
              </TabsList>

              {/* FEATURES TAB */}
              <TabsContent value="features" className="space-y-6">
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                      <List className="h-5 w-5 text-blue-400" />
                      Feature Scope
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {detail.featureList.map((feature, i) => (
                        <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg text-white">{feature.name}</h4>
                            <Badge variant={feature.complexity === 'High' ? 'destructive' : feature.complexity === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                              {feature.complexity}
                            </Badge>
                          </div>
                          <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* BUILD TAB */}
              <TabsContent value="build" className="space-y-6">
                 <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                      <Cpu className="h-5 w-5 text-purple-400" />
                      Build Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {detail.buildBreakdown.map((phase, i) => (
                        <div key={i} className="relative pl-8 border-l border-white/10 last:border-0">
                          <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-purple-500 ring-4 ring-black" />
                          
                          <h3 className="text-lg font-semibold mb-1 text-white">Step {phase.step}: {phase.title}</h3>
                          <p className="text-zinc-400 text-sm mb-4">{phase.description}</p>
                          
                          <div className="space-y-2">
                            {phase.tasks.map((task, tIdx) => (
                              <div key={tIdx} className="flex gap-3 items-start group">
                                <CheckCircle2 className="h-4 w-4 text-zinc-600 group-hover:text-green-400 transition-colors mt-0.5 shrink-0" />
                                <span className="text-zinc-300 text-sm">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ARCHITECTURE TAB */}
              <TabsContent value="architecture" className="space-y-6">
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                      <Network className="h-5 w-5 text-orange-400" />
                      System Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="highLevel" onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-5 w-full bg-black/40 mb-4 p-1">
                        <TabsTrigger value="highLevel" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">High Level</TabsTrigger>
                        <TabsTrigger value="requestFlow" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Request Flow</TabsTrigger>
                        <TabsTrigger value="deployment" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Deployment</TabsTrigger>
                        <TabsTrigger value="apiGateway" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">API Gateway</TabsTrigger>
                        <TabsTrigger value="databaseErd" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Data Model</TabsTrigger>
                      </TabsList>
                      
                      <div className="bg-black/40 rounded-lg p-4 border border-white/5 min-h-[500px] flex items-center justify-center overflow-auto">
                        <div ref={mermaidRef} className="w-full flex justify-center" />
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API TAB */}
              <TabsContent value="api" className="space-y-6">
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                      <Terminal className="h-5 w-5 text-green-400" />
                      API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px] px-6 pb-6">
                      <div className="space-y-4">
                        {detail.apiEndpoints.map((ep, i) => (
                          <div key={i} className="rounded-lg border border-white/5 bg-black/40 overflow-hidden">
                            <div className="flex items-center gap-3 p-3 border-b border-white/5 bg-white/5">
                              <Badge variant="outline" className={`
                                ${ep.method === 'GET' ? 'text-blue-400 border-blue-400/30' : 
                                  ep.method === 'POST' ? 'text-green-400 border-green-400/30' : 
                                  ep.method === 'DELETE' ? 'text-red-400 border-red-400/30' : 
                                  'text-yellow-400 border-yellow-400/30'} 
                                bg-transparent font-mono text-xs
                              `}>
                                {ep.method}
                              </Badge>
                              <code className="text-xs text-zinc-300 font-mono truncate">{ep.endpoint}</code>
                            </div>
                            
                            <div className="p-3 space-y-3">
                              <p className="text-xs text-zinc-400">{ep.description}</p>
                              
                              {ep.requestBody && Object.keys(ep.requestBody).length > 0 && (
                                <div>
                                  <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold mb-1">Request</div>
                                  <pre className="text-[10px] bg-black p-2 rounded border border-white/5 text-zinc-400 overflow-x-auto">
                                    {JSON.stringify(ep.requestBody, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {ep.responseBody && Object.keys(ep.responseBody).length > 0 && (
                                <div>
                                  <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold mb-1">Response</div>
                                  <pre className="text-[10px] bg-black p-2 rounded border border-white/5 text-zinc-400 overflow-x-auto">
                                    {JSON.stringify(ep.responseBody, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* RESOURCES TAB */}
              <TabsContent value="resources" className="space-y-6">
                 <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-white">
                      <BookOpen className="h-5 w-5 text-yellow-400" />
                      Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3">
                          <Youtube className="h-4 w-4 text-red-500" /> Video Tutorials
                        </h4>
                        <div className="space-y-2">
                          {detail.resources.youtube.map((res, i) => (
                            <a key={i} href={res.url} target="_blank" className="block p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-sm">
                              <div className="font-medium truncate text-blue-400 hover:underline">{res.title}</div>
                            </a>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-3">
                          <FileText className="h-4 w-4 text-blue-400" /> Documentation
                        </h4>
                        <div className="space-y-2">
                          {detail.resources.docs.map((res, i) => (
                            <a key={i} href={res.url} target="_blank" className="block p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-sm">
                              <div className="font-medium truncate text-blue-400 hover:underline">{res.title}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </motion.section>
        )}

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/40 backdrop-blur-lg mt-20">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Want to contribute?</h3>
                <p className="text-zinc-400 mb-6 max-w-md">
                  We're always looking for talented developers to help improve TechStackAI. 
                  Send us a message if you're interested in collaborating or have feature requests.
                </p>
                <div className="flex gap-4 text-zinc-500">
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">GitHub</a>
                  <a href="#" className="hover:text-white transition-colors">Discord</a>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <form onSubmit={handleContribute} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Name" 
                      value={contributeForm.name}
                      onChange={e => setContributeForm({...contributeForm, name: e.target.value})}
                      className="bg-black/50 border-white/10 focus:border-white/30"
                      required
                    />
                    <Input 
                      placeholder="Email" 
                      type="email"
                      value={contributeForm.email}
                      onChange={e => setContributeForm({...contributeForm, email: e.target.value})}
                      className="bg-black/50 border-white/10 focus:border-white/30"
                      required
                    />
                  </div>
                  <Textarea 
                    placeholder="Tell us how you'd like to contribute..." 
                    value={contributeForm.message}
                    onChange={e => setContributeForm({...contributeForm, message: e.target.value})}
                    className="bg-black/50 border-white/10 focus:border-white/30 min-h-[100px] resize-none"
                    required
                  />
                  <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
              © {new Date().getFullYear()} TechStackAI. All rights reserved.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
