# AI Hackathon Assistant 2025 - UI Design System

This document defines the official UI design system for the AI Hackathon Assistant 2025 project. All development should follow these guidelines to ensure visual consistency.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Border & Corner Style](#border--corner-style)
- [Shadow System (Stagger Shadows)](#shadow-system-stagger-shadows)
- [Component Patterns](#component-patterns)
- [Button Variants](#button-variants)
- [Card Components](#card-components)
- [Form Elements](#form-elements)
- [Modal & Dialog](#modal--dialog)
- [Chat Interface](#chat-interface)
- [FAQ Section](#faq-section)
- [Animation Guidelines](#animation-guidelines)
- [Responsive Design](#responsive-design)
- [Code Examples](#code-examples)

---

## Design Philosophy

The AI Hackathon Assistant uses a **"Stagger" design system** characterized by:

1. **Sharp Corners** - NO rounded corners (no `rounded-*` classes) unless specifically noted
2. **Stagger Shadows** - Solid, offset box shadows that create a layered/stacked effect
3. **Blue Primary Theme** - Professional blue gradient aesthetic
4. **High Contrast** - Clear visual hierarchy with strong borders
5. **Minimal Decoration** - Clean, functional design focused on usability

---

## Color System

### CSS Variables (defined in globals.css)

```css
:root {
  --background: 0 0% 100%;           /* White */
  --foreground: 222.2 84% 4.9%;      /* Near black */
  --primary: 221.2 83.2% 53.3%;      /* Blue #3B82F6 */
  --primary-foreground: 210 40% 98%; /* White */
  --secondary: 210 40% 96%;          /* Light gray */
  --muted: 210 40% 96%;              /* Light gray */
  --muted-foreground: 215.4 16.3% 46.9%; /* Gray text */
  --border: 214.3 31.8% 91.4%;       /* Light border */
  --destructive: 0 84.2% 60.2%;      /* Red */
}
```

### Primary Color Usage

| Context | Color | Tailwind Class |
|---------|-------|----------------|
| Primary actions | Blue | `bg-primary` |
| Primary gradient | Blue to Dark Blue | `bg-gradient-to-br from-primary to-blue-700` |
| Text on primary | White | `text-primary-foreground` or `text-white` |
| Borders | Border color | `border-border` or `border-primary` |

### Blue Section Backgrounds

For sections with blue backgrounds (FAQ, modals):

```tsx
// Container background
className="bg-gradient-to-br from-primary via-primary to-blue-700"

// Header with blur
className="bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm"

// Cards on blue background
className="bg-white/95 text-gray-800 border-2 border-white/50"

// Text on blue background
className="text-white"           // Primary text
className="text-white/90"        // Secondary text
className="text-white/70"        // Muted text
className="text-white/50"        // Disabled/hint text
```

---

## Typography

### Font Sizes

| Size | Class | Usage |
|------|-------|-------|
| Extra Small | `text-xs` | Labels, hints, timestamps |
| Small | `text-sm` | Body text, descriptions |
| Base | `text-base` | Default text |
| Large | `text-lg` | Section titles |
| XL | `text-xl` | Page titles |

### Font Weights

- Regular: `font-normal`
- Medium: `font-medium` - For emphasis
- Semibold: `font-semibold` - For headings
- Bold: `font-bold` - For strong emphasis

---

## Border & Corner Style

### CRITICAL: No Rounded Corners

**DO NOT USE** rounded corner classes in this project:
- ❌ `rounded-lg`
- ❌ `rounded-md`
- ❌ `rounded-sm`
- ❌ `rounded-full`
- ❌ `rounded-xl`

**USE** sharp corners (default) or clip-path for special shapes.

### Border Width

Always use `border-2` for visible borders to maintain consistency:

```tsx
// Standard card/container
className="border-2 border-border"

// Primary emphasis
className="border-2 border-primary"

// On blue backgrounds
className="border-2 border-white/30"
```

### Clip-Path Corners (Optional)

For special cut-corner effects:

```tsx
// Small clip corner
className="clip-corner-sm"

// Medium clip corner
className="clip-corner-md"

// Large clip corner
className="clip-corner-lg"
```

> ⚠️ **IMPORTANT: Clip-Path and Shadow Conflict**
>
> **`clip-path` and `box-shadow` CANNOT be used together on the same element.** The `clip-path` property clips the entire element including its shadow, making the shadow invisible.
>
> **Solutions:**
> 1. Choose one: Use either `clip-corner-*` OR `shadow-stagger-*`, not both
> 2. Use a wrapper element: Apply shadow to a parent element and clip-path to a child
> 3. Use the pseudo-element approach with `.stagger-card` class (defined in globals.css)
>
> ```tsx
> // ❌ WRONG - Shadow will not be visible
> className="clip-corner-sm shadow-stagger"
>
> // ✅ CORRECT - Use only one
> className="shadow-stagger border-2 border-border"
>
> // ✅ CORRECT - Use wrapper approach
> <div className="shadow-stagger">
>   <div className="clip-corner-sm bg-card">Content</div>
> </div>
> ```

---

## Shadow System (Stagger Shadows)

The signature visual element of this design system. Stagger shadows are solid, offset shadows that create a layered appearance.

### Shadow Sizes

| Size | Class | Shadow Value | Usage |
|------|-------|--------------|-------|
| Small | `shadow-stagger-sm` | `0px 4px 0px 2px` | Buttons, small elements |
| Default | `shadow-stagger` | `0px 8px 0px 4px` | Cards, containers |
| Large | `shadow-stagger-lg` | `0px 12px 0px 6px` | Modals, dialogs |

### Shadow Colors

| Type | Class | Usage |
|------|-------|-------|
| Border color | `shadow-stagger` | Default, neutral |
| Primary color | `shadow-stagger-primary` | Emphasized elements |
| Primary small | `shadow-stagger-sm-primary` | Small emphasized elements |
| Primary large | `shadow-stagger-lg-primary` | Large emphasized elements |

### Custom Shadow for Blue Backgrounds

When elements are on blue backgrounds, use custom white shadows:

```tsx
// Cards on blue background
className="shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]"

// Smaller elements on blue
className="shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]"

// Hover state
className="hover:shadow-[0px_8px_0px_4px_rgba(255,255,255,0.4)]"
```

---

## Component Patterns

### Standard Card Pattern

```tsx
<div className={cn(
  "bg-card text-card-foreground",
  "border-2 border-border",
  "shadow-stagger",
  "hover:border-primary/50 transition-all duration-200"
)}>
  {/* Card content */}
</div>
```

### Card on Blue Background

```tsx
<div className={cn(
  "bg-white/95 text-gray-800",
  "border-2 border-white/50",
  "shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]",
  "hover:bg-white hover:shadow-[0px_8px_0px_4px_rgba(255,255,255,0.4)]",
  "transition-all duration-200"
)}>
  {/* Card content */}
</div>
```

### Info Card on Blue Background (for modals)

```tsx
<div className={cn(
  "flex items-center space-x-4 p-3",
  "bg-white/10 border-2 border-white/20",
  "shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]",
  "hover:bg-white/15 hover:translate-y-[-2px]",
  "transition-all"
)}>
  {/* Content */}
</div>
```

---

## Button Variants

### Available Variants

```tsx
// Stagger button (default style for this project)
<Button variant="stagger">Button</Button>

// Stagger with primary shadow
<Button variant="staggerPrimary">Button</Button>

// Small stagger button
<Button variant="staggerSm">Button</Button>

// Small stagger with primary shadow
<Button variant="staggerSmPrimary">Button</Button>
```

### Button on Blue Background

```tsx
// Active/Selected state
className={cn(
  "bg-white text-primary hover:bg-white/90 border-white"
)}

// Inactive state
className={cn(
  "border-white/30 text-white/80 bg-transparent",
  "hover:bg-white/20 hover:text-white"
)}
```

---

## Form Elements

### Input Fields

```tsx
// Standard input
<input className={cn(
  "w-full px-4 py-2 text-sm",
  "border-2 border-input bg-background text-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
)} />

// Input on blue background
<input className={cn(
  "w-full px-4 py-2 text-sm",
  "border-2 border-white/30 bg-white/10 text-white",
  "placeholder:text-white/50",
  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
)} />
```

### Select Dropdowns

```tsx
// Select on blue background
<select className={cn(
  "w-full px-3 py-1.5 text-sm",
  "border-2 border-white/30 bg-white/10 text-white",
  "focus:outline-none focus:ring-2 focus:ring-white/50"
)}>
  <option className="bg-primary text-white">Option</option>
</select>
```

---

## Modal & Dialog

### Modal Container

```tsx
<motion.div className={cn(
  "bg-gradient-to-br from-primary via-primary to-blue-700 text-white",
  "border-2 border-white/20",
  "shadow-stagger-lg-primary",
  "max-w-2xl w-full mx-4 max-h-[85vh] overflow-auto",
  "clip-corner-sm"
)}>
  {/* Modal content */}
</motion.div>
```

### Modal Header

```tsx
<div className={cn(
  "sticky top-0 z-10",
  "bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm",
  "border-b border-white/20",
  "px-6 py-4"
)}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/images/AI-Hackathon-logo.svg" className="w-8 h-8" />
      <h2 className="text-lg font-semibold text-white">Title</h2>
    </div>
    <button className={cn(
      "p-2 border-2 border-white/30",
      "hover:bg-white/20 hover:border-white/50",
      "transition-all duration-200"
    )}>
      <X size={16} />
    </button>
  </div>
</div>
```

---

## Chat Interface

### AI Avatar

```tsx
<div className={cn(
  "flex-shrink-0 w-9 h-9 flex items-center justify-center border-2",
  "bg-gradient-to-br from-primary to-blue-700",
  "border-white/30",
  "shadow-[0px_3px_0px_1px_rgba(59,130,246,0.5)]"
)}>
  <img
    src="/images/AI-Hackathon-logo.svg"
    alt="AI Assistant"
    className="w-6 h-6 object-contain"
  />
</div>
```

### User Avatar

```tsx
<div className={cn(
  "flex-shrink-0 w-9 h-9 flex items-center justify-center border-2",
  "bg-primary border-primary",
  "shadow-[0px_3px_0px_1px_hsl(var(--primary))]"
)}>
  <User size={16} className="text-primary-foreground" />
</div>
```

### Message Bubbles

```tsx
// User message
<div className={cn(
  "px-4 py-2",
  "bg-background text-foreground",
  "border-2 border-primary",
  "shadow-stagger-sm-primary"
)}>

// AI message
<div className={cn(
  "px-4 py-2",
  "bg-muted text-foreground",
  "border-2 border-border",
  "shadow-stagger"
)}>
```

---

## FAQ Section

### FAQ Container

```tsx
<div className="bg-gradient-to-br from-primary via-primary to-blue-700">
  {/* FAQ content */}
</div>
```

### FAQ Header

```tsx
<div className={cn(
  "p-4 border-b border-white/20",
  "bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm"
)}>
  <h2 className="text-lg font-semibold text-white">
    Frequently Asked Questions
  </h2>
</div>
```

### FAQ Card

```tsx
<motion.div
  whileHover={{ y: -4 }}
  className={cn(
    "bg-white/95 text-gray-800 border-2 border-white/50",
    "shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]",
    "hover:bg-white hover:border-white",
    "hover:shadow-[0px_8px_0px_4px_rgba(255,255,255,0.4)]",
    "transition-all duration-200 overflow-hidden"
  )}
>
  {/* Category Badge */}
  <span className="px-2 py-1 bg-primary text-white text-xs font-medium">
    Category
  </span>

  {/* Question */}
  <h3 className="font-semibold text-gray-900 text-sm">Question?</h3>

  {/* Answer */}
  <p className="text-gray-600 text-sm">Answer text...</p>

  {/* Stats section */}
  <div className="border-t border-gray-200 bg-gray-50/80">
    {/* Stats and voting buttons */}
  </div>
</motion.div>
```

---

## Animation Guidelines

### Hover Animations

```tsx
// Lift on hover
whileHover={{ y: -4 }}

// Scale on hover (buttons)
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Entrance Animations

```tsx
// Fade in and slide up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3 }}

// Scale in
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
```

### Transition Durations

| Type | Duration | Usage |
|------|----------|-------|
| Fast | `duration-150` | Micro-interactions |
| Normal | `duration-200` | Standard transitions |
| Slow | `duration-300` | Entrance animations |

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Class Prefix |
|------------|-------|--------------|
| Mobile | < 640px | Default |
| Tablet | >= 640px | `sm:` |
| Laptop | >= 1024px | `lg:` |
| Desktop | >= 1280px | `xl:` |

### Layout Patterns

```tsx
// Desktop: side-by-side, Mobile: stacked
<div className="hidden lg:flex">
  {/* Desktop layout */}
</div>
<div className="lg:hidden">
  {/* Mobile layout */}
</div>
```

---

## Code Examples

### Complete FAQ Card Example

```tsx
<motion.div
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  whileHover={{ y: -4 }}
  className={cn(
    "bg-white/95 text-gray-800 border-2 border-white/50",
    "shadow-[0px_6px_0px_3px_rgba(255,255,255,0.3)]",
    "hover:bg-white hover:border-white",
    "hover:shadow-[0px_8px_0px_4px_rgba(255,255,255,0.4)]",
    "transition-all duration-200 overflow-hidden group"
  )}
>
  <div className="px-4 pt-4 pb-1">
    <span className="inline-block px-2 py-1 bg-primary text-white text-xs font-medium">
      Category
    </span>
  </div>
  <div className="px-4 pb-2">
    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
      Question title goes here?
    </h3>
  </div>
  <div className="px-4 pb-3">
    <p className="text-gray-600 text-sm leading-relaxed">
      Answer content goes here...
    </p>
  </div>
  <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/80">
    {/* Stats and actions */}
  </div>
</motion.div>
```

### Complete Modal Example

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0, y: 20 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 20 }}
    className={cn(
      "bg-gradient-to-br from-primary via-primary to-blue-700 text-white",
      "border-2 border-white/20",
      "shadow-stagger-lg-primary",
      "max-w-2xl w-full mx-4 max-h-[85vh] overflow-auto",
      "clip-corner-sm"
    )}
  >
    {/* Header */}
    <div className={cn(
      "sticky top-0 z-10",
      "bg-gradient-to-r from-primary/95 to-blue-700/95 backdrop-blur-sm",
      "border-b border-white/20",
      "px-6 py-4"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/AI-Hackathon-logo.svg" className="w-8 h-8" />
          <h2 className="text-lg font-semibold text-white">Modal Title</h2>
        </div>
        <button className={cn(
          "p-2 border-2 border-white/30",
          "hover:bg-white/20 hover:border-white/50",
          "transition-all duration-200"
        )}>
          <X size={16} />
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 space-y-5">
      {/* Info cards */}
      <div className={cn(
        "flex items-center space-x-4 p-3",
        "bg-white/10 border-2 border-white/20",
        "shadow-[0px_4px_0px_2px_rgba(255,255,255,0.15)]"
      )}>
        {/* Card content */}
      </div>
    </div>
  </motion.div>
</motion.div>
```

---

## Quick Reference

### DO's

- ✅ Use `border-2` for all visible borders
- ✅ Use `shadow-stagger*` classes for shadows
- ✅ Use sharp corners (no border-radius)
- ✅ Use blue gradients for primary sections
- ✅ Use white/opacity colors on blue backgrounds
- ✅ Use Framer Motion for animations
- ✅ Follow the stagger shadow pattern

### DON'Ts

- ❌ Use `rounded-*` classes
- ❌ Use standard `shadow-*` classes (use stagger instead)
- ❌ Use thin borders (`border` without width)
- ❌ Mix design systems
- ❌ Use colors outside the defined palette
- ❌ Use `clip-path` and `box-shadow` on the same element (shadow will be clipped/invisible)

---

*Last updated: December 2024*
*Design System Version: 1.0*
