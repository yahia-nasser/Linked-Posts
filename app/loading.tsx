"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-blue-950 via-cyan-700 to-blue-950">
      <motion.div
        initial={{ scale: 0.86, opacity: 0.9 }}
        animate={{ scale: [0.98, 1, 0.98], rotate: [0, 0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          aria-hidden
          className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center"
        >
          {/* circular border (white) */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 30px rgba(255,255,255,0.05)",
              border: "3px solid rgba(255,255,255,0.95)",
              background: "transparent",
            }}
          />

          <svg
            width="150"
            height="150"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <rect width="100" height="100" fill="transparent" />

            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="18"
              fill="transparent"
            />

            <path d="M32 28 H46 V66 H68 V76 H32 Z" fill="#ffffff" />

            <path
              d="M50 28 H70 C79 28 84 34 84 42 C84 50 79 56 70 56 H50 Z"
              fill="#00E6FF"
            />
          </svg>

          {/* shimmer overlay — uses CSS animation defined below */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-full shimmer"
            style={{
              WebkitMask:
                "radial-gradient(circle at center, rgba(0,0,0,1) 46%, rgba(0,0,0,0.0) 47%)",
              mask: "radial-gradient(circle at center, rgba(0,0,0,1) 46%, rgba(0,0,0,0.0) 47%)",
            }}
          />
        </div>

        {/* Optional small caption */}
        <div className="mt-4 text-center">
          <p className="text-sm text-cyan-500 font-bold">
            Loading Linked Posts…
          </p>
        </div>

        {/* Inline CSS for shimmer animation */}
        <style>{`
          /* shimmer uses a moving linear-gradient overlay */
          .shimmer {
            pointer-events: none;
            background: linear-gradient(120deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.04) 80%);
            mix-blend-mode: screen;
            transform: translateZ(0);
            transition: opacity 200ms ease;
            animation: shimmerMove 2.2s infinite linear;
          }

          @keyframes shimmerMove {
            0% { transform: translateX(-140%) scale(1.1); opacity: 0.9; }
            50% { transform: translateX(0%) scale(1.05); opacity: 1; }
            100% { transform: translateX(140%) scale(1.1); opacity: 0.9; }
          }

          /* reduce size on very small screens */
          @media (max-width: 420px) {
            .shimmer { animation-duration: 2.6s; }
          }
        `}</style>
      </motion.div>
    </div>
  );
}
