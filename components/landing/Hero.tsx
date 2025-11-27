import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { COMPLEXITY_OPTIONS, SCALE_OPTIONS } from "@/app/constants";

interface HeroProps {
  idea: string;
  setIdea: (val: string) => void;
  tech: string;
  setTech: (val: string) => void;
  complexity: string;
  setComplexity: (val: string) => void;
  scale: string;
  setScale: (val: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

export function Hero({ 
  idea, setIdea, tech, setTech, complexity, setComplexity, scale, setScale, loading, onGenerate 
}: HeroProps) {
  return (
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
          Version 1.0 is Live
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        <div className="space-y-6 text-left relative z-10">
          <div>
            <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 block">Project Description</label>
            <Textarea 
              placeholder="e.g. A SaaS HR system where companies manage employees, payroll, attendance, onboarding, and performance."
              value={idea} 
              required={true}
              onChange={e => setIdea(e.target.value)}
              className="bg-black/50 border-white/10 focus:border-white/30 min-h-[100px] resize-none text-base md:text-lg placeholder:text-sm md:placeholder:text-base"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-400 ml-1 mb-2 block">Preferred Tech (Optional)</label>
            <Input 
              placeholder="e.g. Next.js, Supabase, Stripe"
              value={tech} 
              onChange={e => setTech(e.target.value)}
              className="bg-black/50 border-white/10 focus:border-white/30 text-base md:text-lg placeholder:text-sm md:placeholder:text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
  onClick={onGenerate}
  disabled={loading}
  className="
    w-full h-12 mt-2 text-lg font-medium tracking-wide rounded-xl
    bg-gradient-to-br from-white/95 to-white/80 text-black
    shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]
    hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.55)]
    hover:from-white hover:to-zinc-100
    active:scale-[0.98] active:shadow-none
    transition-all duration-300
  "
>
  {loading ? "Analyzing Requirements..." : "Generate Architecture"}
</Button>

        </div>
      </div>
    </motion.section>
  );
}
