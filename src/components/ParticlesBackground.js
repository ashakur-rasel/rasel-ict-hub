"use client";
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
      const [init, setInit] = useState(false);

      useEffect(() => {
            initParticlesEngine(async (engine) => {
                  await loadSlim(engine);
            }).then(() => setInit(true));
      }, []);

      const options = useMemo(() => ({
            background: { color: { value: "transparent" } }, // মেইন পেজের ব্যাকগ্রাউন্ড কালার ব্যবহার করবে
            fpsLimit: 120,
            interactivity: {
                  events: {
                        onClick: { enable: true, mode: "push" },
                        onHover: { enable: true, mode: "grab" },
                  },
                  modes: {
                        grab: { distance: 140, links: { opacity: 0.5 } },
                        push: { quantity: 4 },
                  },
            },
            particles: {
                  color: { value: "#3b82f6" },
                  links: { color: "#3b82f6", distance: 150, enable: true, opacity: 0.2, width: 1 },
                  move: { enable: true, speed: 1.5, outModes: { default: "bounce" } },
                  number: { density: { enable: true, area: 800 }, value: 60 },
                  opacity: { value: 0.4 },
                  shape: { type: "circle" },
                  size: { value: { min: 1, max: 3 } },
            },
      }), []);

      if (init) return <Particles id="tsparticles" options={options} className="absolute inset-0 z-0" />;
      return null;
};

export default ParticlesBackground;