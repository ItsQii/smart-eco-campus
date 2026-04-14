import { Leaf } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-card/50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Smart Eco-Campus</p>
              <p className="text-sm text-muted-foreground">Sustainable by design</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Smart Eco-Campus Efficiency System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
