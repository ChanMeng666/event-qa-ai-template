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
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-primary text-primary-foreground border-primary"
          : "z-0 bg-card text-card-foreground border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className="flex items-start gap-4 mb-4">
        <img
          src={testimonial.avatarUrl}
          alt={testimonial.author}
          className="h-14 w-12 bg-muted object-cover object-top"
          style={{
            boxShadow: "3px 3px 0px hsl(var(--background))"
          }}
        />
        <div>
          <span className={cn(
            "inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1",
            isCenter ? "bg-primary-foreground/20 text-primary-foreground" : getRoleBadgeColor(testimonial.role)
          )}>
            {getRoleDisplayName(testimonial.role)}
          </span>
        </div>
      </div>
      <h3 className={cn(
        "text-base sm:text-lg font-medium leading-relaxed",
        isCenter ? "text-primary-foreground" : "text-foreground"
      )}>
        "{testimonial.quote}"
      </h3>
      <div className={cn(
        "absolute bottom-8 left-8 right-8 mt-2",
        isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
      )}>
        <p className="text-sm font-medium">
          {testimonial.author}
        </p>
        <p className="text-xs italic">
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
      className={cn("relative w-full overflow-hidden bg-muted/30", className)}
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
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border shadow-stagger-sm hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-background border-2 border-border shadow-stagger-sm hover:bg-primary hover:text-primary-foreground hover:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
