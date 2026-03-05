"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-black flex flex-col cursor-pointer select-none"
      onClick={() => router.push("/think")}
    >
      {/* monk wordmark — top left */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-7 left-8 text-sm font-light tracking-[0.35em] text-white/30 lowercase"
      >
        monk
      </motion.p>

      {/* Avatar — bottom center, small */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 pointer-events-none"
      >
        <img
          src="/monk.PNG"
          alt=""
          className="w-full object-contain"
          style={{ filter: "grayscale(100%) brightness(0.85)" }}
        />
      </motion.div>
    </div>
  );
}
