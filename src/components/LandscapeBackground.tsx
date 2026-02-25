export default function LandscapeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/background.PNG"
        alt=""
        className="w-full h-full object-cover object-center"
      />
      {/* Subtle vignette so UI elements stay readable over the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 45%, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
