import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StaggerTestimonials } from '@/components/ui/stagger-testimonials';

export const metadata: Metadata = {
  title: 'Testimonials - AI Hackathon Festival 2025',
  description: 'Hear from mentors, judges, and organizers about the AI Hackathon Festival 2025 experience.',
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="flex h-10 w-10 items-center justify-center border-2 border-border bg-background transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
              aria-label="Back to AI Assistant"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Testimonials
              </h1>
              <p className="text-sm text-muted-foreground">
                Hear from our mentors, judges, and organizers
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Testimonials Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What People Are Saying
            </h2>
            <p className="text-muted-foreground">
              Discover what mentors, judges, and organizers have to say about the
              AI Hackathon Festival 2025 and the incredible innovations happening here.
            </p>
          </div>
        </div>

        <StaggerTestimonials />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            AI Hackathon Festival 2025 - Organized by AUT, AI Forum NZ, and She Sharp
          </p>
        </div>
      </footer>
    </main>
  );
}
