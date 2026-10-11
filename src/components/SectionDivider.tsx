export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-border" />
      <div className="flex gap-2 items-center">
        <div className="w-1.5 h-1.5 bg-gold/30 rotate-45" />
        <span className="retro-font text-[5px] text-text-secondary/30">◆</span>
        <div className="w-1.5 h-1.5 bg-gold/30 rotate-45" />
      </div>
      <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}