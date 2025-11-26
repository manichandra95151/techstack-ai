import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    List, Cpu, CheckCircle2, Network, Terminal, BookOpen, Youtube, FileText, Loader2
} from "lucide-react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Step3Data, StackKey, Diagrams } from "@/types";

interface BuildSpecificationProps {
    detail: Step3Data;
    selectedKey: StackKey;
    isExporting: boolean;
    onExport: () => void;
    onChangeStack: () => void;
}

const DiagramSkeleton = () => (
    <div className="w-full h-[400px] flex items-center justify-center">
        <svg className="w-full h-full max-w-md animate-pulse" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="150" y="20" width="100" height="60" rx="8" fill="#71717a" opacity="0.3" />
            <rect x="50" y="150" width="100" height="60" rx="8" fill="#71717a" opacity="0.3" />
            <rect x="250" y="150" width="100" height="60" rx="8" fill="#71717a" opacity="0.3" />
            <rect x="150" y="250" width="100" height="40" rx="20" fill="#71717a" opacity="0.3" />
            <path d="M200 80 V130 M200 130 H100 V150 M200 130 H300 V150 M100 210 V230 H200 V250 M300 210 V230 H200" stroke="#71717a" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        </svg>
    </div>
);

export function BuildSpecification({ detail, selectedKey, isExporting, onExport, onChangeStack }: BuildSpecificationProps) {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("highLevel");
    const [isDiagramLoading, setIsDiagramLoading] = useState(false);

    useEffect(() => {
        if (detail?.diagrams && mermaidRef.current) {
            setIsDiagramLoading(true);
            mermaid.initialize({ startOnLoad: false, theme: 'dark' });

            let code = detail.diagrams[activeTab as keyof Diagrams];

            if (code) {
                code = code.replace(/-->\|(.*?)\|>/g, "-->|$1|");
                if (!code.includes('\n')) {
                    code = code.replace(/^(graph \w+|sequenceDiagram|classDiagram|stateDiagram-v2|erDiagram)/, '$1\n');
                }
                code = code.replace(/\](\w)/g, ']\n$1');

                mermaidRef.current.innerHTML = "";
                mermaidRef.current.removeAttribute("data-processed");

                setTimeout(() => {
                    try {
                        mermaid.render(`mermaid-${Date.now()}`, code).then(({ svg }) => {
                            if (mermaidRef.current) {
                                mermaidRef.current.innerHTML = svg;
                                setIsDiagramLoading(false);
                            }
                        });
                    } catch (e) {
                        console.error("Mermaid render error", e);
                        if (mermaidRef.current) {
                            mermaidRef.current.innerHTML = "<p class='text-red-400 text-sm p-4'>Error rendering diagram. Please try regenerating.</p>";
                            setIsDiagramLoading(false);
                        }
                    }
                }, 500);
            } else {
                setIsDiagramLoading(false);
            }
        }
    }, [detail, activeTab]);

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto mt-10 px-6 pb-20"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Build Specification</h2>
                    <p className="text-zinc-400 mt-1">
                        Comprehensive breakdown for your <span className="capitalize text-white font-medium">{selectedKey}</span> project.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onChangeStack} className="border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all">
                        Change Stack
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onExport}
                        disabled={isExporting}
                        className="
    font-medium
    tracking-wide
    flex items-center justify-center gap-2

    border border-white/10
    bg-white/5
    text-zinc-300

    hover:bg-white/10 
    hover:text-white
    transition-all duration-300

    backdrop-blur-md
    shadow-[0_0_20px_-6px_rgba(255,255,255,0.15)]
    active:scale-[0.97]
  "
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            "Export Spec"
                        )}
                    </Button>

                </div>
            </div>

            <Tabs defaultValue="features" className="w-full">
                <TabsList className="flex w-full justify-start overflow-x-auto md:grid md:grid-cols-5 bg-zinc-900/50 border border-white/10 mb-8 p-1 scrollbar-hide overflow-y-hidden">
                    <TabsTrigger value="features" className="flex-none px-4 md:flex-1 min-w-[120px] data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Features</TabsTrigger>
                    <TabsTrigger value="build" className="flex-none px-4 md:flex-1 min-w-[120px] data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Build Plan</TabsTrigger>
                    <TabsTrigger value="architecture" className="flex-none px-4 md:flex-1 min-w-[120px] data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Architecture</TabsTrigger>
                    <TabsTrigger value="api" className="flex-none px-4 md:flex-1 min-w-[120px] data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">API Spec</TabsTrigger>
                    <TabsTrigger value="resources" className="flex-none px-4 md:flex-1 min-w-[120px] data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Resources</TabsTrigger>
                </TabsList>

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
                                <TabsList className="flex w-full justify-start overflow-x-auto md:grid md:grid-cols-5 bg-black/40 mb-4 p-1 scrollbar-hide">
                                    <TabsTrigger value="highLevel" className="flex-none px-3 md:flex-1 min-w-[100px] text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">High Level</TabsTrigger>
                                    <TabsTrigger value="requestFlow" className="flex-none px-3 md:flex-1 min-w-[100px] text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Request Flow</TabsTrigger>
                                    <TabsTrigger value="deployment" className="flex-none px-3 md:flex-1 min-w-[100px] text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Deployment</TabsTrigger>
                                    <TabsTrigger value="apiGateway" className="flex-none px-3 md:flex-1 min-w-[100px] text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">API Gateway</TabsTrigger>
                                    <TabsTrigger value="databaseErd" className="flex-none px-3 md:flex-1 min-w-[100px] text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white text-zinc-500 hover:text-zinc-300 transition-colors">Data Model</TabsTrigger>
                                </TabsList>

                                <div className="bg-black/40 rounded-lg p-4 border border-white/5 min-h-[500px] flex items-center justify-center overflow-auto">
                                    {isDiagramLoading && (
                                        <DiagramSkeleton />
                                    )}
                                    <div ref={mermaidRef} className={`w-full flex justify-center ${isDiagramLoading ? 'hidden' : 'block'}`} />
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>

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
    );
}
