import { useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  label: string;
};

export function BeforeAfter({ before, after, beforeAlt, afterAlt, label }: Props) {
  const [split, setSplit] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromPointer = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (clientX - rect.left) / rect.width;
    setSplit(Math.round(Math.min(100, Math.max(0, ratio * 100))));
  };

  return (
    <div className="compare">
      <div
        className="compare-frame"
        ref={frameRef}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <img src={after} alt={afterAlt} draggable={false} />
        <img
          className="compare-before"
          src={before}
          alt={beforeAlt}
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        />
        <span className="compare-tag compare-tag-before">Before</span>
        <span className="compare-tag compare-tag-after">After</span>
        <span className="compare-handle" style={{ left: `${split}%` }} aria-hidden="true" />
      </div>
      <label className="compare-range">
        <span className="sr-only">{label}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-valuetext={`${split}% before, ${100 - split}% after`}
        />
      </label>
    </div>
  );
}
