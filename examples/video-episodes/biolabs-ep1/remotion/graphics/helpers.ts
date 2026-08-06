import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";

// Shared motion + semantic-colour helpers so every graphic animates the same way.
// These are pure functions (no hooks), so they are safe to call inside .map().

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

// Frame-driven reveal: fade + rise, matching the web system's cubic-bezier(.16,1,.3,1).
export const reveal = (
  frame: number,
  fps: number,
  delaySec = 0,
  distance = 30,
  durSec = 0.6
): CSSProperties => {
  const start = delaySec * fps;
  const p = interpolate(frame, [start, start + durSec * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

const onInk = (scene: any) => scene?.background === "ink";

// Semantic accent: primary vs the reserved secondary thread, auto-brightened on ink.
export const accent = (scene: any, brand: any): string => {
  if (scene?.accent === "secondary") {
    return onInk(scene) ? brand.colors.accentSecondaryBright : brand.colors.accentSecondary;
  }
  return onInk(scene) ? brand.colors.accentPrimaryBright : brand.colors.accentPrimary;
};

// A faint tinted fill derived from the current accent (for callout backgrounds).
export const accentTint = (scene: any, brand: any, alpha = 0.06): string => {
  const hex = accent(scene, brand).replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export const fg = (scene: any, brand: any) => (onInk(scene) ? brand.colors.paper : brand.colors.text);
export const muted = (scene: any, brand: any) =>
  onInk(scene) ? "rgba(247,247,244,.62)" : brand.colors.muted;
export const hair = (scene: any, brand: any) =>
  onInk(scene) ? "rgba(255,255,255,.14)" : brand.colors.hairline;
export const surface = (scene: any) => (onInk(scene) ? "rgba(255,255,255,.05)" : "#FFFFFF");
