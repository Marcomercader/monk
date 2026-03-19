"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

function getProfiles(): Record<string, { vows: string[]; about: string }> {
  try { return JSON.parse(localStorage.getItem("monk_profiles") ?? "{}"); } catch { return {}; }
}

function saveProfile(name: string, vows: string[], about: string) {
  const profiles = getProfiles();
  profiles[name.trim().toLowerCase()] = { vows, about };
  localStorage.setItem("monk_profiles", JSON.stringify(profiles));
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [vows, setVows] = useState(["", "", "", "", "", ""]);
  const [about, setAbout] = useState("");
  const [returningUser, setReturningUser] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const vow0Ref = useRef<HTMLInputElement>(null);
  const vowRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 0) nameRef.current?.focus();
    if (step === 1) vow0Ref.current?.focus();
    if (step === 2) aboutRef.current?.focus();
  }, [step]);

  function submitName() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const profiles = getProfiles();
    const saved = profiles[trimmed.toLowerCase()];
    if (saved) {
      // returning user — restore and go home
      localStorage.setItem("monk_username", trimmed);
      localStorage.setItem("monk_vows", JSON.stringify(saved.vows));
      localStorage.setItem("monk_about", saved.about);
      setReturningUser(true);
      setTimeout(() => router.replace("/"), 800);
    } else {
      setStep(1);
    }
  }

  function finish(finalAbout: string) {
    const trimmedName = name.trim();
    const trimmedVows = vows.map((v) => v.trim());
    localStorage.setItem("monk_username", trimmedName);
    localStorage.setItem("monk_vows", JSON.stringify(trimmedVows));
    localStorage.setItem("monk_about", finalAbout.trim());
    saveProfile(trimmedName, trimmedVows, finalAbout.trim());
    router.replace("/");
  }

  const label = (text: string) => (
    <p style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#8a7f74", fontSize: "13px", letterSpacing: "0.05em" }}>
      {text}
    </p>
  );

  const inputStyle = { borderColor: "#c8b088", color: "#2d2926", caretColor: "#2d2926" };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#f0ede8" }}>
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          backgroundColor: "#fdf0e0",
          borderRadius: "clamp(0px, 4vw, 44px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <AnimatePresence mode="wait">

          {/* Step 0: Name */}
          {step === 0 && (
            <motion.div key="step-0" {...fadeUp} className="flex flex-col items-center gap-6">
              {returningUser ? label("welcome back") : label("what is your name?")}
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitName()}
                className="bg-transparent border-0 border-b text-center text-xl font-light focus:outline-none w-56"
                style={inputStyle}
                autoComplete="off"
              />
              <button
                onClick={submitName}
                disabled={!name.trim()}
                className="mt-2 text-xs tracking-[0.25em] lowercase cursor-pointer disabled:opacity-30 transition-opacity"
                style={{ color: "#8a7f74" }}
              >
                continue →
              </button>
            </motion.div>
          )}

          {/* Step 1: 6 Vows */}
          {step === 1 && (
            <motion.div key="step-1" {...fadeUp} className="flex flex-col items-center gap-8">
              {label("name your six vows")}
              <div className="flex flex-col gap-4 items-center">
                {vows.map((vow, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      vowRefs.current[i] = el;
                      if (i === 0) vow0Ref.current = el;
                    }}
                    value={vow}
                    onChange={(e) => setVows((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (i < 5) {
                          vowRefs.current[i + 1]?.focus();
                        } else {
                          setStep(2);
                        }
                      }
                    }}
                    placeholder={`vow ${i + 1}`}
                    className="bg-transparent border-0 border-b text-center text-base font-light focus:outline-none w-64 placeholder-[#c8b088]"
                    style={inputStyle}
                    autoComplete="off"
                  />
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-2 text-xs tracking-[0.25em] lowercase cursor-pointer transition-opacity"
                style={{ color: "#8a7f74" }}
              >
                continue →
              </button>
            </motion.div>
          )}

          {/* Step 2: About */}
          {step === 2 && (
            <motion.div key="step-2" {...fadeUp} className="flex flex-col items-center gap-6">
              {label("tell me about yourself")}
              <textarea
                ref={aboutRef}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    finish(about);
                  }
                }}
                rows={4}
                className="bg-transparent border-b resize-none text-center text-base font-light focus:outline-none w-80 leading-relaxed"
                style={{ ...inputStyle, borderColor: "transparent", borderBottomColor: "#c8b088" }}
              />
              <button
                onClick={() => finish(about)}
                disabled={!about.trim()}
                className="mt-2 text-xs tracking-[0.25em] lowercase cursor-pointer disabled:opacity-30 transition-opacity"
                style={{ color: "#8a7f74" }}
              >
                continue →
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
