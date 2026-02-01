"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  testimonials as defaultTestimonials,
  Testimonial,
  getRoleDisplayName,
  getRoleBadgeColor
} from '@/lib/testimonials-data';

const SQRT_5000 = Math.sqrt(5000);

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial & { tempId: number };
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-8 transition-all duration-500 ease-scifi-smooth backdrop-blur-[20px]",
        isCenter
          ? "z-10 bg-white/10 text-white border-white/30"
          : "z-0 bg-white/5 text-white/80 border-white/10 hover:border-white/20"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0 0 30px rgba(255, 255, 255, 0.1)" : "0px 0px 0px 0px transparent"
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <img
          src={testimonial.avatarUrl}
          alt={testimonial.author}
          className="h-14 w-12 object-cover object-top border border-white/20"
        />
        <div>
          <span className={cn(
            "inline-block px-3 py-1 text-[0.6rem] font-display font-medium tracking-[2px] uppercase mb-1",
            isCenter 
              ? "bg-white/20 text-white border border-white/30" 
              : "bg-white/10 text-white/60 border border-white/10"
          )}>
            {getRoleDisplayName(testimonial.role)}
          </span>
        </div>
      </div>
      <h3 className={cn(
        "text-base sm:text-lg font-primary leading-relaxed",
        isCenter ? "text-white" : "text-white/70"
      )}>
        "{testimonial.quote}"
      </h3>
      <div className={cn(
        "absolute bottom-8 left-8 right-8 mt-2",
        isCenter ? "text-white/80" : "text-white/40"
      )}>
        <p className="text-sm font-medium font-display tracking-wider">
          {testimonial.author}
        </p>
        <p className="text-xs font-primary opacity-70">
          {testimonial.organization}
        </p>
      </div>
    </div>
  );
};

export interface StaggerTestimonialsProps {
  testimonials?: Testimonial[];
  className?: string;
}

export const StaggerTestimonials: React.FC<StaggerTestimonialsProps> = ({
  testimonials = defaultTestimonials,
  className
}) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(
    testimonials.map((t, i) => ({ ...t, tempId: i }))
  );

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-all duration-300",
            "bg-white/5 backdrop-blur-[20px] border border-white/20 text-white/60",
            "hover:bg-white/15 hover:border-white/40 hover:text-white hover:shadow-glow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-all duration-300",
            "bg-white/5 backdrop-blur-[20px] border border-white/20 text-white/60",
            "hover:bg-white/15 hover:border-white/40 hover:text-white hover:shadow-glow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
