export function HeroPixelScene() {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-end justify-center">
      <svg
        viewBox="0 0 480 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[480px]"
        aria-label="Pixel art fantasy landscape with floating islands, castle, and developer avatar"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020810" />
            <stop offset="60%" stopColor="#030B18" />
            <stop offset="100%" stopColor="#061326" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F4F6FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F4F6FF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="480" height="400" fill="url(#sky)" />

        {/* Stars layer */}
        {[
          [40, 25], [95, 15], [150, 40], [210, 18], [270, 35], [330, 22],
          [380, 30], [440, 12], [70, 55], [180, 60], [300, 50], [410, 45],
          [55, 80], [130, 70], [250, 65], [360, 55], [420, 70], [20, 45],
          [110, 30], [200, 50], [340, 40], [460, 30], [80, 40], [290, 25],
        ].map(([x, y], i) => (
          <rect
            key={`star-${i}`}
            x={x}
            y={y}
            width={i % 3 === 0 ? 3 : 2}
            height={i % 3 === 0 ? 3 : 2}
            fill={i % 5 === 0 ? "#795CFF" : i % 7 === 0 ? "#35D9F2" : "#F4F6FF"}
            opacity={i % 3 === 0 ? 0.9 : 0.6}
            className="animate-twinkle"
            style={{ animationDelay: `${(i * 0.3) % 3}s` }}
          />
        ))}

        {/* Moon */}
        <circle cx="390" cy="65" r="45" fill="url(#moonGlow)" />
        <circle cx="390" cy="65" r="22" fill="#F4F6FF" opacity="0.9" />
        <circle cx="396" cy="60" r="19" fill="#020810" />
        <circle cx="390" cy="65" r="22" fill="none" stroke="#F4F6FF" strokeOpacity="0.1" strokeWidth="8" />

        {/* Mountains back layer */}
        <polygon points="0,230 50,150 100,230" fill="#081a35" />
        <polygon points="60,230 140,120 220,230" fill="#0a1e3d" />
        <polygon points="160,230 260,105 360,230" fill="#0d2545" />
        <polygon points="280,230 370,130 460,230" fill="#081a35" />
        <polygon points="380,230 440,160 480,230" fill="#0a1e3d" />

        {/* Far floating island */}
        <g className="animate-float" style={{ animationDelay: '2s' }}>
          <rect x="360" y="130" width="60" height="5" fill="#1a3a25" rx="1" />
          <rect x="365" y="135" width="50" height="10" fill="#0f2518" rx="1" />
          <rect x="370" y="145" width="40" height="5" fill="#0a1a10" rx="1" />
          {/* Small tree */}
          <rect x="385" y="118" width="3" height="12" fill="#3a2a1a" />
          <rect x="380" y="112" width="12" height="8" fill="#2d5a3d" />
          <rect x="382" y="108" width="8" height="6" fill="#3a7a50" />
        </g>

        {/* Main floating island */}
        <g className="animate-float">
          {/* Island base */}
          <rect x="140" y="155" width="160" height="10" fill="#2d5a3d" rx="2" />
          <rect x="150" y="165" width="140" height="15" fill="#1a3a25" rx="2" />
          <rect x="160" y="180" width="120" height="10" fill="#0f2518" rx="2" />
          <rect x="175" y="190" width="90" height="8" fill="#0a1a10" rx="2" />
          <rect x="190" y="198" width="60" height="5" fill="#071510" rx="2" />
          {/* Grass details */}
          <rect x="155" y="152" width="4" height="4" fill="#3a7a50" />
          <rect x="175" y="151" width="3" height="5" fill="#2d5a3d" />
          <rect x="220" y="152" width="4" height="4" fill="#3a7a50" />
          <rect x="260" y="151" width="3" height="5" fill="#2d5a3d" />
          <rect x="285" y="152" width="4" height="4" fill="#3a7a50" />
        </g>

        {/* Castle on island */}
        <g className="animate-float" style={{ animationDelay: '0.5s' }}>
          {/* Main tower */}
          <rect x="200" y="105" width="60" height="50" fill="#1a1a3e" />
          <rect x="195" y="100" width="12" height="55" fill="#1a1a3e" />
          <rect x="253" y="100" width="12" height="55" fill="#1a1a3e" />
          {/* Tower tops */}
          <rect x="195" y="94" width="12" height="8" fill="#2a2a5e" />
          <rect x="253" y="94" width="12" height="8" fill="#2a2a5e" />
          {/* Center spire */}
          <rect x="223" y="85" width="14" height="20" fill="#1a1a3e" />
          <rect x="226" y="78" width="8" height="8" fill="#2a2a5e" />
          {/* Windows */}
          <rect x="208" y="112" width="8" height="10" fill="#795CFF" opacity="0.7" rx="1" />
          <rect x="226" y="112" width="8" height="10" fill="#C04BFF" opacity="0.7" rx="1" />
          <rect x="244" y="112" width="8" height="10" fill="#795CFF" opacity="0.7" rx="1" />
          {/* Window glow */}
          <rect x="206" y="110" width="12" height="14" fill="#795CFF" opacity="0.1" rx="2" />
          <rect x="224" y="110" width="12" height="14" fill="#C04BFF" opacity="0.1" rx="2" />
          <rect x="242" y="110" width="12" height="14" fill="#795CFF" opacity="0.1" rx="2" />
          {/* Door */}
          <rect x="222" y="135" width="16" height="20" fill="#0d0d2b" rx="8" />
          <rect x="234" y="145" width="2" height="2" fill="#C04BFF" />
          {/* Flag */}
          <line x1="230" y1="68" x2="230" y2="85" stroke="#4a4a6a" strokeWidth="2" />
          <polygon points="230,68 248,74 230,80" fill="#C04BFF" opacity="0.9" />
          <polygon points="230,68 248,74 230,80" fill="none" stroke="#795CFF" strokeWidth="0.5" />
        </g>

        {/* Developer avatar on smaller platform */}
        <g className="animate-float" style={{ animationDelay: '1s' }}>
          {/* Platform */}
          <rect x="60" y="195" width="65" height="8" fill="#1a3a5c" rx="1" />
          <rect x="65" y="203" width="55" height="12" fill="#0f2540" rx="1" />
          <rect x="70" y="215" width="45" height="5" fill="#0a1a30" rx="1" />
          {/* Avatar - standing with laptop */}
          <rect x="82" y="162" width="20" height="8" fill="#1a1a2e" />
          <rect x="80" y="167" width="24" height="4" fill="#1a1a2e" />
          <rect x="84" y="171" width="16" height="10" fill="#f4c7a0" />
          <rect x="86" y="173" width="4" height="3" fill="#1a1a2e" />
          <rect x="94" y="173" width="4" height="3" fill="#1a1a2e" />
          <rect x="89" y="178" width="6" height="2" fill="#e8a0a0" />
          <rect x="80" y="181" width="24" height="14" fill="#1a1a2e" />
          <rect x="82" y="183" width="20" height="10" fill="#2a2a4e" />
          <rect x="88" y="185" width="8" height="5" fill="#795CFF" rx="0.5" />
          {/* Laptop in hand */}
          <rect x="74" y="183" width="8" height="5" fill="#0a0a20" stroke="#183455" strokeWidth="0.5" />
          <rect x="75" y="184" width="6" height="3" fill="#795CFF" opacity="0.4" />
        </g>

        {/* Companion creature */}
        <g className="animate-float" style={{ animationDelay: '1.5s' }}>
          <rect x="130" y="187" width="10" height="8" fill="#35D9F2" rx="1" />
          <rect x="132" y="184" width="6" height="4" fill="#35D9F2" rx="1" />
          <rect x="133" y="185" width="2" height="2" fill="#F4F6FF" />
          <rect x="137" y="185" width="2" height="2" fill="#F4F6FF" />
          <rect x="134" y="188" width="4" height="1" fill="#e8a0a0" />
          <rect x="132" y="195" width="2" height="3" fill="#35D9F2" />
          <rect x="138" y="195" width="2" height="3" fill="#35D9F2" />
          {/* Tail */}
          <rect x="140" y="190" width="4" height="2" fill="#35D9F2" opacity="0.7" />
          <rect x="143" y="188" width="3" height="2" fill="#35D9F2" opacity="0.5" />
        </g>

        {/* Glowing water */}
        <rect x="0" y="230" width="480" height="170" fill="#061326" />
        {/* Water reflections */}
        {[
          [40, 240, 80], [160, 250, 100], [320, 245, 70], [80, 270, 50],
          [250, 280, 90], [400, 260, 60], [120, 300, 40], [350, 310, 70],
        ].map(([x, y, w], i) => (
          <rect
            key={`water-${i}`}
            x={x}
            y={y}
            width={w}
            height={2}
            fill={i % 3 === 0 ? "#795CFF" : i % 3 === 1 ? "#35D9F2" : "#C04BFF"}
            opacity={0.08 + (i % 3) * 0.04}
            rx="1"
          />
        ))}

        {/* Sign on right side */}
        <g className="animate-float" style={{ animationDelay: '2.5s' }}>
          <rect x="430" y="165" width="3" height="40" fill="#5a4a3a" />
          <rect x="408" y="158" width="50" height="18" fill="#2a2a4e" rx="2" />
          <rect x="408" y="158" width="50" height="18" fill="none" stroke="#795CFF" strokeWidth="0.5" rx="2" />
          <text x="433" y="169" textAnchor="middle" fill="#35D9F2" fontSize="5" fontFamily="monospace">
            Better Code,
          </text>
          <text x="433" y="175" textAnchor="middle" fill="#795CFF" fontSize="5" fontFamily="monospace">
            Bigger Dreams
          </text>
        </g>

        {/* Lanterns */}
        <g>
          <rect x="50" y="190" width="5" height="8" fill="#5a4a3a" />
          <rect x="48" y="186" width="8" height="5" fill="#C04BFF" opacity="0.5" rx="1" />
          <rect x="48" y="186" width="8" height="5" fill="#C04BFF" opacity="0.15" rx="4" />
        </g>
        <g>
          <rect x="410" y="190" width="5" height="8" fill="#5a4a3a" />
          <rect x="408" y="186" width="8" height="5" fill="#795CFF" opacity="0.5" rx="1" />
          <rect x="408" y="186" width="8" height="5" fill="#795CFF" opacity="0.15" rx="4" />
        </g>

        {/* Plants */}
        <g>
          <rect x="120" y="222" width="5" height="8" fill="#2d5a3d" />
          <rect x="117" y="218" width="10" height="5" fill="#3a7a50" />
          <rect x="119" y="215" width="6" height="4" fill="#4a9a60" />
        </g>
        <g>
          <rect x="340" y="222" width="5" height="8" fill="#2d5a3d" />
          <rect x="337" y="218" width="10" height="5" fill="#3a7a50" />
          <rect x="339" y="215" width="6" height="4" fill="#4a9a60" />
        </g>

        {/* Crystal */}
        <g className="animate-glow-pulse">
          <polygon points="25,218 28,208 31,218" fill="#795CFF" opacity="0.7" />
          <polygon points="25,218 28,208 31,218" fill="none" stroke="#C04BFF" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}

export function AboutPixelScene() {
  return (
    <svg
      viewBox="0 0 350 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[350px]"
      aria-label="Developer working at desk in cozy night-time workspace"
    >
      <defs>
        <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020810" />
          <stop offset="100%" stopColor="#061326" />
        </linearGradient>
      </defs>
      <rect width="350" height="280" fill="#061326" />

      {/* Window */}
      <rect x="210" y="25" width="100" height="75" fill="url(#windowSky)" stroke="#183455" strokeWidth="2" />
      <line x1="260" y1="25" x2="260" y2="100" stroke="#183455" strokeWidth="1" />
      <line x1="210" y1="62" x2="310" y2="62" stroke="#183455" strokeWidth="1" />
      {/* Stars through window */}
      <rect x="225" y="35" width="2" height="2" fill="#F4F6FF" opacity="0.7" className="animate-twinkle" />
      <rect x="280" y="40" width="2" height="2" fill="#795CFF" opacity="0.6" className="animate-twinkle" style={{ animationDelay: '0.5s' }} />
      <rect x="250" y="45" width="2" height="2" fill="#35D9F2" opacity="0.5" className="animate-twinkle" style={{ animationDelay: '1s' }} />
      {/* City skyline through window */}
      <rect x="215" y="70" width="6" height="18" fill="#0a1e3d" />
      <rect x="222" y="65" width="4" height="23" fill="#0d2545" />
      <rect x="228" y="72" width="6" height="16" fill="#0a1e3d" />
      <rect x="240" y="60" width="5" height="28" fill="#0d2545" />
      <rect x="250" y="68" width="6" height="20" fill="#0a1e3d" />
      <rect x="265" y="64" width="4" height="24" fill="#0d2545" />
      <rect x="275" y="70" width="6" height="18" fill="#0a1e3d" />
      <rect x="285" y="66" width="5" height="22" fill="#0d2545" />
      <rect x="295" y="72" width="6" height="16" fill="#0a1e3d" />
      {/* Building lights */}
      <rect x="242" y="68" width="2" height="2" fill="#795CFF" opacity="0.6" />
      <rect x="267" y="72" width="2" height="2" fill="#C04BFF" opacity="0.5" />
      <rect x="287" y="70" width="2" height="2" fill="#35D9F2" opacity="0.5" />

      {/* Desk */}
      <rect x="15" y="155" width="280" height="10" fill="#1a1a3e" />
      <rect x="20" y="165" width="12" height="60" fill="#1a1a3e" />
      <rect x="278" y="165" width="12" height="60" fill="#1a1a3e" />
      {/* Desk edge glow */}
      <rect x="15" y="155" width="280" height="2" fill="#795CFF" opacity="0.1" />

      {/* Bookshelf left */}
      <rect x="20" y="40" width="50" height="5" fill="#1a1a3e" />
      <rect x="22" y="45" width="10" height="35" fill="#C04BFF" opacity="0.5" />
      <rect x="32" y="45" width="10" height="35" fill="#795CFF" opacity="0.5" />
      <rect x="42" y="45" width="10" height="35" fill="#35D9F2" opacity="0.5" />
      <rect x="52" y="45" width="10" height="35" fill="#C04BFF" opacity="0.3" />
      <rect x="20" y="80" width="50" height="5" fill="#1a1a3e" />
      <rect x="22" y="85" width="10" height="28" fill="#795CFF" opacity="0.4" />
      <rect x="32" y="85" width="10" height="28" fill="#35D9F2" opacity="0.4" />
      <rect x="42" y="85" width="10" height="28" fill="#C04BFF" opacity="0.4" />
      <rect x="52" y="85" width="10" height="28" fill="#795CFF" opacity="0.25" />

      {/* Monitor */}
      <rect x="90" y="95" width="100" height="60" fill="#0a0a20" stroke="#183455" strokeWidth="2" rx="2" />
      <rect x="95" y="100" width="90" height="50" fill="#0d1b30" rx="1" />
      {/* Code on screen */}
      <rect x="102" y="108" width="40" height="2" fill="#795CFF" opacity="0.8" />
      <rect x="102" y="114" width="28" height="2" fill="#35D9F2" opacity="0.6" />
      <rect x="108" y="120" width="50" height="2" fill="#C04BFF" opacity="0.6" />
      <rect x="108" y="126" width="35" height="2" fill="#795CFF" opacity="0.5" />
      <rect x="102" y="132" width="45" height="2" fill="#35D9F2" opacity="0.4" />
      <rect x="108" y="138" width="20" height="2" fill="#C04BFF" opacity="0.3" />
      {/* Monitor stand */}
      <rect x="130" y="155" width="20" height="6" fill="#1a1a3e" rx="1" />
      {/* Cursor blink */}
      <rect x="128" y="132" width="2" height="6" fill="#F4F6FF" opacity="0.8" className="animate-twinkle" />

      {/* Developer at desk */}
      <g>
        {/* Hair */}
        <rect x="120" y="108" width="30" height="10" fill="#1a1a2e" />
        <rect x="118" y="113" width="34" height="5" fill="#1a1a2e" />
        {/* Face */}
        <rect x="123" y="118" width="24" height="12" fill="#f4c7a0" />
        <rect x="126" y="120" width="4" height="3" fill="#1a1a2e" />
        <rect x="136" y="120" width="4" height="3" fill="#1a1a2e" />
        <rect x="130" y="126" width="8" height="2" fill="#e8a0a0" />
        {/* Body (hoodie) */}
        <rect x="118" y="130" width="34" height="25" fill="#1a1a2e" />
        <rect x="120" y="132" width="30" height="20" fill="#2a2a4e" />
        <rect x="128" y="135" width="14" height="6" fill="#795CFF" rx="1" />
        {/* Arms */}
        <rect x="108" y="135" width="10" height="6" fill="#1a1a2e" />
        <rect x="152" y="135" width="10" height="6" fill="#1a1a2e" />
        <rect x="105" y="140" width="6" height="12" fill="#f4c7a0" />
        <rect x="155" y="140" width="6" height="12" fill="#f4c7a0" />
      </g>

      {/* Second monitor / laptop */}
      <rect x="5" y="130" width="35" height="25" fill="#0a0a20" stroke="#183455" strokeWidth="1" rx="1" />
      <rect x="8" y="133" width="29" height="19" fill="#0d1b30" />
      <rect x="12" y="138" width="15" height="2" fill="#795CFF" opacity="0.5" />
      <rect x="12" y="143" width="20" height="2" fill="#35D9F2" opacity="0.4" />

      {/* Coffee mug */}
      <rect x="190" y="145" width="12" height="12" fill="#2a2a4e" rx="1" />
      <rect x="202" y="149" width="4" height="4" fill="none" stroke="#2a2a4e" strokeWidth="1" />
      {/* Steam */}
      <rect x="194" y="140" width="2" height="4" fill="#F4F6FF" opacity="0.15" />
      <rect x="198" y="138" width="2" height="5" fill="#F4F6FF" opacity="0.1" />

      {/* Neon strip on wall */}
      <rect x="140" y="35" width="60" height="3" fill="#795CFF" opacity="0.25" rx="1" />
      <rect x="150" y="40" width="40" height="2" fill="#C04BFF" opacity="0.15" rx="1" />

      {/* Speech bubble */}
      <rect x="170" y="70" width="120" height="22" fill="#0d1b30" stroke="#795CFF" strokeWidth="1" rx="3" />
      <polygon points="190,92 196,92 185,100" fill="#0d1b30" stroke="#795CFF" strokeWidth="1" />
      <polygon points="191,92 195,92 186,99" fill="#0d1b30" />
      <text x="230" y="83" textAnchor="middle" fill="#35D9F2" fontSize="6" fontFamily="monospace">
        Good code brings
      </text>
      <text x="230" y="90" textAnchor="middle" fill="#795CFF" fontSize="6" fontFamily="monospace">
        good opportunities.
      </text>

      {/* Floor */}
      <rect x="0" y="225" width="350" height="55" fill="#030B18" />
      {/* Carpet */}
      <rect x="60" y="225" width="200" height="55" fill="#07172B" rx="2" />
      <rect x="65" y="228" width="190" height="2" fill="#795CFF" opacity="0.05" />
    </svg>
  );
}