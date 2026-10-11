export function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
      <div className="flex gap-1.5">
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-sm" />
        <div className="w-1.5 h-1.5 bg-accent/40 rounded-sm" />
        <div className="w-1.5 h-1.5 bg-cyan/40 rounded-sm" />
      </div>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}