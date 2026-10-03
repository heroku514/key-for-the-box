export type KeySpot = "hook" | "in";
export type Lid = "shut" | "open";

export type BoxState = {
  key: KeySpot;
  lid: Lid;
};

export const EMPTY_BOX: BoxState = { key: "hook", lid: "shut" };

export function boxLine(state: BoxState): string {
  if (state.lid === "open") return "The box is open.";
  if (state.key === "in") return "The key is in.";
  return "The box is shut.";
}

export function keyLine(state: BoxState): string {
  if (state.lid === "open") return "Lid up.";
  if (state.key === "in") return "Ready to open.";
  return "Key on the hook.";
}

export function hasProgress(state: BoxState): boolean {
  return state.key !== "hook" || state.lid !== "shut";
}

export function parseBox(raw: string | null): BoxState {
  if (!raw) return EMPTY_BOX;
  try {
    const value = JSON.parse(raw) as { key?: unknown; lid?: unknown };
    const key = value.key === "hook" || value.key === "in" ? value.key : null;
    const lid = value.lid === "shut" || value.lid === "open" ? value.lid : null;
    if (!key || !lid) return EMPTY_BOX;
    if (lid === "open" && key !== "in") return EMPTY_BOX;
    return { key, lid };
  } catch {
    return EMPTY_BOX;
  }
}

export function putKey(state: BoxState): { state: BoxState; note: string } {
  if (state.key === "in") return { state, note: "Already in." };
  return { state: { ...state, key: "in" }, note: "Key placed." };
}

export function takeKey(state: BoxState): { state: BoxState; note: string } {
  if (state.lid === "open") return { state, note: "Shut it first." };
  if (state.key === "hook") return { state, note: "Already out." };
  return { state: { ...state, key: "hook" }, note: "Key lifted." };
}

export function openBox(state: BoxState): { state: BoxState; note: string } {
  if (state.lid === "open") return { state, note: "Already open." };
  if (state.key === "hook") return { state, note: "Key first." };
  return { state: { ...state, lid: "open" }, note: "Lid lifted." };
}

export function shutBox(state: BoxState): { state: BoxState; note: string } {
  if (state.lid === "shut") return { state, note: "Already shut." };
  return { state: { ...state, lid: "shut" }, note: "Lid down." };
}

export function resetBox(): { state: BoxState; note: string } {
  return { state: EMPTY_BOX, note: "Look at the box." };
}
