import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail } from "lucide-react"

const team = [
  {
    name: "Ahmad Rifqi",
    role: "Lead IoT Engineer",
    bio: "Specializes in embedded systems and sensor networks with 8+ years of experience in industrial IoT deployments.",
    avatar: "AR",
  },
  {
    name: "Aryan Saputra",
    role: "AI/ML Engineer",
    bio: "Expert in computer vision and deep learning, focused on developing intelligent analytics solutions.",
    avatar: "AS",
  },
  {
    name: "Hanifah Kurniasari",
    role: "Big Data Architect",
    bio: "Designs scalable data pipelines and real-time processing systems for enterprise applications.",
    avatar: "HK",
  },
  {
    name: "Key Firdausi",
    role: "Full Stack Developer",
    bio: "Builds intuitive dashboards and APIs that connect IoT infrastructure with user experiences.",
    avatar: "KF",
  },
]

export function TeamSection() {
  return (
    <section className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(16,185,129,0.02)_50%,transparent_100%)]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-emerald-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Experts
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            About the Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A dedicated team of engineers and developers building the future 
            of sustainable campus infrastructure.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card 
              key={index}
              className="bg-card border-zinc-800 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-zinc-800 border-2 border-zinc-700 group-hover:border-emerald-500/50 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-500">
                    {member.avatar}
                  </span>
                </div>
                
                {/* Info */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-emerald-500 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {member.bio}
                </p>
                
                {/* Social links */}
                <div className="flex justify-center gap-3">
                  <a 
                    href="#" 
                    className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 border border-zinc-700 hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="w-4 h-4 text-zinc-400 hover:text-emerald-500" />
                  </a>
                  <a 
                    href="#" 
                    className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 border border-zinc-700 hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="w-4 h-4 text-zinc-400 hover:text-emerald-500" />
                  </a>
                  <a 
                    href="#" 
                    className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 border border-zinc-700 hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-4 h-4 text-zinc-400 hover:text-emerald-500" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
