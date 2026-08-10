const COLORS = ['#D02886', '#FF5FB3', '#9966CC', '#54218E'];
const COUNT = 18;

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 h-2 w-2 rounded-sm motion-safe:animate-amx-fall motion-reduce:hidden"
          style={{
            left: `${5 + i * 5.2}%`,
            background: COLORS[i % COLORS.length],
            animationDuration: `${1600 + (i % 5) * 260}ms`,
            animationDelay: `${i * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}
