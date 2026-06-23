"use client";

import { useMemo } from "react";
import {
  buildButterflySpecs,
  buildButterflyStyles,
  type ButterflySpec,
} from "@/lib/whimsy/butterfly-paths";

function Butterfly({ spec }: { spec: ButterflySpec }) {
  return (
    <div
      className="butterfly-path absolute left-0 top-0 opacity-[0.9]"
      style={{
        animation: `fly-${spec.id} ${spec.duration}s ease-in-out ${spec.delay}s infinite`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spec.src}
        alt=""
        width={spec.size}
        height={spec.size}
        className="butterfly-body max-w-none select-none"
        style={{
          width: spec.size,
          height: spec.size,
          filter: "drop-shadow(0 2px 4px rgba(61, 74, 92, 0.15))",
        }}
      />
    </div>
  );
}

export function FloatingCritters() {
  const specs = useMemo(() => buildButterflySpecs(8), []);
  const styles = useMemo(() => buildButterflyStyles(specs), [specs]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="floating-critters pointer-events-none fixed inset-0 z-[2] overflow-hidden"
        aria-hidden="true"
      >
        {specs.map((spec) => (
          <Butterfly key={spec.id} spec={spec} />
        ))}
      </div>
    </>
  );
}
