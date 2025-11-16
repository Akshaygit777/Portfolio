"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, ReactNode, useRef } from "react";

// BubbleText component props
interface BubbleTextProps {
  children: ReactNode;
  className?: string;
  textClassName?: string;
  activeColor?: string; // Prop for active text color
  neighborColor?: string; // Prop for neighbor text color
  restColor?: string; // Prop for rest state text color
  autoAnimate?: boolean; // Enable auto animation
  animationInterval?: number; // Time between animations in ms
}

// Text component props for individual characters
interface TextProps {
  children: string;
  className?: string;
  activeColor?: string;
  neighborColor?: string;
  restColor?: string;
  autoAnimate?: boolean;
  animationInterval?: number;
}

const BubbleText = ({ 
  children, 
  className, 
  textClassName,
  activeColor = "rgb(238, 242, 255)", // Default white
  neighborColor, // Optional, will use activeColor with reduced opacity if not provided
  restColor = "rgb(165, 180, 252)", // Default indigo-300
  autoAnimate = true, // Auto animation enabled by default
  animationInterval = 3000 // Run animation every 3 seconds by default
}: BubbleTextProps) => {
  return (
    <h2 className={cn("hover-text text-center text-5xl", className)}>
      <Text 
        className={textClassName}
        activeColor={activeColor}
        neighborColor={neighborColor}
        restColor={restColor}
        autoAnimate={autoAnimate}
        animationInterval={animationInterval}
      >
        {typeof children === 'string' ? children : 'Bubble text'}
      </Text>
    </h2>
  );
};

const Text = ({ 
  children, 
  className,
  activeColor = "rgb(238, 242, 255)", // Default white
  neighborColor, // Will use activeColor if not provided
  restColor = "rgb(165, 180, 252)", // Default indigo-300
  autoAnimate = true,
  animationInterval = 3000
}: TextProps) => {
  // If neighborColor is not provided, use activeColor with reduced opacity
  const computedNeighborColor = neighborColor || activeColor;
  const spansRef = useRef<HTMLSpanElement[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringRef = useRef(false);
  
  // Function to apply the hover effect to a span
  const applyHoverEffect = (span: HTMLSpanElement) => {
    if (!span) return;
    
    span.style.fontWeight = "900";
    span.style.color = activeColor;

    const leftNeighbor = span.previousElementSibling as HTMLSpanElement;
    const rightNeighbor = span.nextElementSibling as HTMLSpanElement;

    if (leftNeighbor) {
      leftNeighbor.style.fontWeight = "500";
      leftNeighbor.style.color = computedNeighborColor;
    }
    if (rightNeighbor) {
      rightNeighbor.style.fontWeight = "500";
      rightNeighbor.style.color = computedNeighborColor;
    }
  };

  // Function to remove the hover effect from a span
  const removeHoverEffect = (span: HTMLSpanElement) => {
    if (!span) return;
    
    span.style.fontWeight = "100";
    span.style.color = restColor;

    const leftNeighbor = span.previousElementSibling as HTMLSpanElement;
    const rightNeighbor = span.nextElementSibling as HTMLSpanElement;

    if (leftNeighbor) {
      leftNeighbor.style.fontWeight = "100";
      leftNeighbor.style.color = restColor;
    }
    if (rightNeighbor) {
      rightNeighbor.style.fontWeight = "100";
      rightNeighbor.style.color = restColor;
    }
  };

  // Animation function
  const runAnimation = () => {
    if (isHoveringRef.current || !spansRef.current.length) return;
    
    const spans = spansRef.current;
    const randomIndex = Math.floor(Math.random() * spans.length);
    const span = spans[randomIndex];
    
    applyHoverEffect(span);
    
    // Reset after a delay
    setTimeout(() => {
      if (!isHoveringRef.current) {
        removeHoverEffect(span);
      }
    }, 500); // Animation duration
  };
  
  useEffect(() => {
    const spans = document.querySelectorAll(
      ".hover-text span"
    ) as NodeListOf<HTMLSpanElement>;
    
    // Store spans in ref for animation access
    spansRef.current = Array.from(spans);

    // Set initial color
    spans.forEach((span) => {
      span.style.color = restColor;
      span.style.fontWeight = "100";
    });

    // Setup hover event listeners
    spans.forEach((span) => {
      span.addEventListener("mouseenter", function (this: typeof span) {
        isHoveringRef.current = true;
        applyHoverEffect(this);
      });

      span.addEventListener("mouseleave", function (this: typeof span) {
        isHoveringRef.current = false;
        removeHoverEffect(this);
      });
    });

    // Start animation interval if enabled
    if (autoAnimate) {
      animationRef.current = setInterval(runAnimation, animationInterval);
    }

    // Cleanup event listeners and interval on unmount
    return () => {
      spans.forEach((span) => {
        span.removeEventListener("mouseenter", () => {});
        span.removeEventListener("mouseleave", () => {});
      });
      
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [activeColor, computedNeighborColor, restColor, autoAnimate, animationInterval]);

  return (
    <>
      {children.split("").map((child, idx) => (
        <span
          className={cn(className)}
          style={{
            transition: "0.35s font-weight, 0.35s color",
            fontWeight: "100",
            color: restColor
          }}
          key={idx}
        >
          {child}
        </span>
      ))}
    </>
  );
};

export { BubbleText };