"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8">
          <Leaf className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">Enterprise IoT Solution</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
          <span className="text-balance block">Smart Eco-Campus</span>
          <span className="text-balance block text-emerald-500">Efficiency System</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          Transform your campus into an intelligent, sustainable ecosystem. 
          Harness the power of IoT sensors, AI Vision, and Big Data analytics 
          to optimize energy consumption and reduce environmental impact.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-foreground px-8 py-6 text-lg rounded-lg transition-all duration-300"
          >
            View Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-zinc-800">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-500">40%</p>
            <p className="text-sm text-muted-foreground mt-1">Energy Savings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-500">10K+</p>
            <p className="text-sm text-muted-foreground mt-1">IoT Sensors</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-emerald-500">24/7</p>
            <p className="text-sm text-muted-foreground mt-1">Real-time Monitoring</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
