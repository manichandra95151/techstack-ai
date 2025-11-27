export function HowItWorks() {
  return (
    <section id="how-it-works" className=" relative border-t border-white/5 bg-black/20">
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
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 opacity-50" />

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

      {/* Video Section */}
      <div className="mt-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
            Watch TechStackAI Build for You
          </h3>
          <p className="text-zinc-400 text-lg">
            See how your project idea evolves into full tech stacks, diagrams, and a ready-to-build plan.
          </p>
        </div>

        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-white/10 to-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-20" />

          <div className="relative bg-black/80 backdrop-blur-sm rounded-xl overflow-hidden aspect-video border border-white/10 group">
            <video
              src="/demo.mp4"
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </div>

    </section>
  );
}

