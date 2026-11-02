import type React from "react";
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type ShowcaseLayer = {
  image: string;
  objectPosition: string;
  hold: [number, number];
};

export type ShowcaseProps = {
  layers: ShowcaseLayer[];
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

export const ServiceShowcaseComposition: React.FC<ShowcaseProps> = ({ layers }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const last = durationInFrames - 1;
  const at = (progress: number) => progress * last;

  return (
    <AbsoluteFill style={{ backgroundColor: "#141618", overflow: "hidden" }}>
      {layers.map((layer, i) => {
        const prev = layers[i - 1];
        const next = layers[i + 1];
        const inStart = prev ? at(prev.hold[1]) : 0;
        const inEnd = at(layer.hold[0]);
        const outStart = next ? at(layer.hold[1]) : last;
        const outEnd = next ? at(next.hold[0]) : last;

        const enter = prev ? interpolate(frame, [inStart, inEnd], [0, 1], { ...clamp, easing: ease }) : 1;
        const exit = next ? interpolate(frame, [outStart, outEnd], [0, 1], { ...clamp, easing: ease }) : 0;

        return (
          <AbsoluteFill
            key={layer.image}
            style={{
              translate: `0 ${(1 - enter) * 100 - exit * 18}%`,
              boxShadow: prev && enter < 1 ? "0 -30px 60px rgba(0, 0, 0, 0.35)" : undefined,
              overflow: "hidden",
            }}
          >
            <Img
              src={layer.image}
              onError={() => undefined}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: layer.objectPosition,
                scale: interpolate(frame, [inStart, outEnd], [1.08, 1.03], clamp),
                translate: `0 ${interpolate(frame, [inStart, outEnd], [-1, 1], clamp)}%`,
              }}
            />
            <AbsoluteFill style={{ backgroundColor: "#141618", opacity: exit * 0.5 }} />
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(20,22,24,0) 60%, rgba(20,22,24,0.4) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
