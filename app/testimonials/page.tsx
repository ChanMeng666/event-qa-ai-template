import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';
import { HUDHeader } from '@/components/ui/hud-header';
import { NoiseOverlay } from '@/components/effects/noise-overlay';
import { siteConfig } from '@/config';

export const metadata: Metadata = {
  title: 'Testimonials - AI Hackathon Festival 2025',
  description: 'Hear from mentors, judges, and organizers about the AI Hackathon Festival 2025 experience.',
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Noise Overlay */}
      <NoiseOverlay opacity={0.04} />
      
      {/* Background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
        {/* Subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]" />
      </div>
      
      {/* Header - Sci-Fi Style */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-[20px]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="flex h-10 w-10 items-center justify-center border border-white/20 bg-transparent text-white/60 transition-all duration-300 hover:bg-white/10 hover:border-white/40 hover:text-white"
              aria-label="Back to AI Assistant"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="font-display text-lg font-bold tracking-[4px] uppercase text-white/80">
                Testimonials
              </h1>
              <p className="text-xs text-white/40 font-primary tracking-wider">
                Hear from our mentors, judges, and organizers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Testimonials Section */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 mb-12">
          <HUDHeader 
            title="What People Are Saying"
            backgroundText="STORIES"
            size="md"
          />
          <p className="text-white/40 text-center max-w-2xl mx-auto font-primary">
            Discover what mentors, judges, and organizers have to say about the
            {siteConfig.name} and the incredible innovations happening here.
          </p>
        </div>

        <StaggerTestimonials />
      </section>

      {/* Footer - Sci-Fi Style */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-[20px] py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-white/30 font-display tracking-[3px] uppercase">
            {siteConfig.name} - Organized by {siteConfig.organizers.map(o => o.shortName).join(', ')}
          </p>
        </div>
      </footer>
    </main>
  );
}
