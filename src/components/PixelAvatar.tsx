export function PixelAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pixel avatar"
    >
      <rect x="10" y="2" width="12" height="4" fill="#1a1a2e" />
      <rect x="8" y="4" width="16" height="2" fill="#1a1a2e" />
      <rect x="10" y="6" width="12" height="6" fill="#f4c7a0" />
      <rect x="12" y="7" width="2" height="2" fill="#1a1a2e" />
      <rect x="18" y="7" width="2" height="2" fill="#1a1a2e" />
      <rect x="14" y="10" width="4" height="1" fill="#e8a0a0" />
      <rect x="8" y="12" width="16" height="10" fill="#1a1a2e" />
      <rect x="10" y="14" width="12" height="6" fill="#2a2a4e" />
      <rect x="14" y="15" width="4" height="3" fill="#795CFF" rx="0.5" />
      <rect x="6" y="14" width="2" height="8" fill="#f4c7a0" />
      <rect x="24" y="14" width="2" height="8" fill="#f4c7a0" />
      <rect x="10" y="22" width="4" height="6" fill="#1a1a2e" />
      <rect x="18" y="22" width="4" height="6" fill="#1a1a2e" />
      <rect x="10" y="28" width="5" height="2" fill="#333" />
      <rect x="17" y="28" width="5" height="2" fill="#333" />
    </svg>
  );
}