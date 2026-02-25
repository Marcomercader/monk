export default function LandscapeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky gradient — deep blue-navy at zenith → pale dusty blue → warm gold at horizon */}
          <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0d1e36" />
            <stop offset="18%"  stopColor="#162e52" />
            <stop offset="38%"  stopColor="#1e4878" />
            <stop offset="60%"  stopColor="#3870a0" />
            <stop offset="78%"  stopColor="#7ab0c8" />
            <stop offset="90%"  stopColor="#b8d0c8" />
            <stop offset="100%" stopColor="#d8e0b8" />
          </linearGradient>

          {/* Warm sun glow at center-horizon */}
          <radialGradient id="ls-sun" cx="50%" cy="100%" r="55%">
            <stop offset="0%"   stopColor="#f0d878" stopOpacity="0.55" />
            <stop offset="35%"  stopColor="#e8a850" stopOpacity="0.25" />
            <stop offset="75%"  stopColor="#e89050" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#e89050" stopOpacity="0" />
          </radialGradient>

          {/* Mist at mountain bases */}
          <linearGradient id="ls-mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.14" />
          </linearGradient>

          {/* Ground gradient */}
          <linearGradient id="ls-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1e2c38" />
            <stop offset="100%" stopColor="#111820" />
          </linearGradient>
        </defs>

        {/* ── SKY ── */}
        <rect width="1440" height="900" fill="url(#ls-sky)" />
        <rect width="1440" height="900" fill="url(#ls-sun)" />

        {/* ── FAR MOUNTAINS — palest blue-grey ── */}
        <path
          d="M 0,552 L 68,488 L 140,522 L 228,448 L 318,492 L 380,422 L 448,462 L 530,388 L 608,432 L 672,368 L 738,408 L 820,442 L 908,382 L 992,420 L 1082,458 L 1162,396 L 1248,442 L 1332,412 L 1400,432 L 1440,448 L 1440,900 L 0,900 Z"
          fill="#6888a8"
          opacity="0.62"
        />
        {/* Snow caps on far peaks */}
        <polygon points="530,388 506,428 554,428" fill="white" opacity="0.52" />
        <polygon points="672,368 646,412 698,412" fill="white" opacity="0.58" />
        <polygon points="908,382 882,424 934,424" fill="white" opacity="0.50" />
        <polygon points="380,422 358,458 402,458" fill="white" opacity="0.42" />

        {/* ── MID MOUNTAINS — medium slate blue ── */}
        <path
          d="M 0,680 L 72,628 L 148,658 L 232,598 L 325,638 L 408,572 L 494,612 L 588,552 L 680,592 L 762,558 L 852,598 L 948,640 L 1038,572 L 1128,612 L 1228,658 L 1318,622 L 1400,648 L 1440,638 L 1440,900 L 0,900 Z"
          fill="#3d5568"
          opacity="0.82"
        />

        {/* ── NEAR HILLS — darker ── */}
        <path
          d="M 0,790 L 88,752 L 196,774 L 318,738 L 448,768 L 572,728 L 698,758 L 832,736 L 958,762 L 1082,742 L 1208,770 L 1330,752 L 1440,742 L 1440,900 L 0,900 Z"
          fill="#283440"
          opacity="0.92"
        />

        {/* Mist layer at mountain bases */}
        <rect x="0" y="618" width="1440" height="160" fill="url(#ls-mist)" />

        {/* ── FOREGROUND GROUND ── */}
        <path
          d="M 0,865 L 180,850 L 380,860 L 568,845 L 720,854 L 892,844 L 1088,858 L 1278,848 L 1440,854 L 1440,900 L 0,900 Z"
          fill="url(#ls-ground)"
        />

        {/* ── PINE TREE SILHOUETTES — left ── */}
        <g fill="#1c2830" opacity="0.85">
          {/* tree 1 */}
          <polygon points="42,848 52,788 62,848" />
          <polygon points="38,848 52,770 66,848" />
          <rect x="48" y="848" width="8" height="14" rx="2" />
          {/* tree 2 */}
          <polygon points="96,848 108,782 120,848" />
          <polygon points="92,848 108,762 124,848" />
          <rect x="104" y="848" width="8" height="14" rx="2" />
          {/* tree 3 */}
          <polygon points="152,848 162,792 172,848" />
          <polygon points="148,848 162,775 176,848" />
          <rect x="158" y="848" width="8" height="14" rx="2" />
          {/* tree 4 (smaller) */}
          <polygon points="198,855 206,810 214,855" />
          <polygon points="195,855 206,796 217,855" />
          <rect x="202" y="855" width="7" height="10" rx="2" />
        </g>

        {/* ── PINE TREE SILHOUETTES — right ── */}
        <g fill="#1c2830" opacity="0.85">
          <polygon points="1232,855 1240,810 1248,855" />
          <polygon points="1229,855 1240,795 1251,855" />
          <rect x="1236" y="855" width="7" height="10" rx="2" />

          <polygon points="1278,848 1290,782 1302,848" />
          <polygon points="1274,848 1290,762 1306,848" />
          <rect x="1286" y="848" width="8" height="14" rx="2" />

          <polygon points="1334,848 1346,788 1358,848" />
          <polygon points="1330,848 1346,770 1362,848" />
          <rect x="1342" y="848" width="8" height="14" rx="2" />

          <polygon points="1388,848 1398,792 1408,848" />
          <polygon points="1384,848 1398,775 1412,848" />
          <rect x="1394" y="848" width="8" height="14" rx="2" />
        </g>

        {/* ── ATMOSPHERIC DEPTH — very subtle vignette ── */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.28" />
        </radialGradient>
        <rect width="1440" height="900" fill="url(#vignette)" />
      </svg>
    </div>
  );
}
