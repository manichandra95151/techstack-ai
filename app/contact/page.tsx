"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [contributeForm, setContributeForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: contributeForm.name,
          email: contributeForm.email,
          message: contributeForm.message,
          subject: `New Contact Form Submission from ${contributeForm.name}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setContributeForm({ name: "", email: "", message: "" });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 relative z-10">
      <Navbar onNewProject={() => window.location.href = "/"} />
      
      <main className="relative min-h-screen overflow-hidden pt-20">
        <div className="fixed inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black z-50 pointer-events-none" />
        
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                Get in Touch
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Have a question, suggestion, or want to contribute? We'd love to hear from you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-zinc-400 mb-8">
                  We're always looking for talented developers to help improve TechStackAI. 
                  Send us a message if you're interested in collaborating or have feature requests.
                </p>
                
                {/* <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-zinc-400">hello@techstack.ai</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <h4 className="text-white font-semibold mb-1">Socials</h4>
                    <div className="flex gap-4 text-zinc-400">
                      <a href="#" className="hover:text-white transition-colors">Twitter</a>
                      <a href="#" className="hover:text-white transition-colors">GitHub</a>
                      <a href="#" className="hover:text-white transition-colors">Discord</a>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <form onSubmit={handleContribute} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Name</label>
                    <Input 
                      placeholder="Your name" 
                      value={contributeForm.name}
                      onChange={e => setContributeForm({...contributeForm, name: e.target.value})}
                      className="bg-black/50 border-white/10 focus:border-white/30 h-12"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Email</label>
                    <Input 
                      placeholder="you@example.com" 
                      type="email"
                      value={contributeForm.email}
                      onChange={e => setContributeForm({...contributeForm, email: e.target.value})}
                      className="bg-black/50 border-white/10 focus:border-white/30 h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Message</label>
                    <Textarea 
                      placeholder="How can we help?" 
                      value={contributeForm.message}
                      onChange={e => setContributeForm({...contributeForm, message: e.target.value})}
                      className="bg-black/50 border-white/10 focus:border-white/30 min-h-[150px] resize-none text-base"
                      required
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      Failed to send message. Please try again later.
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-semibold h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
