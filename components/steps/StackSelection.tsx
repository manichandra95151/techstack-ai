import { motion } from "framer-motion";
import { Globe, Server, Database, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StackKey, StackMap } from "@/types";

interface StackSelectionProps {
  stacks: StackMap | null;
  selectedKey: StackKey | null;
  loading: boolean;
  onSelectStack: (key: StackKey) => void;
  onBack: () => void;
}

export function StackSelection({ stacks, selectedKey, loading, onSelectStack, onBack }: StackSelectionProps) {
  return (
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold capitalize">{key} Stack</h3>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button className="flex items-center justify-center">
                              <HelpCircle className="h-5 w-5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="bottom" 
                            align="start"
                            className="max-w-[350px] md:max-w-[400px] bg-zinc-900 border-white/10 text-zinc-300 p-4 z-50"
                          >
                            <p className="font-semibold mb-3 text-white">Why this stack?</p>
                            <ul className="space-y-2 text-xs">
                              {s.why.map((point, index) => (
                                <li key={index} className="leading-relaxed">
                                  • {point}
                                </li>
                              ))}
                            </ul>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-sm text-zinc-500 ml-2">Best for {key === 'mvp' ? 'Speed to Market' : key === 'enterprise' ? 'Scale & Security' : key === 'beginner' ? 'Learning' : 'Low Cost'}</p>
                    </div>
                    {selectedKey === key && <Badge className="bg-white text-black">Selected</Badge>}
                  </div>

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
                    onClick={() => onSelectStack(key)}
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
        <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors text-sm">
          ← Back to Requirements
        </button>
      </div>
    </motion.section>
  );
}
