"use client";

import { motion } from "framer-motion";

export default function MonkAvatar() {
  return (
    <div className="flex flex-col items-center select-none" style={{ height: "52vh", aspectRatio: "3/4" }}>
      <div className="relative w-full h-full">
        {/* Outer glow — warm golden halo behind the figure */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(240,210,100,0.55) 0%, rgba(240,160,60,0.2) 50%, transparent 100%)",
          }}
        />

        {/* Floating monk — swap src to use your own image */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <img
            src="/monk.PNG"
            alt="Meditating monk"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Breathing label */}
      <motion.p
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="text-[10px] tracking-[0.4em] uppercase text-white/50 mt-2"
      >
        breathe
      </motion.p>
    </div>
  );
}
