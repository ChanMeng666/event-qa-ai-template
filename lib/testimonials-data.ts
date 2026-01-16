/**
 * Testimonials Data Module
 *
 * This module re-exports testimonials from the centralized configuration.
 * It serves as a thin wrapper for backward compatibility with existing code.
 *
 * To customize testimonials, edit: config/content.config.ts
 */

import { contentConfig } from '@/config';
import type { Testimonial, TestimonialRole } from '@/config';

// Re-export testimonials from config
export const testimonials: Testimonial[] = contentConfig.testimonials;

// Re-export the Testimonial type for backward compatibility
export type { Testimonial } from '@/config';

/**
 * Get display name for a role
 */
export const getRoleDisplayName = (role: TestimonialRole): string => {
  return contentConfig.roles[role]?.display || role;
};

/**
 * Get badge color classes for a role
 */
export const getRoleBadgeColor = (role: TestimonialRole): string => {
  return contentConfig.roles[role]?.badgeColor || 'bg-gray-50 text-gray-600';
};
