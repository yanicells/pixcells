# Background Toggle Implementation Guide

This guide provides all the code and instructions needed to implement a background toggle feature that switches between an animated bubble background and a simple gradient background.

## Dependencies Required

Make sure you have these packages installed:

```bash
npm install zustand framer-motion lucide-react clsx tailwind-merge
```

Or with yarn:

```bash
yarn add zustand framer-motion lucide-react clsx tailwind-merge
```

---

## Step 1: Create/Edit the Store File

**File:** `store/ui.store.ts` (or wherever you keep your stores)

Create this file with the following content:

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type BackgroundStore = {
  useSimpleBackground: boolean;
  toggleBackground: () => void;
};

export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set) => ({
      useSimpleBackground: false,
      toggleBackground: () =>
        set((state) => ({ useSimpleBackground: !state.useSimpleBackground })),
    }),
    {
      name: "background-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**What this does:** Creates a Zustand store that persists the background preference in localStorage.

---

## Step 2: Create the Utils File (if you don't have it)

**File:** `lib/utils.ts` (or `utils/utils.ts` - adjust import paths accordingly)

Create this file if you don't already have it:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**What this does:** Utility function for merging Tailwind classes (required by BubbleBackground component).

---

## Step 3: Create the BubbleBackground Component

**File:** `components/ui/shadcn-io/bubble-background/index.tsx`

Create the directory structure and this file:

```typescript
"use client";

import * as React from "react";
import {
  motion,
  type SpringOptions,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils"; // Adjust import path if your utils file is elsewhere

type BubbleBackgroundProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
  transition?: SpringOptions;
  colors?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
    sixth: string;
  };
};

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },
  colors = {
    first: "18,113,255",
    second: "221,74,255",
    third: "0,220,255",
    fourth: "200,50,50",
    fifth: "180,180,50",
    sixth: "140,100,255",
  },
  ...props
}: BubbleBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  React.useEffect(() => {
    if (!interactive) return;

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = currentContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    currentContainer?.addEventListener("mousemove", handleMouseMove);
    return () =>
      currentContainer?.removeEventListener("mousemove", handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn(
        "relative size-full overflow-hidden bg-gradient-to-br from-violet-900 to-blue-900",
        className
      )}
      {...props}
    >
      <style>
        {`
            :root {
              --first-color: ${colors.first};
              --second-color: ${colors.second};
              --third-color: ${colors.third};
              --fourth-color: ${colors.fourth};
              --fifth-color: ${colors.fifth};
              --sixth-color: ${colors.sixth};
            }
          `}
      </style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-0 h-0"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        className="absolute inset-0"
        style={{ filter: "url(#goo) blur(40px)" }}
      >
        <motion.div
          className="absolute rounded-full size-[80%] top-[10%] left-[10%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--first-color),0.8)_0%,rgba(var(--first-color),0)_50%)]"
          animate={{ y: [-50, 50, -50] }}
          transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center origin-[calc(50%-400px)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <div className="rounded-full size-[80%] top-[10%] left-[10%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--second-color),0.8)_0%,rgba(var(--second-color),0)_50%)]" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex justify-center items-center origin-[calc(50%+400px)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          <div className="absolute rounded-full size-[80%] bg-[radial-gradient(circle_at_center,rgba(var(--third-color),0.8)_0%,rgba(var(--third-color),0)_50%)] mix-blend-hard-light top-[calc(50%+200px)] left-[calc(50%-500px)]" />
        </motion.div>

        <motion.div
          className="absolute rounded-full size-[80%] top-[10%] left-[10%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fourth-color),0.8)_0%,rgba(var(--fourth-color),0)_50%)] opacity-70"
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 40, ease: "easeInOut", repeat: Infinity }}
        />

        <motion.div
          className="absolute inset-0 flex justify-center items-center origin-[calc(50%_-_800px)_calc(50%_+_200px)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          <div className="absolute rounded-full size-[160%] mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--fifth-color),0.8)_0%,rgba(var(--fifth-color),0)_50%)] top-[calc(50%-80%)] left-[calc(50%-80%)]" />
        </motion.div>

        {interactive && (
          <motion.div
            className="absolute rounded-full size-full mix-blend-hard-light bg-[radial-gradient(circle_at_center,rgba(var(--sixth-color),0.8)_0%,rgba(var(--sixth-color),0)_50%)] opacity-70"
            style={{
              x: springX,
              y: springY,
            }}
          />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground, type BubbleBackgroundProps };
```

**Note:** If you're using `framer-motion` instead of `motion`, change the import from `'motion/react'` to `'framer-motion'`.

**What this does:** Creates an animated bubble background with customizable colors and interactive mouse tracking.

---

## Step 4: Create the BackgroundWrapper Component

**File:** `components/shared/BackgroundWrapper.tsx` (or any location you prefer)

```typescript
"use client";

import { useEffect } from "react";
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background/index"; // Adjust path if needed
import { useBackgroundStore } from "@/store/ui.store"; // Adjust path if needed

// Detect if user is on mobile device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;

  // Check user agent
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "android",
    "webos",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ];
  const isMobileUA = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword)
  );

  // Check screen size (less than 1024px width)
  const isSmallScreen = window.innerWidth < 1024;

  // Check touch capability
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return isMobileUA || (isSmallScreen && isTouchDevice);
};

export function BackgroundWrapper() {
  const { useSimpleBackground, toggleBackground } = useBackgroundStore();

  useEffect(() => {
    // Only run on first load, check if preference has been set
    const hasPreference = localStorage.getItem("background-store");

    if (!hasPreference && isMobileDevice()) {
      // First time on mobile - default to simple background
      toggleBackground();
    }
  }, [toggleBackground]);

  if (useSimpleBackground) {
    // Simple gradient background - customize colors to match your design
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#282c20] to-[#1a1d16]" />
    );
  }

  // Animated bubble background - customize colors to match your design
  return (
    <BubbleBackground
      interactive
      colors={{
        first: "40,44,32", // Dark olive
        second: "70,100,55", // Medium forest
        third: "95,110,70", // Balanced sage
        fourth: "55,72,46", // Medium moss
        fifth: "82,92,60", // Medium olive
        sixth: "115,125,80", // Soft sage
      }}
      className="fixed inset-0 bg-gradient-to-br from-[#282c20] to-[#1a1d16] -z-10"
    />
  );
}
```

**What this does:**

- Wraps the background logic, switching between bubble and simple backgrounds based on store state
- Auto-switches to simple background on mobile devices for better performance
- Customize the gradient colors and bubble colors to match your design

---

## Step 5: Create the BackgroundToggle Button Component

**File:** `components/shared/BackgroundToggle.tsx` (or any location you prefer)

```typescript
"use client";

import { motion } from "framer-motion"; // or 'motion/react' if using motion package
import { Sparkles, Palette } from "lucide-react";
import { useBackgroundStore } from "@/store/ui.store"; // Adjust path if needed

export function BackgroundToggle() {
  const { useSimpleBackground, toggleBackground } = useBackgroundStore();

  return (
    <motion.button
      onClick={toggleBackground}
      className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full backdrop-blur-[11.9px] border border-white/30 transition-all duration-300 overflow-hidden group"
      style={{
        background: "rgba(255, 255, 255, 0.19)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      title={
        useSimpleBackground
          ? "Enable animated background"
          : "Disable animations (better performance)"
      }
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8 }}
      />

      {/* Icon with rotation animation */}
      <motion.div
        className="relative z-10"
        initial={false}
        animate={{ rotate: useSimpleBackground ? 0 : 360 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {useSimpleBackground ? (
          <Sparkles className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
        ) : (
          <Palette className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" />
        )}
      </motion.div>
    </motion.button>
  );
}
```

**What this does:** Creates a floating toggle button with animations that switches between bubble and simple backgrounds.

---

## Step 6: Integrate into Your Layout

**File:** `app/layout.tsx` (or `_app.tsx` if using Pages Router)

Add these imports at the top:

```typescript
import { BackgroundToggle } from "@/components/shared/BackgroundToggle"; // Adjust path
import { BackgroundWrapper } from "@/components/shared/BackgroundWrapper"; // Adjust path
```

Inside your layout component's return statement, add:

```typescript
<BackgroundWrapper />
// ... your other content ...
<BackgroundToggle />
```

**Full example for Next.js App Router:**

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BackgroundWrapper />

        <div className="relative z-10">
          {/* Your app content */}
          {children}
        </div>

        <BackgroundToggle />
      </body>
    </html>
  );
}
```

---

## Customization Options

### Change Simple Background Colors

Edit the `BackgroundWrapper.tsx` component, in the `useSimpleBackground` return:

```typescript
<div className="fixed inset-0 -z-10 bg-gradient-to-br from-[YOUR_COLOR_1] to-[YOUR_COLOR_2]" />
```

### Change Bubble Background Colors

Edit the `colors` prop in `BackgroundWrapper.tsx`:

```typescript
colors={{
  first: 'R,G,B',    // RGB values as strings (e.g., '255,100,50')
  second: 'R,G,B',
  // ... etc
}}
```

### Change Toggle Button Position

Edit the `className` in `BackgroundToggle.tsx`:

```typescript
className = "fixed bottom-6 right-6 z-50 ..."; // Change bottom/right values
```

### Disable Mobile Auto-Switch

Remove or comment out the `useEffect` in `BackgroundWrapper.tsx` if you don't want mobile devices to auto-switch.

---

## Summary Checklist

- [ ] Install dependencies: `zustand`, `framer-motion` (or `motion`), `lucide-react`, `clsx`, `tailwind-merge`
- [ ] Create `store/ui.store.ts` with background store
- [ ] Create `lib/utils.ts` with `cn` function (if needed)
- [ ] Create `components/ui/shadcn-io/bubble-background/index.tsx`
- [ ] Create `components/shared/BackgroundWrapper.tsx`
- [ ] Create `components/shared/BackgroundToggle.tsx`
- [ ] Import and add `BackgroundWrapper` and `BackgroundToggle` to your layout
- [ ] Customize colors to match your design
- [ ] Test the toggle functionality

---

## Troubleshooting

**If the background doesn't show:**

- Check that `BackgroundWrapper` has `z-index` lower than your content (uses `-z-10`)
- Make sure your content wrapper has `position: relative` and higher z-index

**If the toggle button doesn't appear:**

- Ensure it has a high z-index (currently `z-50`)
- Check that nothing is covering it

**If colors don't match your design:**

- Update the gradient in `BackgroundWrapper` for simple background
- Update the `colors` prop in the `BubbleBackground` component

**If you get import errors:**

- Adjust all import paths to match your project structure
- Make sure all dependencies are installed
