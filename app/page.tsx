import Link from 'next/link'
import { AnimatedLogo } from './components/ui/AnimatedLogo'
import { AnimatedButton } from './components/ui/AnimatedButton'
import { AnimatedBackground } from './components/ui/AnimatedBackground'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="container-responsive relative z-10 flex flex-col items-center justify-center min-h-screen py-12 text-center">
        <div className="animate-slide-down">
          <AnimatedLogo size={120} />
        </div>
        
        <h1 className="mt-8 text-5xl md:text-6xl font-bold tracking-tight gradient-text animate-slide-up">
          NoamX Arena
        </h1>
        
        <p className="mt-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
          The advanced AI model testing platform where you can test, compare, and analyze various AI language models in real-time.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Link href="/models">
            <AnimatedButton variant="primary" size="lg">
              Test AI Models
            </AnimatedButton>
          </Link>
          
          <Link href="/compare">
            <AnimatedButton variant="secondary" size="lg">
              Compare Models
            </AnimatedButton>
          </Link>
          
          <Link href="/auth/signin">
            <AnimatedButton variant="outline" size="lg">
              Sign In
            </AnimatedButton>
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <FeatureCard 
            title="Multiple AI Models" 
            description="Test and compare responses from various AI models including GPT, Claude, Gemini, Llama, and more."
            delay={0.1}
          />
          
          <FeatureCard 
            title="Advanced Comparisons" 
            description="Visualize model performance with animated graphs and side-by-side response comparisons."
            delay={0.2}
          />
          
          <FeatureCard 
            title="Custom Prompts" 
            description="Create, save, and share prompt templates with variable substitution for consistent testing."
            delay={0.3}
          />
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <div 
      className="card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  )
}
