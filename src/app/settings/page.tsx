"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [vows, setVows] = useState(["", "", "", "", "", ""]);
  const [about, setAbout] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("monk_username") ?? "");
    try {
      const v = JSON.parse(localStorage.getItem("monk_vows") ?? "[]");
      if (Array.isArray(v)) setVows([...v, "", "", "", "", "", ""].slice(0, 6));
    } catch {}
    setAbout(localStorage.getItem("monk_about") ?? "");
  }, []);

  function save() {
    localStorage.setItem("monk_username", name.trim());
    localStorage.setItem("monk_vows", JSON.stringify(vows.map((v) => v.trim())));
    localStorage.setItem("monk_about", about.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const label = (text: string) => (
    <p style={{ fontFamily: "var(--font-lora), Georgia, serif", color: "#8a7f74", fontSize: "12px", letterSpacing: "0.05em" }}>
      {text}
    </p>
  );

  const inputCls = "w-full bg-transparent border-b text-sm font-light focus:outline-none py-1";
  const inputStyle = { borderColor: "#e0d5c5", color: "#2d2926", caretColor: "#2d2926" };

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: "#f0ede8" }}>
      <div
        className="relative overflow-y-auto"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          backgroundColor: "#ffffff",
          borderRadius: "clamp(0px, 4vw, 44px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <div className="px-10 pt-12 pb-16 flex flex-col gap-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="text-xs tracking-widest lowercase cursor-pointer"
              style={{ color: "#bbb" }}
            >
              ← back
            </button>
            <p className="text-xs tracking-[0.3em] lowercase" style={{ color: "#bbb" }}>profile</p>
            <button
              onClick={save}
              className="text-xs tracking-widest lowercase cursor-pointer transition-colors"
              style={{ color: saved ? "#7a8e7c" : "#8a7f74" }}
            >
              {saved ? "saved" : "save"}
            </button>
          </div>

          {/* Name */}
          <div className="flex flex-col gap-3">
            {label("your name")}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              style={inputStyle}
              autoComplete="off"
            />
          </div>

          {/* Vows */}
          <div className="flex flex-col gap-3">
            {label("your six vows")}
            <div className="flex flex-col gap-3">
              {vows.map((vow, i) => (
                <input
                  key={i}
                  value={vow}
                  onChange={(e) => setVows((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                  placeholder={`vow ${i + 1}`}
                  className={inputCls + " placeholder-[#ddd]"}
                  style={inputStyle}
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-3">
            {label("about you")}
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="w-full bg-transparent border-b resize-none text-sm font-light focus:outline-none leading-relaxed"
              style={{ ...inputStyle, borderColor: "#e0d5c5" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
