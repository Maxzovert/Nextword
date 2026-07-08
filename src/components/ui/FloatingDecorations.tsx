"use client";

export function FloatingDecorations() {
  const stickers = [
    { color: "#62aef0", top: "6%", right: "10%", size: 6 },
    { color: "#d6b6f6", top: "22%", left: "8%", size: 5, delay: true },
    { color: "#2a9d99", top: "55%", right: "12%", size: 4, delay: true },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {stickers.map((s, i) => (
        <div
          key={i}
          className={`absolute rounded-full opacity-25 animate-sticker ${s.delay ? "animate-sticker-delayed" : ""}`}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
          }}
        />
      ))}
    </div>
  );
}
