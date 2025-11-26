"use client";

import { useState } from "react";
import { Layers, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onNewProject: () => void;
}

export function Navbar({ onNewProject }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 z-50 relative">
        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
          <Layers className="h-5 w-5 text-black" />
        </div>
        <span className="text-xl font-bold tracking-tight">TechStack<span className="text-zinc-400">AI</span></span>
      </Link>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
        <Link href="/features" className="hover:text-white transition-colors">Features</Link>
        <Link href="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
      </nav>

      <div className="hidden md:block">
        <Button
          onClick={onNewProject}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all shadow-[0_0_15px_-3px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_-3px_rgba(255,255,255,0.2)]"
        >
          New Project
        </Button>
      </div>

      <button 
        className="md:hidden z-50 relative text-white p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-8 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-2 z-50 md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-1">
                <Link 
                  href="/features" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  Features
                </Link>
                <Link 
                  href="/how-it-works" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  How it Works
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsOpen(false)} 
                  className="px-4 py-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  Contact
                </Link>
              </nav>

              <div className="h-px bg-white/10 my-1" />

              <Button
                onClick={() => {
                  onNewProject();
                  setIsOpen(false);
                }}
                className="w-full bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl h-10"
              >
                New Project
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
