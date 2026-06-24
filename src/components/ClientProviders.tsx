"use client";

import type { ReactNode } from "react";
import { SoundProvider } from "@/components/SoundProvider";
import { SoundToggleButton } from "@/components/SoundToggleButton";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SoundProvider>
      {children}
      <SoundToggleButton />
    </SoundProvider>
  );
}
