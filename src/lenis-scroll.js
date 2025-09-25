import Lenis from "@studio-freight/lenis";

export const initializeLenis = () => {
  const lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
    wheelMultiplier: 0.7,
    gestureOrientation: "vertical",
    smoothTouch: false,
  });

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  lenis.on("scroll", ScrollTrigger.update);

  // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
  // This ensures Lenis's smooth scroll animation updates on each GSAP tick
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert time from seconds to milliseconds
  });

  // Disable lag smoothing in GSAP to prevent any delay in scroll animations
  gsap.ticker.lagSmoothing(0);

  console.log("Lenis Smooth Scroll initialized");
};
