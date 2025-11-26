import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-lg mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} TechStackAI. All rights reserved.
          </div>
          
          {/* <div className="flex gap-6 text-zinc-500 text-sm">
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
