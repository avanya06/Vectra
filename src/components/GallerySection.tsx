import React, { useEffect, useRef } from "react";
import "./GallerySection.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const GallerySection: React.FC = () => {
  const rocketRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<SVGGElement>(null);
  const smokeRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const helmetRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const rocket = rocketRef.current;
    const flame = flameRef.current;
    const smoke = smokeRef.current;
    const container = containerRef.current;
    const helmet = helmetRef.current;

    if (!rocket || !flame || !container) return;

    const ctx = gsap.context(() => {
        gsap.set(rocket, { x: 0, y: 100, opacity: 1, scale: 1, rotation: 0 });
        gsap.set(flame, { opacity: 0, scale: 0 });
        gsap.set(smoke, { opacity: 0, scale: 0 });
        if (helmet) {
          gsap.set(helmet, {
            rotationY: -25,
            rotationX: 8,
            transformPerspective: 800,
            transformOrigin: "50% 50%"
          });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "bottom 50%",
            scrub: 1,
          }
        });

        tl
          .to(rocket, { x: "+=2", y: "+=2", rotation: "+=1", yoyo: true, repeat: 5, duration: 0.05 })
          .to(flame, { opacity: 1, scale: 1.5, duration: 0.1 }, "<")
          .to(smoke, { opacity: 0.8, scale: 1.2, duration: 0.2 }, "<")
          
          .to(rocket, {
            motionPath: {
              path: [
                { x: 0, y: 50 },
                { x: 0, y: -100 },
                { x: 0, y: -300 },
                { x: 0, y: -100 },
                { x: 0, y: 0 }
              ],
              curviness: 1,
              autoRotate: false,
              alignOrigin: [0.5, 0.5]
            },
            scale: 1.5,
            duration: 3,
            ease: "power3.inOut"
          }, ">-0.1")
          
          .to(smoke, { opacity: 0, scale: 2, duration: 1 }, "-=2")
          .to(flame, { scale: 0.6, opacity: 0.8, duration: 1 }, "-=1");

        gsap.to(flame, {
          scaleY: 1.2,
          scaleX: 0.9,
          yoyo: true,
          repeat: -1,
          duration: 0.1,
          ease: "power1.inOut"
        });

      if (smoke) {
        gsap.to(smoke.children, {
          y: 40,
          x: "random(-10, 10)",
          scale: "random(1.5, 2.5)",
          opacity: 0,
          duration: 0.8,
          stagger: {
            each: 0.1,
            repeat: -1
          },
          ease: "power1.out"
        });
      }

      if (helmet && container) {
        gsap.to(helmet, {
          rotationY: 5,
          rotationX: 0,
          scale: 1.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "bottom 20%",
            scrub: 1.5
          }
        });
      }

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="gallery">
      <div className="gallery-top">
        <div className="gallery-image" style={{ minHeight: '300px', width: '100%', maxWidth: '600px' }}>
          <div ref={rocketRef} className="w-32 h-32 md:w-48 md:h-48 relative z-50">
            <svg 
              viewBox="0 0 32 32" 
              className="w-full h-full drop-shadow-[0_0_25px_rgba(93,214,44,0.6)] overflow-visible"
              shapeRendering="crispEdges"
            >
              <g ref={flameRef} style={{ transformOrigin: '16px 32px' }}>
                <path d="M14 32h4v2h-4z" fill="#facc15" />
                <path d="M13 34h6v2h-6z" fill="#fb923c" />
                <path d="M14 36h4v2h-4z" fill="#ef4444" />
                <path d="M15 38h2v3h-2z" fill="#ef4444" opacity="0.8" />
                <path d="M14 41h4v2h-4z" fill="#ef4444" opacity="0.4" />
              </g>

              <g ref={smokeRef} style={{ transformOrigin: '16px 42px' }}>
                 <circle cx="12" cy="40" r="3" fill="#555" opacity="0.6" />
                 <circle cx="20" cy="40" r="3" fill="#555" opacity="0.6" />
                 <circle cx="16" cy="42" r="4" fill="#777" opacity="0.6" />
                 <circle cx="8" cy="44" r="3" fill="#444" opacity="0.5" />
                 <circle cx="24" cy="44" r="3" fill="#444" opacity="0.5" />
                 <circle cx="16" cy="46" r="2" fill="#333" opacity="0.4" />
              </g>

              <g>
                <path d="M15 2h2v2h2v2h2v4h1v6h-1v2h2v2h-1v2h1v2h-4v2h-6v-2h-4v-2h1v-2h-1v-2h2v-2h-1v-6h1v-4h2v-2h2v-2z" fill="#5DD62C" />
                <path d="M15 10h2v4h-2z" fill="#0F0F0F" />
                <path d="M11 18h2v4h-2zM19 18h2v4h-2z" fill="#ef4444" />
                <path d="M15 22h2v2h-2z" fill="#ef4444" />
              </g>
            </svg>
          </div>
        </div>

        <div className="gallery-text">
          <h1>🧩 Why Choose Us ?</h1>
          <p>
            We focus on speed, simplicity, and reliability. Our tool is built to work across all devices and platforms, ensuring your links always perform when it matters most. Whether you need one link or thousands, we scale with your needs.
          </p>
        </div>
      </div>

      <div className="gallery-bottom">
        <div className="thoughts">
          <div>
            <h1>🧩 Features Overview</h1>
            <p className="mb-8">
              With advanced customization, real-time analytics, and fast link generation, our platform gives you complete control over your links. Track clicks, optimize performance, and create links that match your brand — all while keeping your workflow smooth and efficient.
            </p>
          </div>
          
          <div className="h-px bg-white/10 my-8 w-full" />

          <div>
            <h1>🧩 Description Section</h1>
            <p>
              Our all-in-one link generator is designed to simplify how you create and manage links. From shortening URLs to generating QR codes and branded links, everything works seamlessly in one place. No technical skills required — just paste your link, customize it, and share it anywhere.
            </p>
          </div>
        </div>

        <div className="out-box">
          <img
            ref={helmetRef}
            src="/helmet.png"
            alt="Astronaut Helmet"
          />
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
