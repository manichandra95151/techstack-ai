import { Cpu, Layers, FileText, Network, Zap, Shield } from "lucide-react";

export function Features() {
  return (
    <section id="features" className="relative">
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
  );
}
