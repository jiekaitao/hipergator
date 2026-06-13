export function ChapterMarker({
  label,
}: {
  // num and tagline kept in the interface for backward-compat with existing
  // call sites, but no longer rendered — the decorative chapter line was clutter.
  num?: string;
  label: string;
  tagline?: string;
}) {
  return (
    <h2 className="font-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
      {label}
    </h2>
  );
}
